import { Config } from '@/simulation/Config';
import { Mode } from '@/simulation/types';
import type { WorldGrid } from '@/simulation/WorldGrid';

export interface ViewportState {
  offsetX: number;
  offsetY: number;
  zoom: number;
}

export class WorldRenderer {
  drawMarkers: boolean = true;
  drawDensity: boolean = false;
  coloniesColor: string[] = [];
  private map: WorldGrid;

  private static readonly INTENSITY_FACTOR = 255.0 / Config.MARKER_INTENSITY;

  // Cached colony RGB values
  private colonyRgbCache: Array<{ r: number; g: number; b: number }> = [];

  constructor(map: WorldGrid) {
    this.map = map;
  }

  private updateColonyRgbCache(): void {
    if (this.colonyRgbCache.length !== this.coloniesColor.length) {
      this.colonyRgbCache = this.coloniesColor.map((hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
          : { r: 255, g: 255, b: 255 };
      });
    }
  }

  render(ctx: CanvasRenderingContext2D, viewport: ViewportState): void {
    const { width, height, cellSize, cells } = this.map;
    const numColonies = this.coloniesColor.length;
    this.updateColonyRgbCache();
    const colonyRgb = this.colonyRgbCache;
    const intensityFactor = WorldRenderer.INTENSITY_FACTOR;
    const drawMarkers = this.drawMarkers;
    const drawDensity = this.drawDensity;

    // Calculate visible cell range based on viewport
    const invZoom = 1.0 / viewport.zoom;
    const viewLeft = -viewport.offsetX * invZoom;
    const viewTop = -viewport.offsetY * invZoom;
    const viewRight = viewLeft + ctx.canvas.width * invZoom;
    const viewBottom = viewTop + ctx.canvas.height * invZoom;

    const startX = Math.max(0, Math.floor(viewLeft / cellSize));
    const startY = Math.max(0, Math.floor(viewTop / cellSize));
    const endX = Math.min(width - 1, Math.ceil(viewRight / cellSize));
    const endY = Math.min(height - 1, Math.ceil(viewBottom / cellSize));

    // Batch fillRect calls by color to reduce state changes
    // Collect cells into color buckets
    const colorBuckets = new Map<string, Array<[number, number]>>();

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const cellIdx = y * width + x;
        const cell = cells[cellIdx];
        let color = '';

        if (cell.wall) {
          color = '#726b6b';
        } else if (cell.food > 0) {
          const g = Math.min(255, 100 + cell.food * 10);
          color = `rgb(0,${g},0)`;
        } else if (drawMarkers && numColonies > 0) {
          let r = 0, g = 0, b = 0;
          for (let ci = 0; ci < numColonies; ci++) {
            const colonyCell = cell.markers[ci];
            const toHomeI = colonyCell.intensity[Mode.ToHome];
            const toFoodI = colonyCell.intensity[Mode.ToFood];
            const toEnemyI = colonyCell.intensity[Mode.ToEnemy];
            const repellent = colonyCell.repellent;

            if (toHomeI > 0.1 || toFoodI > 0.1 || toEnemyI > 0.1 || repellent > 0.1) {
              const rgb = colonyRgb[ci] || colonyRgb[0];
              if (toHomeI > 0.1) { const f = intensityFactor * toHomeI; r += rgb.r * 0.8 * f; g += rgb.g * 0.3 * f; b += rgb.b * 0.3 * f; }
              if (toFoodI > 0.1) { const f = intensityFactor * toFoodI; r += rgb.r * 0.3 * f; g += rgb.g * 0.8 * f; b += rgb.b * 0.3 * f; }
              if (toEnemyI > 0.1) { const f = intensityFactor * toEnemyI; r += 200 * f; b += 200 * f; }
              if (repellent > 0.1) { const f = intensityFactor * repellent; b += 255 * f; }
            }
          }
          if (r > 0 || g > 0 || b > 0) {
            r = Math.min(255, r) | 0;
            g = Math.min(255, g) | 0;
            b = Math.min(255, b) | 0;
            color = `rgb(${r},${g},${b})`;
          }
        }

        if (drawDensity && !cell.wall && cell.density > 0.01 && !color) {
          const dr = Math.min(255, 4.0 * cell.density * 255) | 0;
          const dg = Math.min(255, cell.density * 255) | 0;
          color = `rgba(${dr},${dg},${dg},0.5)`;
        }

        if (color) {
          let bucket = colorBuckets.get(color);
          if (!bucket) {
            bucket = [];
            colorBuckets.set(color, bucket);
          }
          bucket.push([x, y]);
        }
      }
    }

    // Render batched by color
    for (const [color, positions] of colorBuckets) {
      ctx.fillStyle = color;
      for (const [x, y] of positions) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}
