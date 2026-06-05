// FoodSprites - 12 个食物堆 SVG（4 种类 × 3 尺寸）
// 设计原则：每种食物必须有标志性形状，用户一眼能辨认
// viewBox 统一 32×32，便于精细绘制
export type FoodType = 0 | 1 | 2 | 3; // 0=chicken 1=apple 2=bread 3=berry
export type FoodSize = 'small' | 'medium' | 'large';

export const FOOD_SIZE_THRESHOLDS = { small: 1, medium: 5, large: 10 } as const;

export function foodSizeFromQty(qty: number): FoodSize {
  if (qty >= FOOD_SIZE_THRESHOLDS.large) return 'large';
  if (qty >= FOOD_SIZE_THRESHOLDS.medium) return 'medium';
  return 'small';
}

// ==================== 苹果 ====================
// 标志：圆身 + 顶部凹陷 + 短茎 + 绿叶

const apple_small = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- 苹果身（顶部凹陷） -->
  <path d="M16,10 C11,10 7,13 7,19 C7,25 11,29 16,29 C21,29 25,25 25,19 C25,13 21,10 16,10
           M14.5,10.5 Q16,8 17.5,10.5"
        fill="#d62828" stroke="#5a0808" stroke-width="0.9"/>
  <!-- 高光 -->
  <ellipse cx="11" cy="15" rx="2" ry="3" fill="#ff8080" opacity="0.6"/>
  <!-- 茎 -->
  <rect x="15.5" y="6" width="1.2" height="4.5" fill="#5a3a1a" stroke="#3a2010" stroke-width="0.3"/>
  <!-- 叶 -->
  <ellipse cx="19" cy="6" rx="2.8" ry="1.3" transform="rotate(30 19 6)" fill="#3a8a3a" stroke="#1a4a1a" stroke-width="0.4"/>
</svg>`;

const apple_medium = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <path d="M16,9 C11,9 6,12 6,19 C6,25 11,29 16,29 C21,29 26,25 26,19 C26,12 21,9 16,9
           M14,9.8 Q16,6.5 18,9.8"
        fill="#d62828" stroke="#5a0808" stroke-width="1"/>
  <ellipse cx="10" cy="15" rx="2.5" ry="3.5" fill="#ff8080" opacity="0.6"/>
  <ellipse cx="10" cy="20" rx="1" ry="1.5" fill="#ffb0b0" opacity="0.4"/>
  <path d="M16,8 L17,3.5 L15,3.5 Z" fill="#5a3a1a" stroke="#3a2010" stroke-width="0.3"/>
  <path d="M17,5 C20,3 23,4 22.5,7.5 C20,8 17,7 17,5 Z" fill="#3a8a3a" stroke="#1a4a1a" stroke-width="0.4"/>
  <line x1="18" y1="6" x2="21" y2="7" stroke="#1a4a1a" stroke-width="0.3"/>
</svg>`;

const apple_large = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- 苹果 A（左前大） -->
  <path d="M11,13 C6,13 2,16 2,22 C2,28 6,32 11,32 C16,32 20,28 20,22 C20,16 16,13 11,13
           M9,13.8 Q11,10 13,13.8"
        fill="#c02020" stroke="#5a0808" stroke-width="0.8"/>
  <ellipse cx="6" cy="18" rx="2" ry="3" fill="#ff6060" opacity="0.55"/>
  <rect x="10.5" y="9" width="1.2" height="4" fill="#5a3a1a"/>
  <ellipse cx="14" cy="9" rx="2.5" ry="1.2" transform="rotate(30 14 9)" fill="#3a8a3a" stroke="#1a4a1a" stroke-width="0.3"/>
  <!-- 苹果 B（右上小） -->
  <path d="M22,10 C19,10 17,12 17,15 C17,18 19,20 22,20 C25,20 27,18 27,15 C27,12 25,10 22,10
           M21,10.5 Q22,8.5 23,10.5"
        fill="#d83030" stroke="#5a0808" stroke-width="0.7"/>
  <ellipse cx="19.5" cy="13" rx="1" ry="1.5" fill="#ff7070" opacity="0.55"/>
  <rect x="21.5" y="6" width="1" height="3.5" fill="#5a3a1a"/>
  <ellipse cx="24" cy="6.5" rx="1.8" ry="0.9" transform="rotate(30 24 6.5)" fill="#3a8a3a" stroke="#1a4a1a" stroke-width="0.3"/>
