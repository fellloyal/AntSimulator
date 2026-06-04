// WornPath - 磨损土路 SVG 和阈值常量

export const WEAR_THRESHOLD = 0.3; // wearLevel > 0.3 触发土路渲染

// 磨损土路：草地变土路，保留少量草
export const WORN_PATH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
  <rect width="14" height="14" fill="#5a4a30"/>
  <path d="M2,12 L4,5" stroke="#3a5a20" stroke-width="0.3" fill="none" stroke-linecap="round" opacity="0.4"/>
  <path d="M8,12 L7,3" stroke="#3a5a20" stroke-width="0.3" fill="none" stroke-linecap="round" opacity="0.4"/>
  <circle cx="3" cy="3" r="0.3" fill="#6a9a40" opacity="0.3"/>
  <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.3"/>
</svg>`;
