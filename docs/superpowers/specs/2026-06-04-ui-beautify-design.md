# UI 美化设计 - 蚂蚁模拟游戏

| 字段 | 值 |
|------|-----|
| 日期 | 2026-06-04 |
| 项目 | ant-cn (Web 蚂蚁行为模拟游戏) |
| 状态 | 待用户审核 |
| 配套实现 | 实施计划将由 writing-plans 技能生成 |

## 1. 背景与目标

### 1.1 当前问题
模拟器现有视觉表现过于简陋，违背游戏产品定位：
- 背景纯黑（`#111111`），缺乏环境氛围
- 障碍物为单一灰块（`#726b6b`），像开发占位符
- 食物为绿色色块，不具备"食物"语义
- 蚁窝虽已有棕色土堆，但与整体风格脱节
- 信息素轨迹是色块叠加，与环境割裂

### 1.2 目标
把 Canvas 渲染从"开发者视角"提升到"玩家视角"，让地图看起来像真实的蚂蚁生态场景，同时保持 12ms 帧时间预算和现有的脏区域增量序列化性能。

### 1.3 不在范围内
- 蚁群管理 UI、参数面板、控制面板、菜单流程（已游戏化，本设计不涉及）
- 服务端、地图 CRUD、API（已存在）
- 蚂蚁行为/战斗逻辑（已稳定，本设计只改视觉）
- 移动端响应式改造
- 国际化

## 2. 关键决策（已与用户确认）

| # | 决策点 | 选择 | 替代方案 |
|---|--------|------|----------|
| 1 | 美术资源来源 | **SVG 矢量** | 程序化/emoji/PNG 素材 |
| 2 | 地形系统 | **多地形（草地/沙地/水/石头）** | 单一/双地形 |
| 3 | 食物视觉 | **食物堆（按数量大小）+ 多样种类** | 统一鸡腿/4 种轮换 |
| 4 | 障碍物风格 | **多种可选（红砖/冰砖/木板/铁栅栏）** | 统一红砖/跟随地形 |
| 5 | 蚁窝视觉 | **强化（草+光晕+蚁道+周围蚂蚁）** | 保持现状/仅加装饰 |
| 6 | 信息素轨迹 | **磨损土路+蚁群色叠加** | 保持色块/发光带 |
| 7 | 蚂蚁群聚可辨识性 | **缩小 0.7x + 0.5px 暗色描边（双保险）** | 仅描边/仅缩小/动态 alpha |

## 3. 架构

### 3.1 渲染分层（自底向上）
```
┌────────────────────────────────────────────┐
│  L7  UI 层（React + Tailwind 玻璃态）     │  ← 不变
├────────────────────────────────────────────┤
│  L6  模拟器主控（Renderer / WorkerRenderer）│  ← 新增视觉装配逻辑
├────────────────────────────────────────────┤
│  L5  主题精灵表（ThemeAssetRegistry）       │  ← 新增：SVG/纹理缓存
├────────────────────────────────────────────┤
│  L4  元素渲染器（FoodPileRenderer 等）      │  ← 新增：每个元素独立类
├────────────────────────────────────────────┤
│  L3  World 渲染（地形+信息素+障碍物）      │  ← 重构为分层绘制
├────────────────────────────────────────────┤
│  L2  Cell 数据（WorldGrid）                 │  ← 扩展字段（见 3.3）
├────────────────────────────────────────────┤
│  L1  Worker 计算（simulation/）             │  ← 不变
└────────────────────────────────────────────┘
```

### 3.2 新增模块
- `src/render/assets/TerrainTiles.ts` — 4 种地形 SVG 图案定义
- `src/render/assets/ObstacleTiles.ts` — 4 种障碍物 SVG 图案定义
- `src/render/assets/FoodSprites.ts` — 食物堆 3 个尺寸 SVG + 4 种食物轮换表
- `src/render/assets/NestOverlay.ts` — 蚁窝装饰（草/光晕/蚁道/周围蚂蚁）
- `src/render/assets/WornPath.ts` — 磨损土路图案 + 阈值定义
- `src/render/AssetRegistry.ts` — SVG → OffscreenCanvas 缓存，避免每帧重新解析
- `src/render/TerrainRenderer.ts` — 地形+磨损土路绘制（替代 WorldRenderer 部分职责）
- `src/render/ObstacleRenderer.ts` — 障碍物绘制
- `src/render/FoodPileRenderer.ts` — 食物堆绘制（按 qty 决定尺寸+种类）

### 3.3 数据模型扩展
不改 simulation 计算逻辑，只扩展持久化和传输层：

