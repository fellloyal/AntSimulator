import { Config } from '@/simulation/Config';
import { Mode } from '@/simulation/types';
import type { WorldGrid } from '@/simulation/WorldGrid';

export interface ViewportState {
  offsetX: number;
  offsetY: number;
  zoom: number;
}

// Parse hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 255, g: 255, b: 255 };
}

export class WorldRenderer {
  drawMarkers: boolean = true;
  drawDensity: boolean = false;
  coloniesColor: string[] = [];
  private map: WorldGrid;

  private static readonly INTENSITY_FACTOR = 255.0 / Config.MARKER_INTENSITY;

  constructor(map: WorldGrid) {
    this.map = map;
  }

  render(ctx: CanvasRenderingContext2D, viewport: ViewportState): void {
    const { width, height, cellSize } = this.map;

    // Calculate visible cell range based on viewport
    const invZoom = 1.0 / viewport.zoom;
    const viewLeft = -viewport.offsetX * invZoom;
    const viewTop = -viewport.offsetY * invZoom;
    const viewRight = viewLeft + ctx.canvas.width * invZoom;
    const viewBottom = viewTop + ctx.canvas.height * invZoom;

    const startX = Math.max(0, Math.floor(viewLeft / cellSize));
    const startY = Math.max(0, Math.floor(viewTop / cellSize));
    const endX = Math.min(width, Math.ceil(viewRight / cellSize) + 1);
    const endY = Math.min(height, Math.ceil(viewBottom / cellSize) + 1);

    // 1. Walls
    ctx.fillStyle = '#726b6b';
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const cell = this.map.cells[y * width + x];
        if (cell.wall) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    // 2. Food
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const cell = this.map.cells[y * width + x];
        if (cell.food > 0) {
          const green = Math.min(255, 100 + cell.food * 10);
          ctx.fillStyle = `rgb(0,${green},0)`;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    // 3. Markers for ALL colonies
    if (this.drawMarkers) {
      const numColonies = this.coloniesColor.length;
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const cell = this.map.cells[y * width + x];
          if (cell.food > 0 || cell.wall) continue;

          let totalR = 0, totalG = 0, totalB = 0;
          let hasMarker = false;

          for (let ci = 0; ci < numColonies; ci++) {
            const colonyCell = cell.markers[ci];
            const toHomeI = colonyCell.intensity[Mode.ToHome];
            const toFoodI = colonyCell.intensity[Mode.ToFood];
            const toEnemyI = colonyCell.intensity[Mode.ToEnemy];

            if (toHomeI > 0.1 || toFoodI > 0.1 || toEnemyI > 0.1 || colonyCell.repellent > 0.1) {
              hasMarker = true;
              const colonyRgb = hexToRgb(this.coloniesColor[ci] || '#ffffff');

              // ToHome: colony color (dimmed)
              if (toHomeI > 0.1) {
                const f = WorldRenderer.INTENSITY_FACTOR * toHomeI;
                totalR += colonyRgb.r * 0.8 * f;
                totalG += colonyRgb.g * 0.3 * f;
                totalB += colonyRgb.b * 0.3 * f;
              }
              // ToFood: green tint
              if (toFoodI > 0.1) {
                const f = WorldRenderer.INTENSITY_FACTOR * toFoodI;
                totalR += colonyRgb.r * 0.3 * f;
                totalG += colonyRgb.g * 0.8 * f;
                totalB += colonyRgb.b * 0.3 * f;
              }
              // ToEnemy: purple tint
              if (toEnemyI > 0.1) {
                const f = WorldRenderer.INTENSITY_FACTOR * toEnemyI;
                totalR += 200 * f;
                totalG += 0;
                totalB += 200 * f;
              }
              // Repellent: blue tint
              if (colonyCell.repellent > 0.1) {
                const f = WorldRenderer.INTENSITY_FACTOR * colonyCell.repellent;
                totalR += 0;
                totalG += 0;
                totalB += 255 * f;
              }
            }
          }

          if (hasMarker && (totalR > 0 || totalG > 0 || totalB > 0)) {
            const r = Math.min(255, totalR) | 0;
            const g = Math.min(255, totalG) | 0;
            const b = Math.min(255, totalB) | 0;
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }
    }

    // 4. Density overlay
    if (this.drawDensity) {
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const cell = this.map.cells[y * width + x];
          if (cell.food > 0 || cell.wall) continue;

          const density = cell.density;
          if (density > 0.01) {
            const r = Math.min(255, 4.0 * density * 255) | 0;
            const g = Math.min(255, density * 255) | 0;
            const b = Math.min(255, density * 255) | 0;
            ctx.fillStyle = `rgba(${r},${g},${b},0.5)`;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }
    }
  }
}
