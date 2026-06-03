import { WorldRenderer, type ViewportState } from './WorldRenderer';
import { ColonyRenderer } from './ColonyRenderer';
import type { World } from '@/simulation/World';
import type { Colony } from '@/simulation/Colony';

export class Renderer {
  renderAnts: boolean = true;
  worldRenderer: WorldRenderer;
  colonyRenderers: ColonyRenderer[] = [];
  viewport: ViewportState = { offsetX: 0, offsetY: 0, zoom: 1 };

  private static readonly MIN_ZOOM = 0.1;
  private static readonly MAX_ZOOM = 10.0;
  private static readonly ZOOM_FACTOR = 0.1;

  constructor(world: World) {
    this.worldRenderer = world.renderer;
  }

  addColony(colony: Colony): void {
    this.colonyRenderers.push(new ColonyRenderer(colony));
  }

  removeColony(colonyId: number): void {
    this.colonyRenderers = this.colonyRenderers.filter(
      (cr) => cr.colony.id !== colonyId
    );
  }

  render(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw black background for world area
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.save();
    ctx.translate(this.viewport.offsetX, this.viewport.offsetY);
    ctx.scale(this.viewport.zoom, this.viewport.zoom);

    // Render world (markers, food, walls)
    this.worldRenderer.render(ctx, this.viewport);

    // Render colonies (ants + bases)
    for (const cr of this.colonyRenderers) {
      cr.render(ctx, this.renderAnts, this.viewport.zoom);
    }

    ctx.restore();
  }

  pan(dx: number, dy: number): void {
    this.viewport.offsetX += dx;
    this.viewport.offsetY += dy;
  }

  zoomAt(delta: number, x: number, y: number): void {
    const oldZoom = this.viewport.zoom;
    const zoomDelta = -delta * Renderer.ZOOM_FACTOR;
    const newZoom = Math.max(
      Renderer.MIN_ZOOM,
      Math.min(Renderer.MAX_ZOOM, oldZoom * (1 + zoomDelta))
    );

    // Zoom towards the cursor position
    const zoomRatio = newZoom / oldZoom;
    this.viewport.offsetX = x - (x - this.viewport.offsetX) * zoomRatio;
    this.viewport.offsetY = y - (y - this.viewport.offsetY) * zoomRatio;
    this.viewport.zoom = newZoom;
  }
}