</svg>`;

// ==================== 鸡腿 ====================
// 标志：椭圆肉 + 末端白骨

const chicken_small = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <g transform="rotate(-25 16 16)">
    <!-- 肉 -->
    <ellipse cx="14" cy="12" rx="8" ry="6.5" fill="#d4a060" stroke="#7a4520" stroke-width="0.9"/>
    <!-- 高光 -->
    <ellipse cx="11" cy="10" rx="3" ry="1.8" fill="#ecc080" opacity="0.7"/>
    <!-- 焦色点 -->
    <circle cx="15" cy="13" r="0.7" fill="#8a5020"/>
    <circle cx="12" cy="14" r="0.6" fill="#8a5020"/>
    <!-- 骨 -->
    <rect x="18" y="16" width="3" height="10" rx="1.5" fill="#f0e8d0" stroke="#a8956a" stroke-width="0.5"/>
    <!-- 骨关节 -->
    <ellipse cx="19.5" cy="26" rx="2" ry="1.3" fill="#f0e8d0" stroke="#a8956a" stroke-width="0.5"/>
  </g>
</svg>`;

const chicken_medium = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <g transform="rotate(-30 16 16)">
    <!-- 肉 -->
    <ellipse cx="13" cy="11" rx="9" ry="7" fill="#d4a060" stroke="#7a4520" stroke-width="1"/>
    <!-- 高光 -->
    <ellipse cx="9" cy="8" rx="3.5" ry="2" fill="#ecc080" opacity="0.7"/>
    <!-- 焦色纹理 -->
    <circle cx="14" cy="12" r="0.8" fill="#8a5020"/>
    <circle cx="11" cy="13" r="0.7" fill="#8a5020"/>
    <circle cx="16" cy="14" r="0.6" fill="#8a5020"/>
    <circle cx="12" cy="10" r="0.5" fill="#8a5020"/>
    <!-- 骨 -->
    <rect x="17" y="16" width="3.2" height="11" rx="1.5" fill="#f0e8d0" stroke="#a8956a" stroke-width="0.6"/>
    <!-- 骨阴影 -->
    <rect x="18" y="17" width="1" height="9" fill="#d8cfb0" opacity="0.6"/>
    <!-- 骨关节 -->
    <ellipse cx="18.6" cy="27" rx="2.3" ry="1.5" fill="#f0e8d0" stroke="#a8956a" stroke-width="0.6"/>
  </g>
</svg>`;

const chicken_large = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- 鸡腿 1（大，左下） -->
  <g transform="rotate(-30 12 18)">
    <ellipse cx="10" cy="15" rx="8" ry="6" fill="#c98a4a" stroke="#6a3818" stroke-width="0.9"/>
    <ellipse cx="7" cy="13" rx="2.8" ry="1.5" fill="#e0a868" opacity="0.7"/>
    <circle cx="11" cy="16" r="0.7" fill="#7a4020"/>
    <circle cx="9" cy="17" r="0.6" fill="#7a4020"/>
    <rect x="14" y="19" width="2.8" height="9" rx="1.3" fill="#f0e8d0" stroke="#a8956a" stroke-width="0.5"/>
    <ellipse cx="15.4" cy="28" rx="2" ry="1.3" fill="#f0e8d0" stroke="#a8956a" stroke-width="0.5"/>
  </g>
  <!-- 鸡腿 2（小，右上） -->
  <g transform="rotate(20 24 8)">
    <ellipse cx="24" cy="9" rx="5.5" ry="4" fill="#d4a060" stroke="#7a4520" stroke-width="0.8"/>
    <ellipse cx="22" cy="8" rx="2" ry="1" fill="#ecc080" opacity="0.7"/>
    <circle cx="25" cy="10" r="0.5" fill="#8a5020"/>
    <rect x="26.5" y="11" width="2" height="6" rx="1" fill="#f0e8d0" stroke="#a8956a" stroke-width="0.4"/>
    <ellipse cx="27.5" cy="17" rx="1.5" ry="1" fill="#f0e8d0" stroke="#a8956a" stroke-width="0.4"/>
  </g>
</svg>`;

// ==================== 面包 ====================
// 标志：椭圆面包 + 顶部 3 道斜切痕

