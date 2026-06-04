// FoodSprites - 12 个食物堆 SVG（4 种类 × 3 尺寸）
export type FoodType = 0 | 1 | 2 | 3; // 0=chicken 1=apple 2=bread 3=berry
export type FoodSize = 'small' | 'medium' | 'large';

export const FOOD_SIZE_THRESHOLDS = { small: 1, medium: 5, large: 10 } as const;

export function foodSizeFromQty(qty: number): FoodSize {
  if (qty >= FOOD_SIZE_THRESHOLDS.large) return 'large';
  if (qty >= FOOD_SIZE_THRESHOLDS.medium) return 'medium';
  return 'small';
}

// 鸡腿 3 尺寸
const chicken_small = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
  <ellipse cx="6" cy="8" rx="3" ry="3" fill="#d4a060" stroke="#8a5020" stroke-width="0.4"/>
  <ellipse cx="5" cy="7" rx="1.5" ry="1.2" fill="#e8b878"/>
  <ellipse cx="6" cy="3" rx="1" ry="0.8" fill="#f0e8d0" stroke="#a8956a" stroke-width="0.3"/>
</svg>`;

const chicken_medium = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <ellipse cx="9" cy="11" rx="4.5" ry="5" fill="#d4a060" stroke="#8a5020" stroke-width="0.5"/>
  <ellipse cx="7" cy="9" rx="2.5" ry="2" fill="#e8b878"/>
  <ellipse cx="9" cy="4" rx="1.5" ry="1" fill="#f0e8d0" stroke="#a8956a" stroke-width="0.4"/>
  <ellipse cx="11" cy="10" rx="1" ry="1.5" fill="#c98a4a"/>
</svg>`;

const chicken_large = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
  <ellipse cx="5" cy="15" rx="4" ry="4" fill="#d4a060" stroke="#8a5020" stroke-width="0.5"/>
  <ellipse cx="3" cy="13" rx="2" ry="1.5" fill="#e8b878"/>
  <ellipse cx="5" cy="6" rx="1.5" ry="1" fill="#f0e8d0" stroke="#a8956a" stroke-width="0.4"/>
  <ellipse cx="15" cy="13" rx="5" ry="6" fill="#c98a4a" stroke="#8a5020" stroke-width="0.5"/>
  <ellipse cx="13" cy="11" rx="3" ry="2.5" fill="#e8b878"/>
  <ellipse cx="14" cy="22" rx="4" ry="3" fill="#d4a060" stroke="#8a5020" stroke-width="0.5"/>
  <ellipse cx="13" cy="20" rx="2" ry="1.5" fill="#e8b878"/>
</svg>`;

// 苹果 3 尺寸
const apple_small = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
  <path d="M7,4 C5,4 3,6 3,8 C3,10 5,12 7,12 C9,12 11,10 11,8 C11,6 9,4 7,4 Z" fill="#c02020" stroke="#7a0a0a" stroke-width="0.4"/>
  <ellipse cx="5" cy="7" rx="0.8" ry="1.2" fill="#ff5050" opacity="0.6"/>
  <ellipse cx="7" cy="3" rx="0.5" ry="0.5" fill="#3a8a3a"/>
</svg>`;

const apple_medium = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <path d="M10,5 C7,5 4,7 4,11 C4,14 7,17 10,17 C13,17 16,14 16,11 C16,7 13,5 10,5 Z" fill="#c02020" stroke="#7a0a0a" stroke-width="0.5"/>
  <ellipse cx="7" cy="9" rx="1.2" ry="1.8" fill="#ff5050" opacity="0.6"/>
  <ellipse cx="10" cy="3" rx="0.8" ry="0.7" fill="#3a8a3a"/>
