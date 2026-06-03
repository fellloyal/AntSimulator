import { Mode, AntType } from '@/simulation/types';
import { ANT_FLOATS_PER_ANT, WORLD_FLOATS_PER_CELL } from '@/simulation/worker-protocol';
import type { ViewportState } from './WorldRenderer';

// LOD thresholds based on viewport zoom
const LOD_DETAIL = 1.5;
const LOD_SIMPLE = 0.6;

export class WorkerRenderer {
  renderAnts: boolean = true;
  drawMarkers: boolean = true;
  drawDensity: boolean = false;
  coloniesColor: string[] = [];
  viewport: ViewportState = { offsetX: 0, offsetY: 0, zoom: 1 };

  private gridWidth: number;
  private gridHeight: number;
  private cellSize: number;

  // Offscreen canvas for world ImageData
  private offscreenCanvas: OffscreenCanvas | null = null;
  private offscreenCtx: OffscreenCanvasRenderingContext2D | null = null;
  private lastGridWidth = 0;
  private lastGridHeight = 0;

  private static readonly MIN_ZOOM = 0.1;
  private static readonly MAX_ZOOM = 10.0;
  private static readonly ZOOM_FACTOR = 0.1;

  constructor(gridWidth: number, gridHeight: number, cellSize: number) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.cellSize = cellSize;
  }

  private ensureOffscreen(width: number, height: number): void {
    if (this.lastGridWidth !== width || this.lastGridHeight !== height) {
      this.offscreenCanvas = new OffscreenCanvas(width, height);
      this.offscreenCtx = this.offscreenCanvas.getContext('2d');
      this.lastGridWidth = width;
      this.lastGridHeight = height;
    }
  }

  pan(dx: number, dy: number): void {
    this.viewport.offsetX += dx;
    this.viewport.offsetY += dy;
  }

  zoomAt(delta: number, x: number, y: number): void {
    const oldZoom = this.viewport.zoom;
    const zoomDelta = -delta * WorkerRenderer.ZOOM_FACTOR;
    const newZoom = Math.max(
      WorkerRenderer.MIN_ZOOM,
      Math.min(WorkerRenderer.MAX_ZOOM, oldZoom * (1 + zoomDelta))
    );
    const zoomRatio = newZoom / oldZoom;
    this.viewport.offsetX = x - (x - this.viewport.offsetX) * zoomRatio;
    this.viewport.offsetY = y - (y - this.viewport.offsetY) * zoomRatio;
    this.viewport.zoom = newZoom;
  }

  render(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    antData: Float32Array | null,
    worldData: Float32Array | null
  ): void {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.save();
    ctx.translate(this.viewport.offsetX, this.viewport.offsetY);
    ctx.scale(this.viewport.zoom, this.viewport.zoom);

    // 1. Render world grid from worker data
    if (worldData) {
      this.renderWorld(ctx, worldData);
    }

    // 2. Render ants from worker data
    if (antData && this.renderAnts) {
      this.renderAntsFromData(ctx, antData);
    }

    ctx.restore();
  }

  private renderWorld(ctx: CanvasRenderingContext2D, worldData: Float32Array): void {
    const { gridWidth, gridHeight, cellSize } = this;

    this.ensureOffscreen(gridWidth, gridHeight);
    if (!this.offscreenCtx) return;

    const imageData = this.offscreenCtx.createImageData(gridWidth, gridHeight);
    const data = imageData.data;

    for (let i = 0; i < gridWidth * gridHeight; i++) {
      const base = i * WORLD_FLOATS_PER_CELL;
      const packed = worldData[base];
      const wall = packed >= 10000 ? 1 : 0;
      const food = packed >= 10000 ? 0 : packed;

      const pixIdx = i * 4;

      if (wall) {
        data[pixIdx] = 0x72;
        data[pixIdx + 1] = 0x6b;
        data[pixIdx + 2] = 0x6b;
        data[pixIdx + 3] = 255;
      } else if (food > 0) {
        data[pixIdx] = 0;
        data[pixIdx + 1] = Math.min(255, 100 + food * 10) | 0;
        data[pixIdx + 2] = 0;
        data[pixIdx + 3] = 255;
      } else if (this.drawMarkers) {
        const r = Math.min(255, worldData[base + 1] * 255) | 0;
        const g = Math.min(255, worldData[base + 2] * 255) | 0;
        const b = Math.min(255, worldData[base + 3] * 255) | 0;
        data[pixIdx] = r;
        data[pixIdx + 1] = g;
        data[pixIdx + 2] = b;
        data[pixIdx + 3] = (r > 0 || g > 0 || b > 0) ? 255 : 0;
      }
    }

    this.offscreenCtx.putImageData(imageData, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.offscreenCanvas, 0, 0, gridWidth, gridHeight, 0, 0, gridWidth * cellSize, gridHeight * cellSize);
  }

  private renderAntsFromData(ctx: CanvasRenderingContext2D, antData: Float32Array): void {
    const antCount = antData.length / ANT_FLOATS_PER_ANT;
    const zoom = this.viewport.zoom;

    // Parse colony colors once
    const colors = this.coloniesColor.map((hex) => {
      const cr = parseInt(hex.slice(1, 3), 16);
      const cg = parseInt(hex.slice(3, 5), 16);
      const cb = parseInt(hex.slice(5, 7), 16);
      return { cr, cg, cb, hex };
    });

    // Group ants by colony for color batching
    // Since we don't have colony id in the data, we use the color of the first colony
    // TODO: add colony id to ant data for multi-colony support
    const color = colors[0] || { cr: 255, cg: 73, cb: 68, hex: '#ff4944' };

    if (zoom >= LOD_DETAIL) {
      this.renderAntsDetailed(ctx, antData, antCount, color);
    } else if (zoom >= LOD_SIMPLE) {
      this.renderAntsMedium(ctx, antData, antCount, color);
    } else {
      this.renderAntsSimple(ctx, antData, antCount, color.hex);
    }
  }

  private renderAntsSimple(ctx: CanvasRenderingContext2D, antData: Float32Array, antCount: number, color: string): void {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < antCount; i++) {
      const base = i * ANT_FLOATS_PER_ANT;
      const phase = antData[base + 3];
      if (phase === Mode.Dead) continue;
      const x = antData[base];
      const y = antData[base + 1];
      const angle = antData[base + 2] + Math.PI / 2;
      const type = antData[base + 4];
      const scale = type === AntType.Soldier ? 2.0 : 1.0;
      const h = 4 * scale;
      const dx = Math.cos(angle) * h * 0.5;
      const dy = Math.sin(angle) * h * 0.5;
      ctx.moveTo(x - dx, y - dy);
      ctx.lineTo(x + dx, y + dy);
    }
    ctx.stroke();
  }

  private renderAntsMedium(ctx: CanvasRenderingContext2D, antData: Float32Array, antCount: number, color: { cr: number; cg: number; cb: number; hex: string }): void {
    ctx.fillStyle = color.hex;
    ctx.beginPath();
    for (let i = 0; i < antCount; i++) {
      const base = i * ANT_FLOATS_PER_ANT;
      const phase = antData[base + 3];
      if (phase === Mode.Dying || phase === Mode.Dead) continue;
      const x = antData[base];
      const y = antData[base + 1];
      const angle = antData[base + 2] + Math.PI / 2;
      const type = antData[base + 4];
      const scale = type === AntType.Soldier ? 2.0 : 1.0;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.ellipse(0, -3.5 * scale, 1.2 * scale, 1.2 * scale * 1.1, 0, 0, Math.PI * 2);
      ctx.ellipse(0, -1.2 * scale, 1.4 * scale * 0.85, 1.4 * scale, 0, 0, Math.PI * 2);
      ctx.ellipse(0, 1.8 * scale, 1.6 * scale, 2.2 * scale, 0, 0, Math.PI * 2);
      ctx.restore();
    }
    ctx.fill();
  }

  private renderAntsDetailed(ctx: CanvasRenderingContext2D, antData: Float32Array, antCount: number, color: { cr: number; cg: number; cb: number; hex: string }): void {
    // Body batch
    ctx.fillStyle = color.hex;
    for (let i = 0; i < antCount; i++) {
      const base = i * ANT_FLOATS_PER_ANT;
      const phase = antData[base + 3];
      if (phase === Mode.Dead || phase === Mode.Dying) continue;
      const x = antData[base];
      const y = antData[base + 1];
      const angle = antData[base + 2] + Math.PI / 2;
      const type = antData[base + 4];
      const scale = type === AntType.Soldier ? 2.0 : 1.0;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -3.5 * scale, 1.2 * scale, 1.2 * scale * 1.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -1.2 * scale, 1.4 * scale * 0.85, 1.4 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 1.8 * scale, 1.6 * scale, 2.2 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