const bread_small = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- 面包身（椭圆） -->
  <ellipse cx="16" cy="18" rx="11" ry="7" fill="#e8c888" stroke="#a88040" stroke-width="0.9"/>
  <!-- 高光 -->
  <ellipse cx="13" cy="14" rx="4" ry="1.5" fill="#f5d8a0" opacity="0.7"/>
  <!-- 切痕（3 道） -->
  <path d="M11,14 L13,12" stroke="#a88040" stroke-width="0.7" fill="none"/>
  <path d="M16,13 L18,11" stroke="#a88040" stroke-width="0.7" fill="none"/>
  <path d="M21,14 L23,12" stroke="#a88040" stroke-width="0.7" fill="none"/>
  <!-- 芝麻 -->
  <circle cx="12" cy="17" r="0.4" fill="#8a5a20"/>
  <circle cx="18" cy="18" r="0.4" fill="#8a5a20"/>
</svg>`;

const bread_medium = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <ellipse cx="16" cy="18" rx="12" ry="8" fill="#e8c888" stroke="#a88040" stroke-width="1"/>
  <ellipse cx="12" cy="14" rx="5" ry="2" fill="#f5d8a0" opacity="0.7"/>
  <!-- 切痕（3 道斜线） -->
  <path d="M9,13.5 L12,11" stroke="#7a5820" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  <path d="M15,12.5 L18,10" stroke="#7a5820" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  <path d="M21,13.5 L24,11" stroke="#7a5820" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  <!-- 芝麻 -->
  <ellipse cx="11" cy="17" rx="0.5" ry="0.3" fill="#8a5a20"/>
  <ellipse cx="15" cy="19" rx="0.5" ry="0.3" fill="#8a5a20"/>
  <ellipse cx="20" cy="17" rx="0.5" ry="0.3" fill="#8a5a20"/>
  <ellipse cx="22" cy="20" rx="0.5" ry="0.3" fill="#8a5a20"/>
  <!-- 边缘焦色 -->
  <path d="M5,18 C5,15 8,12 16,12 C24,12 27,15 27,18" stroke="#a88040" stroke-width="0.5" fill="none" opacity="0.5"/>
</svg>`;

const bread_large = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- 长棍（前） -->
  <ellipse cx="10" cy="20" rx="9" ry="5" fill="#e8c888" stroke="#a88040" stroke-width="0.9"/>
  <ellipse cx="7" cy="18" rx="3" ry="1" fill="#f5d8a0" opacity="0.7"/>
  <path d="M5,17 L7,15.5" stroke="#7a5820" stroke-width="0.6" fill="none" stroke-linecap="round"/>
  <path d="M9,16.5 L11,15" stroke="#7a5820" stroke-width="0.6" fill="none" stroke-linecap="round"/>
  <path d="M13,17 L15,15.5" stroke="#7a5820" stroke-width="0.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="8" cy="20" rx="0.4" ry="0.25" fill="#8a5a20"/>
  <ellipse cx="12" cy="21" rx="0.4" ry="0.25" fill="#8a5a20"/>
  <!-- 圆面包（后右上） -->
  <ellipse cx="24" cy="11" rx="6" ry="5" fill="#d8b070" stroke="#a88040" stroke-width="0.8"/>
  <ellipse cx="22" cy="9" rx="2" ry="0.8" fill="#ecc080" opacity="0.7"/>
  <path d="M21,9 L23,7.5" stroke="#7a5820" stroke-width="0.5" fill="none" stroke-linecap="round"/>
  <path d="M25,9 L27,7.5" stroke="#7a5820" stroke-width="0.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="23" cy="11" rx="0.3" ry="0.2" fill="#8a5a20"/>
  <ellipse cx="26" cy="12" rx="0.3" ry="0.2" fill="#8a5a20"/>
</svg>`;

// ==================== 浆果 ====================
// 标志：多颗圆果成簇 + 茎连接 + 顶部叶

const berry_small = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- 茎 -->
  <path d="M16,5 L13,12 L8,16" stroke="#3a6a20" stroke-width="1" fill="none"/>
  <path d="M16,5 L19,12 L24,16" stroke="#3a6a20" stroke-width="1" fill="none"/>
  <!-- 浆果 1 (左下) -->
  <circle cx="8" cy="18" r="5" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.7"/>
  <ellipse cx="6" cy="16" rx="1.5" ry="1" fill="#b070d0" opacity="0.6"/>
  <!-- 浆果 2 (右下) -->
  <circle cx="24" cy="18" r="5" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.7"/>
  <ellipse cx="22" cy="16" rx="1.5" ry="1" fill="#b070d0" opacity="0.6"/>
  <!-- 浆果 3 (顶部) -->
  <circle cx="16" cy="12" r="3" fill="#7a2a9a" stroke="#3a0a4a" stroke-width="0.6"/>
  <ellipse cx="15" cy="11" rx="0.8" ry="0.5" fill="#b070d0" opacity="0.6"/>
  <!-- 叶 -->
  <ellipse cx="16" cy="4" rx="3" ry="1.2" fill="#3a8a3a" stroke="#1a4a1a" stroke-width="0.3"/>
</svg>`;