#### 3.3.1 WorldGrid cell 扩展（新增字段，老字段不变）
```typescript
// src/simulation/WorldGrid.ts
interface Cell {
  // 已有
  wall: boolean;
  food: number;
  markers: ColonyCellMarker[];
  density: number;
  currentAnt: number;
  // 新增
  terrain: TerrainType;     // 0=grass(默认) 1=sand 2=water 3=rock
  obstacle: ObstacleType;    // 0=none 1=brick 2=ice 3=wood 4=fence
  foodType: FoodType;        // 0=chicken 1=apple 2=bread 3=berry
  wearLevel: number;         // 0~1，蚂蚁经过累积，由 Worker 端累加
}
```

#### 3.3.2 数据库扩展
```sql
-- maps 表新增列（向后兼容，老地图全为默认值）
ALTER TABLE maps ADD COLUMN terrain_seed INTEGER DEFAULT 0;
-- grid_data JSON 扩展
{ "cellSize": 4, "terrain": [[cx,cy,type],...], "walls": [[cx,cy,obstacleType],...], "foods": [[cx,cy,qty,foodType],...] }
```

#### 3.3.3 Worker 协议扩展
```typescript
// src/simulation/worker-protocol.ts init 命令新增
interface InitConfig {
  // 已有
  mapWidth: number;
  mapHeight: number;
  colonyPositions: Array<{...}>;
  gridData: GridData;
  // 新增
  enableVisualTheme: boolean;  // 关闭则退回原 #111111 黑底（兼容调试）
}
```

### 3.4 渲染流程（按 z-order）
1. **清屏**：`ctx.clearRect()`
2. **地形底图**：`TerrainRenderer` 按 cell 填充 4 种图案（水地形与障碍物同层，因为蚂蚁不能通过水）
3. **磨损土路**：`TerrainRenderer` 用 wearLevel > 0.3 的 cell 叠加土路图案
4. **信息素**：蚁群色透明度叠加在格子上（保持现状逻辑，不在已变水/石头的 cell 上画）
5. **障碍物**：`ObstacleRenderer` 绘制 4 种砖墙（z 高于地形，蚂蚁无法通过）
6. **食物堆**：`FoodPileRenderer` 绘制 3 尺寸 SVG 堆（按 qty 决定大小+种类）
7. **蚁窝**：`ColonyRenderer.renderBase()` 增强版本
8. **蚂蚁**：`ColonyRenderer.renderAnts()`（已存在 LOD 逻辑不变，叠加 0.7x 缩小 + 0.5px 描边，见 3.7）

### 3.5 通行规则（与地形系统绑定）
- 草地、沙地：可通行，蚂蚁按 `Config.ANT_SPEED` 移动
- 水：不可通行（视为墙），与 obstacle 行为一致
- 石头：装饰性底图，本身不阻挡（地图作者可叠墙在上面）

### 3.6 缓存策略
- SVG 字符串 → 预解析为 `OffscreenCanvas`（24×12 障碍物、20×20 地形等）存入 `AssetRegistry`
- Canvas API 渲染时 `ctx.drawImage(cache, x, y, cellSize*scale, cellSize*scale)`
- 避免每帧 `new Path2D()` / `parseFloat()` 的开销
- AssetRegistry 单例，按 cellSize 缓存；cellSize 不同时失效重建

### 3.7 蚂蚁群聚可辨识性增强（backport）

#### 3.7.1 问题
多只同色蚂蚁在蚁窝附近、路径交叉、食物堆周围挤在一起时，三段椭圆身体相互重叠，形成大色块，无法识别单只个体。

#### 3.7.2 解决方案：双保险
1. **尺寸缩小**：所有 LOD 蚂蚁整体 scale 从 `1.0` 降至 `0.7`
   - LOD_DETAIL（zoom≥1.5）：segment rx/ry 乘 0.7，腿/触角长度乘 0.7
   - LOD_MEDIUM（0.6≤zoom<1.5）：同样乘 0.7
   - LOD_SIMPLE（zoom<0.6）：保持现状（已经是简单线段，影响小）
2. **暗色描边**：每只蚂蚁身体段（头/胸/腹）加 0.5px 描边，颜色为 `#1a0808`（比蚁群色暗 4 档）
   - 描边仅在 LOD_DETAIL 模式下生效（性能考虑，LOD_MEDIUM 仍可生效但描边细到 0.3px）
   - 描边在蚁群色之上绘制（顺序：先 fill，再 stroke）

#### 3.7.3 影响范围
- 主线程：`src/render/ColonyRenderer.ts`（renderAntsDetailed/Medium/Simple）
- Worker 端：`src/render/WorkerRenderer.ts`（renderAntsFromData/Detailed/Medium/Simple）
- 两端必须同步修改，保持视觉一致

