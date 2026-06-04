// TerrainRenderer - 地形底图 + 磨损土路绘制
import { TERRAIN_TILES, type TerrainType } from './assets/TerrainTiles';
import { WORN_PATH_SVG, WEAR_THRESHOLD } from './assets/WornPath';
import { AssetRegistry } from './AssetRegistry';

export interface Viewport {
  offsetX: number;
  offsetY: number;
  zoom: number;
}

export class TerrainRenderer {
  private gridWidth: number;
  private gridHeight: number;
  private cellSize: number;
  private terrainKeys: Map<number, string> = new Map();
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

  // 视口可见范围
  private getVisibleCellRange(viewport: Viewport, canvasWidth: number, canvasHeight: number) {
    const invZoom = 1.0 / viewport.zoom;
    const vl = -viewport.offsetX * invZoom;
    const vt = -viewport.offsetY * invZoom;
    const vr = vl + canvasWidth * invZoom;
    const vb = vt + canvasHeight * invZoom;
    return {
      sx: Math.max(0, Math.floor(vl / this.cellSize)),
      sy: Math.max(0, Math.floor(vt / this.cellSize)),
      ex: Math.min(this.gridWidth - 1, Math.ceil(vr / this.cellSize)),
      ey: Math.min(this.gridHeight - 1, Math.ceil(vb / this.cellSize)),
    };
  }

  // 绘制地形底图（一次性画全屏视口范围）
  drawTerrain(
    ctx: CanvasRenderingContext2D,
    world: { map: { getByCoords: (c: { x: number; y: number }) => { terrain: number } } },
    viewport: Viewport,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const { sx, sy, ex, ey } = this.getVisibleCellRange(viewport, canvasWidth, canvasHeight);
    // 按地形分桶，一次性 drawImage 减少状态切换
    const buckets = new Map<number, Array<[number, number]>>();
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const cell = world.map.getByCoords({ x, y });
        const t = cell.terrain ?? 0;
        let bucket = buckets.get(t);
        if (!bucket) {
          bucket = [];
          buckets.set(t, bucket);
        }
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
  drawWornPaths(
    ctx: CanvasRenderingContext2D,
    world: { map: { getByCoords: (c: { x: number; y: number }) => { wearLevel: number; wall: number } } },
    viewport: Viewport,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const { sx, sy, ex, ey } = this.getVisibleCellRange(viewport, canvasWidth, canvasHeight);
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const cell = world.map.getByCoords({ x, y });
        if (cell.wall) continue;
        if (cell.wearLevel > WEAR_THRESHOLD) {
          AssetRegistry.drawTile(ctx, this.wornKey, x * this.cellSize, y * this.cellSize, this.cellSize);
        }
      }
    }
  }
}
