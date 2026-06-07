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
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
          <path d="M0,4 Q1,0 3,4 Q4,0 6,4 Q7,0 9,4 Q10,0 12,4 Q13,0 15,4 Q16,0 18,4 Q19,0 20,4 L20,5 L0,5 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,4 Q2.5,1 3,4 M7,4 Q7.5,1 8,4 M12,4 Q12.5,1 13,4 M17,4 Q17.5,1 18,4" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,2 L1,0.5 M6,2 L6,0.5 M11,2 L11,0.5 M16,2 L16,0.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
          <path d="M0,16 Q1,20 3,16 Q4,20 6,16 Q7,20 9,16 Q10,20 12,16 Q13,20 15,16 Q16,20 18,16 Q19,20 20,16 L20,15 L0,15 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,16 Q2.5,19 3,16 M7,16 Q7.5,19 8,16 M12,16 Q12.5,19 13,16 M17,16 Q17.5,19 18,16" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,18 L1,19.5 M6,18 L6,19.5 M11,18 L11,19.5 M16,18 L16,19.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
          <path d="M4,0 Q0,1 4,3 Q0,4 4,6 Q0,7 4,9 Q0,10 4,12 Q0,13 4,15 Q0,16 4,18 Q0,19 4,20 L5,20 L5,0 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M4,2 Q1,2.5 4,3 M4,7 Q1,7.5 4,8 M4,12 Q1,12.5 4,13 M4,17 Q1,17.5 4,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M2,1 L0.5,1 M2,6 L0.5,6 M2,11 L0.5,11 M2,16 L0.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        <path d="M16,0 Q20,1 16,3 Q20,4 16,6 Q20,7 16,9 Q20,10 16,12 Q20,13 16,15 Q20,16 16,18 Q20,19 16,20 L15,20 L15,0 Z" fill="#5a8a35" opacity="0.85"/>
        <path d="M16,2 Q19,2.5 16,3 M16,7 Q19,7.5 16,8 M16,12 Q19,12.5 16,13 M16,17 Q19,17.5 16,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
        <path d="M18,1 L19.5,1 M18,6 L19.5,6 M18,11 L19.5,11 M18,16 L19.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/></svg>`,
    1: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
          <path d="M0,16 Q1,20 3,16 Q4,20 6,16 Q7,20 9,16 Q10,20 12,16 Q13,20 15,16 Q16,20 18,16 Q19,20 20,16 L20,15 L0,15 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,16 Q2.5,19 3,16 M7,16 Q7.5,19 8,16 M12,16 Q12.5,19 13,16 M17,16 Q17.5,19 18,16" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,18 L1,19.5 M6,18 L6,19.5 M11,18 L11,19.5 M16,18 L16,19.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
          <path d="M4,0 Q0,1 4,3 Q0,4 4,6 Q0,7 4,9 Q0,10 4,12 Q0,13 4,15 Q0,16 4,18 Q0,19 4,20 L5,20 L5,0 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M4,2 Q1,2.5 4,3 M4,7 Q1,7.5 4,8 M4,12 Q1,12.5 4,13 M4,17 Q1,17.5 4,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M2,1 L0.5,1 M2,6 L0.5,6 M2,11 L0.5,11 M2,16 L0.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        <path d="M16,0 Q20,1 16,3 Q20,4 16,6 Q20,7 16,9 Q20,10 16,12 Q20,13 16,15 Q20,16 16,18 Q20,19 16,20 L15,20 L15,0 Z" fill="#5a8a35" opacity="0.85"/>
        <path d="M16,2 Q19,2.5 16,3 M16,7 Q19,7.5 16,8 M16,12 Q19,12.5 16,13 M16,17 Q19,17.5 16,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
        <path d="M18,1 L19.5,1 M18,6 L19.5,6 M18,11 L19.5,11 M18,16 L19.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/></svg>`,
    2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
          <path d="M0,4 Q1,0 3,4 Q4,0 6,4 Q7,0 9,4 Q10,0 12,4 Q13,0 15,4 Q16,0 18,4 Q19,0 20,4 L20,5 L0,5 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,4 Q2.5,1 3,4 M7,4 Q7.5,1 8,4 M12,4 Q12.5,1 13,4 M17,4 Q17.5,1 18,4" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,2 L1,0.5 M6,2 L6,0.5 M11,2 L11,0.5 M16,2 L16,0.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
          <path d="M4,0 Q0,1 4,3 Q0,4 4,6 Q0,7 4,9 Q0,10 4,12 Q0,13 4,15 Q0,16 4,18 Q0,19 4,20 L5,20 L5,0 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M4,2 Q1,2.5 4,3 M4,7 Q1,7.5 4,8 M4,12 Q1,12.5 4,13 M4,17 Q1,17.5 4,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M2,1 L0.5,1 M2,6 L0.5,6 M2,11 L0.5,11 M2,16 L0.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        <path d="M16,0 Q20,1 16,3 Q20,4 16,6 Q20,7 16,9 Q20,10 16,12 Q20,13 16,15 Q20,16 16,18 Q20,19 16,20 L15,20 L15,0 Z" fill="#5a8a35" opacity="0.85"/>
        <path d="M16,2 Q19,2.5 16,3 M16,7 Q19,7.5 16,8 M16,12 Q19,12.5 16,13 M16,17 Q19,17.5 16,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
        <path d="M18,1 L19.5,1 M18,6 L19.5,6 M18,11 L19.5,11 M18,16 L19.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/></svg>`,
    3: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
          <path d="M4,0 Q0,1 4,3 Q0,4 4,6 Q0,7 4,9 Q0,10 4,12 Q0,13 4,15 Q0,16 4,18 Q0,19 4,20 L5,20 L5,0 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M4,2 Q1,2.5 4,3 M4,7 Q1,7.5 4,8 M4,12 Q1,12.5 4,13 M4,17 Q1,17.5 4,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M2,1 L0.5,1 M2,6 L0.5,6 M2,11 L0.5,11 M2,16 L0.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        <path d="M16,0 Q20,1 16,3 Q20,4 16,6 Q20,7 16,9 Q20,10 16,12 Q20,13 16,15 Q20,16 16,18 Q20,19 16,20 L15,20 L15,0 Z" fill="#5a8a35" opacity="0.85"/>
        <path d="M16,2 Q19,2.5 16,3 M16,7 Q19,7.5 16,8 M16,12 Q19,12.5 16,13 M16,17 Q19,17.5 16,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
        <path d="M18,1 L19.5,1 M18,6 L19.5,6 M18,11 L19.5,11 M18,16 L19.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/></svg>`,
    4: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
          <path d="M0,4 Q1,0 3,4 Q4,0 6,4 Q7,0 9,4 Q10,0 12,4 Q13,0 15,4 Q16,0 18,4 Q19,0 20,4 L20,5 L0,5 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,4 Q2.5,1 3,4 M7,4 Q7.5,1 8,4 M12,4 Q12.5,1 13,4 M17,4 Q17.5,1 18,4" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,2 L1,0.5 M6,2 L6,0.5 M11,2 L11,0.5 M16,2 L16,0.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
          <path d="M0,16 Q1,20 3,16 Q4,20 6,16 Q7,20 9,16 Q10,20 12,16 Q13,20 15,16 Q16,20 18,16 Q19,20 20,16 L20,15 L0,15 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,16 Q2.5,19 3,16 M7,16 Q7.5,19 8,16 M12,16 Q12.5,19 13,16 M17,16 Q17.5,19 18,16" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,18 L1,19.5 M6,18 L6,19.5 M11,18 L11,19.5 M16,18 L16,19.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        <path d="M16,0 Q20,1 16,3 Q20,4 16,6 Q20,7 16,9 Q20,10 16,12 Q20,13 16,15 Q20,16 16,18 Q20,19 16,20 L15,20 L15,0 Z" fill="#5a8a35" opacity="0.85"/>
        <path d="M16,2 Q19,2.5 16,3 M16,7 Q19,7.5 16,8 M16,12 Q19,12.5 16,13 M16,17 Q19,17.5 16,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
        <path d="M18,1 L19.5,1 M18,6 L19.5,6 M18,11 L19.5,11 M18,16 L19.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/></svg>`,
    5: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
          <path d="M0,16 Q1,20 3,16 Q4,20 6,16 Q7,20 9,16 Q10,20 12,16 Q13,20 15,16 Q16,20 18,16 Q19,20 20,16 L20,15 L0,15 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,16 Q2.5,19 3,16 M7,16 Q7.5,19 8,16 M12,16 Q12.5,19 13,16 M17,16 Q17.5,19 18,16" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,18 L1,19.5 M6,18 L6,19.5 M11,18 L11,19.5 M16,18 L16,19.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        <path d="M16,0 Q20,1 16,3 Q20,4 16,6 Q20,7 16,9 Q20,10 16,12 Q20,13 16,15 Q20,16 16,18 Q20,19 16,20 L15,20 L15,0 Z" fill="#5a8a35" opacity="0.85"/>
        <path d="M16,2 Q19,2.5 16,3 M16,7 Q19,7.5 16,8 M16,12 Q19,12.5 16,13 M16,17 Q19,17.5 16,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
        <path d="M18,1 L19.5,1 M18,6 L19.5,6 M18,11 L19.5,11 M18,16 L19.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/></svg>`,
    6: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
          <path d="M0,4 Q1,0 3,4 Q4,0 6,4 Q7,0 9,4 Q10,0 12,4 Q13,0 15,4 Q16,0 18,4 Q19,0 20,4 L20,5 L0,5 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,4 Q2.5,1 3,4 M7,4 Q7.5,1 8,4 M12,4 Q12.5,1 13,4 M17,4 Q17.5,1 18,4" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,2 L1,0.5 M6,2 L6,0.5 M11,2 L11,0.5 M16,2 L16,0.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        <path d="M16,0 Q20,1 16,3 Q20,4 16,6 Q20,7 16,9 Q20,10 16,12 Q20,13 16,15 Q20,16 16,18 Q20,19 16,20 L15,20 L15,0 Z" fill="#5a8a35" opacity="0.85"/>
        <path d="M16,2 Q19,2.5 16,3 M16,7 Q19,7.5 16,8 M16,12 Q19,12.5 16,13 M16,17 Q19,17.5 16,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
        <path d="M18,1 L19.5,1 M18,6 L19.5,6 M18,11 L19.5,11 M18,16 L19.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/></svg>`,
    7: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <path d="M16,0 Q20,1 16,3 Q20,4 16,6 Q20,7 16,9 Q20,10 16,12 Q20,13 16,15 Q20,16 16,18 Q20,19 16,20 L15,20 L15,0 Z" fill="#5a8a35" opacity="0.85"/>
        <path d="M16,2 Q19,2.5 16,3 M16,7 Q19,7.5 16,8 M16,12 Q19,12.5 16,13 M16,17 Q19,17.5 16,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
        <path d="M18,1 L19.5,1 M18,6 L19.5,6 M18,11 L19.5,11 M18,16 L19.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/></svg>`,
    8: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
          <path d="M0,4 Q1,0 3,4 Q4,0 6,4 Q7,0 9,4 Q10,0 12,4 Q13,0 15,4 Q16,0 18,4 Q19,0 20,4 L20,5 L0,5 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,4 Q2.5,1 3,4 M7,4 Q7.5,1 8,4 M12,4 Q12.5,1 13,4 M17,4 Q17.5,1 18,4" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,2 L1,0.5 M6,2 L6,0.5 M11,2 L11,0.5 M16,2 L16,0.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
          <path d="M0,16 Q1,20 3,16 Q4,20 6,16 Q7,20 9,16 Q10,20 12,16 Q13,20 15,16 Q16,20 18,16 Q19,20 20,16 L20,15 L0,15 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,16 Q2.5,19 3,16 M7,16 Q7.5,19 8,16 M12,16 Q12.5,19 13,16 M17,16 Q17.5,19 18,16" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,18 L1,19.5 M6,18 L6,19.5 M11,18 L11,19.5 M16,18 L16,19.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
          <path d="M4,0 Q0,1 4,3 Q0,4 4,6 Q0,7 4,9 Q0,10 4,12 Q0,13 4,15 Q0,16 4,18 Q0,19 4,20 L5,20 L5,0 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M4,2 Q1,2.5 4,3 M4,7 Q1,7.5 4,8 M4,12 Q1,12.5 4,13 M4,17 Q1,17.5 4,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M2,1 L0.5,1 M2,6 L0.5,6 M2,11 L0.5,11 M2,16 L0.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/></svg>`,
    9: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
          <path d="M0,16 Q1,20 3,16 Q4,20 6,16 Q7,20 9,16 Q10,20 12,16 Q13,20 15,16 Q16,20 18,16 Q19,20 20,16 L20,15 L0,15 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,16 Q2.5,19 3,16 M7,16 Q7.5,19 8,16 M12,16 Q12.5,19 13,16 M17,16 Q17.5,19 18,16" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,18 L1,19.5 M6,18 L6,19.5 M11,18 L11,19.5 M16,18 L16,19.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
          <path d="M4,0 Q0,1 4,3 Q0,4 4,6 Q0,7 4,9 Q0,10 4,12 Q0,13 4,15 Q0,16 4,18 Q0,19 4,20 L5,20 L5,0 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M4,2 Q1,2.5 4,3 M4,7 Q1,7.5 4,8 M4,12 Q1,12.5 4,13 M4,17 Q1,17.5 4,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M2,1 L0.5,1 M2,6 L0.5,6 M2,11 L0.5,11 M2,16 L0.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/></svg>`,
    10: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
          <path d="M0,4 Q1,0 3,4 Q4,0 6,4 Q7,0 9,4 Q10,0 12,4 Q13,0 15,4 Q16,0 18,4 Q19,0 20,4 L20,5 L0,5 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,4 Q2.5,1 3,4 M7,4 Q7.5,1 8,4 M12,4 Q12.5,1 13,4 M17,4 Q17.5,1 18,4" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,2 L1,0.5 M6,2 L6,0.5 M11,2 L11,0.5 M16,2 L16,0.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
          <path d="M4,0 Q0,1 4,3 Q0,4 4,6 Q0,7 4,9 Q0,10 4,12 Q0,13 4,15 Q0,16 4,18 Q0,19 4,20 L5,20 L5,0 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M4,2 Q1,2.5 4,3 M4,7 Q1,7.5 4,8 M4,12 Q1,12.5 4,13 M4,17 Q1,17.5 4,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M2,1 L0.5,1 M2,6 L0.5,6 M2,11 L0.5,11 M2,16 L0.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/></svg>`,
    11: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
          <path d="M4,0 Q0,1 4,3 Q0,4 4,6 Q0,7 4,9 Q0,10 4,12 Q0,13 4,15 Q0,16 4,18 Q0,19 4,20 L5,20 L5,0 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M4,2 Q1,2.5 4,3 M4,7 Q1,7.5 4,8 M4,12 Q1,12.5 4,13 M4,17 Q1,17.5 4,18" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M2,1 L0.5,1 M2,6 L0.5,6 M2,11 L0.5,11 M2,16 L0.5,16" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/></svg>`,
    12: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
          <path d="M0,4 Q1,0 3,4 Q4,0 6,4 Q7,0 9,4 Q10,0 12,4 Q13,0 15,4 Q16,0 18,4 Q19,0 20,4 L20,5 L0,5 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,4 Q2.5,1 3,4 M7,4 Q7.5,1 8,4 M12,4 Q12.5,1 13,4 M17,4 Q17.5,1 18,4" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,2 L1,0.5 M6,2 L6,0.5 M11,2 L11,0.5 M16,2 L16,0.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/>
          <path d="M0,16 Q1,20 3,16 Q4,20 6,16 Q7,20 9,16 Q10,20 12,16 Q13,20 15,16 Q16,20 18,16 Q19,20 20,16 L20,15 L0,15 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,16 Q2.5,19 3,16 M7,16 Q7.5,19 8,16 M12,16 Q12.5,19 13,16 M17,16 Q17.5,19 18,16" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,18 L1,19.5 M6,18 L6,19.5 M11,18 L11,19.5 M16,18 L16,19.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/></svg>`,
    13: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
          <path d="M0,16 Q1,20 3,16 Q4,20 6,16 Q7,20 9,16 Q10,20 12,16 Q13,20 15,16 Q16,20 18,16 Q19,20 20,16 L20,15 L0,15 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,16 Q2.5,19 3,16 M7,16 Q7.5,19 8,16 M12,16 Q12.5,19 13,16 M17,16 Q17.5,19 18,16" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,18 L1,19.5 M6,18 L6,19.5 M11,18 L11,19.5 M16,18 L16,19.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/></svg>`,
    14: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
          <path d="M0,4 Q1,0 3,4 Q4,0 6,4 Q7,0 9,4 Q10,0 12,4 Q13,0 15,4 Q16,0 18,4 Q19,0 20,4 L20,5 L0,5 Z" fill="#5a8a35" opacity="0.85"/>
          <path d="M2,4 Q2.5,1 3,4 M7,4 Q7.5,1 8,4 M12,4 Q12.5,1 13,4 M17,4 Q17.5,1 18,4" stroke="#6a9a40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,2 L1,0.5 M6,2 L6,0.5 M11,2 L11,0.5 M16,2 L16,0.5" stroke="#4a7a28" stroke-width="0.8" fill="none" stroke-linecap="round"/></svg>`,
    15: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="#6a9a40" opacity="0.4"/></svg>`,
  },
  1: {
    0: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/>
          <circle cx="1.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="1" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="0.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="1.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="19.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="2" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="0.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/>
        <circle cx="18" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
        <circle cx="19.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/></svg>`,
    1: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/>
          <circle cx="1.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="19.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="2" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="0.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/>
        <circle cx="18" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
        <circle cx="19.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/></svg>`,
    2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/>
          <circle cx="1.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="1" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="0.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="2" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="0.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/>
        <circle cx="18" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
        <circle cx="19.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/></svg>`,
    3: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/>
          <circle cx="2" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="0.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/>
        <circle cx="18" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
        <circle cx="19.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/></svg>`,
    4: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/>
          <circle cx="1.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="1" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="0.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="1.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="19.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/>
        <circle cx="18" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
        <circle cx="19.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/></svg>`,
    5: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/>
          <circle cx="1.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="19.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/>
        <circle cx="18" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
        <circle cx="19.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/></svg>`,
    6: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/>
          <circle cx="1.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="1" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="0.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/>
        <circle cx="18" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
        <circle cx="19.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/></svg>`,
    7: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/>
        <circle cx="18" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
        <circle cx="18" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
        <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
        <circle cx="19.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
        <circle cx="19.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/></svg>`,
    8: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/>
          <circle cx="1.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="1" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="0.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="1.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="19.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="2" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="0.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/></svg>`,
    9: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/>
          <circle cx="1.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="19.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="2" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="0.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/></svg>`,
    10: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/>
          <circle cx="1.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="1" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="0.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="2" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="0.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/></svg>`,
    11: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/>
          <circle cx="2" cy="1.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="5" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="8.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="12" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="2" cy="15.5" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="1" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="0.5" cy="3.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="10" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="0.5" cy="17" r="1" fill="#b8965a" opacity="0.85"/></svg>`,
    12: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/>
          <circle cx="1.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="1" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="0.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="1.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="19.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/></svg>`,
    13: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/>
          <circle cx="1.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="19" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="18" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="19" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="19.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="19.5" r="1" fill="#b8965a" opacity="0.85"/></svg>`,
    14: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/>
          <circle cx="1.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="5" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="8.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="12" cy="1" r="1.8" fill="#a8854a" opacity="0.8"/>
          <circle cx="15.5" cy="2" r="2" fill="#a8854a" opacity="0.85"/>
          <circle cx="19" cy="1" r="1.5" fill="#b8965a" opacity="0.9"/>
          <circle cx="3.5" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/>
          <circle cx="10" cy="0.5" r="0.8" fill="#b8965a" opacity="0.85"/>
          <circle cx="17" cy="0.5" r="1" fill="#b8965a" opacity="0.85"/></svg>`,
    15: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="9" cy="9" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="#a8854a" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="#b8965a" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.4"/></svg>`,
  },
  2: {
    0: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/>
          <path d="M0,2 L20,2 L20,4 L0,4 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,2.5 Q4,0 8,2.5 T16,2.5 T20,2.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
          <path d="M0,16 L20,16 L20,18 L0,18 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,17.5 Q4,20 8,17.5 T16,17.5 T20,17.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
          <path d="M2,0 L4,0 L4,20 L2,20 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M2.5,0 Q0,4 2.5,8 T2.5,16 T2.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
        <path d="M16,0 L18,0 L18,20 L16,20 Z" fill="#a8c0e0" opacity="0.5"/>
        <path d="M17.5,0 Q20,4 17.5,8 T17.5,16 T17.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/></svg>`,
    1: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/>
          <path d="M0,16 L20,16 L20,18 L0,18 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,17.5 Q4,20 8,17.5 T16,17.5 T20,17.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
          <path d="M2,0 L4,0 L4,20 L2,20 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M2.5,0 Q0,4 2.5,8 T2.5,16 T2.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
        <path d="M16,0 L18,0 L18,20 L16,20 Z" fill="#a8c0e0" opacity="0.5"/>
        <path d="M17.5,0 Q20,4 17.5,8 T17.5,16 T17.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/></svg>`,
    2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/>
          <path d="M0,2 L20,2 L20,4 L0,4 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,2.5 Q4,0 8,2.5 T16,2.5 T20,2.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
          <path d="M2,0 L4,0 L4,20 L2,20 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M2.5,0 Q0,4 2.5,8 T2.5,16 T2.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
        <path d="M16,0 L18,0 L18,20 L16,20 Z" fill="#a8c0e0" opacity="0.5"/>
        <path d="M17.5,0 Q20,4 17.5,8 T17.5,16 T17.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/></svg>`,
    3: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/>
          <path d="M2,0 L4,0 L4,20 L2,20 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M2.5,0 Q0,4 2.5,8 T2.5,16 T2.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
        <path d="M16,0 L18,0 L18,20 L16,20 Z" fill="#a8c0e0" opacity="0.5"/>
        <path d="M17.5,0 Q20,4 17.5,8 T17.5,16 T17.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/></svg>`,
    4: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/>
          <path d="M0,2 L20,2 L20,4 L0,4 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,2.5 Q4,0 8,2.5 T16,2.5 T20,2.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
          <path d="M0,16 L20,16 L20,18 L0,18 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,17.5 Q4,20 8,17.5 T16,17.5 T20,17.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
        <path d="M16,0 L18,0 L18,20 L16,20 Z" fill="#a8c0e0" opacity="0.5"/>
        <path d="M17.5,0 Q20,4 17.5,8 T17.5,16 T17.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/></svg>`,
    5: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/>
          <path d="M0,16 L20,16 L20,18 L0,18 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,17.5 Q4,20 8,17.5 T16,17.5 T20,17.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
        <path d="M16,0 L18,0 L18,20 L16,20 Z" fill="#a8c0e0" opacity="0.5"/>
        <path d="M17.5,0 Q20,4 17.5,8 T17.5,16 T17.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/></svg>`,
    6: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/>
          <path d="M0,2 L20,2 L20,4 L0,4 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,2.5 Q4,0 8,2.5 T16,2.5 T20,2.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
        <path d="M16,0 L18,0 L18,20 L16,20 Z" fill="#a8c0e0" opacity="0.5"/>
        <path d="M17.5,0 Q20,4 17.5,8 T17.5,16 T17.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/></svg>`,
    7: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M16,0 L18,0 L18,20 L16,20 Z" fill="#a8c0e0" opacity="0.5"/>
        <path d="M17.5,0 Q20,4 17.5,8 T17.5,16 T17.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/></svg>`,
    8: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/>
          <path d="M0,2 L20,2 L20,4 L0,4 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,2.5 Q4,0 8,2.5 T16,2.5 T20,2.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
          <path d="M0,16 L20,16 L20,18 L0,18 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,17.5 Q4,20 8,17.5 T16,17.5 T20,17.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
          <path d="M2,0 L4,0 L4,20 L2,20 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M2.5,0 Q0,4 2.5,8 T2.5,16 T2.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/></svg>`,
    9: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/>
          <path d="M0,16 L20,16 L20,18 L0,18 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,17.5 Q4,20 8,17.5 T16,17.5 T20,17.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
          <path d="M2,0 L4,0 L4,20 L2,20 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M2.5,0 Q0,4 2.5,8 T2.5,16 T2.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/></svg>`,
    10: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/>
          <path d="M0,2 L20,2 L20,4 L0,4 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,2.5 Q4,0 8,2.5 T16,2.5 T20,2.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
          <path d="M2,0 L4,0 L4,20 L2,20 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M2.5,0 Q0,4 2.5,8 T2.5,16 T2.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/></svg>`,
    11: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/>
          <path d="M2,0 L4,0 L4,20 L2,20 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M2.5,0 Q0,4 2.5,8 T2.5,16 T2.5,20" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/></svg>`,
    12: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/>
          <path d="M0,2 L20,2 L20,4 L0,4 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,2.5 Q4,0 8,2.5 T16,2.5 T20,2.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>
          <path d="M0,16 L20,16 L20,18 L0,18 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,17.5 Q4,20 8,17.5 T16,17.5 T20,17.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/></svg>`,
    13: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/>
          <path d="M0,16 L20,16 L20,18 L0,18 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,17.5 Q4,20 8,17.5 T16,17.5 T20,17.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/></svg>`,
    14: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/>
          <path d="M0,2 L20,2 L20,4 L0,4 Z" fill="#a8c0e0" opacity="0.5"/>
          <path d="M0,2.5 Q4,0 8,2.5 T16,2.5 T20,2.5" stroke="#a8c0e0" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/></svg>`,
    15: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.3" fill="none" opacity="0.5"/></svg>`,
  },
  3: {
    0: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,4 3,0 5,1 6,3 4,5 1,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,4 9,0 12,1 13,3 11,5 7,5" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,4 16,0 18,1 19,3 17,5 14,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,1 L4,0.5 M9,1 L10,0.5 M16,1 L17,0.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
          <polygon points="0,16 3,20 5,19 6,17 4,15 1,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,16 9,20 12,19 13,17 11,15 7,15" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,16 16,20 18,19 19,17 17,15 14,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,19 L4,19.5 M9,19 L10,19.5 M16,19 L17,19.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
          <polygon points="4,0 0,3 1,5 3,6 5,4 5,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,6 0,9 1,12 3,13 5,11 5,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,13 0,16 1,18 3,19 5,17 5,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M1,3 L0.5,4 M1,9 L0.5,10 M1,16 L0.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
        <polygon points="16,0 20,3 19,5 17,6 15,4 15,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,6 20,9 19,12 17,13 15,11 15,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,13 20,16 19,18 17,19 15,17 15,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <path d="M19,3 L19.5,4 M19,9 L19.5,10 M19,16 L19.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/></svg>`,
    1: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,16 3,20 5,19 6,17 4,15 1,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,16 9,20 12,19 13,17 11,15 7,15" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,16 16,20 18,19 19,17 17,15 14,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,19 L4,19.5 M9,19 L10,19.5 M16,19 L17,19.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
          <polygon points="4,0 0,3 1,5 3,6 5,4 5,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,6 0,9 1,12 3,13 5,11 5,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,13 0,16 1,18 3,19 5,17 5,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M1,3 L0.5,4 M1,9 L0.5,10 M1,16 L0.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
        <polygon points="16,0 20,3 19,5 17,6 15,4 15,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,6 20,9 19,12 17,13 15,11 15,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,13 20,16 19,18 17,19 15,17 15,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <path d="M19,3 L19.5,4 M19,9 L19.5,10 M19,16 L19.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/></svg>`,
    2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,4 3,0 5,1 6,3 4,5 1,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,4 9,0 12,1 13,3 11,5 7,5" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,4 16,0 18,1 19,3 17,5 14,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,1 L4,0.5 M9,1 L10,0.5 M16,1 L17,0.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
          <polygon points="4,0 0,3 1,5 3,6 5,4 5,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,6 0,9 1,12 3,13 5,11 5,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,13 0,16 1,18 3,19 5,17 5,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M1,3 L0.5,4 M1,9 L0.5,10 M1,16 L0.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
        <polygon points="16,0 20,3 19,5 17,6 15,4 15,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,6 20,9 19,12 17,13 15,11 15,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,13 20,16 19,18 17,19 15,17 15,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <path d="M19,3 L19.5,4 M19,9 L19.5,10 M19,16 L19.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/></svg>`,
    3: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="4,0 0,3 1,5 3,6 5,4 5,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,6 0,9 1,12 3,13 5,11 5,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,13 0,16 1,18 3,19 5,17 5,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M1,3 L0.5,4 M1,9 L0.5,10 M1,16 L0.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
        <polygon points="16,0 20,3 19,5 17,6 15,4 15,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,6 20,9 19,12 17,13 15,11 15,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,13 20,16 19,18 17,19 15,17 15,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <path d="M19,3 L19.5,4 M19,9 L19.5,10 M19,16 L19.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/></svg>`,
    4: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,4 3,0 5,1 6,3 4,5 1,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,4 9,0 12,1 13,3 11,5 7,5" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,4 16,0 18,1 19,3 17,5 14,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,1 L4,0.5 M9,1 L10,0.5 M16,1 L17,0.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
          <polygon points="0,16 3,20 5,19 6,17 4,15 1,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,16 9,20 12,19 13,17 11,15 7,15" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,16 16,20 18,19 19,17 17,15 14,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,19 L4,19.5 M9,19 L10,19.5 M16,19 L17,19.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
        <polygon points="16,0 20,3 19,5 17,6 15,4 15,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,6 20,9 19,12 17,13 15,11 15,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,13 20,16 19,18 17,19 15,17 15,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <path d="M19,3 L19.5,4 M19,9 L19.5,10 M19,16 L19.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/></svg>`,
    5: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,16 3,20 5,19 6,17 4,15 1,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,16 9,20 12,19 13,17 11,15 7,15" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,16 16,20 18,19 19,17 17,15 14,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,19 L4,19.5 M9,19 L10,19.5 M16,19 L17,19.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
        <polygon points="16,0 20,3 19,5 17,6 15,4 15,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,6 20,9 19,12 17,13 15,11 15,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,13 20,16 19,18 17,19 15,17 15,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <path d="M19,3 L19.5,4 M19,9 L19.5,10 M19,16 L19.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/></svg>`,
    6: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,4 3,0 5,1 6,3 4,5 1,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,4 9,0 12,1 13,3 11,5 7,5" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,4 16,0 18,1 19,3 17,5 14,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,1 L4,0.5 M9,1 L10,0.5 M16,1 L17,0.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
        <polygon points="16,0 20,3 19,5 17,6 15,4 15,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,6 20,9 19,12 17,13 15,11 15,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,13 20,16 19,18 17,19 15,17 15,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <path d="M19,3 L19.5,4 M19,9 L19.5,10 M19,16 L19.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/></svg>`,
    7: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="16,0 20,3 19,5 17,6 15,4 15,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,6 20,9 19,12 17,13 15,11 15,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <polygon points="16,13 20,16 19,18 17,19 15,17 15,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
        <path d="M19,3 L19.5,4 M19,9 L19.5,10 M19,16 L19.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/></svg>`,
    8: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,4 3,0 5,1 6,3 4,5 1,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,4 9,0 12,1 13,3 11,5 7,5" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,4 16,0 18,1 19,3 17,5 14,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,1 L4,0.5 M9,1 L10,0.5 M16,1 L17,0.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
          <polygon points="0,16 3,20 5,19 6,17 4,15 1,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,16 9,20 12,19 13,17 11,15 7,15" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,16 16,20 18,19 19,17 17,15 14,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,19 L4,19.5 M9,19 L10,19.5 M16,19 L17,19.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
          <polygon points="4,0 0,3 1,5 3,6 5,4 5,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,6 0,9 1,12 3,13 5,11 5,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,13 0,16 1,18 3,19 5,17 5,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M1,3 L0.5,4 M1,9 L0.5,10 M1,16 L0.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/></svg>`,
    9: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,16 3,20 5,19 6,17 4,15 1,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,16 9,20 12,19 13,17 11,15 7,15" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,16 16,20 18,19 19,17 17,15 14,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,19 L4,19.5 M9,19 L10,19.5 M16,19 L17,19.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
          <polygon points="4,0 0,3 1,5 3,6 5,4 5,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,6 0,9 1,12 3,13 5,11 5,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,13 0,16 1,18 3,19 5,17 5,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M1,3 L0.5,4 M1,9 L0.5,10 M1,16 L0.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/></svg>`,
    10: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,4 3,0 5,1 6,3 4,5 1,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,4 9,0 12,1 13,3 11,5 7,5" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,4 16,0 18,1 19,3 17,5 14,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,1 L4,0.5 M9,1 L10,0.5 M16,1 L17,0.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
          <polygon points="4,0 0,3 1,5 3,6 5,4 5,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,6 0,9 1,12 3,13 5,11 5,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,13 0,16 1,18 3,19 5,17 5,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M1,3 L0.5,4 M1,9 L0.5,10 M1,16 L0.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/></svg>`,
    11: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="4,0 0,3 1,5 3,6 5,4 5,1" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,6 0,9 1,12 3,13 5,11 5,7" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="4,13 0,16 1,18 3,19 5,17 5,14" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M1,3 L0.5,4 M1,9 L0.5,10 M1,16 L0.5,17" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/></svg>`,
    12: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,4 3,0 5,1 6,3 4,5 1,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,4 9,0 12,1 13,3 11,5 7,5" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,4 16,0 18,1 19,3 17,5 14,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,1 L4,0.5 M9,1 L10,0.5 M16,1 L17,0.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/>
          <polygon points="0,16 3,20 5,19 6,17 4,15 1,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,16 9,20 12,19 13,17 11,15 7,15" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,16 16,20 18,19 19,17 17,15 14,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,19 L4,19.5 M9,19 L10,19.5 M16,19 L17,19.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/></svg>`,
    13: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,16 3,20 5,19 6,17 4,15 1,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,16 9,20 12,19 13,17 11,15 7,15" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,16 16,20 18,19 19,17 17,15 14,15" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,19 L4,19.5 M9,19 L10,19.5 M16,19 L17,19.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/></svg>`,
    14: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
          <polygon points="0,4 3,0 5,1 6,3 4,5 1,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="6,4 9,0 12,1 13,3 11,5 7,5" fill="#7a7a82" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <polygon points="13,4 16,0 18,1 19,3 17,5 14,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="1" opacity="0.95"/>
          <path d="M3,1 L4,0.5 M9,1 L10,0.5 M16,1 L17,0.5" stroke="#3a3a52" stroke-width="1" fill="none" opacity="0.8"/></svg>`,
    15: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.2" opacity="0.7"/></svg>`,
  },
};

