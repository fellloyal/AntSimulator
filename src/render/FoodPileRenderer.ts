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

    // UI美化：找到 NxN 食物块的"锚点"（左上），画一个尺寸 = N×cellSize 的精灵
    // 避免每个格子都画一遍导致 sprite 重叠
    const foodMap = new Map<number, { x: number; y: number; type: number; food: number }>();
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const cell = world.map.getByCoords({ x, y });
        if (cell.food > 0) {
          foodMap.set(y * world.map.width + x, { x, y, type: cell.foodType ?? 0, food: cell.food });
        }
      }
    }
    const drawn = new Set<number>();
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const idx = y * world.map.width + x;
        if (drawn.has(idx)) continue;
        const f = foodMap.get(idx);
        if (!f) continue;
        // 锚点 = 上方和左方都没有同类型食物
        if (y > 0) {
          const up = foodMap.get((y - 1) * world.map.width + x);
          if (up && up.type === f.type) continue;
        }
        if (x > 0) {
          const left = foodMap.get(y * world.map.width + (x - 1));
          if (left && left.type === f.type) continue;
        }
        // 找块大小 - 沿对角线扩展直到不再是同类型食物
        let blockSize = 1;
        while (
          x + blockSize < world.map.width &&
          y + blockSize < world.map.height
        ) {
          const diag = foodMap.get((y + blockSize) * world.map.width + (x + blockSize));
          if (diag && diag.type === f.type) {
            blockSize++;
          } else {
            break;
          }
        }
        // 标记这一块都被画了
        for (let by = 0; by < blockSize; by++) {
          for (let bx = 0; bx < blockSize; bx++) {
            const dIdx = (y + by) * world.map.width + (x + bx);
            const d = foodMap.get(dIdx);
            if (d && d.type === f.type) drawn.add(dIdx);
          }
        }
        // 选 sprite：按块大小映射到 foodSizeFromQty
        const qty = Math.max(1, blockSize * blockSize);
        const size = foodSizeFromQty(qty);
        const key = this.foodKeys.get(`${f.type}_${size}`);
        const drawSize = blockSize * this.cellSize;
        if (key) {
          AssetRegistry.drawTile(ctx, key, x * this.cellSize, y * this.cellSize, drawSize);
        }
      }
    }
  }
}
