// FoodSprites - 4 种食物的预生成 JPG 图（AI 离线生成，构建时嵌入）
// 用 Vite ?url 引入，避免运行时的 CORS 跨域问题
import appleUrl from './food_images/apple.jpg?url';
import chickenUrl from './food_images/chicken.jpg?url';
import breadUrl from './food_images/bread.jpg?url';
import berryUrl from './food_images/berry.jpg?url';

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
  0: { small: chickenUrl, medium: chickenUrl, large: chickenUrl },
  1: { small: appleUrl, medium: appleUrl, large: appleUrl },
  2: { small: breadUrl, medium: breadUrl, large: breadUrl },
  3: { small: berryUrl, medium: berryUrl, large: berryUrl },
};

// 加载食物资源：4 种食物均为 JPG，使用 preloadImage
export function preloadFoodSprite(reg: { preloadImage: (url: string, key: string) => unknown; preloadSVG: (svg: string, key: string) => unknown }, type: FoodType, size: FoodSize, key: string): void {
  const val = FOOD_SPRITES[type][size];
  if (val.startsWith('http') || val.startsWith('data:') || val.startsWith('/') || val.startsWith('blob:')) {
    reg.preloadImage(val, key);
  } else {
    reg.preloadSVG(val, key);
  }
}
