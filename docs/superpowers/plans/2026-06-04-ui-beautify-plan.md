# UI 美化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把蚂蚁模拟游戏 Canvas 渲染从"开发者视角"提升到"玩家视角"——加入多地形、多种障碍物、食物堆、强化蚁窝、磨损土路、强化蚂蚁可辨识性，同时保持 12ms 帧时间预算和现有脏区域增量序列化性能。

**Architecture:** 新增 9 个渲染相关模块（AssetRegistry + 4 资源常量 + 4 元素渲染器），扩展 WorldGrid Cell 数据模型，模拟器/Worker 渲染双端同步改造，按 z-order 分层绘制（地形→磨损→信息素→障碍物→食物→蚁窝→蚂蚁）。

**Tech Stack:** React 18 + TypeScript + Vite 6 + Canvas 2D（已有），新增 SVG 资源 + OffscreenCanvas 缓存。

**Spec:** `docs/superpowers/specs/2026-06-04-ui-beautify-design.md`

---

## 文件结构总览

### 新建文件
| 文件 | 职责 |
|------|------|
| `src/render/assets/TerrainTiles.ts` | 4 种地形 SVG 图案 + 类型定义 |
| `src/render/assets/ObstacleTiles.ts` | 4 种障碍物 SVG 图案 + 类型定义 |
| `src/render/assets/FoodSprites.ts` | 食物堆 3 尺寸 × 4 种类的 SVG + 阈值函数 |
| `src/render/assets/NestOverlay.ts` | 蚁窝装饰元素（草/光晕/蚁道/周围蚂蚁） |
| `src/render/assets/WornPath.ts` | 磨损土路图案 + 阈值常量 |
| `src/render/AssetRegistry.ts` | SVG → OffscreenCanvas 缓存单例 |
| `src/render/TerrainRenderer.ts` | 地形+磨损土路绘制 |
| `src/render/ObstacleRenderer.ts` | 障碍物绘制 |
| `src/render/FoodPileRenderer.ts` | 食物堆绘制 |

### 修改文件
| 文件 | 改动内容 |
|------|----------|
| `src/simulation/WorldGrid.ts` | Cell 增加 terrain/obstacle/foodType/wearLevel 字段 |
| `src/simulation/World.ts` | 构造函数支持新字段；新增 setTerrain/setObstacle/setFoodType/bumpWear |
| `src/simulation/simulation-worker.ts` | init 时设置新字段；蚂蚁移动时 bumpWear |
| `src/simulation/worker-protocol.ts` | InitConfig 增加 enableVisualTheme |
| `src/render/WorldRenderer.ts` | 删除 wall/food 渲染逻辑（交给 ObstacleRenderer/FoodPileRenderer），保留 markers 渲染 |
| `src/render/ColonyRenderer.ts` | renderBase 增强（草+光晕+蚁道+周围蚂蚁）；renderAnts 缩小 0.7x + 0.5px 描边 |
| `src/render/WorkerRenderer.ts` | 同 ColonyRenderer 的蚂蚁改动；renderBases 增强 |
| `src/render/Renderer.ts` | 装配 TerrainRenderer/ObstacleRenderer/FoodPileRenderer |
| `src/pages/MapEditor.tsx` | 工具栏新增"地形"工具 + "障碍物"二级选择 |
| `src/hooks/useSimulation.ts` | 加载 gridData 新字段到 Simulation/Worker |
| `src/store/useStore.ts` | editorGridData 扩展序列化（terrain/obstacle/foodType） |
| `src/api/maps.ts` | 序列化/反序列化 gridData 新字段 |
| `server/src/db.ts` | maps 表新增 terrain_seed 列（兼容老地图） |
| `server/src/routes.ts` | 解析 gridData 新字段（terrain/obstacle/foodType） |

---

## Task 1: AssetRegistry 基础设施

**Files:**
- Create: `src/render/AssetRegistry.ts`

- [ ] **Step 1: 创建 AssetRegistry 类骨架（含异步预加载）**

```typescript
// src/render/AssetRegistry.ts
type TileKey = string;

interface CachedTile {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

class AssetRegistryImpl {
  private cache = new Map<TileKey, CachedTile>();
  private cellSize: number = 4;
  private pendingLoads: Array<Promise<void>> = [];
  
  setCellSize(size: number): void {
    if (size !== this.cellSize) {
      this.cache.clear();
      this.cellSize = size;
    }
  }
  
  // 异步预加载 SVG（推荐在构造函数 / 模块顶层调用）
  preloadSVG(svg: string, key: TileKey): CachedTile | null {
    const existing = this.cache.get(key);
    if (existing) return existing;
    
    if (!svg) return null;  // 空 SVG（如 obstacle=0）直接跳过
    
    const canvas = document.createElement('canvas');
    canvas.width = this.cellSize * 2;  // 2x density
    canvas.height = this.cellSize * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2d context');
    
    const img = new Image();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const loadPromise = new Promise<void>((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        console.warn(`[AssetRegistry] Failed to load SVG: ${key}`);
        resolve();  // 不阻塞，让 drawTile 时静默忽略
      };
      img.src = url;
    });
    this.pendingLoads.push(loadPromise);
    
    const tile: CachedTile = { canvas, width: canvas.width, height: canvas.height };
    this.cache.set(key, tile);
    return tile;
  }
  
  // 等待所有 SVG 加载完成（在首次渲染前 await）
  async waitForLoad(): Promise<void> {
    await Promise.all(this.pendingLoads);
    this.pendingLoads = [];
  }
  
  drawTile(ctx: CanvasRenderingContext2D, key: TileKey, x: number, y: number, size: number): void {
    const tile = this.cache.get(key);
    if (!tile) return;
    ctx.drawImage(tile.canvas, x, y, size, size);
  }
  
  has(key: TileKey): boolean {
    return this.cache.has(key);
  }
  
  invalidate(): void {
    this.cache.clear();
  }
}

export const AssetRegistry = new AssetRegistryImpl();
```

- [ ] **Step 2: 验证文件能编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit src/render/AssetRegistry.ts 2>&1 | head -20`
Expected: 没有 TypeScript 错误，或仅提示缺 `@types`（此文件暂未引用 DOM 库，可后续修复）

- [ ] **Step 3: 提交**

```bash
cd d:\Projects\ant-cn
git add src/render/AssetRegistry.ts
git commit -m "feat(render): 新增 AssetRegistry - SVG缓存单例"
```

---

## Task 2: TerrainTiles 资源常量

**Files:**
- Create: `src/render/assets/TerrainTiles.ts`

- [ ] **Step 1: 创建 4 种地形 SVG 图案常量**

```typescript
// src/render/assets/TerrainTiles.ts
export type TerrainType = 0 | 1 | 2 | 3;  // 0=grass 1=sand 2=water 3=rock

export interface TerrainTile {
  id: 'grass' | 'sand' | 'water' | 'rock';
  svg: string;     // 用于预解析的 SVG 字符串
  bg: string;      // 主色背景
  accent: string;  // 强调色（生成层）
  passable: boolean;
}

export const TERRAIN_TILES: Record<TerrainType, TerrainTile> = {
  0: {
    id: 'grass',
    bg: '#3a5a20',
    accent: '#5a8a35',
    passable: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <rect width="20" height="20" fill="#3a5a20"/>
      <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
      <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
      <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
      <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
      <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
    </svg>`,
  },
  1: {
    id: 'sand',
    bg: '#c9a866',
    accent: '#a8854a',
    passable: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <rect width="20" height="20" fill="#c9a866"/>
      <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
      <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
      <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
      <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
      <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
      <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
    </svg>`,
  },
  2: {
    id: 'water',
    bg: '#3a5a8a',
    accent: '#7a9aca',
    passable: false,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <rect width="20" height="20" fill="#3a5a8a"/>
      <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
      <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
      <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
    </svg>`,
  },
  3: {
    id: 'rock',
    bg: '#6a6a72',
    accent: '#8a8a92',
    passable: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <rect width="20" height="20" fill="#6a6a72"/>
      <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
      <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
      <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
    </svg>`,
  },
};