#### 3.7.4 性能影响
- 描边增加 ~5% 渲染开销（每只蚂蚁多一次 stroke 调用，但批处理仍然生效）
- 缩小不影响性能，反而让 batch 命中的 cell 区域更大
- 预计单帧蚂蚁渲染从 5ms → 5.2ms，仍在预算内

## 4. 组件接口

### 4.1 TerrainTiles
```typescript
export const TERRAIN_TILES = {
  0: { id: 'grass', svg: '...', bg: '#3a5a20', accent: '#5a8a35' },
  1: { id: 'sand',  svg: '...', bg: '#c9a866', accent: '#a8854a' },
  2: { id: 'water', svg: '...', bg: '#3a5a8a', accent: '#7a9aca' },
  3: { id: 'rock',  svg: '...', bg: '#6a6a72', accent: '#8a8a92' },
} as const;
export type TerrainType = 0 | 1 | 2 | 3;
```

### 4.2 ObstacleTiles
```typescript
export const OBSTACLE_TILES = {
  1: { id: 'brick', svg: '...', palette: { fg: '#a04020', bg: '#8a3818', line: '#2a0808' } },
  2: { id: 'ice',   svg: '...', palette: { fg: '#a0c8e8', bg: '#80b0d8', line: '#1a3a5a' } },
  3: { id: 'wood',  svg: '...', palette: { fg: '#a08050', bg: '#806040', line: '#2a1a08' } },
  4: { id: 'fence', svg: '...', palette: { fg: '#7a7a82', bg: '#4a4a52', line: '#1a1a22' } },
} as const;
export type ObstacleType = 0 | 1 | 2 | 3 | 4;
```

### 4.3 FoodSprites
```typescript
export const FOOD_SPRITES = {
  chicken: { small: 'svg', medium: 'svg', large: 'svg' },
  apple:   { small: 'svg', medium: 'svg', large: 'svg' },
  bread:   { small: 'svg', medium: 'svg', large: 'svg' },
  berry:   { small: 'svg', medium: 'svg', large: 'svg' },
} as const;
export type FoodType = 0 | 1 | 2 | 3;

// 尺寸阈值
export const FOOD_SIZE_THRESHOLDS = { small: 1, medium: 5, large: 10 };
export function foodSizeFromQty(qty: number): 'small' | 'medium' | 'large';
```

### 4.4 AssetRegistry
```typescript
class AssetRegistry {
  private cache: Map<string, HTMLCanvasElement> = new Map();
  private cellSize: number = 0;
  
  // 预解析 SVG 字符串为 Canvas
  preloadSVG(svg: string, width: number, height: number, key: string): HTMLCanvasElement;
  
  // 绘制缓存到目标 ctx
  drawTile(ctx: CanvasRenderingContext2D, key: string, x: number, y: number, size: number): void;
  
  // cellSize 变化时失效
  invalidate(): void;
}
```

## 5. 数据流

### 5.1 地图编辑流程（用户操作）
```
[用户在地图编辑器选择"地形"工具 + 草地形]
  → MapEditor.tsx onClick  → handleTerrainPaint(cx, cy, terrain)
    → gridData.terrain.push([cx, cy, 1])
      → 立即重渲染对应 cell（红色/黄色/蓝色高亮）
[用户点击保存]
  → POST /api/maps { gridData: { terrain: [...], walls: [...], foods: [...] } }
    → SQLite 存储
[用户选择该地图开始]
  → init 命令携带 gridData.terrain → Worker 初始化 cell.terrain
    → WorkerRenderer/ColonyRenderer 读 cell.terrain 选择 TerrainTiles
```

### 5.2 模拟运行流程（Worker 模式）
```
[Worker 帧循环]
  → 蚂蚁移动 → 增加经过 cell 的 wearLevel（每帧 += 0.001）
  → 食物被吃 → 减少 qty → FoodPileRenderer 重绘（小堆→消失）
  → 战斗 → 蚂蚁进入 Dying → 渐隐
  → postMessage dirty cells → WorkerRenderer 接收 → 增量更新 worldState
[WorkerRenderer 帧渲染]
  → render(ctx, ...)
    → TerrainRenderer.draw()    // 一次性画全屏地形（缓存命中）
    → WornPath.draw()            // 只画 wearLevel > threshold 的 cell
    → ObstacleRenderer.draw()    // 只画 dirty 中 wall 变化的 cell
    → FoodPileRenderer.draw()    // 同上
    → ColonyRenderer.drawBase()  // 已有
    → ColonyRenderer.drawAnts()  // 已有 LOD 逻辑
```

