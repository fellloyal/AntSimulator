// ObstacleRenderer - 4 种障碍物绘制
import { OBSTACLE_TILES, type ObstacleType } from './assets/ObstacleTiles';
import { AssetRegistry } from './AssetRegistry';
import type { Viewport } from './TerrainRenderer';

export class ObstacleRenderer {
  private cellSize: number;
  private obstacleKeys: Map<number, string> = new Map();

  constructor(cellSize: number) {
    this.cellSize = cellSize;
    AssetRegistry.setCellSize(cellSize);
    this.preload();
  }

  private preload(): void {
    for (const t of [1, 2, 3, 4] as ObstacleType[]) {
      const key = `obstacle_${OBSTACLE_TILES[t].id}`;
      AssetRegistry.preloadSVG(OBSTACLE_TILES[t].svg, key);
      this.obstacleKeys.set(t, key);
    }
  }

  setCellSize(size: number): void {
    if (size !== this.cellSize) {
      this.cellSize = size;
      AssetRegistry.setCellSize(size);
      this.preload();
    }
  }

  drawObstacles(
    ctx: CanvasRenderingContext2D,
    world: { map: { width: number; height: number; getByCoords: (c: { x: number; y: number }) => { wall: number; obstacle: number; terrain?: number } } },
    viewport: Viewport,
    canvasWidth: number,
    canvasHeight: number
  ): void {
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
        const cell = world.map.getByCoords({ x, y });
        if (!cell.wall) continue;
        // 水地形（terrain=2）也标记为 wall 用于游戏逻辑（不可通过），
        // 但视觉上应保留水纹，不要被砖块纹理覆盖
        if (cell.terrain === 2) continue;
        const o = cell.obstacle ?? 1;
        const key = this.obstacleKeys.get(o);
        if (key) {
          AssetRegistry.drawTile(ctx, key, x * this.cellSize, y * this.cellSize, this.cellSize);
        }
      }
    }
  }
}