export function isTerrainPassable(t: TerrainType): boolean {
  return TERRAIN_TILES[t].passable;
}
```

- [ ] **Step 2: 验证文件能编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit src/render/assets/TerrainTiles.ts 2>&1 | head -20`
Expected: 仅有少量类型警告或无错误

- [ ] **Step 3: 提交**

```bash
cd d:\Projects\ant-cn
git add src/render/assets/TerrainTiles.ts
git commit -m "feat(render): 新增 TerrainTiles - 4种地形SVG常量"
```

---

## Task 3: ObstacleTiles 资源常量

**Files:**
- Create: `src/render/assets/ObstacleTiles.ts`

- [ ] **Step 1: 创建 4 种障碍物 SVG 图案常量**

```typescript
// src/render/assets/ObstacleTiles.ts
export type ObstacleType = 0 | 1 | 2 | 3 | 4;  // 0=none 1=brick 2=ice 3=wood 4=fence

export interface ObstacleTile {
  id: 'none' | 'brick' | 'ice' | 'wood' | 'fence';
  svg: string;
}

export const OBSTACLE_TILES: Record<ObstacleType, ObstacleTile> = {
  0: { id: 'none', svg: '' },
  1: {
    id: 'brick',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 24 12">
      <rect width="24" height="6" fill="#a04020" stroke="#3a1808" stroke-width="0.3"/>
      <rect y="6" width="24" height="6" fill="#8a3818" stroke="#3a1808" stroke-width="0.3"/>
      <line x1="0" y1="6" x2="24" y2="6" stroke="#2a0808" stroke-width="0.3"/>
      <line x1="12" y1="0" x2="12" y2="6" stroke="#2a0808" stroke-width="0.3"/>
      <line x1="6" y1="6" x2="6" y2="12" stroke="#2a0808" stroke-width="0.3"/>
      <line x1="18" y1="6" x2="18" y2="12" stroke="#2a0808" stroke-width="0.3"/>
    </svg>`,
  },
  2: {
    id: 'ice',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 24 12">
      <rect width="24" height="6" fill="#a0c8e8" stroke="#3a5a7a" stroke-width="0.3"/>
      <rect y="6" width="24" height="6" fill="#80b0d8" stroke="#3a5a7a" stroke-width="0.3"/>
      <line x1="0" y1="6" x2="24" y2="6" stroke="#1a3a5a" stroke-width="0.3"/>
      <line x1="12" y1="0" x2="12" y2="6" stroke="#1a3a5a" stroke-width="0.3"/>
      <line x1="6" y1="6" x2="6" y2="12" stroke="#1a3a5a" stroke-width="0.3"/>
      <line x1="18" y1="6" x2="18" y2="12" stroke="#1a3a5a" stroke-width="0.3"/>
    </svg>`,
  },
  3: {
    id: 'wood',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 24 12">
      <rect width="24" height="6" fill="#a08050" stroke="#3a2010" stroke-width="0.3"/>
      <rect y="6" width="24" height="6" fill="#806040" stroke="#3a2010" stroke-width="0.3"/>
      <line x1="0" y1="6" x2="24" y2="6" stroke="#2a1a08" stroke-width="0.3"/>
      <line x1="12" y1="0" x2="12" y2="6" stroke="#2a1a08" stroke-width="0.3"/>
      <line x1="6" y1="6" x2="6" y2="12" stroke="#2a1a08" stroke-width="0.3"/>
      <line x1="18" y1="6" x2="18" y2="12" stroke="#2a1a08" stroke-width="0.3"/>
    </svg>`,
  },
  4: {
    id: 'fence',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 24 12">
      <rect width="24" height="6" fill="#7a7a82" stroke="#1a1a22" stroke-width="0.3"/>
      <rect y="6" width="24" height="6" fill="#5a5a62" stroke="#1a1a22" stroke-width="0.3"/>
      <line x1="4" y1="0" x2="4" y2="6" stroke="#1a1a22" stroke-width="0.5"/>
      <line x1="12" y1="0" x2="12" y2="6" stroke="#1a1a22" stroke-width="0.5"/>
      <line x1="20" y1="0" x2="20" y2="6" stroke="#1a1a22" stroke-width="0.5"/>
      <line x1="0" y1="6" x2="24" y2="6" stroke="#1a1a22" stroke-width="0.4"/>
    </svg>`,
  },
};
```

- [ ] **Step 2: 验证文件能编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit src/render/assets/ObstacleTiles.ts 2>&1 | head -20`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
cd d:\Projects\ant-cn
git add src/render/assets/ObstacleTiles.ts
git commit -m "feat(render): 新增 ObstacleTiles - 4种障碍物SVG常量"
```

---

## Task 4: FoodSprites 资源常量

**Files:**
- Create: `src/render/assets/FoodSprites.ts`

- [ ] **Step 1: 创建食物堆 SVG（3 尺寸 × 4 种类共 12 个）**

```typescript
// src/render/assets/FoodSprites.ts
export type FoodType = 0 | 1 | 2 | 3;  // 0=chicken 1=apple 2=bread 3=berry
export type FoodSize = 'small' | 'medium' | 'large';

export const FOOD_SIZE_THRESHOLDS = { small: 1, medium: 5, large: 10 } as const;

export function foodSizeFromQty(qty: number): FoodSize {
  if (qty >= FOOD_SIZE_THRESHOLDS.large) return 'large';
  if (qty >= FOOD_SIZE_THRESHOLDS.medium) return 'medium';
  return 'small';
}

// 鸡腿 3 尺寸
const chicken_small = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
  <ellipse cx="6" cy="8" rx="3" ry="3" fill="#d4a060" stroke="#8a5020" stroke-width="0.4"/>
  <ellipse cx="5" cy="7" rx="1.5" ry="1.2" fill="#e8b878"/>
  <ellipse cx="6" cy="3" rx="1" ry="0.8" fill="#f0e8d0" stroke="#a8956a" stroke-width="0.3"/>
</svg>`;

const chicken_medium = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <ellipse cx="9" cy="11" rx="4.5" ry="5" fill="#d4a060" stroke="#8a5020" stroke-width="0.5"/>
  <ellipse cx="7" cy="9" rx="2.5" ry="2" fill="#e8b878"/>
  <ellipse cx="9" cy="4" rx="1.5" ry="1" fill="#f0e8d0" stroke="#a8956a" stroke-width="0.4"/>
  <ellipse cx="11" cy="10" rx="1" ry="1.5" fill="#c98a4a"/>
</svg>`;

const chicken_large = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
  <ellipse cx="5" cy="15" rx="4" ry="4" fill="#d4a060" stroke="#8a5020" stroke-width="0.5"/>
  <ellipse cx="3" cy="13" rx="2" ry="1.5" fill="#e8b878"/>
  <ellipse cx="5" cy="6" rx="1.5" ry="1" fill="#f0e8d0" stroke="#a8956a" stroke-width="0.4"/>
  <ellipse cx="15" cy="13" rx="5" ry="6" fill="#c98a4a" stroke="#8a5020" stroke-width="0.5"/>
  <ellipse cx="13" cy="11" rx="3" ry="2.5" fill="#e8b878"/>
  <ellipse cx="14" cy="22" rx="4" ry="3" fill="#d4a060" stroke="#8a5020" stroke-width="0.5"/>
  <ellipse cx="13" cy="20" rx="2" ry="1.5" fill="#e8b878"/>
</svg>`;

// 苹果 3 尺寸
const apple_small = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
  <path d="M7,4 C5,4 3,6 3,8 C3,10 5,12 7,12 C9,12 11,10 11,8 C11,6 9,4 7,4 Z" fill="#c02020" stroke="#7a0a0a" stroke-width="0.4"/>
  <ellipse cx="5" cy="7" rx="0.8" ry="1.2" fill="#ff5050" opacity="0.6"/>
  <ellipse cx="7" cy="3" rx="0.5" ry="0.5" fill="#3a8a3a"/>
</svg>`;

const apple_medium = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <path d="M10,5 C7,5 4,7 4,11 C4,14 7,17 10,17 C13,17 16,14 16,11 C16,7 13,5 10,5 Z" fill="#c02020" stroke="#7a0a0a" stroke-width="0.5"/>
  <ellipse cx="7" cy="9" rx="1.2" ry="1.8" fill="#ff5050" opacity="0.6"/>
  <ellipse cx="10" cy="3" rx="0.8" ry="0.7" fill="#3a8a3a"/>
</svg>`;

const apple_large = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
  <path d="M8,15 C5,15 3,18 3,22 C3,25 5,27 8,27 C11,27 13,25 13,22 C13,18 11,15 8,15 Z" fill="#a01010" stroke="#5a0a0a" stroke-width="0.5"/>
  <path d="M20,7 C17,7 15,10 15,13 C15,16 17,18 20,18 C23,18 25,16 25,13 C25,10 23,7 20,7 Z" fill="#c02020" stroke="#7a0a0a" stroke-width="0.5"/>
  <path d="M14,15 C12,15 10,17 10,20 C10,23 12,25 14,25 C16,25 18,23 18,20 C18,17 16,15 14,15 Z" fill="#d83030" stroke="#7a0a0a" stroke-width="0.5"/>
  <ellipse cx="6" cy="19" rx="0.8" ry="1.5" fill="#ff5050" opacity="0.6"/>
  <ellipse cx="19" cy="10" rx="0.8" ry="1.5" fill="#ff5050" opacity="0.6"/>
</svg>`;

// 面包 3 尺寸
const bread_small = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
  <ellipse cx="7" cy="8" rx="4" ry="3" fill="#e8c888" stroke="#a88040" stroke-width="0.4"/>
  <path d="M3,7 Q7,5 11,7" stroke="#a88040" stroke-width="0.3" fill="none"/>
  <circle cx="5" cy="8" r="0.3" fill="#8a5a20"/>
  <circle cx="9" cy="8" r="0.3" fill="#8a5a20"/>
</svg>`;

const bread_medium = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <ellipse cx="10" cy="11" rx="6" ry="4" fill="#e8c888" stroke="#a88040" stroke-width="0.5"/>
  <path d="M4,10 Q10,7 16,10" stroke="#a88040" stroke-width="0.4" fill="none"/>
  <circle cx="7" cy="11" r="0.4" fill="#8a5a20"/>
  <circle cx="11" cy="12" r="0.4" fill="#8a5a20"/>
  <circle cx="13" cy="11" r="0.3" fill="#8a5a20"/>
</svg>`;

const bread_large = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
  <ellipse cx="9" cy="15" rx="6" ry="4" fill="#e8c888" stroke="#a88040" stroke-width="0.5"/>
  <ellipse cx="19" cy="18" rx="6" ry="4" fill="#d8b070" stroke="#a88040" stroke-width="0.5"/>
  <path d="M3,14 Q9,11 15,14" stroke="#a88040" stroke-width="0.4" fill="none"/>
  <path d="M13,17 Q19,14 25,17" stroke="#a88040" stroke-width="0.4" fill="none"/>
  <circle cx="6" cy="15" r="0.4" fill="#8a5a20"/>
  <circle cx="12" cy="16" r="0.4" fill="#8a5a20"/>
  <circle cx="16" cy="18" r="0.4" fill="#8a5a20"/>
  <circle cx="22" cy="18" r="0.4" fill="#8a5a20"/>
</svg>`;

// 浆果 3 尺寸
const berry_small = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
  <circle cx="6" cy="8" r="2.5" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.4"/>
  <circle cx="9" cy="10" r="2" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.4"/>
  <ellipse cx="5" cy="7" rx="0.6" ry="0.4" fill="#a050c0" opacity="0.6"/>
</svg>`;

const berry_medium = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <circle cx="6" cy="10" r="3.5" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <circle cx="11" cy="7" r="3" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <circle cx="13" cy="12" r="2.8" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <ellipse cx="5" cy="9" rx="0.8" ry="0.5" fill="#a050c0" opacity="0.6"/>
  <ellipse cx="10" cy="6" rx="0.7" ry="0.4" fill="#a050c0" opacity="0.6"/>
</svg>`;

const berry_large = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
  <circle cx="6" cy="12" r="4" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <circle cx="14" cy="7" r="3.5" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <circle cx="20" cy="14" r="3.8" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <circle cx="11" cy="18" r="3" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <circle cx="22" cy="20" r="2.5" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <ellipse cx="5" cy="10" rx="1" ry="0.6" fill="#a050c0" opacity="0.6"/>
  <ellipse cx="13" cy="5" rx="0.8" ry="0.5" fill="#a050c0" opacity="0.6"/>
</svg>`;

export const FOOD_SPRITES: Record<FoodType, Record<FoodSize, string>> = {
  0: { small: chicken_small, medium: chicken_medium, large: chicken_large },
  1: { small: apple_small, medium: apple_medium, large: apple_large },
  2: { small: bread_small, medium: bread_medium, large: bread_large },
  3: { small: berry_small, medium: berry_medium, large: berry_large },
};
```

- [ ] **Step 2: 验证文件能编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit src/render/assets/FoodSprites.ts 2>&1 | head -20`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
cd d:\Projects\ant-cn
git add src/render/assets/FoodSprites.ts
git commit -m "feat(render): 新增 FoodSprites - 12个食物堆SVG(4种类x3尺寸)"
```

---

## Task 5: WornPath 资源常量

**Files:**
- Create: `src/render/assets/WornPath.ts`

- [ ] **Step 1: 创建磨损土路 SVG 和阈值**

```typescript
// src/render/assets/WornPath.ts

export const WEAR_THRESHOLD = 0.3;  // wearLevel > 0.3 触发土路渲染

// 磨损土路：草地变土路，保留少量草
export const WORN_PATH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
  <rect width="14" height="14" fill="#5a4a30"/>
  <path d="M2,12 L4,5" stroke="#3a5a20" stroke-width="0.3" fill="none" stroke-linecap="round" opacity="0.4"/>
  <path d="M8,12 L7,3" stroke="#3a5a20" stroke-width="0.3" fill="none" stroke-linecap="round" opacity="0.4"/>
  <circle cx="3" cy="3" r="0.3" fill="#6a9a40" opacity="0.3"/>
  <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.3"/>
</svg>`;
```

- [ ] **Step 2: 验证文件能编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit src/render/assets/WornPath.ts 2>&1 | head -20`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
cd d:\Projects\ant-cn
git add src/render/assets/WornPath.ts
git commit -m "feat(render): 新增 WornPath - 磨损土路SVG和阈值常量"
```

---

## Task 6: NestOverlay 资源常量

**Files:**
- Create: `src/render/assets/NestOverlay.ts`

- [ ] **Step 1: 创建蚁窝装饰元素**

```typescript
// src/render/assets/NestOverlay.ts

// 蚁窝外圈光晕（在蚁群色环之外的脉冲光）
export const NEST_GLOW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="-30 -30 60 60">
  <circle cx="0" cy="0" r="26" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>
  <circle cx="0" cy="0" r="24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>
</svg>`;

// 顶部小草（3 株，随机旋转）
export const NEST_GRASS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <path d="M2,18 Q4,8 6,18" stroke="#3a5a20" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <path d="M14,16 Q16,6 18,16" stroke="#3a5a20" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <path d="M8,14 Q10,4 12,14" stroke="#3a5a20" stroke-width="1.4" fill="none" stroke-linecap="round"/>
</svg>`;

// 蚁道（从蚁窝向外的磨损路径）
export const NEST_TRAIL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="8" viewBox="0 0 20 8">
  <path d="M0,4 Q5,2 10,4 T20,4" stroke="#5a4020" stroke-width="2.5" fill="none" opacity="0.5"/>
  <path d="M0,4 Q5,2 10,4 T20,4" stroke="#7a5020" stroke-width="1" fill="none" opacity="0.7"/>
</svg>`;
```

- [ ] **Step 2: 验证文件能编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit src/render/assets/NestOverlay.ts 2>&1 | head -20`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
cd d:\Projects\ant-cn
git add src/render/assets/NestOverlay.ts
git commit -m "feat(render): 新增 NestOverlay - 蚁窝装饰SVG(光晕/草/蚁道)"
```

---

## Task 7: WorldGrid Cell 扩展

**Files:**
- Modify: `src/simulation/WorldGrid.ts`

- [ ] **Step 1: 读取当前 WorldGrid.ts**

读 `d:\Projects\ant-cn\src\simulation\WorldGrid.ts`，定位 Cell 接口定义。

- [ ] **Step 2: 扩展 Cell 接口**

在 Cell 接口中追加新字段（位置在 `density` 后）：

```typescript
// src/simulation/WorldGrid.ts - Cell 接口处
import type { TerrainType } from '@/render/assets/TerrainTiles';
import type { ObstacleType } from '@/render/assets/ObstacleTiles';
import type { FoodType } from '@/render/assets/FoodSprites';

interface Cell {
  // ... existing fields (wall, food, markers, density, currentAnt) ...
  
  // 新增（task 7）
  terrain: TerrainType;     // 0=grass(default) 1=sand 2=water 3=rock
  obstacle: ObstacleType;    // 0=none 1=brick 2=ice 3=wood 4=fence
  foodType: FoodType;        // 0=chicken 1=apple 2=bread 3=berry
  wearLevel: number;         // 0~1，蚂蚁经过累积
}
```

- [ ] **Step 3: 找到 WorldGrid 构造函数/初始化处**

定位 `new Cell()` 或类似代码处，初始化新字段：

```typescript
// 初始化新字段（默认值）
cell.terrain = 0;       // 草地
cell.obstacle = 0;      // 无
cell.foodType = 0;      // 鸡腿
cell.wearLevel = 0;
```

- [ ] **Step 4: 验证 TypeScript 编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误（如果出现类型不匹配，按报错修复 import 路径）

- [ ] **Step 5: 提交**

```bash
cd d:\Projects\ant-cn
git add src/simulation/WorldGrid.ts
git commit -m "feat(simulation): WorldGrid Cell 扩展 - terrain/obstacle/foodType/wearLevel"
```

---

## Task 8: World.ts 工具方法

**Files:**
- Modify: `src/simulation/World.ts`

- [ ] **Step 1: 定位 World 类构造函数**

读 `d:\Projects\ant-cn\src\simulation\World.ts`，找到构造函数（接受 gridData 的部分）。

- [ ] **Step 2: 扩展 gridData 解析**

在解析 `walls` 和 `foods` 数组后，添加 terrain/obstacle/foodType 解析：

```typescript
// World.ts 构造函数中，gridData 解析处
// walls: [[cx, cy, obstacleType], ...]  // 兼容老格式 [[cx, cy]]
for (const [cx, cy, obstacleType] of (gridData.walls || [])) {
  const cell = this.map.getCell(cx, cy);
  cell.wall = true;
  cell.obstacle = (obstacleType ?? 1) as ObstacleType;  // 默认红砖
}
for (const [cx, cy, qty, foodType] of (gridData.foods || [])) {
  const cell = this.map.getCell(cx, cy);
  cell.food = qty;
  cell.foodType = (foodType ?? 0) as FoodType;  // 默认鸡腿
}
// 新增 terrain
for (const [cx, cy, terrain] of (gridData.terrain || [])) {
  const cell = this.map.getCell(cx, cy);
  cell.terrain = terrain as TerrainType;
  // 水地形（terrain=2）默认不可通过，与 obstacle 行为一致
  if (terrain === 2) cell.wall = true;
}
```

- [ ] **Step 3: 新增 setter 方法**

在 World 类添加：

```typescript
setTerrain(cx: number, cy: number, terrain: TerrainType): void {
  const cell = this.map.getCell(cx, cy);
  cell.terrain = terrain;
}

setObstacle(cx: number, cy: number, obstacle: ObstacleType): void {
  const cell = this.map.getCell(cx, cy);
  cell.obstacle = obstacle;
  cell.wall = obstacle !== 0;  // 0=通行，其他都算墙
}

setFoodType(cx: number, cy: number, foodType: FoodType): void {
  const cell = this.map.getCell(cx, cy);
  cell.foodType = foodType;
}

bumpWear(cx: number, cy: number, amount: number = 0.001): void {
  const cell = this.map.getCell(cx, cy);
  if (cell.wearLevel < 1) {
    cell.wearLevel = Math.min(1, cell.wearLevel + amount);
  }
}
```

- [ ] **Step 4: 验证编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误

- [ ] **Step 5: 提交**

```bash
cd d:\Projects\ant-cn
git add src/simulation/World.ts
git commit -m "feat(simulation): World 新增 setTerrain/setObstacle/setFoodType/bumpWear"
```

---

## Task 9: Worker 端 wearLevel 累加

**Files:**
- Modify: `src/simulation/simulation-worker.ts`

- [ ] **Step 1: 读取当前 worker 文件**

读 `d:\Projects\ant-cn\src\simulation\simulation-worker.ts`，定位蚂蚁移动逻辑（updateAnt 或类似）。

- [ ] **Step 2: 在蚂蚁移动后 bumpWear**

在蚂蚁 position 更新后（不依赖 phase）添加：

```typescript
// simulation-worker.ts 中 updateAnt 函数
// 假设 position 更新后
const cx = Math.floor(ant.position.x / Config.CELL_SIZE);
const cy = Math.floor(ant.position.y / Config.CELL_SIZE);
this.world.bumpWear(cx, cy, 0.001);
```

注：需检查 `this.world` 是否可访问，bumpWear 在 step 8 中已添加到 World。

- [ ] **Step 3: 验证编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误

- [ ] **Step 4: 提交**

```bash
cd d:\Projects\ant-cn
git add src/simulation/simulation-worker.ts
git commit -m "feat(worker): 蚂蚁移动时累加 cell.wearLevel"
```

---

## Task 10: TerrainRenderer 实现

**Files:**
- Create: `src/render/TerrainRenderer.ts`

- [ ] **Step 1: 创建 TerrainRenderer 类**

```typescript
// src/render/TerrainRenderer.ts
import { TERRAIN_TILES, type TerrainType } from './assets/TerrainTiles';
import { WORN_PATH_SVG, WEAR_THRESHOLD } from './assets/WornPath';
import { AssetRegistry } from './AssetRegistry';

export class TerrainRenderer {
  private gridWidth: number;
  private gridHeight: number;
  private cellSize: number;
  
  // 预解析的 4 种地形 + 磨损土路
  private terrainKeys: Map<TerrainType, string> = new Map();
  private wornKey: string = 'worn_path';
  
  constructor(gridWidth: number, gridHeight: number, cellSize: number) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.cellSize = cellSize;
    AssetRegistry.setCellSize(cellSize);
    this.preload();
  }
  
  private preload(): void {
    for (const t of [0, 1, 2, 3] as TerrainType[]) {
      const key = `terrain_${TERRAIN_TILES[t].id}`;
      AssetRegistry.preloadSVG(TERRAIN_TILES[t].svg, key);
      this.terrainKeys.set(t, key);
    }
    AssetRegistry.preloadSVG(WORN_PATH_SVG, this.wornKey);
  }
  
  setCellSize(size: number): void {
    if (size !== this.cellSize) {
      this.cellSize = size;
      AssetRegistry.setCellSize(size);
      this.preload();
    }
  }
  
  // 绘制地形（一次性画全屏视口范围）
  drawTerrain(ctx: CanvasRenderingContext2D, world: any, viewport: { offsetX: number; offsetY: number; zoom: number }, canvasWidth: number, canvasHeight: number): void {
    const invZoom = 1.0 / viewport.zoom;
    const vl = -viewport.offsetX * invZoom;
    const vt = -viewport.offsetY * invZoom;
    const vr = vl + canvasWidth * invZoom;
    const vb = vt + canvasHeight * invZoom;
    
    const sx = Math.max(0, Math.floor(vl / this.cellSize));
    const sy = Math.max(0, Math.floor(vt / this.cellSize));
    const ex = Math.min(this.gridWidth - 1, Math.ceil(vr / this.cellSize));
    const ey = Math.min(this.gridHeight - 1, Math.ceil(vb / this.cellSize));
    
    // 按地形分桶
    const buckets = new Map<TerrainType, Array<[number, number]>>();
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const cell = world.map.getCell(x, y);
        if (!cell) continue;
        const t = cell.terrain ?? 0;
        let bucket = buckets.get(t);
        if (!bucket) { bucket = []; buckets.set(t, bucket); }
        bucket.push([x, y]);
      }
    }
    
    for (const [t, cells] of buckets) {
      const key = this.terrainKeys.get(t);
      if (!key) continue;
      for (const [x, y] of cells) {
        AssetRegistry.drawTile(ctx, key, x * this.cellSize, y * this.cellSize, this.cellSize);
      }
    }
  }
  
  // 绘制磨损土路（仅 wearLevel > threshold 的 cell）
  drawWornPaths(ctx: CanvasRenderingContext2D, world: any, viewport: { offsetX: number; offsetY: number; zoom: number }, canvasWidth: number, canvasHeight: number): void {
    const invZoom = 1.0 / viewport.zoom;
    const vl = -viewport.offsetX * invZoom;
    const vt = -viewport.offsetY * invZoom;
    const vr = vl + canvasWidth * invZoom;
    const vb = vt + canvasHeight * invZoom;
    
    const sx = Math.max(0, Math.floor(vl / this.cellSize));
    const sy = Math.max(0, Math.floor(vt / this.cellSize));
    const ex = Math.min(this.gridWidth - 1, Math.ceil(vr / this.cellSize));
    const ey = Math.min(this.gridHeight - 1, Math.ceil(vb / this.cellSize));
    
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const cell = world.map.getCell(x, y);
        if (!cell) continue;
        if (cell.wearLevel > WEAR_THRESHOLD) {
          AssetRegistry.drawTile(ctx, this.wornKey, x * this.cellSize, y * this.cellSize, this.cellSize);
        }
      }
    }
  }
}
```

- [ ] **Step 2: 验证编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
cd d:\Projects\ant-cn
git add src/render/TerrainRenderer.ts
git commit -m "feat(render): TerrainRenderer - 地形+磨损土路绘制"
```

---

## Task 11: ObstacleRenderer 实现

**Files:**
- Create: `src/render/ObstacleRenderer.ts`

- [ ] **Step 1: 创建 ObstacleRenderer 类**

```typescript
// src/render/ObstacleRenderer.ts
import { OBSTACLE_TILES, type ObstacleType } from './assets/ObstacleTiles';
import { AssetRegistry } from './AssetRegistry';

export class ObstacleRenderer {
  private cellSize: number;
  private obstacleKeys: Map<ObstacleType, string> = new Map();
  
  constructor(cellSize: number) {
    this.cellSize = cellSize;
    AssetRegistry.setCellSize(cellSize);
    this.preload();
  }
  
  private preload(): void {
    for (const t of [0, 1, 2, 3, 4] as ObstacleType[]) {
      if (t === 0) continue;  // none 无需预解析
      const key = `obstacle_${OBSTACLE_TILES[t].id}`;
      AssetRegistry.preloadSVG(OBSTACLE_TILES[t].svg, key);
      this.obstacleKeys.set(t, key);
    }
  }
  
  // 绘制所有 wall=true 的 cell（按 obstacle 种类分桶）
  drawObstacles(ctx: CanvasRenderingContext2D, world: any, viewport: { offsetX: number; offsetY: number; zoom: number }, canvasWidth: number, canvasHeight: number): void {
    const invZoom = 1.0 / viewport.zoom;
    const vl = -viewport.offsetX * invZoom;
    const vt = -viewport.offsetY * invZoom;
    const vr = vl + canvasWidth * invZoom;
    const vb = vt + canvasHeight * invZoom;
    
    const sx = Math.max(0, Math.floor(vl / this.cellSize));
    const sy = Math.max(0, Math.floor(vt / this.cellSize));
    const ex = Math.min(world.map.width - 1, Math.ceil(vr / this.cellSize));
    const ey = Math.min(world.map.height - 1, Math.ceil(vb / this.cellSize));
    
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const cell = world.map.getCell(x, y);
        if (!cell || !cell.wall) continue;
        const o = cell.obstacle ?? 1;
        const key = this.obstacleKeys.get(o);
        if (key) {
          AssetRegistry.drawTile(ctx, key, x * this.cellSize, y * this.cellSize, this.cellSize);
        }
      }
    }
  }
}
```

- [ ] **Step 2: 验证编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
cd d:\Projects\ant-cn
git add src/render/ObstacleRenderer.ts
git commit -m "feat(render): ObstacleRenderer - 4种障碍物绘制"
```