### 5.3 渲染性能预算（12ms / 帧）
| 阶段 | 目标耗时 |
|------|----------|
| 地形（缓存 drawImage） | ≤ 1ms |
| 磨损土路 | ≤ 0.5ms |
| 信息素（脏区域） | ≤ 2ms |
| 障碍物（脏区域） | ≤ 1ms |
| 食物（脏区域） | ≤ 0.5ms |
| 蚁窝 | ≤ 0.5ms |
| 蚂蚁（LOD） | ≤ 5ms |
| **合计** | **≤ 10.5ms**（留 1.5ms 余量） |

## 6. 错误处理

### 6.1 SVG 解析失败
- `AssetRegistry.preloadSVG` 失败 → 回退到当前实现（纯色 `fillRect`）
- 不阻断渲染，仅视觉降级

### 6.2 老地图兼容
- 加载老地图（`gridData.terrain` 缺失） → `Cell.terrain` 默认全 0（草地）
- 加载老地图（`obstacle` 缺失） → 现有 `wall: true` 全部映射为 1（红砖）
- 加载老地图（`foodType` 缺失） → 随机分配 0~3

### 6.3 cellSize 不匹配
- 编辑器 cellSize=4，模拟器 cellSize=Config.CELL_SIZE=4（已一致）
- 模拟器缩放时按比例 `drawImage` 缩放，不重新生成缓存

### 6.4 Worker 端/主线程端不一致
- 两端用相同的 `TERRAIN_TILES/OBSTACLE_TILES/FOOD_SPRITES` 常量（从 `src/render/assets/` 同一文件 import）
- 避免硬编码颜色/尺寸

## 7. 测试策略

### 7.1 单元测试（vitest，可选）
- `AssetRegistry.preloadSVG` 幂等性
- `foodSizeFromQty` 阈值边界
- `COLONY_TILE_CACHE` 失效逻辑

### 7.2 视觉验证（手动）
- 4 种地形：草地/沙地/水/石头 各占 25% 的小地图，截图比对
- 4 种障碍物：4 张 100×100 局部截图
- 食物堆：小/中/大 各 1 个，背景对比度检查
- 蚁窝：4 个蚁群同屏时颜色辨识度
- 磨损土路：观察 1 分钟蚂蚁行走后路径变化

### 7.3 性能验证
- Chrome DevTools Performance 面板录制 10 秒
- 帧时间中位数 < 12ms，99 分位 < 16ms
- 内存增长 < 10MB/分钟

### 7.4 兼容性
- Chrome/Edge/Firefox/Safari 最新版
- 1280×720 和 1920×1080 两种分辨率
- Worker 模式 + 主线程模式都覆盖

## 8. 实施计划

详见后续 `writing-plans` 技能生成的实施计划文档。预期阶段：
1. **基础设施** — AssetRegistry + 4 个 assets/*.ts 常量定义
2. **地形层** — TerrainRenderer + WorldGrid 扩展 + 兼容性
3. **障碍物层** — ObstacleRenderer + 编辑器工具栏扩展
4. **食物层** — FoodPileRenderer + 3 尺寸阈值
5. **蚁窝层** — ColonyRenderer.renderBase 增强
6. **信息素磨损** — WornPath + Worker wearLevel 累加
7. **蚂蚁可辨识性 backport** — ColonyRenderer + WorkerRenderer 缩小 0.7x + 描边
8. **集成测试** — 4 地形地图 + 4 蚁群 + 10 分钟稳定性

## 9. 风险与权衡

| 风险 | 缓解 |
|------|------|
| SVG 渲染 800×800 网格性能不足 | AssetRegistry 缓存 + 视口裁剪（与现有策略一致）|
| 视觉变花哨干扰蚂蚁行为观察 | 蚁群色+信息素透明度与之前保持一致，仅替换底层 |
| Worker/主线程代码重复 | assets/*.ts 共享常量，渲染逻辑按需在两端复制 |
| 移动端 SVG 渲染慢 | 本设计不在范围内，下一轮再做 |
| 老地图数据丢失 | 字段缺失全部给默认值，向后兼容 |
| 蚂蚁描边后视觉太"卡通"失去写实感 | 描边仅 0.5px 暗色，远视图不可见，仅在 zoom≥0.6 时生效 |

## 10. 附录

### 10.1 决策过程
- 第 1 轮：美术资源 → C SVG
- 第 2 轮：地形 → C 多地形
- 第 3 轮：食物 → C 食物堆 + 多样种类
- 第 4 轮：障碍物 → C 多种可选
- 第 5 轮：蚁窝 → C 强化版
- 第 6 轮：信息素 → C 磨损土路+蚁群色
- 第 7 轮：完整预览 → 用户批准
- 第 8 轮：蚂蚁群聚可辨识性（追加）→ C 缩小 0.7x + 0.5px 描边

完整可视化对比见 `.superpowers/brainstorm/ui-beautify/content/01-08-*.html`
