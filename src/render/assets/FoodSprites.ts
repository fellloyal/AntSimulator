// FoodSprites - 4 种食物，使用 AI text_to_image 生成的高清图
// 每种食物 1 张图，渲染时按尺寸缩放
export type FoodType = 0 | 1 | 2 | 3; // 0=chicken 1=apple 2=bread 3=berry
export type FoodSize = 'small' | 'medium' | 'large';

export const FOOD_SIZE_THRESHOLDS = { small: 1, medium: 5, large: 10 } as const;

export function foodSizeFromQty(qty: number): FoodSize {
  if (qty >= FOOD_SIZE_THRESHOLDS.large) return 'large';
  if (qty >= FOOD_SIZE_THRESHOLDS.medium) return 'medium';
  return 'small';
}

// AI 生成的图片 URL（每种食物 1 张，由 text_to_image API 生成）
const API_BASE = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image';

function imageUrl(prompt: string): string {
  return `${API_BASE}?prompt=${encodeURIComponent(prompt)}&image_size=square`;
}

const APPLE_URL = imageUrl(
  'a single red apple with green leaf and brown stem, simple flat icon style, white background, top view, food emoji, vibrant red color, high quality'
);
const CHICKEN_URL = imageUrl(
  'a single golden brown fried chicken drumstick with white bone, simple flat icon style, white background, top view, food emoji, crispy fried, high quality'
);
const BREAD_URL = imageUrl(
  'a single golden brown bread loaf with three diagonal score marks on top, simple flat icon style, white background, top view, food emoji, bakery style, high quality'
);
const BERRY_URL = imageUrl(
  'a cluster of dark purple blueberries with green leaves and stems, simple flat icon style, white background, top view, food emoji, blueberry, high quality'
);

// 每种食物 1 张图，所有尺寸共用
export const FOOD_SPRITES: Record<FoodType, Record<FoodSize, string>> = {
  0: { small: CHICKEN_URL, medium: CHICKEN_URL, large: CHICKEN_URL },
  1: { small: APPLE_URL, medium: APPLE_URL, large: APPLE_URL },
  2: { small: BREAD_URL, medium: BREAD_URL, large: BREAD_URL },
  3: { small: BERRY_URL, medium: BERRY_URL, large: BERRY_URL },
};

// 加载食物资源（自动检测 URL 或 SVG）
export function preloadFoodSprite(reg: { preloadImage: (url: string, key: string) => unknown; preloadSVG: (svg: string, key: string) => unknown }, type: FoodType, size: FoodSize, key: string): void {
  const val = FOOD_SPRITES[type][size];
  if (val.startsWith('http') || val.startsWith('data:')) {
    reg.preloadImage(val, key);
  } else {
    reg.preloadSVG(val, key);
  }
}
