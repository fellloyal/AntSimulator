// TerrainRenderer - 地形底图 + 磨损土路绘制
// 支持 24-tile 自动地形过渡（useStore.enableAutoTiles 开关）
import { TERRAIN_TILES, type TerrainType } from './assets/TerrainTiles';
import { TERRAIN_AUTO_EDGE, TERRAIN_AUTO_CORNER } from './assets/TerrainAutoTiles';
import { WORN_PATH_SVG, WEAR_THRESHOLD } from './assets/WornPath';
import { AssetRegistry } from './AssetRegistry';
import {
  computeEdgeMask,
  computeCornerMask,
  computeAllCorners,
  makeWorldGridAdapter,
  type TerrainGrid,
  type Corner,
} from './TerrainAdjacency';
import useStore from '@/store/useStore';

export interface Viewport {
  offsetX: number;
  offsetY: number;
  zoom: number;
}

// 接受 World 实例或带 map.cells 的对象
export interface WorldLike {
  map: {
    cells: ArrayLike<{ terrain: number }>;
    width: number;
    height: number;
    getByCoords?: (c: { x: number; y: number }) => { terrain: number; wearLevel: number; wall: number };
  };
}

export class TerrainRenderer {
  private gridWidth: number;
  private gridHeight: number;
  private cellSize: number;
  private terrainKeys: Map<number, string> = new Map();
  private autoEdgeKeys: Map<number, Map<number, string>> = new Map();
  private autoCornerKeys: Map<number, Map<Corner, Map<'convex' | 'concave', string>>> = new Map();
  private wornKey: string = 'worn_path';

