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

  // Offscreen canvas for ImageData rendering
  private offscreenCanvas: OffscreenCanvas | null = null;
  private offscreenCtx: OffscreenCanvasRenderingContext2D | null = null;
  private lastGridWidth = 0;
  private lastGridHeight = 0;

  // Cached colony RGB values to avoid re-parsing hex every frame
  private colonyRgbCache: Array<{ r: number; g: number; b: number }> = [];

  constructor(map: WorldGrid) {
    this.map = map;
  }

  private ensureOffscreen(width: number, height: number): void {
    if (this.lastGridWidth !== width || this.lastGridHeight !== height) {
      this.offscreenCanvas = new OffscreenCanvas(width, height);
      this.offscreenCtx = this.offscreenCanvas.getContext('2d');
      this.lastGridWidth = width;
      this.lastGridHeight = height;
    }
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(ctx: CanvasRenderingContext2D, _viewport: ViewportState): void {
    const { width, height, cellSize, cells } = this.map;

    // Use ImageData for the world grid rendering (1 pixel per cell)
    this.ensureOffscreen(width, height);
    if (!this.offscreenCtx) return;

    const imageData = this.offscreenCtx.createImageData(width, height);
    const data = imageData.data;

    const numColonies = this.coloniesColor.length;
    this.updateColonyRgbCache();
    const colonyRgb = this.colonyRgbCache;
    const intensityFactor = WorldRenderer.INTENSITY_FACTOR;
    const drawMarkers = this.drawMarkers;
    const drawDensity = this.drawDensity;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cellIdx = y * width + x;
        const cell = cells[cellIdx];
        const pixIdx = cellIdx * 4;

        // Background is transparent (world bg drawn by Renderer)
        let r = 0, g = 0, b = 0, a = 0;

        // 1. Walls
        if (cell.wall) {
          r = 0x72; g = 0x6b; b = 0x6b; a = 255;
        }
        // 2. Food
        else if (cell.food > 0) {
          g = Math.min(255, 100 + cell.food * 10) | 0;
          a = 255;
        }
        // 3. Markers
        else if (drawMarkers) {
          for (let ci = 0; ci < numColonies; ci++) {
            const colonyCell = cell.markers[ci];
            const toHomeI = colonyCell.intensity[Mode.ToHome];
            const toFoodI = colonyCell.intensity[Mode.ToFood];
            const toEnemyI = colonyCell.intensity[Mode.ToEnemy];
            const repellent = colonyCell.repellent;

            if (toHomeI > 0.1 || toFoodI > 0.1 || toEnemyI > 0.1 || repellent > 0.1) {
              const rgb = colonyRgb[ci] || colonyRgb[0];
              // ToHome: colony color (dimmed)
              if (toHomeI > 0.1) {
                const f = intensityFactor * toHomeI;
                r += rgb.r * 0.8 * f;
                g += rgb.g * 0.3 * f;
                b += rgb.b * 0.3 * f;
              }
              // ToFood: green tint
              if (toFoodI > 0.1) {
                const f = intensityFactor * toFoodI;
                r += rgb.r * 0.3 * f;
                g += rgb.g * 0.8 * f;
                b += rgb.b * 0.3 * f;
              }
              // ToEnemy: purple tint
              if (toEnemyI > 0.1) {
                const f = intensityFactor * toEnemyI;
                r += 200 * f;
                b += 200 * f;
              }
              // Repellent: blue tint
              if (repellent > 0.1) {
                const f = intensityFactor * repellent;
                b += 255 * f;
              }
            }
          }

          if (r > 0 || g > 0 || b > 0) {
            r = Math.min(255, r) | 0;
            g = Math.min(255, g) | 0;
            b = Math.min(255, b) | 0;
            a = 255;
          }
        }

        // 4. Density overlay (blended on top)
        if (drawDensity && !cell.wall && cell.density > 0.01) {
          const dr = Math.min(255, 4.0 * cell.density * 255) | 0;
          const dg = Math.min(255, cell.density * 255) | 0;
          const db = Math.min(255, cell.density * 255) | 0;
          // Alpha blend density at 50% over existing color
          if (a > 0) {
            r = (r * 0.5 + dr * 0.5) | 0;
            g = (g * 0.5 + dg * 0.5) | 0;
            b = (b * 0.5 + db * 0.5) | 0;
          } else {
            r = dr; g = dg; b = db; a = 128;
          }
        }

        data[pixIdx] = r;
        data[pixIdx + 1] = g;
        data[pixIdx + 2] = b;
        data[pixIdx + 3] = a;
      }
    }

    this.offscreenCtx.putImageData(imageData, 0, 0);

    // Draw the offscreen canvas scaled up to world coordinates
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.offscreenCanvas, 0, 0, width, height, 0, 0, width * cellSize, height * cellSize);
  }
}
