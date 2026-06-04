import { Mode, AntType } from '@/simulation/types';
import { ANT_FLOATS_PER_ANT, WORLD_FLOATS_PER_CELL, WORLD_DIRTY_FLOATS_PER_CELL } from '@/simulation/worker-protocol';
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
  colonyBases: Array<{ id: number; baseX: number; baseY: number; baseRadius: number; food: number; maxFood: number }> = [];

  private gridWidth: number;
  private gridHeight: number;
  private cellSize: number;

  // Pre-parsed colony colors
  private colonyRgb: Array<{ r: number; g: number; b: number; hex: string }> = [];

  // Local world state for incremental updates
  private worldState: Float32Array | null = null;

  private static readonly MIN_ZOOM = 0.1;
  private static readonly MAX_ZOOM = 10.0;
  private static readonly ZOOM_FACTOR = 0.1;

  constructor(gridWidth: number, gridHeight: number, cellSize: number) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.cellSize = cellSize;
  }

  private updateColonyRgb(): void {
    if (this.colonyRgb.length !== this.coloniesColor.length) {
      this.colonyRgb = this.coloniesColor.map((hex) => {
        const cr = parseInt(hex.slice(1, 3), 16);
        const cg = parseInt(hex.slice(3, 5), 16);
        const cb = parseInt(hex.slice(5, 7), 16);
        return { r: cr, g: cg, b: cb, hex };
      });
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

  updateWorldData(worldData: Float32Array, fullUpdate: boolean): void {
    if (fullUpdate) {
      // Full update: replace entire world state
      this.worldState = worldData;
    } else if (this.worldState) {
      // Incremental update: apply dirty cells
      const dirtyCount = worldData[0];
      for (let j = 0; j < dirtyCount; j++) {
        const base = 1 + j * WORLD_DIRTY_FLOATS_PER_CELL;
        const cellIdx = worldData[base];
        const destBase = cellIdx * WORLD_FLOATS_PER_CELL;
        this.worldState[destBase] = worldData[base + 1];     // packed
        this.worldState[destBase + 1] = worldData[base + 2]; // r
        this.worldState[destBase + 2] = worldData[base + 3]; // g
        this.worldState[destBase + 3] = worldData[base + 4]; // b
      }
    }
  }

  render(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    antData: Float32Array | null
  ): void {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.save();
    ctx.translate(this.viewport.offsetX, this.viewport.offsetY);
    ctx.scale(this.viewport.zoom, this.viewport.zoom);

    // 1. Render world grid
    if (this.worldState) {
      this.renderWorld(ctx, this.worldState, canvasWidth, canvasHeight);
    }

    // 2. Render colony bases
    this.renderBases(ctx);

    // 3. Render ants
    if (antData && this.renderAnts) {
      this.renderAntsFromData(ctx, antData);
    }

    ctx.restore();
  }

  private renderBases(ctx: CanvasRenderingContext2D): void {
    this.updateColonyRgb();

    for (const base of this.colonyBases) {
      const { baseX: x, baseY: y, baseRadius: radius, food, maxFood, id } = base;
      const color = this.colonyRgb[id] || this.colonyRgb[0];
      const hex = color?.hex || '#ff4944';

      // Mound gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5);
      gradient.addColorStop(0, '#3d2b1f');
      gradient.addColorStop(0.3, '#5c3d2e');
      gradient.addColorStop(0.7, '#4a3325');
      gradient.addColorStop(1, 'rgba(74,51,37,0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(x, y, radius * 1.5, radius * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Colony ring
      ctx.strokeStyle = hex;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Entrance hole
      ctx.fillStyle = '#1a0f0a';
      ctx.beginPath();
      ctx.ellipse(x, y, radius * 0.35, radius * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dirt dots
      ctx.fillStyle = '#6b4c3b';
      const seed = id * 137;
      for (let i = 0; i < 12; i++) {
        const a = (seed + i * 0.523) % (2 * Math.PI);
        const r = radius * (0.9 + ((seed + i * 73) % 100) / 100 * 0.8);
        const dotR = 0.5 + ((seed + i * 31) % 100) / 100 * 0.8;
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, dotR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Food arc
      const foodRatio = maxFood > 0 ? food / maxFood : 0;
      if (foodRatio > 0.01) {
        ctx.strokeStyle = '#429942';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(x, y, radius + 4, -Math.PI / 2, -Math.PI / 2 + foodRatio * Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      // Food text
      ctx.fillStyle = '#e0e0e0';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.floor(food)}`, x, y);
    }
  }

  private renderWorld(ctx: CanvasRenderingContext2D, worldData: Float32Array, canvasWidth: number, canvasHeight: number): void {
    const { gridWidth, gridHeight, cellSize } = this;
    this.updateColonyRgb();

    // Calculate visible cell range
    const invZoom = 1.0 / this.viewport.zoom;
    const viewLeft = -this.viewport.offsetX * invZoom;
    const viewTop = -this.viewport.offsetY * invZoom;
    const viewRight = viewLeft + canvasWidth * invZoom;
    const viewBottom = viewTop + canvasHeight * invZoom;

    const startX = Math.max(0, Math.floor(viewLeft / cellSize));
    const startY = Math.max(0, Math.floor(viewTop / cellSize));
    const endX = Math.min(gridWidth - 1, Math.ceil(viewRight / cellSize));
    const endY = Math.min(gridHeight - 1, Math.ceil(viewBottom / cellSize));

    // Batch by color
    const colorBuckets = new Map<string, Array<[number, number]>>();

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const cellIdx = y * gridWidth + x;
        const base = cellIdx * WORLD_FLOATS_PER_CELL;
        const packed = worldData[base];
        const wall = packed >= 10000 ? 1 : 0;
        const food = packed >= 10000 ? 0 : packed;
        let color = '';

        if (wall) {
          color = '#726b6b';
        } else if (food > 0) {
          const g = Math.min(255, 100 + food * 10) | 0;
          color = `rgb(0,${g},0)`;
        } else if (this.drawMarkers) {
          const r = Math.min(255, worldData[base + 1] * 255) | 0;
          const g = Math.min(255, worldData[base + 2] * 255) | 0;
          const b = Math.min(255, worldData[base + 3] * 255) | 0;
          if (r > 0 || g > 0 || b > 0) {
            color = `rgb(${r},${g},${b})`;
          }
        }

        if (color) {
          let bucket = colorBuckets.get(color);
          if (!bucket) { bucket = []; colorBuckets.set(color, bucket); }
          bucket.push([x, y]);
        }
      }
    }

    for (const [color, positions] of colorBuckets) {
      ctx.fillStyle = color;
      for (const [x, y] of positions) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  private renderAntsFromData(ctx: CanvasRenderingContext2D, antData: Float32Array): void {
    const antCount = antData.length / ANT_FLOATS_PER_ANT;
    const zoom = this.viewport.zoom;
    this.updateColonyRgb();

    // Group ants by colony for color batching
    const colonyAnts = new Map<number, Array<{ x: number; y: number; angle: number; phase: number; type: number; wobble: number; dying: number }>>();

    for (let i = 0; i < antCount; i++) {
      const base = i * ANT_FLOATS_PER_ANT;
      const x = antData[base];
      const y = antData[base + 1];
      const angle = antData[base + 2];
      const phase = antData[base + 3];
      const type = antData[base + 4];
      const colId = antData[base + 5] | 0;
      const wobble = antData[base + 6];
      const dying = antData[base + 7];

      if (phase === Mode.Dead) continue;

      let list = colonyAnts.get(colId);
      if (!list) { list = []; colonyAnts.set(colId, list); }
      list.push({ x, y, angle, phase, type, wobble, dying });
    }

    // Render each colony's ants
    for (const [colId, ants] of colonyAnts) {
      const color = this.colonyRgb[colId] || this.colonyRgb[0] || { r: 255, g: 73, b: 68, hex: '#ff4944' };
      const hex = color.hex;

      if (zoom >= LOD_DETAIL) {
        this.renderAntsDetailed(ctx, ants, hex, color);
      } else if (zoom >= LOD_SIMPLE) {
        this.renderAntsMedium(ctx, ants, hex, color);
      } else {
        this.renderAntsSimple(ctx, ants, hex);
      }
    }
  }

  private renderAntsSimple(ctx: CanvasRenderingContext2D, ants: Array<{ x: number; y: number; angle: number; type: number }>, color: string): void {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (const ant of ants) {
      const scale = ant.type === AntType.Soldier ? 2.0 : 1.0;
      const h = 4 * scale;
      const a = ant.angle + Math.PI / 2;
      const dx = Math.cos(a) * h * 0.5;
      const dy = Math.sin(a) * h * 0.5;
      ctx.moveTo(ant.x - dx, ant.y - dy);
      ctx.lineTo(ant.x + dx, ant.y + dy);
    }
    ctx.stroke();
  }

  private renderAntsMedium(ctx: CanvasRenderingContext2D, ants: Array<{ x: number; y: number; angle: number; phase: number; type: number; wobble: number }>, color: string, rgb: { r: number; g: number; b: number }): void {
    // Alive ants body
    ctx.fillStyle = color;
    for (const ant of ants) {
      if (ant.phase === Mode.Dying || ant.phase === Mode.Dead) continue;
      const scale = ant.type === AntType.Soldier ? 2.0 : 1.0;
      const a = ant.angle + Math.PI / 2 + Math.sin(ant.wobble) * 0.05;
      ctx.save();
      ctx.translate(ant.x, ant.y);
      ctx.rotate(a);
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

    // Food dots
    ctx.fillStyle = '#429942';
    ctx.beginPath();
    for (const ant of ants) {
      if (ant.phase !== Mode.ToHome && ant.phase !== Mode.ToHomeNoFood) continue;
      const scale = ant.type === AntType.Soldier ? 2.0 : 1.0;
      const a = ant.angle + Math.PI / 2 + Math.sin(ant.wobble) * 0.05;
      const headR = 1.2 * scale;
      const headY = -3.5 * scale;
      ctx.save();
      ctx.translate(ant.x, ant.y);
      ctx.rotate(a);
      ctx.moveTo(1.2 * scale, headY - headR - 1.0 * scale);
      ctx.arc(0, headY - headR - 1.0 * scale, 1.2 * scale, 0, Math.PI * 2);
      ctx.restore();
    }
    ctx.fill();

    // Dying ants
    for (const ant of ants) {
      if (ant.phase !== Mode.Dying) continue;
      const scale = ant.type === AntType.Soldier ? 2.0 : 1.0;
      const a = ant.angle + Math.PI / 2;
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = `rgb(${rgb.r >> 1},${rgb.g >> 1},${rgb.b >> 1})`;
      ctx.save();
      ctx.translate(ant.x, ant.y);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(0, 0, 1.6 * scale, 3 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1.0;
    }
  }

  private renderAntsDetailed(ctx: CanvasRenderingContext2D, ants: Array<{ x: number; y: number; angle: number; phase: number; type: number; wobble: number }>, color: string, rgb: { r: number; g: number; b: number }): void {
    const colorLight = `rgb(${Math.min(255, rgb.r + ((255 - rgb.r) >> 2))},${Math.min(255, rgb.g + ((255 - rgb.g) >> 2))},${Math.min(255, rgb.b + ((255 - rgb.b) >> 2))})`;

    // Batch 1: Body segments
    ctx.fillStyle = color;
    for (const ant of ants) {
      if (ant.phase === Mode.Dying || ant.phase === Mode.Dead) continue;
      const scale = ant.type === AntType.Soldier ? 2.0 : 1.0;
      const a = ant.angle + Math.PI / 2 + Math.sin(ant.wobble) * 0.05;
      ctx.save();
      ctx.translate(ant.x, ant.y);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(0, -3.5 * scale, 1.2 * scale, 1.2 * scale * 1.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -1.2 * scale, 1.4 * scale * 0.85, 1.4 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 1.8 * scale, 1.6 * scale, 2.2 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      // Petiole
      ctx.fillStyle = colorLight;
      ctx.beginPath();
      ctx.ellipse(0, 0.3 * scale, 0.6 * scale, 0.8 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.restore();
    }

    // Batch 2: Antennae
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (const ant of ants) {
      if (ant.phase === Mode.Dying || ant.phase === Mode.Dead) continue;
      const scale = ant.type === AntType.Soldier ? 2.0 : 1.0;
      const a = ant.angle + Math.PI / 2 + Math.sin(ant.wobble) * 0.05;
      const antWobble1 = Math.sin(ant.wobble * 1.3) * 0.15;
      const antWobble2 = Math.sin(ant.wobble * 1.3 + 1.0) * 0.15;
      const headR = 1.2 * scale;
      const headY = -3.5 * scale;
      const antLen = 3.0 * scale;
      const antBaseY = headY - headR * 0.5;
      const antSpread = 0.45;

      ctx.save();
      ctx.translate(ant.x, ant.y);
      ctx.rotate(a);
      ctx.moveTo(-headR * 0.3, antBaseY);
      ctx.lineTo(
        -Math.sin(antSpread + antWobble1) * antLen,
        antBaseY - Math.cos(antSpread + antWobble1) * antLen
      );
      ctx.moveTo(headR * 0.3, antBaseY);
      ctx.lineTo(
        Math.sin(antSpread + antWobble2) * antLen,
        antBaseY - Math.cos(antSpread + antWobble2) * antLen
      );
      ctx.restore();
    }
    ctx.stroke();

    // Batch 3: Legs
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    for (const ant of ants) {
      if (ant.phase === Mode.Dying || ant.phase === Mode.Dead) continue;
      const scale = ant.type === AntType.Soldier ? 2.0 : 1.0;
      const a = ant.angle + Math.PI / 2 + Math.sin(ant.wobble) * 0.05;
      const thoraxR = 1.4 * scale;
      const thoraxY = -1.2 * scale;
      const legLen = 2.5 * scale;
      const legWobble = ant.wobble;

      ctx.save();
      ctx.translate(ant.x, ant.y);
      ctx.rotate(a);

      for (let li = 0; li < 3; li++) {
        const legBaseY = thoraxY - 0.3 * scale + li * 0.9 * scale;
        const phase = li * 2.094;
        const swingL = Math.sin(legWobble + phase) * 0.25;
        const swingR = Math.sin(legWobble + phase + Math.PI) * 0.25;

        const lStartX = -thoraxR * 0.7;
        const lMidX = lStartX - legLen * 0.5;
        const lMidY = legBaseY + legLen * 0.15 + swingL * legLen;
        const lEndX = lMidX - legLen * 0.15;
        const lEndY = lMidY + legLen * 0.35;
        ctx.moveTo(lStartX, legBaseY);
        ctx.quadraticCurveTo(lMidX, lMidY, lEndX, lEndY);

        const rStartX = thoraxR * 0.7;
        const rMidX = rStartX + legLen * 0.5;
        const rMidY = legBaseY + legLen * 0.15 + swingR * legLen;
        const rEndX = rMidX + legLen * 0.15;
        const rEndY = rMidY + legLen * 0.35;
        ctx.moveTo(rStartX, legBaseY);
        ctx.quadraticCurveTo(rMidX, rMidY, rEndX, rEndY);
      }
      ctx.restore();
    }
    ctx.stroke();

    // Batch 4: Food particles
    ctx.fillStyle = '#429942';
    ctx.beginPath();
    for (const ant of ants) {
      if (ant.phase !== Mode.ToHome && ant.phase !== Mode.ToHomeNoFood) continue;
      const scale = ant.type === AntType.Soldier ? 2.0 : 1.0;
      const a = ant.angle + Math.PI / 2 + Math.sin(ant.wobble) * 0.05;
      const headR = 1.2 * scale;
      const headY = -3.5 * scale;
      ctx.save();
      ctx.translate(ant.x, ant.y);
      ctx.rotate(a);
      ctx.moveTo(1.2 * scale, headY - headR - 1.0 * scale);
      ctx.arc(0, headY - headR - 1.0 * scale, 1.2 * scale, 0, Math.PI * 2);
      ctx.restore();
    }
    ctx.fill();

    // Batch 5: Dying ants
    for (const ant of ants) {
      if (ant.phase !== Mode.Dying) continue;
      const scale = ant.type === AntType.Soldier ? 2.0 : 1.0;
      const a = ant.angle + Math.PI / 2;
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = `rgb(${rgb.r >> 1},${rgb.g >> 1},${rgb.b >> 1})`;
      ctx.save();
      ctx.translate(ant.x, ant.y);
      ctx.rotate(a);
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
      ctx.globalAlpha = 1.0;
    }
  }
}
