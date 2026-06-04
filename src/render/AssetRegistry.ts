// AssetRegistry - SVG → OffscreenCanvas 缓存单例
type TileKey = string;

interface CachedTile {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

class AssetRegistryImpl {
  private cache = new Map<TileKey, CachedTile>();
  private cellSize: number = 4;
  private pendingLoads: Array<Promise<void>> = [];

  setCellSize(size: number): void {
    if (size !== this.cellSize) {
      this.cache.clear();
      this.cellSize = size;
    }
  }

  // 异步预加载 SVG（在构造函数/模块顶层调用）
  preloadSVG(svg: string, key: TileKey): CachedTile | null {
    const existing = this.cache.get(key);
    if (existing) return existing;

    if (!svg) return null; // 空 SVG 直接跳过

    const canvas = document.createElement('canvas');
    canvas.width = this.cellSize * 2; // 2x density
    canvas.height = this.cellSize * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2d context');

    const img = new Image();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const loadPromise = new Promise<void>((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        console.warn(`[AssetRegistry] Failed to load SVG: ${key}`);
        resolve(); // 不阻塞，drawTile 时静默忽略
      };
      img.src = url;
    });
    this.pendingLoads.push(loadPromise);

    const tile: CachedTile = { canvas, width: canvas.width, height: canvas.height };
    this.cache.set(key, tile);
    return tile;
  }

  // 等待所有 SVG 加载完成（首次渲染前 await）
  async waitForLoad(): Promise<void> {
    await Promise.all(this.pendingLoads);
    this.pendingLoads = [];
  }

  drawTile(ctx: CanvasRenderingContext2D, key: TileKey, x: number, y: number, size: number): void {
    const tile = this.cache.get(key);
    if (!tile) return;
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
