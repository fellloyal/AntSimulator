import { WorldRenderer, type ViewportState } from './WorldRenderer';
import { ColonyRenderer } from './ColonyRenderer';
import { TerrainRenderer } from './TerrainRenderer';
import { ObstacleRenderer } from './ObstacleRenderer';
import { FoodPileRenderer } from './FoodPileRenderer';
import type { World } from '@/simulation/World';
import type { Colony } from '@/simulation/Colony';

export class Renderer {
  renderAnts: boolean = true;
  worldRenderer: WorldRenderer;
  colonyRenderers: ColonyRenderer[] = [];
  viewport: ViewportState = { offsetX: 0, offsetY: 0, zoom: 1 };

  // UI美化新增：分层渲染器
  private world: World;
  private terrainRenderer: TerrainRenderer;
  private obstacleRenderer: ObstacleRenderer;
  private foodRenderer: FoodPileRenderer;

  private static readonly MIN_ZOOM = 0.1;
  private static readonly MAX_ZOOM = 10.0;
  private static readonly ZOOM_FACTOR = 0.1;

  constructor(world: World) {
    this.world = world;
    this.worldRenderer = new WorldRenderer(world.map);
    this.terrainRenderer = new TerrainRenderer(
      world.map.width,
      world.map.height,
      world.map.cellSize
    );
    this.obstacleRenderer = new ObstacleRenderer(world.map.cellSize);
    this.foodRenderer = new FoodPileRenderer(world.map.cellSize);
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

    // UI美化：不再画纯黑底，由 TerrainRenderer 绘制地形底图
    // ctx.fillStyle = '#111111';
    // ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.save();
    ctx.translate(this.viewport.offsetX, this.viewport.offsetY);
    ctx.scale(this.viewport.zoom, this.viewport.zoom);

    // 1. 地形底图
    this.terrainRenderer.drawTerrain(ctx, this.world, this.viewport, canvasWidth, canvasHeight);

    // 2. 磨损土路
    this.terrainRenderer.drawWornPaths(ctx, this.world, this.viewport, canvasWidth, canvasHeight);

    // 3. 信息素 markers（worldRenderer 移除 wall/food 后只负责 markers/density）
    this.worldRenderer.render(ctx, this.viewport);

    // 4. 障碍物
    this.obstacleRenderer.drawObstacles(ctx, this.world, this.viewport, canvasWidth, canvasHeight);

    // 5. 食物堆
    this.foodRenderer.drawFoodPiles(ctx, this.world, this.viewport, canvasWidth, canvasHeight);

    // 6. 蚁窝和蚂蚁
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
