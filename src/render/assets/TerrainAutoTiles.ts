// TerrainAutoTiles - 24-tile 自动地形过渡的 SVG 资源
// 由 scripts/generate-terrain-tiles.mjs 自动生成，请勿手工编辑
// 共 4 地形 × (16 边变体 + 4 角点×2 variant) = 80 张

import type { TerrainType } from './TerrainTiles';
import type { Corner, CornerVariant } from '../TerrainAdjacency';

export type TerrainId = 'grass' | 'sand' | 'water' | 'rock';

// 边变体：4 地形 × 16 掩码 = 64 张
export const TERRAIN_AUTO_EDGE: Record<TerrainType, Record<number, string>> = {
  0: {
    0: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/>
          <rect x="0" y="0" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,9 Q2,0 4,9 Q6,0 8,9 Q10,0 12,9 Q14,0 16,9 Q18,0 20,9 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,9 Q2.5,1 3,9 M7,9 Q7.5,1 8,9 M12,9 Q12.5,1 13,9 M17,9 Q17.5,1 18,9" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,5 L1,2 M6,5 L6,2 M11,5 L11,2 M16,5 L16,2" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <rect x="0" y="11" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,11 Q2,20 4,11 Q6,20 8,11 Q10,20 12,11 Q14,20 16,11 Q18,20 20,11 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,11 Q2.5,19 3,11 M7,11 Q7.5,19 8,11 M12,11 Q12.5,19 13,11 M17,11 Q17.5,19 18,11" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,15 L1,18 M6,15 L6,18 M11,15 L11,18 M16,15 L16,18" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <rect x="0" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
          <path d="M9,0 Q0,2 9,4 Q0,6 9,8 Q0,10 9,12 Q0,14 9,16 Q0,18 9,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M9,2 Q1,2.5 9,3 M9,7 Q1,7.5 9,8 M9,12 Q1,12.5 9,13 M9,17 Q1,17.5 9,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M5,1 L2,1 M5,6 L2,6 M5,11 L2,11 M5,16 L2,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <rect x="11" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
        <path d="M11,0 Q20,2 11,4 Q20,6 11,8 Q20,10 11,12 Q20,14 11,16 Q20,18 11,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
        <path d="M11,2 Q19,2.5 11,3 M11,7 Q19,7.5 11,8 M11,12 Q19,12.5 11,13 M11,17 Q19,17.5 11,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
        <path d="M15,1 L18,1 M15,6 L18,6 M15,11 L18,11 M15,16 L18,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    1: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/>
          <rect x="0" y="11" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,11 Q2,20 4,11 Q6,20 8,11 Q10,20 12,11 Q14,20 16,11 Q18,20 20,11 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,11 Q2.5,19 3,11 M7,11 Q7.5,19 8,11 M12,11 Q12.5,19 13,11 M17,11 Q17.5,19 18,11" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,15 L1,18 M6,15 L6,18 M11,15 L11,18 M16,15 L16,18" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <rect x="0" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
          <path d="M9,0 Q0,2 9,4 Q0,6 9,8 Q0,10 9,12 Q0,14 9,16 Q0,18 9,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M9,2 Q1,2.5 9,3 M9,7 Q1,7.5 9,8 M9,12 Q1,12.5 9,13 M9,17 Q1,17.5 9,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M5,1 L2,1 M5,6 L2,6 M5,11 L2,11 M5,16 L2,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <rect x="11" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
        <path d="M11,0 Q20,2 11,4 Q20,6 11,8 Q20,10 11,12 Q20,14 11,16 Q20,18 11,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
        <path d="M11,2 Q19,2.5 11,3 M11,7 Q19,7.5 11,8 M11,12 Q19,12.5 11,13 M11,17 Q19,17.5 11,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
        <path d="M15,1 L18,1 M15,6 L18,6 M15,11 L18,11 M15,16 L18,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/>
          <rect x="0" y="0" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,9 Q2,0 4,9 Q6,0 8,9 Q10,0 12,9 Q14,0 16,9 Q18,0 20,9 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,9 Q2.5,1 3,9 M7,9 Q7.5,1 8,9 M12,9 Q12.5,1 13,9 M17,9 Q17.5,1 18,9" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,5 L1,2 M6,5 L6,2 M11,5 L11,2 M16,5 L16,2" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <rect x="0" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
          <path d="M9,0 Q0,2 9,4 Q0,6 9,8 Q0,10 9,12 Q0,14 9,16 Q0,18 9,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M9,2 Q1,2.5 9,3 M9,7 Q1,7.5 9,8 M9,12 Q1,12.5 9,13 M9,17 Q1,17.5 9,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M5,1 L2,1 M5,6 L2,6 M5,11 L2,11 M5,16 L2,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <rect x="11" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
        <path d="M11,0 Q20,2 11,4 Q20,6 11,8 Q20,10 11,12 Q20,14 11,16 Q20,18 11,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
        <path d="M11,2 Q19,2.5 11,3 M11,7 Q19,7.5 11,8 M11,12 Q19,12.5 11,13 M11,17 Q19,17.5 11,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
        <path d="M15,1 L18,1 M15,6 L18,6 M15,11 L18,11 M15,16 L18,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    3: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/>
          <rect x="0" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
          <path d="M9,0 Q0,2 9,4 Q0,6 9,8 Q0,10 9,12 Q0,14 9,16 Q0,18 9,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M9,2 Q1,2.5 9,3 M9,7 Q1,7.5 9,8 M9,12 Q1,12.5 9,13 M9,17 Q1,17.5 9,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M5,1 L2,1 M5,6 L2,6 M5,11 L2,11 M5,16 L2,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <rect x="11" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
        <path d="M11,0 Q20,2 11,4 Q20,6 11,8 Q20,10 11,12 Q20,14 11,16 Q20,18 11,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
        <path d="M11,2 Q19,2.5 11,3 M11,7 Q19,7.5 11,8 M11,12 Q19,12.5 11,13 M11,17 Q19,17.5 11,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
        <path d="M15,1 L18,1 M15,6 L18,6 M15,11 L18,11 M15,16 L18,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    4: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/>
          <rect x="0" y="0" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,9 Q2,0 4,9 Q6,0 8,9 Q10,0 12,9 Q14,0 16,9 Q18,0 20,9 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,9 Q2.5,1 3,9 M7,9 Q7.5,1 8,9 M12,9 Q12.5,1 13,9 M17,9 Q17.5,1 18,9" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,5 L1,2 M6,5 L6,2 M11,5 L11,2 M16,5 L16,2" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <rect x="0" y="11" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,11 Q2,20 4,11 Q6,20 8,11 Q10,20 12,11 Q14,20 16,11 Q18,20 20,11 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,11 Q2.5,19 3,11 M7,11 Q7.5,19 8,11 M12,11 Q12.5,19 13,11 M17,11 Q17.5,19 18,11" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,15 L1,18 M6,15 L6,18 M11,15 L11,18 M16,15 L16,18" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <rect x="11" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
        <path d="M11,0 Q20,2 11,4 Q20,6 11,8 Q20,10 11,12 Q20,14 11,16 Q20,18 11,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
        <path d="M11,2 Q19,2.5 11,3 M11,7 Q19,7.5 11,8 M11,12 Q19,12.5 11,13 M11,17 Q19,17.5 11,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
        <path d="M15,1 L18,1 M15,6 L18,6 M15,11 L18,11 M15,16 L18,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    5: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/>
          <rect x="0" y="11" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,11 Q2,20 4,11 Q6,20 8,11 Q10,20 12,11 Q14,20 16,11 Q18,20 20,11 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,11 Q2.5,19 3,11 M7,11 Q7.5,19 8,11 M12,11 Q12.5,19 13,11 M17,11 Q17.5,19 18,11" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,15 L1,18 M6,15 L6,18 M11,15 L11,18 M16,15 L16,18" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <rect x="11" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
        <path d="M11,0 Q20,2 11,4 Q20,6 11,8 Q20,10 11,12 Q20,14 11,16 Q20,18 11,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
        <path d="M11,2 Q19,2.5 11,3 M11,7 Q19,7.5 11,8 M11,12 Q19,12.5 11,13 M11,17 Q19,17.5 11,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
        <path d="M15,1 L18,1 M15,6 L18,6 M15,11 L18,11 M15,16 L18,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    6: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/>
          <rect x="0" y="0" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,9 Q2,0 4,9 Q6,0 8,9 Q10,0 12,9 Q14,0 16,9 Q18,0 20,9 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,9 Q2.5,1 3,9 M7,9 Q7.5,1 8,9 M12,9 Q12.5,1 13,9 M17,9 Q17.5,1 18,9" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,5 L1,2 M6,5 L6,2 M11,5 L11,2 M16,5 L16,2" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <rect x="11" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
        <path d="M11,0 Q20,2 11,4 Q20,6 11,8 Q20,10 11,12 Q20,14 11,16 Q20,18 11,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
        <path d="M11,2 Q19,2.5 11,3 M11,7 Q19,7.5 11,8 M11,12 Q19,12.5 11,13 M11,17 Q19,17.5 11,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
        <path d="M15,1 L18,1 M15,6 L18,6 M15,11 L18,11 M15,16 L18,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    7: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/>
        <rect x="11" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
        <path d="M11,0 Q20,2 11,4 Q20,6 11,8 Q20,10 11,12 Q20,14 11,16 Q20,18 11,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
        <path d="M11,2 Q19,2.5 11,3 M11,7 Q19,7.5 11,8 M11,12 Q19,12.5 11,13 M11,17 Q19,17.5 11,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
        <path d="M15,1 L18,1 M15,6 L18,6 M15,11 L18,11 M15,16 L18,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    8: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/>
          <rect x="0" y="0" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,9 Q2,0 4,9 Q6,0 8,9 Q10,0 12,9 Q14,0 16,9 Q18,0 20,9 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,9 Q2.5,1 3,9 M7,9 Q7.5,1 8,9 M12,9 Q12.5,1 13,9 M17,9 Q17.5,1 18,9" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,5 L1,2 M6,5 L6,2 M11,5 L11,2 M16,5 L16,2" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <rect x="0" y="11" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,11 Q2,20 4,11 Q6,20 8,11 Q10,20 12,11 Q14,20 16,11 Q18,20 20,11 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,11 Q2.5,19 3,11 M7,11 Q7.5,19 8,11 M12,11 Q12.5,19 13,11 M17,11 Q17.5,19 18,11" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,15 L1,18 M6,15 L6,18 M11,15 L11,18 M16,15 L16,18" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <rect x="0" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
          <path d="M9,0 Q0,2 9,4 Q0,6 9,8 Q0,10 9,12 Q0,14 9,16 Q0,18 9,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M9,2 Q1,2.5 9,3 M9,7 Q1,7.5 9,8 M9,12 Q1,12.5 9,13 M9,17 Q1,17.5 9,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M5,1 L2,1 M5,6 L2,6 M5,11 L2,11 M5,16 L2,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    9: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/>
          <rect x="0" y="11" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,11 Q2,20 4,11 Q6,20 8,11 Q10,20 12,11 Q14,20 16,11 Q18,20 20,11 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,11 Q2.5,19 3,11 M7,11 Q7.5,19 8,11 M12,11 Q12.5,19 13,11 M17,11 Q17.5,19 18,11" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,15 L1,18 M6,15 L6,18 M11,15 L11,18 M16,15 L16,18" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <rect x="0" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
          <path d="M9,0 Q0,2 9,4 Q0,6 9,8 Q0,10 9,12 Q0,14 9,16 Q0,18 9,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M9,2 Q1,2.5 9,3 M9,7 Q1,7.5 9,8 M9,12 Q1,12.5 9,13 M9,17 Q1,17.5 9,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M5,1 L2,1 M5,6 L2,6 M5,11 L2,11 M5,16 L2,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    10: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/>
          <rect x="0" y="0" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,9 Q2,0 4,9 Q6,0 8,9 Q10,0 12,9 Q14,0 16,9 Q18,0 20,9 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,9 Q2.5,1 3,9 M7,9 Q7.5,1 8,9 M12,9 Q12.5,1 13,9 M17,9 Q17.5,1 18,9" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,5 L1,2 M6,5 L6,2 M11,5 L11,2 M16,5 L16,2" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <rect x="0" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
          <path d="M9,0 Q0,2 9,4 Q0,6 9,8 Q0,10 9,12 Q0,14 9,16 Q0,18 9,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M9,2 Q1,2.5 9,3 M9,7 Q1,7.5 9,8 M9,12 Q1,12.5 9,13 M9,17 Q1,17.5 9,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M5,1 L2,1 M5,6 L2,6 M5,11 L2,11 M5,16 L2,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    11: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/>
          <rect x="0" y="0" width="9" height="20" fill="#7ab045" opacity="0.7"/>
          <path d="M9,0 Q0,2 9,4 Q0,6 9,8 Q0,10 9,12 Q0,14 9,16 Q0,18 9,20 L10,20 L10,0 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M9,2 Q1,2.5 9,3 M9,7 Q1,7.5 9,8 M9,12 Q1,12.5 9,13 M9,17 Q1,17.5 9,18" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M5,1 L2,1 M5,6 L2,6 M5,11 L2,11 M5,16 L2,16" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    12: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/>
          <rect x="0" y="0" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,9 Q2,0 4,9 Q6,0 8,9 Q10,0 12,9 Q14,0 16,9 Q18,0 20,9 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,9 Q2.5,1 3,9 M7,9 Q7.5,1 8,9 M12,9 Q12.5,1 13,9 M17,9 Q17.5,1 18,9" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,5 L1,2 M6,5 L6,2 M11,5 L11,2 M16,5 L16,2" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <rect x="0" y="11" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,11 Q2,20 4,11 Q6,20 8,11 Q10,20 12,11 Q14,20 16,11 Q18,20 20,11 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,11 Q2.5,19 3,11 M7,11 Q7.5,19 8,11 M12,11 Q12.5,19 13,11 M17,11 Q17.5,19 18,11" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,15 L1,18 M6,15 L6,18 M11,15 L11,18 M16,15 L16,18" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    13: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/>
          <rect x="0" y="11" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,11 Q2,20 4,11 Q6,20 8,11 Q10,20 12,11 Q14,20 16,11 Q18,20 20,11 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,11 Q2.5,19 3,11 M7,11 Q7.5,19 8,11 M12,11 Q12.5,19 13,11 M17,11 Q17.5,19 18,11" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,15 L1,18 M6,15 L6,18 M11,15 L11,18 M16,15 L16,18" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    14: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/>
          <rect x="0" y="0" width="20" height="9" fill="#7ab045" opacity="0.7"/>
          <path d="M0,9 Q2,0 4,9 Q6,0 8,9 Q10,0 12,9 Q14,0 16,9 Q18,0 20,9 L20,10 L0,10 Z" fill="#7ab045" opacity="0.95"/>
          <path d="M2,9 Q2.5,1 3,9 M7,9 Q7.5,1 8,9 M12,9 Q12.5,1 13,9 M17,9 Q17.5,1 18,9" stroke="#9ad85a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,5 L1,2 M6,5 L6,2 M11,5 L11,2 M16,5 L16,2" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    15: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="#5a8a35" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="#9ad85a" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="#9ad85a" opacity="0.3"/></svg>`,
  },
  1: {
    0: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/>
          <circle cx="2" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="0.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="2" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="19.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="4" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="4" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="0.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="0.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="0.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/>
        <circle cx="16" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="16" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="19.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
        <circle cx="19.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
        <circle cx="19.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/></svg>`,
    1: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/>
          <circle cx="2" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="19.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="4" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="4" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="0.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="0.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="0.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/>
        <circle cx="16" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="16" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="19.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
        <circle cx="19.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
        <circle cx="19.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/></svg>`,
    2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/>
          <circle cx="2" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="0.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="4" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="4" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="0.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="0.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="0.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/>
        <circle cx="16" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="16" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="19.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
        <circle cx="19.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
        <circle cx="19.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/></svg>`,
    3: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/>
          <circle cx="4" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="4" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="0.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="0.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="0.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/>
        <circle cx="16" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="16" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="19.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
        <circle cx="19.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
        <circle cx="19.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/></svg>`,
    4: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/>
          <circle cx="2" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="0.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="2" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="19.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/>
        <circle cx="16" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="16" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="19.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
        <circle cx="19.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
        <circle cx="19.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/></svg>`,
    5: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/>
          <circle cx="2" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="19.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/>
        <circle cx="16" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="16" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="19.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
        <circle cx="19.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
        <circle cx="19.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/></svg>`,
    6: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/>
          <circle cx="2" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="0.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/>
        <circle cx="16" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="16" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="19.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
        <circle cx="19.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
        <circle cx="19.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/></svg>`,
    7: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/>
        <circle cx="16" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="16" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
        <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
        <circle cx="19.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
        <circle cx="19.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
        <circle cx="19.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/></svg>`,
    8: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/>
          <circle cx="2" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="0.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="2" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="19.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="4" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="4" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="0.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="0.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="0.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/></svg>`,
    9: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/>
          <circle cx="2" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="19.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="4" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="4" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="0.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="0.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="0.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/></svg>`,
    10: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/>
          <circle cx="2" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="0.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="4" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="4" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="0.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="0.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="0.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/></svg>`,
    11: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/>
          <circle cx="4" cy="2" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="7" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="4" cy="12" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="3" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="0.5" cy="10" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="0.5" cy="5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="0.5" cy="15" r="1.2" fill="#e8c890" opacity="0.85"/></svg>`,
    12: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/>
          <circle cx="2" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="0.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="2" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="19.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/></svg>`,
    13: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/>
          <circle cx="2" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="16" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="17" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="19.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="19.5" r="1.2" fill="#e8c890" opacity="0.85"/></svg>`,
    14: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/>
          <circle cx="2" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="7" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="12" cy="4" r="3.5" fill="#d4ad6a" opacity="0.85"/>
          <circle cx="17" cy="3" r="3" fill="#d4ad6a" opacity="0.8"/>
          <circle cx="10" cy="0.5" r="1.5" fill="#e8c890" opacity="0.9"/>
          <circle cx="5" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/>
          <circle cx="15" cy="0.5" r="1.2" fill="#e8c890" opacity="0.85"/></svg>`,
    15: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#d4ad6a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#e8c890" opacity="0.5"/></svg>`,
  },
  2: {
    0: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/>
          <rect x="0" y="0" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,5 L20,5 L20,9 L0,9 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,3 Q4,0 8,3 T16,3 T20,3" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,7 Q5,5 10,7 T20,7" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="2" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="1.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="2" r="1" fill="#d8e8f8" opacity="1"/>
          <rect x="0" y="16" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,11 L20,11 L20,15 L0,15 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,17 Q4,20 8,17 T16,17 T20,17" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,13 Q5,15 10,13 T20,13" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="18" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="18.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="18" r="1" fill="#d8e8f8" opacity="1"/>
          <rect x="0" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
          <path d="M5,0 L9,0 L9,20 L5,20 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M3,0 Q0,4 3,8 T3,16 T3,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M7,0 Q5,5 7,10 T7,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="2" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="1.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="2" cy="17" r="1" fill="#d8e8f8" opacity="1"/>
        <rect x="16" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
        <path d="M11,0 L15,0 L15,20 L11,20 Z" fill="#a8c0e0" opacity="0.85"/>
        <path d="M17,0 Q20,4 17,8 T17,16 T17,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
        <path d="M13,0 Q15,5 13,10 T13,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
        <circle cx="18" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
        <circle cx="18.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
        <circle cx="18" cy="17" r="1" fill="#d8e8f8" opacity="1"/></svg>`,
    1: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/>
          <rect x="0" y="16" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,11 L20,11 L20,15 L0,15 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,17 Q4,20 8,17 T16,17 T20,17" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,13 Q5,15 10,13 T20,13" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="18" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="18.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="18" r="1" fill="#d8e8f8" opacity="1"/>
          <rect x="0" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
          <path d="M5,0 L9,0 L9,20 L5,20 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M3,0 Q0,4 3,8 T3,16 T3,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M7,0 Q5,5 7,10 T7,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="2" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="1.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="2" cy="17" r="1" fill="#d8e8f8" opacity="1"/>
        <rect x="16" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
        <path d="M11,0 L15,0 L15,20 L11,20 Z" fill="#a8c0e0" opacity="0.85"/>
        <path d="M17,0 Q20,4 17,8 T17,16 T17,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
        <path d="M13,0 Q15,5 13,10 T13,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
        <circle cx="18" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
        <circle cx="18.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
        <circle cx="18" cy="17" r="1" fill="#d8e8f8" opacity="1"/></svg>`,
    2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/>
          <rect x="0" y="0" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,5 L20,5 L20,9 L0,9 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,3 Q4,0 8,3 T16,3 T20,3" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,7 Q5,5 10,7 T20,7" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="2" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="1.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="2" r="1" fill="#d8e8f8" opacity="1"/>
          <rect x="0" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
          <path d="M5,0 L9,0 L9,20 L5,20 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M3,0 Q0,4 3,8 T3,16 T3,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M7,0 Q5,5 7,10 T7,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="2" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="1.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="2" cy="17" r="1" fill="#d8e8f8" opacity="1"/>
        <rect x="16" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
        <path d="M11,0 L15,0 L15,20 L11,20 Z" fill="#a8c0e0" opacity="0.85"/>
        <path d="M17,0 Q20,4 17,8 T17,16 T17,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
        <path d="M13,0 Q15,5 13,10 T13,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
        <circle cx="18" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
        <circle cx="18.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
        <circle cx="18" cy="17" r="1" fill="#d8e8f8" opacity="1"/></svg>`,
    3: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/>
          <rect x="0" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
          <path d="M5,0 L9,0 L9,20 L5,20 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M3,0 Q0,4 3,8 T3,16 T3,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M7,0 Q5,5 7,10 T7,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="2" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="1.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="2" cy="17" r="1" fill="#d8e8f8" opacity="1"/>
        <rect x="16" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
        <path d="M11,0 L15,0 L15,20 L11,20 Z" fill="#a8c0e0" opacity="0.85"/>
        <path d="M17,0 Q20,4 17,8 T17,16 T17,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
        <path d="M13,0 Q15,5 13,10 T13,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
        <circle cx="18" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
        <circle cx="18.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
        <circle cx="18" cy="17" r="1" fill="#d8e8f8" opacity="1"/></svg>`,
    4: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/>
          <rect x="0" y="0" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,5 L20,5 L20,9 L0,9 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,3 Q4,0 8,3 T16,3 T20,3" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,7 Q5,5 10,7 T20,7" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="2" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="1.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="2" r="1" fill="#d8e8f8" opacity="1"/>
          <rect x="0" y="16" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,11 L20,11 L20,15 L0,15 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,17 Q4,20 8,17 T16,17 T20,17" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,13 Q5,15 10,13 T20,13" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="18" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="18.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="18" r="1" fill="#d8e8f8" opacity="1"/>
        <rect x="16" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
        <path d="M11,0 L15,0 L15,20 L11,20 Z" fill="#a8c0e0" opacity="0.85"/>
        <path d="M17,0 Q20,4 17,8 T17,16 T17,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
        <path d="M13,0 Q15,5 13,10 T13,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
        <circle cx="18" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
        <circle cx="18.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
        <circle cx="18" cy="17" r="1" fill="#d8e8f8" opacity="1"/></svg>`,
    5: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/>
          <rect x="0" y="16" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,11 L20,11 L20,15 L0,15 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,17 Q4,20 8,17 T16,17 T20,17" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,13 Q5,15 10,13 T20,13" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="18" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="18.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="18" r="1" fill="#d8e8f8" opacity="1"/>
        <rect x="16" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
        <path d="M11,0 L15,0 L15,20 L11,20 Z" fill="#a8c0e0" opacity="0.85"/>
        <path d="M17,0 Q20,4 17,8 T17,16 T17,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
        <path d="M13,0 Q15,5 13,10 T13,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
        <circle cx="18" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
        <circle cx="18.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
        <circle cx="18" cy="17" r="1" fill="#d8e8f8" opacity="1"/></svg>`,
    6: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/>
          <rect x="0" y="0" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,5 L20,5 L20,9 L0,9 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,3 Q4,0 8,3 T16,3 T20,3" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,7 Q5,5 10,7 T20,7" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="2" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="1.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="2" r="1" fill="#d8e8f8" opacity="1"/>
        <rect x="16" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
        <path d="M11,0 L15,0 L15,20 L11,20 Z" fill="#a8c0e0" opacity="0.85"/>
        <path d="M17,0 Q20,4 17,8 T17,16 T17,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
        <path d="M13,0 Q15,5 13,10 T13,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
        <circle cx="18" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
        <circle cx="18.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
        <circle cx="18" cy="17" r="1" fill="#d8e8f8" opacity="1"/></svg>`,
    7: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/>
        <rect x="16" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
        <path d="M11,0 L15,0 L15,20 L11,20 Z" fill="#a8c0e0" opacity="0.85"/>
        <path d="M17,0 Q20,4 17,8 T17,16 T17,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
        <path d="M13,0 Q15,5 13,10 T13,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
        <circle cx="18" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
        <circle cx="18.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
        <circle cx="18" cy="17" r="1" fill="#d8e8f8" opacity="1"/></svg>`,
    8: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/>
          <rect x="0" y="0" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,5 L20,5 L20,9 L0,9 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,3 Q4,0 8,3 T16,3 T20,3" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,7 Q5,5 10,7 T20,7" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="2" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="1.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="2" r="1" fill="#d8e8f8" opacity="1"/>
          <rect x="0" y="16" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,11 L20,11 L20,15 L0,15 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,17 Q4,20 8,17 T16,17 T20,17" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,13 Q5,15 10,13 T20,13" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="18" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="18.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="18" r="1" fill="#d8e8f8" opacity="1"/>
          <rect x="0" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
          <path d="M5,0 L9,0 L9,20 L5,20 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M3,0 Q0,4 3,8 T3,16 T3,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M7,0 Q5,5 7,10 T7,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="2" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="1.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="2" cy="17" r="1" fill="#d8e8f8" opacity="1"/></svg>`,
    9: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/>
          <rect x="0" y="16" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,11 L20,11 L20,15 L0,15 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,17 Q4,20 8,17 T16,17 T20,17" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,13 Q5,15 10,13 T20,13" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="18" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="18.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="18" r="1" fill="#d8e8f8" opacity="1"/>
          <rect x="0" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
          <path d="M5,0 L9,0 L9,20 L5,20 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M3,0 Q0,4 3,8 T3,16 T3,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M7,0 Q5,5 7,10 T7,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="2" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="1.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="2" cy="17" r="1" fill="#d8e8f8" opacity="1"/></svg>`,
    10: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/>
          <rect x="0" y="0" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,5 L20,5 L20,9 L0,9 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,3 Q4,0 8,3 T16,3 T20,3" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,7 Q5,5 10,7 T20,7" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="2" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="1.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="2" r="1" fill="#d8e8f8" opacity="1"/>
          <rect x="0" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
          <path d="M5,0 L9,0 L9,20 L5,20 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M3,0 Q0,4 3,8 T3,16 T3,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M7,0 Q5,5 7,10 T7,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="2" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="1.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="2" cy="17" r="1" fill="#d8e8f8" opacity="1"/></svg>`,
    11: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/>
          <rect x="0" y="0" width="4" height="20" fill="#d8e8f8" opacity="0.7"/>
          <path d="M5,0 L9,0 L9,20 L5,20 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M3,0 Q0,4 3,8 T3,16 T3,20" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M7,0 Q5,5 7,10 T7,20" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="2" cy="3" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="1.5" cy="10" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="2" cy="17" r="1" fill="#d8e8f8" opacity="1"/></svg>`,
    12: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/>
          <rect x="0" y="0" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,5 L20,5 L20,9 L0,9 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,3 Q4,0 8,3 T16,3 T20,3" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,7 Q5,5 10,7 T20,7" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="2" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="1.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="2" r="1" fill="#d8e8f8" opacity="1"/>
          <rect x="0" y="16" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,11 L20,11 L20,15 L0,15 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,17 Q4,20 8,17 T16,17 T20,17" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,13 Q5,15 10,13 T20,13" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="18" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="18.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="18" r="1" fill="#d8e8f8" opacity="1"/></svg>`,
    13: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/>
          <rect x="0" y="16" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,11 L20,11 L20,15 L0,15 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,17 Q4,20 8,17 T16,17 T20,17" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,13 Q5,15 10,13 T20,13" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="18" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="18.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="18" r="1" fill="#d8e8f8" opacity="1"/></svg>`,
    14: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/>
          <rect x="0" y="0" width="20" height="4" fill="#d8e8f8" opacity="0.7"/>
          <path d="M0,5 L20,5 L20,9 L0,9 Z" fill="#a8c0e0" opacity="0.85"/>
          <path d="M0,3 Q4,0 8,3 T16,3 T20,3" stroke="#d8e8f8" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,7 Q5,5 10,7 T20,7" stroke="#d8e8f8" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="2" r="1" fill="#d8e8f8" opacity="1"/>
          <circle cx="10" cy="1.5" r="0.8" fill="#d8e8f8" opacity="1"/>
          <circle cx="17" cy="2" r="1" fill="#d8e8f8" opacity="1"/></svg>`,
    15: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M6,10 Q10,9 14,10" stroke="#a8c0e0" stroke-width="0.3" fill="none" opacity="0.5"/></svg>`,
  },
  3: {
    0: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,8 3,0 7,1 8,3 6,9 1,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 11,0 15,1 16,3 14,9 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,8 19,0 20,1 20,3 18,9 17,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,2 L4,1 M11,2 L12,1 M18,2 L19,1" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,7 L20,7" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
          <polygon points="0,12 3,20 7,19 8,17 6,11 1,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,12 11,20 15,19 16,17 14,11 9,11" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,12 19,20 20,19 20,17 18,11 17,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,18 L4,19 M11,18 L12,19 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,13 L20,13" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
          <polygon points="8,0 0,3 1,7 3,8 9,6 9,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 0,11 1,15 3,16 9,14 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,16 0,19 1,20 3,20 9,18 9,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M2,3 L1,4 M2,11 L1,12 M2,18 L1,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M7,0 L7,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
        <polygon points="12,0 20,3 19,7 17,8 11,6 11,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,8 20,11 19,15 17,16 11,14 11,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,16 20,19 19,20 17,20 11,18 11,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <path d="M18,3 L19,4 M18,11 L19,12 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
        <path d="M13,0 L13,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/></svg>`,
    1: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,12 3,20 7,19 8,17 6,11 1,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,12 11,20 15,19 16,17 14,11 9,11" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,12 19,20 20,19 20,17 18,11 17,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,18 L4,19 M11,18 L12,19 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,13 L20,13" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
          <polygon points="8,0 0,3 1,7 3,8 9,6 9,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 0,11 1,15 3,16 9,14 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,16 0,19 1,20 3,20 9,18 9,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M2,3 L1,4 M2,11 L1,12 M2,18 L1,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M7,0 L7,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
        <polygon points="12,0 20,3 19,7 17,8 11,6 11,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,8 20,11 19,15 17,16 11,14 11,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,16 20,19 19,20 17,20 11,18 11,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <path d="M18,3 L19,4 M18,11 L19,12 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
        <path d="M13,0 L13,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/></svg>`,
    2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,8 3,0 7,1 8,3 6,9 1,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 11,0 15,1 16,3 14,9 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,8 19,0 20,1 20,3 18,9 17,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,2 L4,1 M11,2 L12,1 M18,2 L19,1" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,7 L20,7" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
          <polygon points="8,0 0,3 1,7 3,8 9,6 9,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 0,11 1,15 3,16 9,14 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,16 0,19 1,20 3,20 9,18 9,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M2,3 L1,4 M2,11 L1,12 M2,18 L1,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M7,0 L7,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
        <polygon points="12,0 20,3 19,7 17,8 11,6 11,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,8 20,11 19,15 17,16 11,14 11,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,16 20,19 19,20 17,20 11,18 11,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <path d="M18,3 L19,4 M18,11 L19,12 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
        <path d="M13,0 L13,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/></svg>`,
    3: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="8,0 0,3 1,7 3,8 9,6 9,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 0,11 1,15 3,16 9,14 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,16 0,19 1,20 3,20 9,18 9,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M2,3 L1,4 M2,11 L1,12 M2,18 L1,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M7,0 L7,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
        <polygon points="12,0 20,3 19,7 17,8 11,6 11,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,8 20,11 19,15 17,16 11,14 11,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,16 20,19 19,20 17,20 11,18 11,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <path d="M18,3 L19,4 M18,11 L19,12 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
        <path d="M13,0 L13,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/></svg>`,
    4: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,8 3,0 7,1 8,3 6,9 1,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 11,0 15,1 16,3 14,9 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,8 19,0 20,1 20,3 18,9 17,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,2 L4,1 M11,2 L12,1 M18,2 L19,1" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,7 L20,7" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
          <polygon points="0,12 3,20 7,19 8,17 6,11 1,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,12 11,20 15,19 16,17 14,11 9,11" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,12 19,20 20,19 20,17 18,11 17,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,18 L4,19 M11,18 L12,19 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,13 L20,13" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
        <polygon points="12,0 20,3 19,7 17,8 11,6 11,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,8 20,11 19,15 17,16 11,14 11,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,16 20,19 19,20 17,20 11,18 11,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <path d="M18,3 L19,4 M18,11 L19,12 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
        <path d="M13,0 L13,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/></svg>`,
    5: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,12 3,20 7,19 8,17 6,11 1,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,12 11,20 15,19 16,17 14,11 9,11" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,12 19,20 20,19 20,17 18,11 17,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,18 L4,19 M11,18 L12,19 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,13 L20,13" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
        <polygon points="12,0 20,3 19,7 17,8 11,6 11,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,8 20,11 19,15 17,16 11,14 11,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,16 20,19 19,20 17,20 11,18 11,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <path d="M18,3 L19,4 M18,11 L19,12 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
        <path d="M13,0 L13,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/></svg>`,
    6: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,8 3,0 7,1 8,3 6,9 1,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 11,0 15,1 16,3 14,9 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,8 19,0 20,1 20,3 18,9 17,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,2 L4,1 M11,2 L12,1 M18,2 L19,1" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,7 L20,7" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
        <polygon points="12,0 20,3 19,7 17,8 11,6 11,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,8 20,11 19,15 17,16 11,14 11,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,16 20,19 19,20 17,20 11,18 11,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <path d="M18,3 L19,4 M18,11 L19,12 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
        <path d="M13,0 L13,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/></svg>`,
    7: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="12,0 20,3 19,7 17,8 11,6 11,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,8 20,11 19,15 17,16 11,14 11,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <polygon points="12,16 20,19 19,20 17,20 11,18 11,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
        <path d="M18,3 L19,4 M18,11 L19,12 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
        <path d="M13,0 L13,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/></svg>`,
    8: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,8 3,0 7,1 8,3 6,9 1,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 11,0 15,1 16,3 14,9 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,8 19,0 20,1 20,3 18,9 17,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,2 L4,1 M11,2 L12,1 M18,2 L19,1" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,7 L20,7" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
          <polygon points="0,12 3,20 7,19 8,17 6,11 1,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,12 11,20 15,19 16,17 14,11 9,11" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,12 19,20 20,19 20,17 18,11 17,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,18 L4,19 M11,18 L12,19 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,13 L20,13" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
          <polygon points="8,0 0,3 1,7 3,8 9,6 9,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 0,11 1,15 3,16 9,14 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,16 0,19 1,20 3,20 9,18 9,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M2,3 L1,4 M2,11 L1,12 M2,18 L1,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M7,0 L7,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/></svg>`,
    9: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,12 3,20 7,19 8,17 6,11 1,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,12 11,20 15,19 16,17 14,11 9,11" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,12 19,20 20,19 20,17 18,11 17,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,18 L4,19 M11,18 L12,19 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,13 L20,13" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
          <polygon points="8,0 0,3 1,7 3,8 9,6 9,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 0,11 1,15 3,16 9,14 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,16 0,19 1,20 3,20 9,18 9,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M2,3 L1,4 M2,11 L1,12 M2,18 L1,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M7,0 L7,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/></svg>`,
    10: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,8 3,0 7,1 8,3 6,9 1,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 11,0 15,1 16,3 14,9 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,8 19,0 20,1 20,3 18,9 17,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,2 L4,1 M11,2 L12,1 M18,2 L19,1" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,7 L20,7" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
          <polygon points="8,0 0,3 1,7 3,8 9,6 9,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 0,11 1,15 3,16 9,14 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,16 0,19 1,20 3,20 9,18 9,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M2,3 L1,4 M2,11 L1,12 M2,18 L1,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M7,0 L7,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/></svg>`,
    11: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="8,0 0,3 1,7 3,8 9,6 9,1" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 0,11 1,15 3,16 9,14 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,16 0,19 1,20 3,20 9,18 9,17" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M2,3 L1,4 M2,11 L1,12 M2,18 L1,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M7,0 L7,20" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/></svg>`,
    12: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,8 3,0 7,1 8,3 6,9 1,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 11,0 15,1 16,3 14,9 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,8 19,0 20,1 20,3 18,9 17,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,2 L4,1 M11,2 L12,1 M18,2 L19,1" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,7 L20,7" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/>
          <polygon points="0,12 3,20 7,19 8,17 6,11 1,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,12 11,20 15,19 16,17 14,11 9,11" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,12 19,20 20,19 20,17 18,11 17,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,18 L4,19 M11,18 L12,19 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,13 L20,13" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/></svg>`,
    13: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,12 3,20 7,19 8,17 6,11 1,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,12 11,20 15,19 16,17 14,11 9,11" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,12 19,20 20,19 20,17 18,11 17,11" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,18 L4,19 M11,18 L12,19 M18,18 L19,19" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,13 L20,13" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/></svg>`,
    14: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,8 3,0 7,1 8,3 6,9 1,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 11,0 15,1 16,3 14,9 9,9" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <polygon points="16,8 19,0 20,1 20,3 18,9 17,9" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1.2" opacity="1"/>
          <path d="M3,2 L4,1 M11,2 L12,1 M18,2 L19,1" stroke="#3a3a52" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,7 L20,7" stroke="#3a3a52" stroke-width="0.5" fill="none" opacity="0.4"/></svg>`,
    15: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="#b0b0b8" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/></svg>`,
  },
};

// 角点变体：4 地形 × 4 角 × 2 variant = 32 张
export const TERRAIN_AUTO_CORNER: Record<TerrainType, Record<Corner, Record<CornerVariant, string>>> = {
  0: {
    tl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="0" width="6" height="6" fill="#7ab045" opacity="0.9"/><path d="M1,5 L2,1 L3,5 M2,1 L3,0 L4,1 M2,5 L4,5" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="1"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="0" width="6" height="6" fill="#7ab045" opacity="0.95"/><path d="M1,5 L1,1 M3,5 L3,1 M5,5 L5,1" stroke="#9ad85a" stroke-width="1" fill="none" stroke-linecap="round" opacity="1"/></svg>`,
    },
    tr: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="0" width="6" height="6" fill="#7ab045" opacity="0.9"/><path d="M7,5 L6,1 L5,5 M6,1 L5,0 L4,1 M6,5 L4,5" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="1"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="0" width="6" height="6" fill="#7ab045" opacity="0.95"/><path d="M3,5 L3,1 M5,5 L5,1 M7,5 L7,1" stroke="#9ad85a" stroke-width="1" fill="none" stroke-linecap="round" opacity="1"/></svg>`,
    },
    bl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="2" width="6" height="6" fill="#7ab045" opacity="0.9"/><path d="M1,3 L2,7 L3,3 M2,7 L3,8 L4,7 M2,3 L4,3" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="1"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="2" width="6" height="6" fill="#7ab045" opacity="0.95"/><path d="M1,3 L1,7 M3,3 L3,7 M5,3 L5,7" stroke="#9ad85a" stroke-width="1" fill="none" stroke-linecap="round" opacity="1"/></svg>`,
    },
    br: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="2" width="6" height="6" fill="#7ab045" opacity="0.9"/><path d="M7,3 L6,7 L5,3 M6,7 L5,8 L4,7 M6,3 L4,3" stroke="#9ad85a" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="1"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="2" width="6" height="6" fill="#7ab045" opacity="0.95"/><path d="M3,3 L3,7 M5,3 L5,7 M7,3 L7,7" stroke="#9ad85a" stroke-width="1" fill="none" stroke-linecap="round" opacity="1"/></svg>`,
    },
  },
  1: {
    tl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="0" width="6" height="6" fill="#d4ad6a" opacity="0.95"/><circle cx="2" cy="2" r="1.2" fill="#e8c890" opacity="1"/><circle cx="4" cy="0.5" r="0.8" fill="#e8c890" opacity="1"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="0" width="6" height="6" fill="#d4ad6a" opacity="1"/><circle cx="2" cy="2" r="1.5" fill="#e8c890" opacity="1"/></svg>`,
    },
    tr: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="0" width="6" height="6" fill="#d4ad6a" opacity="0.95"/><circle cx="6" cy="2" r="1.2" fill="#e8c890" opacity="1"/><circle cx="4" cy="0.5" r="0.8" fill="#e8c890" opacity="1"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="0" width="6" height="6" fill="#d4ad6a" opacity="1"/><circle cx="6" cy="2" r="1.5" fill="#e8c890" opacity="1"/></svg>`,
    },
    bl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="2" width="6" height="6" fill="#d4ad6a" opacity="0.95"/><circle cx="2" cy="6" r="1.2" fill="#e8c890" opacity="1"/><circle cx="4" cy="7.5" r="0.8" fill="#e8c890" opacity="1"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="2" width="6" height="6" fill="#d4ad6a" opacity="1"/><circle cx="2" cy="6" r="1.5" fill="#e8c890" opacity="1"/></svg>`,
    },
    br: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="2" width="6" height="6" fill="#d4ad6a" opacity="0.95"/><circle cx="6" cy="6" r="1.2" fill="#e8c890" opacity="1"/><circle cx="4" cy="7.5" r="0.8" fill="#e8c890" opacity="1"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="2" width="6" height="6" fill="#d4ad6a" opacity="1"/><circle cx="6" cy="6" r="1.5" fill="#e8c890" opacity="1"/></svg>`,
    },
  },
  2: {
    tl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="0" width="6" height="6" fill="#d8e8f8" opacity="0.95"/><path d="M0,4 Q2,2 4,4 Q2,0 0,2" fill="#a8c0e0" opacity="0.9"/><path d="M0,2 Q3,0 5,2" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.7"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="0" width="6" height="6" fill="#d8e8f8" opacity="0.9"/><path d="M0,4 Q2,2 4,4 M0,2 Q3,0 5,2" stroke="#a8c0e0" stroke-width="1.5" fill="none" opacity="1"/><path d="M0,2 Q2,0 4,2" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.7"/></svg>`,
    },
    tr: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="0" width="6" height="6" fill="#d8e8f8" opacity="0.95"/><path d="M8,4 Q6,2 4,4 Q6,0 8,2" fill="#a8c0e0" opacity="0.9"/><path d="M8,2 Q5,0 3,2" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.7"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="0" width="6" height="6" fill="#d8e8f8" opacity="0.9"/><path d="M8,4 Q6,2 4,4 M8,2 Q5,0 3,2" stroke="#a8c0e0" stroke-width="1.5" fill="none" opacity="1"/><path d="M8,2 Q6,0 4,2" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.7"/></svg>`,
    },
    bl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="2" width="6" height="6" fill="#d8e8f8" opacity="0.95"/><path d="M0,4 Q2,6 4,4 Q2,8 0,6" fill="#a8c0e0" opacity="0.9"/><path d="M0,6 Q3,8 5,6" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.7"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="2" width="6" height="6" fill="#d8e8f8" opacity="0.9"/><path d="M0,4 Q2,6 4,4 M0,6 Q3,8 5,6" stroke="#a8c0e0" stroke-width="1.5" fill="none" opacity="1"/><path d="M0,6 Q2,8 4,6" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.7"/></svg>`,
    },
    br: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="2" width="6" height="6" fill="#d8e8f8" opacity="0.95"/><path d="M8,4 Q6,6 4,4 Q6,8 8,6" fill="#a8c0e0" opacity="0.9"/><path d="M8,6 Q5,8 3,6" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.7"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="2" width="6" height="6" fill="#d8e8f8" opacity="0.9"/><path d="M8,4 Q6,6 4,4 M8,6 Q5,8 3,6" stroke="#a8c0e0" stroke-width="1.5" fill="none" opacity="1"/><path d="M8,6 Q6,8 4,6" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.7"/></svg>`,
    },
  },
  3: {
    tl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="0" width="6" height="6" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1" opacity="1"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="0" width="6" height="6" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1" opacity="1"/><path d="M2,2 L2,1 M3,2 L3,0.5" stroke="#3a3a52" stroke-width="0.8" fill="none"/></svg>`,
    },
    tr: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="0" width="6" height="6" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1" opacity="1"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="0" width="6" height="6" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1" opacity="1"/><path d="M6,2 L6,1 M5,2 L5,0.5" stroke="#3a3a52" stroke-width="0.8" fill="none"/></svg>`,
    },
    bl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="2" width="6" height="6" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1" opacity="1"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="2" width="6" height="6" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1" opacity="1"/><path d="M2,6 L2,7 M3,6 L3,7.5" stroke="#3a3a52" stroke-width="0.8" fill="none"/></svg>`,
    },
    br: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="2" width="6" height="6" fill="#b0b0b8" stroke="#3a3a52" stroke-width="1" opacity="1"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect x="2" y="2" width="6" height="6" fill="#9a9aa2" stroke="#3a3a52" stroke-width="1" opacity="1"/><path d="M6,6 L6,7 M5,6 L5,7.5" stroke="#3a3a52" stroke-width="0.8" fill="none"/></svg>`,
    },
  },
};