const berry_medium = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- 茎 -->
  <path d="M16,3 L10,15 M16,3 L22,15 M16,3 L16,15" stroke="#3a6a20" stroke-width="1" fill="none"/>
  <!-- 浆果（左下） -->
  <circle cx="9" cy="19" r="5" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.7"/>
  <ellipse cx="7" cy="17" rx="1.8" ry="1.2" fill="#b070d0" opacity="0.6"/>
  <!-- 浆果（右下） -->
  <circle cx="23" cy="19" r="5" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.7"/>
  <ellipse cx="21" cy="17" rx="1.8" ry="1.2" fill="#b070d0" opacity="0.6"/>
  <!-- 浆果（中下） -->
  <circle cx="16" cy="22" r="4" fill="#7a2a9a" stroke="#3a0a4a" stroke-width="0.6"/>
  <ellipse cx="14.5" cy="20.5" rx="1.4" ry="0.9" fill="#b070d0" opacity="0.6"/>
  <!-- 浆果（顶部） -->
  <circle cx="16" cy="13" r="3" fill="#8a3aaa" stroke="#3a0a4a" stroke-width="0.5"/>
  <ellipse cx="15" cy="12" rx="0.8" ry="0.5" fill="#b070d0" opacity="0.6"/>
  <!-- 叶 -->
  <ellipse cx="16" cy="3" rx="4" ry="1.5" fill="#3a8a3a" stroke="#1a4a1a" stroke-width="0.3"/>
  <line x1="16" y1="3" x2="13" y2="4" stroke="#1a4a1a" stroke-width="0.3"/>
</svg>`;

const berry_large = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- 茎网 -->
  <path d="M16,3 L8,12 L4,20 M16,3 L12,15 L10,25 M16,3 L16,15 L18,26 M16,3 L20,15 L24,24 M16,3 L24,12 L28,20"
        stroke="#3a6a20" stroke-width="0.9" fill="none"/>
  <!-- 浆果 6 颗 -->
  <circle cx="4" cy="22" r="4" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.7"/>
  <ellipse cx="2.5" cy="20.5" rx="1.2" ry="0.8" fill="#b070d0" opacity="0.6"/>
  <circle cx="10" cy="27" r="4.5" fill="#7a2a9a" stroke="#3a0a4a" stroke-width="0.7"/>
  <ellipse cx="8.5" cy="25.5" rx="1.4" ry="1" fill="#b070d0" opacity="0.6"/>
  <circle cx="18" cy="28" r="4.5" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.7"/>
  <ellipse cx="16.5" cy="26.5" rx="1.4" ry="1" fill="#b070d0" opacity="0.6"/>
  <circle cx="25" cy="26" r="4" fill="#7a2a9a" stroke="#3a0a4a" stroke-width="0.7"/>
  <ellipse cx="23.5" cy="24.5" rx="1.2" ry="0.8" fill="#b070d0" opacity="0.6"/>
  <circle cx="28" cy="22" r="3.5" fill="#6a1a8a" stroke="#3a0a4a" stroke-width="0.6"/>
  <ellipse cx="27" cy="21" rx="1" ry="0.7" fill="#b070d0" opacity="0.6"/>
  <circle cx="16" cy="14" r="3" fill="#8a3aaa" stroke="#3a0a4a" stroke-width="0.5"/>
  <ellipse cx="15" cy="13" rx="0.8" ry="0.5" fill="#b070d0" opacity="0.6"/>
  <!-- 顶部叶簇 -->
  <ellipse cx="13" cy="3" rx="3.5" ry="1.3" transform="rotate(-25 13 3)" fill="#3a8a3a" stroke="#1a4a1a" stroke-width="0.3"/>
  <ellipse cx="19" cy="3" rx="3.5" ry="1.3" transform="rotate(25 19 3)" fill="#3a8a3a" stroke="#1a4a1a" stroke-width="0.3"/>
</svg>`;

export const FOOD_SPRITES: Record<FoodType, Record<FoodSize, string>> = {
  0: { small: chicken_small, medium: chicken_medium, large: chicken_large },
  1: { small: apple_small, medium: apple_medium, large: apple_large },
  2: { small: bread_small, medium: bread_medium, large: bread_large },
  3: { small: berry_small, medium: berry_medium, large: berry_large },
};