---

## Task 12: FoodPileRenderer 实现

**Files:**
- Create: `src/render/FoodPileRenderer.ts`

- [ ] **Step 1: 创建 FoodPileRenderer 类**

```typescript
// src/render/FoodPileRenderer.ts
import { FOOD_SPRITES, foodSizeFromQty, type FoodType } from './assets/FoodSprites';
import { AssetRegistry } from './AssetRegistry';

export class FoodPileRenderer {
  private cellSize: number;
  private foodKeys: Map<string, string> = new Map();
  
  constructor(cellSize: number) {
    this.cellSize = cellSize;
    AssetRegistry.setCellSize(cellSize);
    this.preload();
  }
  
  private preload(): void {
    for (const t of [0, 1, 2, 3] as FoodType[]) {
      for (const size of ['small', 'medium', 'large'] as const) {
        const key = `food_${t}_${size}`;
        AssetRegistry.preloadSVG(FOOD_SPRITES[t][size], key);
        this.foodKeys.set(`${t}_${size}`, key);
      }
    }
  }
  
  drawFoodPiles(ctx: CanvasRenderingContext2D, world: any, viewport: { offsetX: number; offsetY: number; zoom: number }, canvasWidth: number, canvasHeight: number): void {
    const invZoom = 1.0 / viewport.zoom;
    const vl = -viewport.offsetX * invZoom;
    const vt = -viewport.offsetY * invZoom;
    const vr = vl + canvasWidth * invZoom;
    const vb = vt + canvasHeight * invZoom;
    
    const sx = Math.max(0, Math.floor(vl / this.cellSize));
    const sy = Math.max(0, Math.floor(vt / this.cellSize));
    const ex = Math.min(world.map.width - 1, Math.ceil(vr / this.cellSize));
    const ey = Math.min(world.map.height - 1, Math.ceil(vb / this.cellSize));
    
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const cell = world.map.getCell(x, y);
        if (!cell || cell.food <= 0) continue;
        const t = cell.foodType ?? 0;
        const size = foodSizeFromQty(cell.food);
        const key = this.foodKeys.get(`${t}_${size}`);
        if (key) {
          AssetRegistry.drawTile(ctx, key, x * this.cellSize, y * this.cellSize, this.cellSize);
        }
      }
    }
  }
}
```

