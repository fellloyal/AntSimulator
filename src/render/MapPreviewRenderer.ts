// MapPreviewRenderer - 给 GameSetup 等"无 World 实例"场景共享的地图预览渲染器
// 输入：gridData 解析后的对象（含 cellSize, walls, foods, terrain）
// 输出：直接在 ctx 上画地形/障碍/食物纹理
// 与 WorkerRenderer 共享 AssetRegistry 单例，纹理仅加载一次
import { TERRAIN_TILES, type TerrainType } from './assets/TerrainTiles';
import { OBSTACLE_TILES, type ObstacleType } from './assets/ObstacleTiles';
import { foodSizeFromQty, preloadFoodSprite, type FoodType } from './assets/FoodSprites';
import { TERRAIN_AUTO_EDGE, TERRAIN_AUTO_CORNER } from './assets/TerrainAutoTiles';
import { AssetRegistry } from './AssetRegistry';
import {
  computeEdgeMask,
  computeCornerMask,
  computeAllCorners,
  makePreviewGridAdapter,
  type TerrainGrid,
  type Corner,
} from './TerrainAdjacency';
import useStore from '@/store/useStore';
import type { Viewport } from './TerrainRenderer';

export interface PreviewCell {
  terrain: number;
  obstacle: number;
  food: number;
  foodType: number;
  wall: number;
}

export interface PreviewGridData {
  cellSize: number;
  walls: Array<[number, number, number?]>;
  foods: Array<[number, number, number, number?]>;
  terrain: Array<[number, number, number]>;
}

export class MapPreviewRenderer {
  cellSize: number;
  private gridWidth: number;
  private gridHeight: number;
  private terrainKeys: Map<number, string> = new Map();
  private autoEdgeKeys: Map<number, Map<number, string>> = new Map();
  private autoCornerKeys: Map<number, Map<Corner, Map<'convex' | 'concave', string>>> = new Map();
  private obstacleKeys: Map<number, string> = new Map();
  private foodKeys: Map<string, string> = new Map();

  constructor(cellSize: number, gridWidth: number, gridHeight: number) {
    this.cellSize = cellSize;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    AssetRegistry.setCellSize(cellSize);
    this.preloadTextures();
  }

  setCellSize(size: number): void {
    if (size !== this.cellSize) {
      this.cellSize = size;
      AssetRegistry.setCellSize(size);
    }
  }

  private preloadTextures(): void {
    for (const t of [0, 1, 2, 3] as TerrainType[]) {
      const key = `terrain_${TERRAIN_TILES[t].id}`;
      AssetRegistry.preloadSVG(TERRAIN_TILES[t].svg, key);
      this.terrainKeys.set(t, key);

      // 24-tile 自动过渡：16 边变体
      const edgeMap = new Map<number, string>();
      for (let mask = 0; mask < 16; mask++) {
        const ek = `auto_edge_${TERRAIN_TILES[t].id}_${mask}`;
        AssetRegistry.preloadSVG(TERRAIN_AUTO_EDGE[t][mask], ek);
        edgeMap.set(mask, ek);
      }
      this.autoEdgeKeys.set(t, edgeMap);

      // 24-tile 自动过渡：4 角 × 2 variant
      const cornerMap = new Map<Corner, Map<'convex' | 'concave', string>>();
      for (const corner of ['tl', 'tr', 'bl', 'br'] as Corner[]) {
        const variantMap = new Map<'convex' | 'concave', string>();
        for (const variant of ['convex', 'concave'] as ('convex' | 'concave')[]) {
          const ck = `auto_corner_${TERRAIN_TILES[t].id}_${corner}_${variant}`;
          AssetRegistry.preloadSVG(TERRAIN_AUTO_CORNER[t][corner][variant], ck);
          variantMap.set(variant, ck);
        }
        cornerMap.set(corner, variantMap);
      }
      this.autoCornerKeys.set(t, cornerMap);
    }
    for (const t of [1, 2, 3, 4] as ObstacleType[]) {
      const key = `obstacle_${OBSTACLE_TILES[t].id}`;
      AssetRegistry.preloadSVG(OBSTACLE_TILES[t].svg, key);
      this.obstacleKeys.set(t, key);
    }
    for (const t of [0, 1, 2, 3] as FoodType[]) {
      for (const size of ['small', 'medium', 'large'] as const) {
        const key = `food_${t}_${size}`;
        preloadFoodSprite(AssetRegistry, t, size, key);
        this.foodKeys.set(`${t}_${size}`, key);
      }
    }
  }

