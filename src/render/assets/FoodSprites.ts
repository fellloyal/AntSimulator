// FoodSprites - 4 种食物的 Twemoji 矢量示意图（标准 emoji 风格）
// 用 Vite ?raw 引入 SVG 文本，无 CORS 问题，构建期嵌入
import appleSvg from './food_images/apple.svg?raw';
import chickenSvg from './food_images/chicken.svg?raw';
import breadSvg from './food_images/bread.svg?raw';
import berrySvg from './food_images/berry.svg?raw';

export type FoodType = 0 | 1 | 2 | 3; // 0=chicken 1=apple 2=bread 3=berry
export type FoodSize = 'small' | 'medium' | 'large';

export const FOOD_SIZE_THRESHOLDS = { small: 1, medium: 5, large: 10 } as const;

export function foodSizeFromQty(qty: number): FoodSize {
  if (qty >= FOOD_SIZE_THRESHOLDS.large) return 'large';
  if (qty >= FOOD_SIZE_THRESHOLDS.medium) return 'medium';
  return 'small';
}

// 每种食物 1 张图，所有尺寸共用
export const FOOD_SPRITES: Record<FoodType, Record<FoodSize, string>> = {
  0: { small: chickenSvg, medium: chickenSvg, large: chickenSvg },
  1: { small: appleSvg, medium: appleSvg, large: appleSvg },
  2: { small: breadSvg, medium: breadSvg, large: breadSvg },
  3: { small: berrySvg, medium: berrySvg, large: berrySvg },
};

// 加载食物资源：4 种食物均为 SVG 字符串，使用 preloadSVG (内部转 Blob URL)
export function preloadFoodSprite(reg: { preloadImage: (url: string, key: string) => unknown; preloadSVG: (svg: string, key: string) => unknown }, type: FoodType, size: FoodSize, key: string): void {
  const val = FOOD_SPRITES[type][size];
  if (val.startsWith('<svg') || val.startsWith('<?xml')) {
    reg.preloadSVG(val, key);
  } else if (val.startsWith('http') || val.startsWith('data:') || val.startsWith('blob:')) {
    reg.preloadImage(val, key);
  } else {
    reg.preloadSVG(val, key);
  }
}