  constructor(gridWidth: number, gridHeight: number, cellSize: number) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.cellSize = cellSize;
    AssetRegistry.setCellSize(cellSize);
    this.preload();
  }

  private preload(): void {
    // Legacy 4 地形纹理
    for (const t of [0, 1, 2, 3] as TerrainType[]) {
      const key = `terrain_${TERRAIN_TILES[t].id}`;
      AssetRegistry.preloadSVG(TERRAIN_TILES[t].svg, key);
      this.terrainKeys.set(t, key);
    }
    AssetRegistry.preloadSVG(WORN_PATH_SVG, this.wornKey);

    // 24-tile 自动地形过渡的 96 张子瓦片
    for (const t of [0, 1, 2, 3] as TerrainType[]) {
      const edgeMap = new Map<number, string>();
      for (let mask = 0; mask < 16; mask++) {
        const key = `auto_edge_${TERRAIN_TILES[t].id}_${mask}`;
        AssetRegistry.preloadSVG(TERRAIN_AUTO_EDGE[t][mask], key);
        edgeMap.set(mask, key);
      }
      this.autoEdgeKeys.set(t, edgeMap);

      const cornerMap = new Map<Corner, Map<'convex' | 'concave', string>>();
      for (const corner of ['tl', 'tr', 'bl', 'br'] as Corner[]) {
        const variantMap = new Map<'convex' | 'concave', string>();
        for (const variant of ['convex', 'concave'] as ('convex' | 'concave')[]) {
          const key = `auto_corner_${TERRAIN_TILES[t].id}_${corner}_${variant}`;
          AssetRegistry.preloadSVG(TERRAIN_AUTO_CORNER[t][corner][variant], key);
          variantMap.set(variant, key);
        }
        cornerMap.set(corner, variantMap);
      }
      this.autoCornerKeys.set(t, cornerMap);
    }
  }

  setCellSize(size: number): void {
    if (size !== this.cellSize) {
      this.cellSize = size;
      AssetRegistry.setCellSize(size);
      this.preload();
    }
  }

  // 视口可见范围
  private getVisibleCellRange(viewport: Viewport, canvasWidth: number, canvasHeight: number) {
    const invZoom = 1.0 / viewport.zoom;
    const vl = -viewport.offsetX * invZoom;
    const vt = -viewport.offsetY * invZoom;
    const vr = vl + canvasWidth * invZoom;
    const vb = vt + canvasHeight * invZoom;
    return {
      sx: Math.max(0, Math.floor(vl / this.cellSize)),
      sy: Math.max(0, Math.floor(vt / this.cellSize)),
      ex: Math.min(this.gridWidth - 1, Math.ceil(vr / this.cellSize)),
      ey: Math.min(this.gridHeight - 1, Math.ceil(vb / this.cellSize)),
    };
  }

  // 公开入口：根据 flag 选 legacy / auto
  drawTerrain(
    ctx: CanvasRenderingContext2D,
    world: WorldLike,
    viewport: Viewport,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    if (useStore.getState().enableAutoTiles) {
      this.drawAutoTerrain(ctx, world, viewport, canvasWidth, canvasHeight);
    } else {
      this.drawLegacyTerrain(ctx, world, viewport, canvasWidth, canvasHeight);
    }
  }

  // 旧版 4 地形硬切（保留为回退路径）
  private drawLegacyTerrain(
    ctx: CanvasRenderingContext2D,
    world: WorldLike,
    viewport: Viewport,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const { sx, sy, ex, ey } = this.getVisibleCellRange(viewport, canvasWidth, canvasHeight);
    const buckets = new Map<number, Array<[number, number]>>();
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const cell = world.map.getByCoords
          ? world.map.getByCoords({ x, y })
          : world.map.cells[y * world.map.width + x];
        const t = cell.terrain ?? 0;
        let bucket = buckets.get(t);
        if (!bucket) {
          bucket = [];
          buckets.set(t, bucket);
        }
        bucket.push([x, y]);
      }
    }
    for (const [t, cells] of buckets) {
      const key = this.terrainKeys.get(t);
      if (!key) continue;
      for (const [x, y] of cells) {
        AssetRegistry.drawTile(ctx, key, x * this.cellSize, y * this.cellSize, this.cellSize);
      }
    }
  }

  // 24-tile 自动地形过渡
  // 流程：
  //   1) 按 (terrain, edgeMask) 分桶批量画主体瓦片
  //   2) 单 cell 扫 4 角点，仅对触发凸/凹的角画 8x8 角贴片
  private drawAutoTerrain(
    ctx: CanvasRenderingContext2D,
    world: WorldLike,
    viewport: Viewport,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const { sx, sy, ex, ey } = this.getVisibleCellRange(viewport, canvasWidth, canvasHeight);
    const width = world.map.width;
    const adapter: TerrainGrid = makeWorldGridAdapter(world.map.cells, width, 0);

    // === 1) 主体：按 (terrain, edgeMask) 分桶 ===
    const buckets = new Map<number, Array<[number, number]>>();
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const t = adapter.getTerrainAt(x, y);
        const edgeMask = computeEdgeMask(adapter, x, y);
        const key = (t << 4) | edgeMask; // 8-bit key: 4 bit terrain + 4 bit edge mask
        let bucket = buckets.get(key);
        if (!bucket) {
          bucket = [];
          buckets.set(key, bucket);
        }
        bucket.push([x, y]);
      }
    }
    for (const [key, cells] of buckets) {
      const t = (key >> 4) & 0xf;
      const edgeMask = key & 0xf;
      const svgKey = this.autoEdgeKeys.get(t)?.get(edgeMask);
      if (!svgKey) continue;
      for (const [x, y] of cells) {
        AssetRegistry.drawTile(ctx, svgKey, x * this.cellSize, y * this.cellSize, this.cellSize);
      }
    }

    // === 2) 角点：单 cell 检查，仅画触发的角 ===
    const CORNER_OFFSETS: Array<{ corner: Corner; dx: 0 | 1; dy: 0 | 1 }> = [
      { corner: 'tl', dx: 0, dy: 0 },
      { corner: 'tr', dx: 1, dy: 0 },
      { corner: 'bl', dx: 0, dy: 1 },
      { corner: 'br', dx: 1, dy: 1 },
    ];
    const cornerSize = 8;
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const t = adapter.getTerrainAt(x, y);
        const edgeMask = computeEdgeMask(adapter, x, y);
        const cornerMask = computeCornerMask(adapter, x, y);
        const corners = computeAllCorners(edgeMask, cornerMask);
        for (let i = 0; i < 4; i++) {
          const c = corners[i];
          if (!c.draw) continue;
          const svgKey = this.autoCornerKeys.get(t)?.get(CORNER_OFFSETS[i].corner)?.get(c.variant);
          if (!svgKey) continue;
          const off = CORNER_OFFSETS[i];
          const px = x * this.cellSize + (off.dx === 1 ? this.cellSize - cornerSize : 0);
          const py = y * this.cellSize + (off.dy === 1 ? this.cellSize - cornerSize : 0);
          AssetRegistry.drawTile(ctx, svgKey, px, py, cornerSize);
        }
      }
    }
  }

  // 绘制磨损土路（仅 wearLevel > threshold 的 cell）
  drawWornPaths(
    ctx: CanvasRenderingContext2D,
    world: { map: { getByCoords?: (c: { x: number; y: number }) => { wearLevel: number; wall: number } } },
    viewport: Viewport,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const { sx, sy, ex, ey } = this.getVisibleCellRange(viewport, canvasWidth, canvasHeight);
    for (let y = sy; y <= ey; y++) {
      for (let x = sx; x <= ex; x++) {
        const cell = world.map.getByCoords
          ? world.map.getByCoords({ x, y })
          : (world.map as any).cells[y * (world.map as any).width + x];
        if (cell.wall) continue;
        if (cell.wearLevel > WEAR_THRESHOLD) {
          AssetRegistry.drawTile(ctx, this.wornKey, x * this.cellSize, y * this.cellSize, this.cellSize);
        }
      }
    }
  }
}