</svg>`;

const apple_large = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
  <path d="M8,15 C5,15 3,18 3,22 C3,25 5,27 8,27 C11,27 13,25 13,22 C13,18 11,15 8,15 Z" fill="#a01010" stroke="#5a0a0a" stroke-width="0.5"/>
  <path d="M20,7 C17,7 15,10 15,13 C15,16 17,18 20,18 C23,18 25,16 25,13 C25,10 23,7 20,7 Z" fill="#c02020" stroke="#7a0a0a" stroke-width="0.5"/>
  <path d="M14,15 C12,15 10,17 10,20 C10,23 12,25 14,25 C16,25 18,23 18,20 C18,17 16,15 14,15 Z" fill="#d83030" stroke="#7a0a0a" stroke-width="0.5"/>
  <ellipse cx="6" cy="19" rx="0.8" ry="1.5" fill="#ff5050" opacity="0.6"/>
  <ellipse cx="19" cy="10" rx="0.8" ry="1.5" fill="#ff5050" opacity="0.6"/>
</svg>`;

// 面包 3 尺寸
const bread_small = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
  <ellipse cx="7" cy="8" rx="4" ry="3" fill="#e8c888" stroke="#a88040" stroke-width="0.4"/>
  <path d="M3,7 Q7,5 11,7" stroke="#a88040" stroke-width="0.3" fill="none"/>
  <circle cx="5" cy="8" r="0.3" fill="#8a5a20"/>
  <circle cx="9" cy="8" r="0.3" fill="#8a5a20"/>
</svg>`;

const bread_medium = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <ellipse cx="10" cy="11" rx="6" ry="4" fill="#e8c888" stroke="#a88040" stroke-width="0.5"/>
  <path d="M4,10 Q10,7 16,10" stroke="#a88040" stroke-width="0.4" fill="none"/>
  <circle cx="7" cy="11" r="0.4" fill="#8a5a20"/>
  <circle cx="11" cy="12" r="0.4" fill="#8a5a20"/>
  <circle cx="13" cy="11" r="0.3" fill="#8a5a20"/>
</svg>`;

const bread_large = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
  <ellipse cx="9" cy="15" rx="6" ry="4" fill="#e8c888" stroke="#a88040" stroke-width="0.5"/>
  <ellipse cx="19" cy="18" rx="6" ry="4" fill="#d8b070" stroke="#a88040" stroke-width="0.5"/>
  <path d="M3,14 Q9,11 15,14" stroke="#a88040" stroke-width="0.4" fill="none"/>
  <path d="M13,17 Q19,14 25,17" stroke="#a88040" stroke-width="0.4" fill="none"/>
  <circle cx="6" cy="15" r="0.4" fill="#8a5a20"/>
  <circle cx="12" cy="16" r="0.4" fill="#8a5a20"/>
  <circle cx="16" cy="18" r="0.4" fill="#8a5a20"/>
  <circle cx="22" cy="18" r="0.4" fill="#8a5a20"/>
</svg>`;

// 浆果 3 尺寸
const berry_small = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
  <circle cx="6" cy="8" r="2.5" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.4"/>
  <circle cx="9" cy="10" r="2" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.4"/>
  <ellipse cx="5" cy="7" rx="0.6" ry="0.4" fill="#a050c0" opacity="0.6"/>
</svg>`;

const berry_medium = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <circle cx="6" cy="10" r="3.5" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <circle cx="11" cy="7" r="3" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <circle cx="13" cy="12" r="2.8" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <ellipse cx="5" cy="9" rx="0.8" ry="0.5" fill="#a050c0" opacity="0.6"/>
  <ellipse cx="10" cy="6" rx="0.7" ry="0.4" fill="#a050c0" opacity="0.6"/>
</svg>`;

const berry_large = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
  <circle cx="6" cy="12" r="4" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <circle cx="14" cy="7" r="3.5" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <circle cx="20" cy="14" r="3.8" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <circle cx="11" cy="18" r="3" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <circle cx="22" cy="20" r="2.5" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.5"/>
  <ellipse cx="5" cy="10" rx="1" ry="0.6" fill="#a050c0" opacity="0.6"/>
  <ellipse cx="13" cy="5" rx="0.8" ry="0.5" fill="#a050c0" opacity="0.6"/>
</svg>`;

export const FOOD_SPRITES: Record<FoodType, Record<FoodSize, string>> = {
  0: { small: chicken_small, medium: chicken_medium, large: chicken_large },
  1: { small: apple_small, medium: apple_medium, large: apple_large },
  2: { small: bread_small, medium: bread_medium, large: bread_large },
  3: { small: berry_small, medium: berry_medium, large: berry_large },
};