// 角点变体：4 地形 × 4 角 × 2 variant = 32 张
export const TERRAIN_AUTO_CORNER: Record<TerrainType, Record<Corner, Record<CornerVariant, string>>> = {
  0: {
    tl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M2,5 L3,2 M3,2 L4,1 M2,5 L4,1" stroke="#6a9a40" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="2.5" cy="1.5" r="0.3" fill="#6a9a40" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="2" cy="2" r="0.4" fill="#6a9a40" opacity="0.95"/><circle cx="3" cy="3" r="0.3" fill="#5a8a35" opacity="0.85"/><path d="M1.5,1.5 L2.5,2.5" stroke="#6a9a40" stroke-width="0.4" fill="none"/></svg>`,
    },
    tr: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M6,5 L5,2 M5,2 L4,1 M6,5 L4,1" stroke="#6a9a40" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="5.5" cy="1.5" r="0.3" fill="#6a9a40" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="6" cy="2" r="0.4" fill="#6a9a40" opacity="0.95"/><circle cx="5" cy="3" r="0.3" fill="#5a8a35" opacity="0.85"/><path d="M6.5,1.5 L5.5,2.5" stroke="#6a9a40" stroke-width="0.4" fill="none"/></svg>`,
    },
    bl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M2,3 L3,6 M3,6 L4,7 M2,3 L4,7" stroke="#6a9a40" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="2.5" cy="6.5" r="0.3" fill="#6a9a40" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="2" cy="6" r="0.4" fill="#6a9a40" opacity="0.95"/><circle cx="3" cy="5" r="0.3" fill="#5a8a35" opacity="0.85"/><path d="M1.5,6.5 L2.5,5.5" stroke="#6a9a40" stroke-width="0.4" fill="none"/></svg>`,
    },
    br: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M6,3 L5,6 M5,6 L4,7 M6,3 L4,7" stroke="#6a9a40" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="5.5" cy="6.5" r="0.3" fill="#6a9a40" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="6" cy="6" r="0.4" fill="#6a9a40" opacity="0.95"/><circle cx="5" cy="5" r="0.3" fill="#5a8a35" opacity="0.85"/><path d="M6.5,6.5 L5.5,5.5" stroke="#6a9a40" stroke-width="0.4" fill="none"/></svg>`,
    },
  },
  1: {
    tl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="1.5" cy="1.5" r="0.35" fill="#b8965a" opacity="0.9"/><circle cx="3" cy="2.8" r="0.3" fill="#a8854a" opacity="0.85"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="2" cy="2" r="0.4" fill="#a8854a" opacity="0.9"/><path d="M1,3.5 Q2,3 3,3.5" stroke="#b8965a" stroke-width="0.4" fill="none"/></svg>`,
    },
    tr: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="6.5" cy="1.5" r="0.35" fill="#b8965a" opacity="0.9"/><circle cx="5" cy="2.8" r="0.3" fill="#a8854a" opacity="0.85"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="6" cy="2" r="0.4" fill="#a8854a" opacity="0.9"/><path d="M5,3.5 Q6,3 7,3.5" stroke="#b8965a" stroke-width="0.4" fill="none"/></svg>`,
    },
    bl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="1.5" cy="6.5" r="0.35" fill="#b8965a" opacity="0.9"/><circle cx="3" cy="5.2" r="0.3" fill="#a8854a" opacity="0.85"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="2" cy="6" r="0.4" fill="#a8854a" opacity="0.9"/><path d="M1,4.5 Q2,5 3,4.5" stroke="#b8965a" stroke-width="0.4" fill="none"/></svg>`,
    },
    br: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="6.5" cy="6.5" r="0.35" fill="#b8965a" opacity="0.9"/><circle cx="5" cy="5.2" r="0.3" fill="#a8854a" opacity="0.85"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="6" cy="6" r="0.4" fill="#a8854a" opacity="0.9"/><path d="M5,4.5 Q6,5 7,4.5" stroke="#b8965a" stroke-width="0.4" fill="none"/></svg>`,
    },
  },
  2: {
    tl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M1,3 Q2.5,1.5 4,3" stroke="#a8c0e0" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="3.5" cy="1.5" r="0.3" fill="#a8c0e0" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M1,4 Q2.5,2.5 4,4" stroke="#a8c0e0" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/><circle cx="2" cy="2" r="0.3" fill="#a8c0e0" opacity="0.9"/></svg>`,
    },
    tr: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M7,3 Q5.5,1.5 4,3" stroke="#a8c0e0" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="4.5" cy="1.5" r="0.3" fill="#a8c0e0" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M7,4 Q5.5,2.5 4,4" stroke="#a8c0e0" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/><circle cx="6" cy="2" r="0.3" fill="#a8c0e0" opacity="0.9"/></svg>`,
    },
    bl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M1,5 Q2.5,6.5 4,5" stroke="#a8c0e0" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="3.5" cy="6.5" r="0.3" fill="#a8c0e0" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M1,4 Q2.5,5.5 4,4" stroke="#a8c0e0" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/><circle cx="2" cy="6" r="0.3" fill="#a8c0e0" opacity="0.9"/></svg>`,
    },
    br: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M7,5 Q5.5,6.5 4,5" stroke="#a8c0e0" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="4.5" cy="6.5" r="0.3" fill="#a8c0e0" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M7,4 Q5.5,5.5 4,4" stroke="#a8c0e0" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/><circle cx="6" cy="6" r="0.3" fill="#a8c0e0" opacity="0.9"/></svg>`,
    },
  },
  3: {
    tl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M1,4 L3,2 M3,2 L4,1" stroke="#3a3a52" stroke-width="0.5" fill="none" stroke-linecap="round" opacity="0.95"/><path d="M0.5,2.5 L1.5,3.5" stroke="#3a3a52" stroke-width="0.4" fill="none"/><circle cx="3.5" cy="3" r="0.3" fill="#7a7a82" opacity="0.85"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="2" cy="2" r="0.4" fill="#3a3a52" opacity="0.9"/><path d="M1,1 L1.8,1.8" stroke="#3a3a52" stroke-width="0.4" fill="none"/><circle cx="3.5" cy="3.5" r="0.25" fill="#7a7a82" opacity="0.7"/></svg>`,
    },
    tr: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M7,4 L5,2 M5,2 L4,1" stroke="#3a3a52" stroke-width="0.5" fill="none" stroke-linecap="round" opacity="0.95"/><path d="M7.5,2.5 L6.5,3.5" stroke="#3a3a52" stroke-width="0.4" fill="none"/><circle cx="4.5" cy="3" r="0.3" fill="#7a7a82" opacity="0.85"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="6" cy="2" r="0.4" fill="#3a3a52" opacity="0.9"/><path d="M7,1 L6.2,1.8" stroke="#3a3a52" stroke-width="0.4" fill="none"/><circle cx="4.5" cy="3.5" r="0.25" fill="#7a7a82" opacity="0.7"/></svg>`,
    },
    bl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M1,4 L3,6 M3,6 L4,7" stroke="#3a3a52" stroke-width="0.5" fill="none" stroke-linecap="round" opacity="0.95"/><path d="M0.5,5.5 L1.5,4.5" stroke="#3a3a52" stroke-width="0.4" fill="none"/><circle cx="3.5" cy="5" r="0.3" fill="#7a7a82" opacity="0.85"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="2" cy="6" r="0.4" fill="#3a3a52" opacity="0.9"/><path d="M1,7 L1.8,6.2" stroke="#3a3a52" stroke-width="0.4" fill="none"/><circle cx="3.5" cy="4.5" r="0.25" fill="#7a7a82" opacity="0.7"/></svg>`,
    },
    br: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M7,4 L5,6 M5,6 L4,7" stroke="#3a3a52" stroke-width="0.5" fill="none" stroke-linecap="round" opacity="0.95"/><path d="M7.5,5.5 L6.5,4.5" stroke="#3a3a52" stroke-width="0.4" fill="none"/><circle cx="4.5" cy="5" r="0.3" fill="#7a7a82" opacity="0.85"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="6" cy="6" r="0.4" fill="#3a3a52" opacity="0.9"/><path d="M7,7 L6.2,6.2" stroke="#3a3a52" stroke-width="0.4" fill="none"/><circle cx="4.5" cy="4.5" r="0.25" fill="#7a7a82" opacity="0.7"/></svg>`,
    },
  },
};