- [ ] **Step 2: 验证编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
cd d:\Projects\ant-cn
git add src/render/FoodPileRenderer.ts
git commit -m "feat(render): FoodPileRenderer - 3尺寸食物堆绘制"
```

---

## Task 13: Renderer 集成新渲染器

**Files:**
- Modify: `src/render/Renderer.ts`

- [ ] **Step 1: 读取并扩展 Renderer**

读 `d:\Projects\ant-cn\src\render\Renderer.ts`，在类顶部新增 3 个渲染器实例：

```typescript
// Renderer.ts
import { TerrainRenderer } from './TerrainRenderer';
import { ObstacleRenderer } from './ObstacleRenderer';
import { FoodPileRenderer } from './FoodPileRenderer';
import { TERRAIN_TILES } from './assets/TerrainTiles';

export class Renderer {
  // ... existing fields ...
  private terrainRenderer: TerrainRenderer;
  private obstacleRenderer: ObstacleRenderer;
  private foodRenderer: FoodPileRenderer;
  
  constructor(world: World) {
    this.worldRenderer = new WorldRenderer(world.map);
    this.terrainRenderer = new TerrainRenderer(world.map.width, world.map.height, world.map.cellSize);
    this.obstacleRenderer = new ObstacleRenderer(world.map.cellSize);
    this.foodRenderer = new FoodPileRenderer(world.map.cellSize);
  }
  
