// FoodPileRenderer - 3 尺寸食物堆绘制
import { FOOD_SPRITES, foodSizeFromQty, type FoodType } from './assets/FoodSprites';
import { AssetRegistry } from './AssetRegistry';
import type { Viewport } from './TerrainRenderer';

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

  setCellSize(size: number): void {
    if (size !== this.cellSize) {
      this.cellSize = size;
      AssetRegistry.setCellSize(size);
      this.preload();
    }
  }

  drawFoodPiles(
    ctx: CanvasRenderingContext2D,
    world: { map: { width: number; height: number; getByCoords: (c: { x: number; y: number }) => { food: number; foodType: number } } },
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
        if (cell.food <= 0) continue;
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
