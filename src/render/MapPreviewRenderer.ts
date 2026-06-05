// MapPreviewRenderer - 给 GameSetup 等"无 World 实例"场景共享的地图预览渲染器
// 输入：gridData 解析后的对象（含 cellSize, walls, foods, terrain）
// 输出：直接在 ctx 上画地形/障碍/食物纹理
// 与 WorkerRenderer 共享 AssetRegistry 单例，纹理仅加载一次
import { TERRAIN_TILES, type TerrainType } from './assets/TerrainTiles';
import { OBSTACLE_TILES, type ObstacleType } from './assets/ObstacleTiles';
import { foodSizeFromQty, preloadFoodSprite, type FoodType } from './assets/FoodSprites';
import { AssetRegistry } from './AssetRegistry';
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

    // 1) 地形
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const idx = y * this.gridWidth + x;
        const cell = cellMap.get(idx);
        if (!cell || cell.terrain === 0) continue;
        const key = this.terrainKeys.get(cell.terrain);
        if (!key) continue;
        AssetRegistry.drawTile(ctx, key, x * cellSize, y * cellSize, cellSize);
      }
    }

    // 2) 障碍（跳过水/石头地形）
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const idx = y * this.gridWidth + x;
        const cell = cellMap.get(idx);
        if (!cell || !cell.wall) continue;
        // UI美化（task 20）：水/石头（terrain=2/3）保留原纹理
        if (cell.terrain === 2 || cell.terrain === 3) continue;
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
}