  // ... existing addColony, removeColony ...
  
  render(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    // 1. 地形底图（替换原 #111111 黑底）
    // ctx.fillStyle = '#111111';
    // ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.save();
    ctx.translate(this.viewport.offsetX, this.viewport.offsetY);
    ctx.scale(this.viewport.zoom, this.viewport.zoom);
    
    // 2. 地形底图
    this.terrainRenderer.drawTerrain(ctx, this.world, this.viewport, canvasWidth, canvasHeight);
    
    // 3. 磨损土路
    this.terrainRenderer.drawWornPaths(ctx, this.world, this.viewport, canvasWidth, canvasHeight);
    
    // 4. 信息素 markers（保留 worldRenderer 现有逻辑）
    this.worldRenderer.render(ctx, this.viewport);
    
    // 5. 障碍物
    this.obstacleRenderer.drawObstacles(ctx, this.world, this.viewport, canvasWidth, canvasHeight);
    
    // 6. 食物堆
    this.foodRenderer.drawFoodPiles(ctx, this.world, this.viewport, canvasWidth, canvasHeight);
    
    // 7. 蚁窝和蚂蚁
    for (const cr of this.colonyRenderers) {
      cr.render(ctx, this.renderAnts, this.viewport.zoom);
    }
    
    ctx.restore();
  }
}
```

注：需添加 `private world: World;` 字段并在构造函数赋值。

- [ ] **Step 2: 验证编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
cd d:\Projects\ant-cn
git add src/render/Renderer.ts
git commit -m "feat(render): Renderer 集成 TerrainRenderer/ObstacleRenderer/FoodPileRenderer"
```