  // 构造 cell 表（按 cell 坐标索引），用于 NxN 食物块扫描
  private buildCellMap(data: PreviewGridData): Map<number, PreviewCell> {
    const map = new Map<number, PreviewCell>();
    for (const t of data.terrain) {
      const cx = t[0] | 0, cy = t[1] | 0, terr = t[2] | 0;
      const idx = cy * this.gridWidth + cx;
      const cell = map.get(idx) ?? { terrain: 0, obstacle: 0, food: 0, foodType: 0, wall: 0 };
      cell.terrain = terr;
      // 水地形（terrain=2）也标记为 wall：保留视觉上的水纹
      if (terr === 2) cell.wall = 1;
      map.set(idx, cell);
    }
    for (const w of data.walls) {
      const cx = w[0] | 0, cy = w[1] | 0;
      const idx = cy * this.gridWidth + cx;
      const cell = map.get(idx) ?? { terrain: 0, obstacle: 0, food: 0, foodType: 0, wall: 0 };
      cell.wall = 1;
      if (w.length >= 3) cell.obstacle = w[2] | 0;
      map.set(idx, cell);
    }
    for (const f of data.foods) {
      const cx = f[0] | 0, cy = f[1] | 0, qty = f[2] | 0;
      const idx = cy * this.gridWidth + cx;
      const cell = map.get(idx) ?? { terrain: 0, obstacle: 0, food: 0, foodType: 0, wall: 0 };
      cell.food = qty;
      if (f.length >= 4) cell.foodType = f[3] | 0;
      map.set(idx, cell);
    }
    return map;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    data: PreviewGridData,
    viewport: Viewport,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const { cellSize } = this;
    const invZoom = 1.0 / viewport.zoom;
    const vl = -viewport.offsetX * invZoom;
    const vt = -viewport.offsetY * invZoom;
    const vr = vl + canvasWidth * invZoom;
    const vb = vt + canvasHeight * invZoom;
    const sx = Math.max(0, Math.floor(vl / cellSize));
    const sy = Math.max(0, Math.floor(vt / cellSize));
    const ex = Math.min(this.gridWidth - 1, Math.ceil(vr / cellSize));
    const ey = Math.min(this.gridHeight - 1, Math.ceil(vb / cellSize));

    const cellMap = this.buildCellMap(data);

    // 1) 地形（auto-tile 开关：开启时用 24-tile 过渡，关闭时回退 4 地形硬切）
    if (useStore.getState().enableAutoTiles) {
      this.drawAutoTerrain(ctx, cellMap, sx, sy, ex, ey);
    } else {
      for (let y = sy; y <= ey; y++) {
        for (let x = sx; x <= ex; x++) {
          const idx = y * this.gridWidth + x;
          const cell = cellMap.get(idx);
          if (!cell) continue;
          const key = this.terrainKeys.get(cell.terrain);
          if (!key) continue;
          AssetRegistry.drawTile(ctx, key, x * cellSize, y * cellSize, cellSize);
        }
      }
    }

    // 2) 障碍（跳过水地形）
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const idx = y * this.gridWidth + x;
        const cell = cellMap.get(idx);
        if (!cell || !cell.wall) continue;
        if (cell.terrain === 2) continue; // 水纹保留
        const key = this.obstacleKeys.get(cell.obstacle);
        if (!key) continue;
        AssetRegistry.drawTile(ctx, key, x * cellSize, y * cellSize, cellSize);
      }
    }

    // 3) 食物（NxN 锚点法）
    const drawn = new Set<number>();
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const idx = y * this.gridWidth + x;
        if (drawn.has(idx)) continue;
        const cell = cellMap.get(idx);
        if (!cell || cell.food === 0) continue;
        const type = cell.foodType;
        let blockSize = 1;
        while (x + blockSize < this.gridWidth && y + blockSize < this.gridHeight) {
          let allFood = true;
          for (let bx = 0; bx <= blockSize; bx++) {
            const c = cellMap.get((y + blockSize) * this.gridWidth + (x + bx));
            if (!c || c.food === 0 || c.foodType !== type) { allFood = false; break; }
          }
          if (!allFood) break;
          for (let by = 0; by <= blockSize; by++) {
            const c = cellMap.get((y + by) * this.gridWidth + (x + blockSize));
            if (!c || c.food === 0 || c.foodType !== type) { allFood = false; break; }
          }
          if (!allFood) break;
          blockSize++;
        }
        for (let by = 0; by < blockSize; by++) {
          for (let bx = 0; bx < blockSize; bx++) {
            drawn.add((y + by) * this.gridWidth + (x + bx));
          }
        }
        const qty = Math.max(1, blockSize * blockSize);
        const size = foodSizeFromQty(qty);
        const key = this.foodKeys.get(`${type}_${size}`);
        const drawSize = blockSize * cellSize;
        if (key) {
          AssetRegistry.drawTile(ctx, key, x * cellSize, y * cellSize, drawSize);
        }
      }
    }
  }

  // 24-tile 自动地形过渡
  // 流程：
  //   1) 按 (terrain, edgeMask) 分桶批量画主体瓦片
  //   2) 单 cell 扫 4 角点，仅对触发凸/凹的角画 8x8 角贴片
  private drawAutoTerrain(
    ctx: CanvasRenderingContext2D,
    cellMap: Map<number, PreviewCell>,
    sx: number, sy: number, ex: number, ey: number,
  ): void {
    const { cellSize } = this;
    const adapter: TerrainGrid = makePreviewGridAdapter(cellMap, this.gridWidth);

    // === 1) 主体：按 (terrain, edgeMask) 分桶 ===
    const buckets = new Map<number, Array<[number, number]>>();
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const idx = y * this.gridWidth + x;
        if (!cellMap.get(idx)) continue;
        const t = adapter.getTerrainAt(x, y);
        const edgeMask = computeEdgeMask(adapter, x, y);
        const key = (t << 4) | edgeMask;
        let bucket = buckets.get(key);
        if (!bucket) {
          bucket = [];
          buckets.set(key, bucket);
        }
        bucket.push([x, y]);
      }
    }
    for (const [key, cells] of buckets) {
      const t = (key >> 4) & 0xf;
      const edgeMask = key & 0xf;
      const svgKey = this.autoEdgeKeys.get(t)?.get(edgeMask);
      if (!svgKey) continue;
      for (const [x, y] of cells) {
        AssetRegistry.drawTile(ctx, svgKey, x * cellSize, y * cellSize, cellSize);
      }
    }

    // === 2) 角点：单 cell 检查，仅画触发的角 ===
    const CORNER_OFFSETS: Array<{ corner: Corner; dx: 0 | 1; dy: 0 | 1 }> = [
      { corner: 'tl', dx: 0, dy: 0 },
      { corner: 'tr', dx: 1, dy: 0 },
      { corner: 'bl', dx: 0, dy: 1 },
      { corner: 'br', dx: 1, dy: 1 },
    ];
    const cornerSize = 8;
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const idx = y * this.gridWidth + x;
        if (!cellMap.get(idx)) continue;
        const t = adapter.getTerrainAt(x, y);
        const edgeMask = computeEdgeMask(adapter, x, y);
        const cornerMask = computeCornerMask(adapter, x, y);
        const corners = computeAllCorners(edgeMask, cornerMask);
        for (let i = 0; i < 4; i++) {
          const c = corners[i];
          if (!c.draw) continue;
          const svgKey = this.autoCornerKeys.get(t)?.get(CORNER_OFFSETS[i].corner)?.get(c.variant);
          if (!svgKey) continue;
          const off = CORNER_OFFSETS[i];
          const px = x * cellSize + (off.dx === 1 ? cellSize - cornerSize : 0);
          const py = y * cellSize + (off.dy === 1 ? cellSize - cornerSize : 0);
          AssetRegistry.drawTile(ctx, svgKey, px, py, cornerSize);
        }
      }
    }
  }
}
