// NestOverlay - 蚁窝装饰元素 SVG

// 蚁窝外圈光晕（在蚁群色环之外的脉冲光）
export const NEST_GLOW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="-30 -30 60 60">
  <circle cx="0" cy="0" r="26" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>
  <circle cx="0" cy="0" r="24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>
</svg>`;

// 顶部小草（3 株）
export const NEST_GRASS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <path d="M2,18 Q4,8 6,18" stroke="#3a5a20" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <path d="M14,16 Q16,6 18,16" stroke="#3a5a20" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <path d="M8,14 Q10,4 12,14" stroke="#3a5a20" stroke-width="1.4" fill="none" stroke-linecap="round"/>
</svg>`;

// 蚁道（从蚁窝向外的磨损路径）
export const NEST_TRAIL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="8" viewBox="0 0 20 8">
  <path d="M0,4 Q5,2 10,4 T20,4" stroke="#5a4020" stroke-width="2.5" fill="none" opacity="0.5"/>
  <path d="M0,4 Q5,2 10,4 T20,4" stroke="#7a5020" stroke-width="1" fill="none" opacity="0.7"/>
</svg>`;