---

## Task 14: WorldRenderer 移除 wall/food 渲染

**Files:**
- Modify: `src/render/WorldRenderer.ts`

- [ ] **Step 1: 删除 wall/food 渲染分支**

读 `d:\Projects\ant-cn\src\render\WorldRenderer.ts`，在 `render()` 方法的 cell 循环中：

```typescript
// 删除这两段（已交给 ObstacleRenderer 和 FoodPileRenderer）
// if (cell.wall) {
//   color = '#726b6b';
// } else if (cell.food > 0) {
//   const g = Math.min(255, 100 + cell.food * 10);
//   color = `rgb(0,${g},0)`;
// } else if (drawMarkers && numColonies > 0) {
//   ...
// }
```

替换为只保留 markers/density 渲染：

```typescript
for (let y = startY; y <= endY; y++) {
  for (let x = startX; x <= endX; x++) {
    const cellIdx = y * width + x;
    const cell = cells[cellIdx];
    let color = '';
    
    // 仅渲染信息素 markers（wall/food 交给新渲染器）
    if (!cell.wall && cell.food === 0 && drawMarkers && numColonies > 0) {
      // ... 保留原 markers 计算逻辑 ...
    }
    
    if (drawDensity && !cell.wall && cell.density > 0.01 && !color) {
      // ... 保留 density 逻辑 ...
    }
    
    if (color) {
      // ... 保留 batch 逻辑 ...
    }
  }
}
```

- [ ] **Step 2: 验证编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
cd d:\Projects\ant-cn
git add src/render/WorldRenderer.ts
git commit -m "refactor(render): WorldRenderer 移除 wall/food 渲染(交给新渲染器)"
```

---

## Task 15: ColonyRenderer.renderBase 增强

**Files:**
- Modify: `src/render/ColonyRenderer.ts`

- [ ] **Step 1: 读取 renderBase 当前实现**

读 `d:\Projects\ant-cn\src\render\ColonyRenderer.ts` 的 `renderBase` 方法。

- [ ] **Step 2: 增强蚁窝渲染**

在 renderBase 中追加：顶部草 + 蚁群色光晕 + 周围蚂蚁 + 蚁道痕迹。

```typescript
// ColonyRenderer.ts renderBase 中，在现有土堆+色环+洞+小石头之后追加：

// 蚁群色光晕（额外脉冲环）
ctx.strokeStyle = this.colony.antsColor;
ctx.lineWidth = 0.8;
ctx.globalAlpha = 0.25;
ctx.beginPath();
ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
ctx.stroke();
ctx.globalAlpha = 1.0;

// 顶部小草（3 株，伪随机）
ctx.strokeStyle = '#3a5a20';
ctx.lineWidth = 1.4;
ctx.lineCap = 'round';
const seed = this.colony.id * 137;
for (let i = 0; i < 3; i++) {
  const angle = (seed + i * 2.094) % (2 * Math.PI);
  const r = radius * 0.85;
  const gx = x + Math.cos(angle) * r;
  const gy = y + Math.sin(angle) * r * 0.5;  // 椭圆分布
  const grassH = 4 + (seed + i * 31) % 4;
  ctx.beginPath();
  ctx.moveTo(gx - 1, gy);
  ctx.quadraticCurveTo(gx, gy - grassH * 0.6, gx + 0.5, gy - grassH);
  ctx.stroke();
}

