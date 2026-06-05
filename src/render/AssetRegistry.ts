// AssetRegistry - SVG → 高分辨率位图 缓存单例
// 关键：缓存为固定 128x128，drawTile 时高质量缩小到目标尺寸
// 这样小目标（如 4x4）也清晰，大目标（如 40x40）也清晰
type TileKey = string;

interface CachedTile {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

const TILE_RENDER_SIZE = 128;  // 固定高分辨率缓存，与 cellSize 无关

class AssetRegistryImpl {
  private cache = new Map<TileKey, CachedTile>();
  private cellSize: number = 4;
  private pendingLoads: Array<Promise<void>> = [];

  setCellSize(size: number): void {
    // 缓存与 cellSize 无关（固定 128x128），不再清空
    this.cellSize = size;
  }

  // 通用图片加载（接受 URL 或 data URL）
  preloadImage(url: string, key: TileKey): CachedTile | null {
    const existing = this.cache.get(key);
    if (existing) return existing;

    if (!url) return null; // 空 URL 直接跳过

    const canvas = document.createElement('canvas');
    canvas.width = TILE_RENDER_SIZE;
    canvas.height = TILE_RENDER_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2d context');
    // 高质量缩放（缩小到任意目标都清晰）
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const loadPromise = new Promise<void>((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve();
      };
      img.onerror = () => {
        console.warn(`[AssetRegistry] Failed to load image: ${key}`);
        resolve(); // 不阻塞，drawTile 时静默忽略
      };
      img.src = url;
    });
    this.pendingLoads.push(loadPromise);

    const tile: CachedTile = { canvas, width: canvas.width, height: canvas.height };
    this.cache.set(key, tile);
    return tile;
  }

  // 异步预加载 SVG（在构造函数/模块顶层调用）
  preloadSVG(svg: string, key: TileKey): CachedTile | null {
    if (!svg) return null;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    return this.preloadImage(url, key);
  }

  // 等待所有 SVG 加载完成（首次渲染前 await）
  async waitForLoad(): Promise<void> {
    await Promise.all(this.pendingLoads);
    this.pendingLoads = [];
  }

  drawTile(ctx: CanvasRenderingContext2D, key: TileKey, x: number, y: number, size: number): void {
    const tile = this.cache.get(key);
    if (!tile) return;
    // 确保目标 ctx 也用高质量缩放
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(tile.canvas, x, y, size, size);
  }

  has(key: TileKey): boolean {
    return this.cache.has(key);
  }

  invalidate(): void {
    this.cache.clear();
  }
}

export const AssetRegistry = new AssetRegistryImpl();