// 周围 3-4 只装饰蚂蚁（用蚁群色）
ctx.fillStyle = this.colony.antsColor;
for (let i = 0; i < 3; i++) {
  const angle = (seed + i * 1.7 + 0.5) % (2 * Math.PI);
  const r = radius * (0.9 + ((seed + i * 23) % 100) / 500);
  const ax = x + Math.cos(angle) * r;
  const ay = y + Math.sin(angle) * r * 0.7;
  ctx.save();
  ctx.translate(ax, ay);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.ellipse(0, 0, 1.5, 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// 蚁道痕迹（4 个方向的短磨损路径）
ctx.strokeStyle = '#5a4020';
ctx.lineWidth = 2.5;
ctx.globalAlpha = 0.4;
for (let i = 0; i < 4; i++) {
  const angle = (seed + i * 1.57) % (2 * Math.PI);
  const sx = x + Math.cos(angle) * radius * 0.6;
  const sy = y + Math.sin(angle) * radius * 0.5;
  const ex = x + Math.cos(angle) * radius * 1.6;
  const ey = y + Math.sin(angle) * radius * 1.3;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.stroke();
}
ctx.globalAlpha = 1.0;
```

- [ ] **Step 3: 验证编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误

- [ ] **Step 4: 提交**

```bash
cd d:\Projects\ant-cn
git add src/render/ColonyRenderer.ts
git commit -m "feat(render): ColonyRenderer.renderBase 增强 - 草+光晕+周围蚂蚁+蚁道"
```

---

## Task 16: 蚂蚁可辨识性 backport - ColonyRenderer

**Files:**
- Modify: `src/render/ColonyRenderer.ts`

- [ ] **Step 1: 定位 renderAntsDetailed/Medium**

读 `d:\Projects\ant-cn\src\render\ColonyRenderer.ts`，定位 LOD_DETAIL 和 LOD_MEDIUM 分支（`renderAntsDetailed` 和 `renderAntsMedium`）。

- [ ] **Step 2: 缩小蚂蚁尺寸**

在两个方法顶部定义 `const SCALE = 0.7;`，把所有 `scale * 1.0` 改为 `scale * SCALE`：

```typescript
// renderAntsDetailed
const SCALE = 0.7;
// ... 把 const scale = ant.type === AntType.Soldier ? 2.0 : 1.0; 改为 ...
const baseScale = ant.type === AntType.Soldier ? 2.0 : 1.0;
const scale = baseScale * SCALE;
```

应用到所有 ellipse 坐标 (rx, ry, x, y 偏移) 和腿/触角长度。

- [ ] **Step 3: 添加 0.5px 暗色描边**

在 Batch 1（身体段）完成后，添加 stroke 描边：

```typescript
// Batch 1.5: 描边（在 body fill 之后）
ctx.strokeStyle = '#1a0808';
ctx.lineWidth = 0.5;
for (const ant of ants) {
  if (ant.phase === Mode.Dead || ant.phase === Mode.Dying) continue;
  const baseScale = ant.type === AntType.Soldier ? 2.0 : 1.0;
  const scale = baseScale * SCALE;
  const wobble = Math.sin(ant.wobblePhase) * 0.05;
  const angle = ant.direction.angle + Math.PI / 2 + wobble;
  ctx.save();
  ctx.translate(ant.position.x, ant.position.y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.ellipse(0, -3.5 * scale, 1.2 * scale, 1.2 * scale * 1.1, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, -1.2 * scale, 1.4 * scale * 0.85, 1.4 * scale, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, 1.8 * scale, 1.6 * scale, 2.2 * scale, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
```

同样修改 renderAntsMedium（描边线宽 0.3px）。

- [ ] **Step 4: 验证编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误

- [ ] **Step 5: 提交**

```bash
cd d:\Projects\ant-cn
git add src/render/ColonyRenderer.ts
git commit -m "feat(render): 蚂蚁可辨识性增强 - 缩小0.7x + 0.5px描边"
```

---

## Task 17: 蚂蚁可辨识性 backport - WorkerRenderer

**Files:**
- Modify: `src/render/WorkerRenderer.ts`

- [ ] **Step 1: 定位 renderAntsDetailed/Medium/Simple**

读 `d:\Projects\ant-cn\src\render\WorkerRenderer.ts`，定位 3 个 LOD 方法。

- [ ] **Step 2: 同样缩小 + 描边**

按 Task 16 相同模式修改 WorkerRenderer：
- 添加 `const SCALE = 0.7;` 常量
- 所有 base scale 乘 SCALE
- LOD_DETAIL 和 LOD_MEDIUM 中加 0.5px/0.3px 描边
- LOD_SIMPLE 保持现状（已是简单线段）

- [ ] **Step 3: 验证编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误

- [ ] **Step 4: 提交**

```bash
cd d:\Projects\ant-cn
git add src/render/WorkerRenderer.ts
git commit -m "feat(render): WorkerRenderer 蚂蚁可辨识性 - 缩小0.7x + 描边"
```

---

## Task 18: Worker 端 WorldGrid 同步扩展

**Files:**
- Modify: `src/simulation/simulation-worker.ts`

- [ ] **Step 1: 检查 worker init 时 Cell 初始化**

读 `d:\Projects\ant-cn\src\simulation\simulation-worker.ts`，找到 init 时创建 WorldGrid 的代码。

- [ ] **Step 2: 确保新字段被初始化**

如果 WorldGrid 的 Cell 构造已自动初始化（Task 7 中已添加），无需修改；否则补充：

```typescript
// simulation-worker.ts init 中
for (let i = 0; i < totalCells; i++) {
  // ... 现有初始化 ...
  this.world.map.cells[i].terrain = 0;
  this.world.map.cells[i].obstacle = 0;
  this.world.map.cells[i].foodType = 0;
  this.world.map.cells[i].wearLevel = 0;
}
```

- [ ] **Step 3: 验证编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误

- [ ] **Step 4: 提交**

```bash
cd d:\Projects\ant-cn
git add src/simulation/simulation-worker.ts
git commit -m "feat(worker): WorldGrid 新字段 worker 端初始化"
```

---

## Task 19: Worker 协议 init 扩展

**Files:**
- Modify: `src/simulation/worker-protocol.ts`

- [ ] **Step 1: 定位 InitConfig 接口**

读 `d:\Projects\ant-cn\src\simulation\worker-protocol.ts`，找到 InitConfig。

- [ ] **Step 2: 新增 enableVisualTheme 字段**

```typescript
// worker-protocol.ts
export interface InitConfig {
  // ... 已有 ...
  enableVisualTheme: boolean;  // false=退回原#111111黑底(调试用)
}
```

- [ ] **Step 3: 验证编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误

- [ ] **Step 4: 提交**

```bash
cd d:\Projects\ant-cn
git add src/simulation/worker-protocol.ts
git commit -m "feat(worker): InitConfig 新增 enableVisualTheme"
```

---

## Task 20: useSimulation 加载新字段

**Files:**
- Modify: `src/hooks/useSimulation.ts`

- [ ] **Step 1: 定位 gridData 传递处**

读 `d:\Projects\ant-cn\src\hooks\useSimulation.ts`，找到 init 时的 gridData。

- [ ] **Step 2: 扩展 gridData 解析**

```typescript
// useSimulation.ts - init 配置中
const initConfig = {
  // ... 已有 ...
  gridData: {
    cellSize: 4,
    terrain: setupConfig.terrain || [],
    walls: setupConfig.walls || [],
    foods: setupConfig.foods || [],
  },
  enableVisualTheme: true,
};
```

- [ ] **Step 3: 验证编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误

- [ ] **Step 4: 提交**

```bash
cd d:\Projects\ant-cn
git add src/hooks/useSimulation.ts
git commit -m "feat(hook): useSimulation 传递 gridData.terrain 到 init"
```

---

## Task 21: MapEditor 工具栏扩展

**Files:**
- Modify: `src/pages/MapEditor.tsx`

- [ ] **Step 1: 读取当前工具栏**

读 `d:\Projects\ant-cn\src\pages\MapEditor.tsx`，找到工具栏 JSX 和 tool 状态。

- [ ] **Step 2: 新增"地形"工具和"障碍物"二级选择**

```typescript
// MapEditor.tsx - state 中
const [tool, setTool] = useState<EditorTool>('wall');
const [terrainType, setTerrainType] = useState<TerrainType>(0);
const [obstacleType, setObstacleType] = useState<ObstacleType>(1);

// JSX 中在 EditToolbar 附近添加：
<button onClick={() => setTool('terrain')} className={tool === 'terrain' ? 'active' : ''}>
  <Mountain size={16} /> 地形
</button>
{tool === 'terrain' && (
  <select value={terrainType} onChange={(e) => setTerrainType(+e.target.value as TerrainType)}>
    <option value={0}>草地</option>
    <option value={1}>沙地</option>
    <option value={2}>水</option>
    <option value={3}>石头</option>
  </select>
)}

<button onClick={() => setTool('obstacle')} className={tool === 'obstacle' ? 'active' : ''}>
  <Brick size={16} /> 障碍
</button>
{tool === 'obstacle' && (
  <select value={obstacleType} onChange={(e) => setObstacleType(+e.target.value as ObstacleType)}>
    <option value={1}>红砖</option>
    <option value={2}>冰砖</option>
    <option value={3}>木板</option>
    <option value={4}>铁栅</option>
  </select>
)}
```

- [ ] **Step 3: 修改 paint handler**

```typescript
// MapEditor.tsx - onPointerDown 中
if (tool === 'terrain') {
  gridRef.current[cy * gridW + cx] = 0;  // 清空
  // 收集到 editorGridData
  updateGridData('terrain', cx, cy, terrainType);
} else if (tool === 'obstacle') {
  gridRef.current[cy * gridW + cx] = 1;
  updateGridData('walls', cx, cy, obstacleType);
}
// ... 现有 wall/food 分支
```

- [ ] **Step 4: editorGridData 序列化扩展**

参考 Task 7 的格式，序列化/反序列化时包含 terrain 数组。

- [ ] **Step 5: 验证编译**

Run: `cd d:\Projects\ant-cn; npx tsc --noEmit 2>&1 | head -30`
Expected: 无错误

- [ ] **Step 6: 提交**

```bash
cd d:\Projects\ant-cn
git add src/pages/MapEditor.tsx
git commit -m "feat(editor): MapEditor 工具栏新增地形/障碍物选择"
```

---

## Task 22: 后端 gridData 解析扩展

**Files:**
- Modify: `server/src/routes.ts`
- Modify: `server/src/db.ts`

- [ ] **Step 1: 读取后端 routes.ts**

读 `d:\Projects\ant-cn\server\src\routes.ts`，找到 POST/PUT /maps 的 gridData 解析。

- [ ] **Step 2: 扩展 gridData 解析**

```typescript
// routes.ts POST/PUT handler
const gridData = JSON.parse(req.body.grid_data || '{}');
// 兼容老格式
const terrain = Array.isArray(gridData.terrain) ? gridData.terrain : [];
const walls = (gridData.walls || []).map((w: any[]) => 
  w.length === 2 ? [w[0], w[1], 1] : w  // 老格式补 obstacleType=1
);
const foods = (gridData.foods || []).map((f: any[]) =>
  f.length === 3 ? [f[0], f[1], f[2], 0] : f  // 老格式补 foodType=0
);

const newGridData = JSON.stringify({
  cellSize: gridData.cellSize || 4,
  terrain,
  walls,
  foods,
});
```

- [ ] **Step 3: db.ts 新增列（可选）**

无需新增列（grid_data 是 TEXT 存 JSON 整体），跳过。

- [ ] **Step 4: 验证编译**

Run: `cd d:\Projects\ant-cn\server; npx tsc --noEmit 2>&1 | head -20`
Expected: 无错误

- [ ] **Step 5: 提交**

```bash
cd d:\Projects\ant-cn
git add server/src/routes.ts
git commit -m "feat(server): routes 解析 gridData 新字段(terrain/obstacle/foodType)"
```

---

## Task 23: 集成测试 - 视觉验证

**Files:**
- 不需要新建文件

- [ ] **Step 1: 启动后端**

Run: `cd d:\Projects\ant-cn\server; npm run dev`
Expected: 服务器在 3001 端口运行

- [ ] **Step 2: 启动前端**

Run: `cd d:\Projects\ant-cn; npm run dev`
Expected: Vite 在 5174 端口运行

- [ ] **Step 3: 浏览器访问主菜单**

浏览器打开 `http://localhost:5174`，应该看到主菜单。

- [ ] **Step 4: 创建测试地图**

点击"制作地图"，地图名"测试地图"，画：
- 5x5 草地地形（默认）
- 中间一条沙地
- 角落画红砖墙
- 几个食物点
- 保存

- [ ] **Step 5: 选择地图开始**

回到主菜单，点击"选择地图开始"，选择刚保存的"测试地图"，设置 2 个蚁群，开始模拟。

- [ ] **Step 6: 视觉验证清单**

打开 DevTools Console 检查无错误，逐项验证：
- [ ] 背景是草地纹理，不是纯黑
- [ ] 沙地区域显示沙地纹理
- [ ] 障碍物显示红砖纹理
- [ ] 食物显示鸡腿/苹果图标
- [ ] 蚁窝显示草+光晕+周围蚂蚁
- [ ] 蚂蚁聚集处单只仍可辨识（描边+缩小）
- [ ] 蚂蚁跑 30 秒后磨损土路出现

- [ ] **Step 7: 性能验证**

打开 Chrome DevTools Performance 面板录制 10 秒：
- 帧时间中位数 < 12ms
- 99 分位 < 16ms
- 内存增长 < 10MB/分钟

- [ ] **Step 8: 记录结果到文档**

如果通过：在 `docs/UI美化实施记录-20260604.md` 写"完成"及截图。
如果不通过：记录问题并修复。

---

## Task 24: 集成测试 - 老地图兼容性

- [ ] **Step 1: 启动后端 + 前端（同 Task 23）**

- [ ] **Step 2: 加载老地图**

选择一个 Task 23 之前的地图（没有 terrain 字段）。

- [ ] **Step 3: 验证兼容**

- 整张地图应该是草地（terrain 默认 0）
- 现有 wall 应该是红砖（obstacleType 默认 1）
- 现有 food 应该是鸡腿（foodType 默认 0）
- 没有报错

- [ ] **Step 4: 提交（如有修复）**

```bash
cd d:\Projects\ant-cn
git add -A
git commit -m "fix: 老地图兼容性修复 (如有)"
```

---

## 完成

所有 24 个 Task 完成后：
1. 整体提交（如果还有未提交改动）
2. 通知用户实施完成
3. 邀请用户进行游戏化测试

---

## 注意事项

- 每个 Task 都是独立可提交的小步
- TypeScript 编译错误优先解决再继续
- 视觉变化必测（不能用单元测试覆盖）
- 性能回归必查（蚂蚁数量应保持 400+50 默认）
- 频繁 commit 是关键，便于回滚
