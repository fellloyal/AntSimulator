// TerrainAutoTiles - 24-tile 自动地形过渡的 SVG 资源
// 由 scripts/generate-terrain-tiles.mjs 自动生成，请勿手工编辑
// 共 4 地形 × 16 边变体 + 4 地形 × 4 角 × 2 variant = 96 张 SVG

import type { TerrainType } from './TerrainTiles';
import type { Corner, CornerVariant } from '../TerrainAdjacency';

export type TerrainId = 'grass' | 'sand' | 'water' | 'rock';

// 边变体：4 地形 × 16 掩码 = 64 张
export const TERRAIN_AUTO_EDGE: Record<TerrainType, Record<number, string>> = {
  0: {
    0: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
          <path d="M2,2 L2.5,0.5 M6,2 L6.5,0.5 M10,2 L10.5,0.5 M14,2 L14.5,0.5 M18,2 L17.5,0.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,2 L4,1 M12,2 L12,1 M16,2 L16,1" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
          <path d="M2,18 L2.5,19.5 M6,18 L6.5,19.5 M10,18 L10.5,19.5 M14,18 L14.5,19.5 M18,18 L17.5,19.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,18 L4,19 M12,18 L12,19 M16,18 L16,19" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
          <path d="M2,2 L0.5,2.5 M2,6 L0.5,6.5 M2,10 L0.5,10.5 M2,14 L0.5,14.5 M2,18 L0.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M2,4 L1,4 M2,12 L1,12 M2,16 L1,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M18,2 L19.5,2.5 M18,6 L19.5,6.5 M18,10 L19.5,10.5 M18,14 L19.5,14.5 M18,18 L19.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
        <path d="M18,4 L19,4 M18,12 L19,12 M18,16 L19,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/></svg>`,
    1: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
          <path d="M2,18 L2.5,19.5 M6,18 L6.5,19.5 M10,18 L10.5,19.5 M14,18 L14.5,19.5 M18,18 L17.5,19.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,18 L4,19 M12,18 L12,19 M16,18 L16,19" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
          <path d="M2,2 L0.5,2.5 M2,6 L0.5,6.5 M2,10 L0.5,10.5 M2,14 L0.5,14.5 M2,18 L0.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M2,4 L1,4 M2,12 L1,12 M2,16 L1,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M18,2 L19.5,2.5 M18,6 L19.5,6.5 M18,10 L19.5,10.5 M18,14 L19.5,14.5 M18,18 L19.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
        <path d="M18,4 L19,4 M18,12 L19,12 M18,16 L19,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/></svg>`,
    2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
          <path d="M2,2 L2.5,0.5 M6,2 L6.5,0.5 M10,2 L10.5,0.5 M14,2 L14.5,0.5 M18,2 L17.5,0.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,2 L4,1 M12,2 L12,1 M16,2 L16,1" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
          <path d="M2,2 L0.5,2.5 M2,6 L0.5,6.5 M2,10 L0.5,10.5 M2,14 L0.5,14.5 M2,18 L0.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M2,4 L1,4 M2,12 L1,12 M2,16 L1,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M18,2 L19.5,2.5 M18,6 L19.5,6.5 M18,10 L19.5,10.5 M18,14 L19.5,14.5 M18,18 L19.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
        <path d="M18,4 L19,4 M18,12 L19,12 M18,16 L19,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/></svg>`,
    3: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
          <path d="M2,2 L0.5,2.5 M2,6 L0.5,6.5 M2,10 L0.5,10.5 M2,14 L0.5,14.5 M2,18 L0.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M2,4 L1,4 M2,12 L1,12 M2,16 L1,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M18,2 L19.5,2.5 M18,6 L19.5,6.5 M18,10 L19.5,10.5 M18,14 L19.5,14.5 M18,18 L19.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
        <path d="M18,4 L19,4 M18,12 L19,12 M18,16 L19,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/></svg>`,
    4: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
          <path d="M2,2 L2.5,0.5 M6,2 L6.5,0.5 M10,2 L10.5,0.5 M14,2 L14.5,0.5 M18,2 L17.5,0.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,2 L4,1 M12,2 L12,1 M16,2 L16,1" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
          <path d="M2,18 L2.5,19.5 M6,18 L6.5,19.5 M10,18 L10.5,19.5 M14,18 L14.5,19.5 M18,18 L17.5,19.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,18 L4,19 M12,18 L12,19 M16,18 L16,19" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M18,2 L19.5,2.5 M18,6 L19.5,6.5 M18,10 L19.5,10.5 M18,14 L19.5,14.5 M18,18 L19.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
        <path d="M18,4 L19,4 M18,12 L19,12 M18,16 L19,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/></svg>`,
    5: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
          <path d="M2,18 L2.5,19.5 M6,18 L6.5,19.5 M10,18 L10.5,19.5 M14,18 L14.5,19.5 M18,18 L17.5,19.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,18 L4,19 M12,18 L12,19 M16,18 L16,19" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M18,2 L19.5,2.5 M18,6 L19.5,6.5 M18,10 L19.5,10.5 M18,14 L19.5,14.5 M18,18 L19.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
        <path d="M18,4 L19,4 M18,12 L19,12 M18,16 L19,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/></svg>`,
    6: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
          <path d="M2,2 L2.5,0.5 M6,2 L6.5,0.5 M10,2 L10.5,0.5 M14,2 L14.5,0.5 M18,2 L17.5,0.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,2 L4,1 M12,2 L12,1 M16,2 L16,1" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M18,2 L19.5,2.5 M18,6 L19.5,6.5 M18,10 L19.5,10.5 M18,14 L19.5,14.5 M18,18 L19.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
        <path d="M18,4 L19,4 M18,12 L19,12 M18,16 L19,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/></svg>`,
    7: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
        <path d="M18,2 L19.5,2.5 M18,6 L19.5,6.5 M18,10 L19.5,10.5 M18,14 L19.5,14.5 M18,18 L19.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
        <path d="M18,4 L19,4 M18,12 L19,12 M18,16 L19,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/></svg>`,
    8: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
          <path d="M2,2 L2.5,0.5 M6,2 L6.5,0.5 M10,2 L10.5,0.5 M14,2 L14.5,0.5 M18,2 L17.5,0.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,2 L4,1 M12,2 L12,1 M16,2 L16,1" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
          <path d="M2,18 L2.5,19.5 M6,18 L6.5,19.5 M10,18 L10.5,19.5 M14,18 L14.5,19.5 M18,18 L17.5,19.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,18 L4,19 M12,18 L12,19 M16,18 L16,19" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
          <path d="M2,2 L0.5,2.5 M2,6 L0.5,6.5 M2,10 L0.5,10.5 M2,14 L0.5,14.5 M2,18 L0.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M2,4 L1,4 M2,12 L1,12 M2,16 L1,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/></svg>`,
    9: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
          <path d="M2,18 L2.5,19.5 M6,18 L6.5,19.5 M10,18 L10.5,19.5 M14,18 L14.5,19.5 M18,18 L17.5,19.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,18 L4,19 M12,18 L12,19 M16,18 L16,19" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
          <path d="M2,2 L0.5,2.5 M2,6 L0.5,6.5 M2,10 L0.5,10.5 M2,14 L0.5,14.5 M2,18 L0.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M2,4 L1,4 M2,12 L1,12 M2,16 L1,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/></svg>`,
    10: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
          <path d="M2,2 L2.5,0.5 M6,2 L6.5,0.5 M10,2 L10.5,0.5 M14,2 L14.5,0.5 M18,2 L17.5,0.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,2 L4,1 M12,2 L12,1 M16,2 L16,1" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
          <path d="M2,2 L0.5,2.5 M2,6 L0.5,6.5 M2,10 L0.5,10.5 M2,14 L0.5,14.5 M2,18 L0.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M2,4 L1,4 M2,12 L1,12 M2,16 L1,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/></svg>`,
    11: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
          <path d="M2,2 L0.5,2.5 M2,6 L0.5,6.5 M2,10 L0.5,10.5 M2,14 L0.5,14.5 M2,18 L0.5,17.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M2,4 L1,4 M2,12 L1,12 M2,16 L1,16" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/></svg>`,
    12: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
          <path d="M2,2 L2.5,0.5 M6,2 L6.5,0.5 M10,2 L10.5,0.5 M14,2 L14.5,0.5 M18,2 L17.5,0.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,2 L4,1 M12,2 L12,1 M16,2 L16,1" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>
          <path d="M2,18 L2.5,19.5 M6,18 L6.5,19.5 M10,18 L10.5,19.5 M14,18 L14.5,19.5 M18,18 L17.5,19.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,18 L4,19 M12,18 L12,19 M16,18 L16,19" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/></svg>`,
    13: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
          <path d="M2,18 L2.5,19.5 M6,18 L6.5,19.5 M10,18 L10.5,19.5 M14,18 L14.5,19.5 M18,18 L17.5,19.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,18 L4,19 M12,18 L12,19 M16,18 L16,19" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/></svg>`,
    14: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
          <path d="M2,2 L2.5,0.5 M6,2 L6.5,0.5 M10,2 L10.5,0.5 M14,2 L14.5,0.5 M18,2 L17.5,0.5" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,2 L4,1 M12,2 L12,1 M16,2 L16,1" stroke="#4a7a28" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/></svg>`,
    15: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a20"/>
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/></svg>`,
  },
  1: {
    0: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
          <circle cx="2" cy="1" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="2" cy="19" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="1" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/>
        <circle cx="19" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/></svg>`,
    1: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
          <circle cx="2" cy="19" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="1" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/>
        <circle cx="19" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/></svg>`,
    2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
          <circle cx="2" cy="1" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="1" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/>
        <circle cx="19" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/></svg>`,
    3: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
          <circle cx="1" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/>
        <circle cx="19" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/></svg>`,
    4: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
          <circle cx="2" cy="1" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="2" cy="19" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/>
        <circle cx="19" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/></svg>`,
    5: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
          <circle cx="2" cy="19" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/>
        <circle cx="19" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/></svg>`,
    6: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
          <circle cx="2" cy="1" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/>
        <circle cx="19" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/></svg>`,
    7: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <circle cx="19" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
        <circle cx="19.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
        <circle cx="19" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/></svg>`,
    8: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
          <circle cx="2" cy="1" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="2" cy="19" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="1" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/></svg>`,
    9: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
          <circle cx="2" cy="19" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="1" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/></svg>`,
    10: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
          <circle cx="2" cy="1" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="1" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/></svg>`,
    11: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
          <circle cx="1" cy="2" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="6" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="10" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="0.5" cy="14" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="1" cy="18" r="0.3" fill="#a8854a" opacity="0.7"/></svg>`,
    12: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
          <circle cx="2" cy="1" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="2" cy="19" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/></svg>`,
    13: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
          <circle cx="2" cy="19" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="19.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="19" r="0.3" fill="#a8854a" opacity="0.7"/></svg>`,
    14: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
          <circle cx="2" cy="1" r="0.4" fill="#a8854a" opacity="0.7"/>
          <circle cx="5" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="9" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/>
          <circle cx="13" cy="0.5" r="0.4" fill="#a8854a" opacity="0.6"/>
          <circle cx="17" cy="1" r="0.3" fill="#a8854a" opacity="0.7"/></svg>`,
    15: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#c9a866"/>
        <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/></svg>`,
  },
  2: {
    0: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,1 Q3,0 6,1 T12,1 T18,1 T20,1" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,2.5 Q4,2 8,2.5 T16,2.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,18.5 Q3,19.5 6,18.5 T12,18.5 T18,18.5 T20,18.5" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,17.5 Q4,18 8,17.5 T16,17.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M1,0 Q0,3 1,6 T1,12 T1,18 T1,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M2.5,0 Q2,4 2.5,8 T2.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
        <path d="M19,0 Q20,3 19,6 T19,12 T19,18 T19,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
        <path d="M17.5,0 Q18,4 17.5,8 T17.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
    1: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,18.5 Q3,19.5 6,18.5 T12,18.5 T18,18.5 T20,18.5" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,17.5 Q4,18 8,17.5 T16,17.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M1,0 Q0,3 1,6 T1,12 T1,18 T1,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M2.5,0 Q2,4 2.5,8 T2.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
        <path d="M19,0 Q20,3 19,6 T19,12 T19,18 T19,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
        <path d="M17.5,0 Q18,4 17.5,8 T17.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
    2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,1 Q3,0 6,1 T12,1 T18,1 T20,1" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,2.5 Q4,2 8,2.5 T16,2.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M1,0 Q0,3 1,6 T1,12 T1,18 T1,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M2.5,0 Q2,4 2.5,8 T2.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
        <path d="M19,0 Q20,3 19,6 T19,12 T19,18 T19,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
        <path d="M17.5,0 Q18,4 17.5,8 T17.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
    3: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M1,0 Q0,3 1,6 T1,12 T1,18 T1,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M2.5,0 Q2,4 2.5,8 T2.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
        <path d="M19,0 Q20,3 19,6 T19,12 T19,18 T19,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
        <path d="M17.5,0 Q18,4 17.5,8 T17.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
    4: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,1 Q3,0 6,1 T12,1 T18,1 T20,1" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,2.5 Q4,2 8,2.5 T16,2.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,18.5 Q3,19.5 6,18.5 T12,18.5 T18,18.5 T20,18.5" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,17.5 Q4,18 8,17.5 T16,17.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
        <path d="M19,0 Q20,3 19,6 T19,12 T19,18 T19,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
        <path d="M17.5,0 Q18,4 17.5,8 T17.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
    5: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,18.5 Q3,19.5 6,18.5 T12,18.5 T18,18.5 T20,18.5" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,17.5 Q4,18 8,17.5 T16,17.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
        <path d="M19,0 Q20,3 19,6 T19,12 T19,18 T19,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
        <path d="M17.5,0 Q18,4 17.5,8 T17.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
    6: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,1 Q3,0 6,1 T12,1 T18,1 T20,1" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,2.5 Q4,2 8,2.5 T16,2.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
        <path d="M19,0 Q20,3 19,6 T19,12 T19,18 T19,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
        <path d="M17.5,0 Q18,4 17.5,8 T17.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
    7: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
        <path d="M19,0 Q20,3 19,6 T19,12 T19,18 T19,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
        <path d="M17.5,0 Q18,4 17.5,8 T17.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
    8: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,1 Q3,0 6,1 T12,1 T18,1 T20,1" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,2.5 Q4,2 8,2.5 T16,2.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,18.5 Q3,19.5 6,18.5 T12,18.5 T18,18.5 T20,18.5" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,17.5 Q4,18 8,17.5 T16,17.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M1,0 Q0,3 1,6 T1,12 T1,18 T1,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M2.5,0 Q2,4 2.5,8 T2.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
    9: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,18.5 Q3,19.5 6,18.5 T12,18.5 T18,18.5 T20,18.5" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,17.5 Q4,18 8,17.5 T16,17.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M1,0 Q0,3 1,6 T1,12 T1,18 T1,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M2.5,0 Q2,4 2.5,8 T2.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
    10: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,1 Q3,0 6,1 T12,1 T18,1 T20,1" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,2.5 Q4,2 8,2.5 T16,2.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M1,0 Q0,3 1,6 T1,12 T1,18 T1,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M2.5,0 Q2,4 2.5,8 T2.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
    11: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M1,0 Q0,3 1,6 T1,12 T1,18 T1,20" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M2.5,0 Q2,4 2.5,8 T2.5,16" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
    12: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,1 Q3,0 6,1 T12,1 T18,1 T20,1" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,2.5 Q4,2 8,2.5 T16,2.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,18.5 Q3,19.5 6,18.5 T12,18.5 T18,18.5 T20,18.5" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,17.5 Q4,18 8,17.5 T16,17.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
    13: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,18.5 Q3,19.5 6,18.5 T12,18.5 T18,18.5 T20,18.5" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,17.5 Q4,18 8,17.5 T16,17.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
    14: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
          <path d="M0,1 Q3,0 6,1 T12,1 T18,1 T20,1" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,2.5 Q4,2 8,2.5 T16,2.5" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
    15: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#3a5a8a"/>
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/></svg>`,
  },
  3: {
    0: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
          <path d="M3,2 L3,0.5 M8,2 L8.5,0.5 M14,2 L13.5,0.5 M17,2 L17,0.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,2 L5.5,0.8 M11,2 L10.5,0.8 M16,2 L16.5,0.8" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
          <path d="M3,18 L3,19.5 M8,18 L8.5,19.5 M14,18 L13.5,19.5 M17,18 L17,19.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,18 L5.5,19.2 M11,18 L10.5,19.2 M16,18 L16.5,19.2" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
          <path d="M2,3 L0.5,3 M2,8 L0.5,8.5 M2,14 L0.5,13.5 M2,17 L0.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M2,5 L0.8,5.5 M2,11 L0.8,10.5 M2,16 L0.8,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
        <path d="M18,3 L19.5,3 M18,8 L19.5,8.5 M18,14 L19.5,13.5 M18,17 L19.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
        <path d="M18,5 L19.2,5.5 M18,11 L19.2,10.5 M18,16 L19.2,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/></svg>`,
    1: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
          <path d="M3,18 L3,19.5 M8,18 L8.5,19.5 M14,18 L13.5,19.5 M17,18 L17,19.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,18 L5.5,19.2 M11,18 L10.5,19.2 M16,18 L16.5,19.2" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
          <path d="M2,3 L0.5,3 M2,8 L0.5,8.5 M2,14 L0.5,13.5 M2,17 L0.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M2,5 L0.8,5.5 M2,11 L0.8,10.5 M2,16 L0.8,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
        <path d="M18,3 L19.5,3 M18,8 L19.5,8.5 M18,14 L19.5,13.5 M18,17 L19.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
        <path d="M18,5 L19.2,5.5 M18,11 L19.2,10.5 M18,16 L19.2,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/></svg>`,
    2: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
          <path d="M3,2 L3,0.5 M8,2 L8.5,0.5 M14,2 L13.5,0.5 M17,2 L17,0.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,2 L5.5,0.8 M11,2 L10.5,0.8 M16,2 L16.5,0.8" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
          <path d="M2,3 L0.5,3 M2,8 L0.5,8.5 M2,14 L0.5,13.5 M2,17 L0.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M2,5 L0.8,5.5 M2,11 L0.8,10.5 M2,16 L0.8,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
        <path d="M18,3 L19.5,3 M18,8 L19.5,8.5 M18,14 L19.5,13.5 M18,17 L19.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
        <path d="M18,5 L19.2,5.5 M18,11 L19.2,10.5 M18,16 L19.2,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/></svg>`,
    3: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
          <path d="M2,3 L0.5,3 M2,8 L0.5,8.5 M2,14 L0.5,13.5 M2,17 L0.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M2,5 L0.8,5.5 M2,11 L0.8,10.5 M2,16 L0.8,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
        <path d="M18,3 L19.5,3 M18,8 L19.5,8.5 M18,14 L19.5,13.5 M18,17 L19.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
        <path d="M18,5 L19.2,5.5 M18,11 L19.2,10.5 M18,16 L19.2,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/></svg>`,
    4: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
          <path d="M3,2 L3,0.5 M8,2 L8.5,0.5 M14,2 L13.5,0.5 M17,2 L17,0.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,2 L5.5,0.8 M11,2 L10.5,0.8 M16,2 L16.5,0.8" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
          <path d="M3,18 L3,19.5 M8,18 L8.5,19.5 M14,18 L13.5,19.5 M17,18 L17,19.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,18 L5.5,19.2 M11,18 L10.5,19.2 M16,18 L16.5,19.2" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
        <path d="M18,3 L19.5,3 M18,8 L19.5,8.5 M18,14 L19.5,13.5 M18,17 L19.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
        <path d="M18,5 L19.2,5.5 M18,11 L19.2,10.5 M18,16 L19.2,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/></svg>`,
    5: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
          <path d="M3,18 L3,19.5 M8,18 L8.5,19.5 M14,18 L13.5,19.5 M17,18 L17,19.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,18 L5.5,19.2 M11,18 L10.5,19.2 M16,18 L16.5,19.2" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
        <path d="M18,3 L19.5,3 M18,8 L19.5,8.5 M18,14 L19.5,13.5 M18,17 L19.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
        <path d="M18,5 L19.2,5.5 M18,11 L19.2,10.5 M18,16 L19.2,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/></svg>`,
    6: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
          <path d="M3,2 L3,0.5 M8,2 L8.5,0.5 M14,2 L13.5,0.5 M17,2 L17,0.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,2 L5.5,0.8 M11,2 L10.5,0.8 M16,2 L16.5,0.8" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
        <path d="M18,3 L19.5,3 M18,8 L19.5,8.5 M18,14 L19.5,13.5 M18,17 L19.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
        <path d="M18,5 L19.2,5.5 M18,11 L19.2,10.5 M18,16 L19.2,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/></svg>`,
    7: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
        <path d="M18,3 L19.5,3 M18,8 L19.5,8.5 M18,14 L19.5,13.5 M18,17 L19.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
        <path d="M18,5 L19.2,5.5 M18,11 L19.2,10.5 M18,16 L19.2,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/></svg>`,
    8: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
          <path d="M3,2 L3,0.5 M8,2 L8.5,0.5 M14,2 L13.5,0.5 M17,2 L17,0.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,2 L5.5,0.8 M11,2 L10.5,0.8 M16,2 L16.5,0.8" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
          <path d="M3,18 L3,19.5 M8,18 L8.5,19.5 M14,18 L13.5,19.5 M17,18 L17,19.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,18 L5.5,19.2 M11,18 L10.5,19.2 M16,18 L16.5,19.2" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
          <path d="M2,3 L0.5,3 M2,8 L0.5,8.5 M2,14 L0.5,13.5 M2,17 L0.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M2,5 L0.8,5.5 M2,11 L0.8,10.5 M2,16 L0.8,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/></svg>`,
    9: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
          <path d="M3,18 L3,19.5 M8,18 L8.5,19.5 M14,18 L13.5,19.5 M17,18 L17,19.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,18 L5.5,19.2 M11,18 L10.5,19.2 M16,18 L16.5,19.2" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
          <path d="M2,3 L0.5,3 M2,8 L0.5,8.5 M2,14 L0.5,13.5 M2,17 L0.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M2,5 L0.8,5.5 M2,11 L0.8,10.5 M2,16 L0.8,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/></svg>`,
    10: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
          <path d="M3,2 L3,0.5 M8,2 L8.5,0.5 M14,2 L13.5,0.5 M17,2 L17,0.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,2 L5.5,0.8 M11,2 L10.5,0.8 M16,2 L16.5,0.8" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
          <path d="M2,3 L0.5,3 M2,8 L0.5,8.5 M2,14 L0.5,13.5 M2,17 L0.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M2,5 L0.8,5.5 M2,11 L0.8,10.5 M2,16 L0.8,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/></svg>`,
    11: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
          <path d="M2,3 L0.5,3 M2,8 L0.5,8.5 M2,14 L0.5,13.5 M2,17 L0.5,17" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M2,5 L0.8,5.5 M2,11 L0.8,10.5 M2,16 L0.8,16.5" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/></svg>`,
    12: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
          <path d="M3,2 L3,0.5 M8,2 L8.5,0.5 M14,2 L13.5,0.5 M17,2 L17,0.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,2 L5.5,0.8 M11,2 L10.5,0.8 M16,2 L16.5,0.8" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/>
          <path d="M3,18 L3,19.5 M8,18 L8.5,19.5 M14,18 L13.5,19.5 M17,18 L17,19.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,18 L5.5,19.2 M11,18 L10.5,19.2 M16,18 L16.5,19.2" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/></svg>`,
    13: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
          <path d="M3,18 L3,19.5 M8,18 L8.5,19.5 M14,18 L13.5,19.5 M17,18 L17,19.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,18 L5.5,19.2 M11,18 L10.5,19.2 M16,18 L16.5,19.2" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/></svg>`,
    14: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
          <path d="M3,2 L3,0.5 M8,2 L8.5,0.5 M14,2 L13.5,0.5 M17,2 L17,0.5" stroke="#3a3a52" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,2 L5.5,0.8 M11,2 L10.5,0.8 M16,2 L16.5,0.8" stroke="#3a3a52" stroke-width="0.3" fill="none" opacity="0.6"/></svg>`,
    15: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="#6a6a72"/>
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/></svg>`,
  },
};

// 角点变体：4 地形 × 4 角 × 2 variant = 32 张
export const TERRAIN_AUTO_CORNER: Record<TerrainType, Record<Corner, Record<CornerVariant, string>>> = {
  0: {
    tl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M6,6 L4,4 M6,6 L2,2 M6,6 L0,4 M6,6 L0,6" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="2" cy="2" r="0.8" fill="#6a9a40" opacity="0.85"/><path d="M2,2 L0,0" stroke="#5a8a35" stroke-width="0.5" stroke-linecap="round" opacity="0.85"/></svg>`,
    },
    tr: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M2,6 L4,4 M2,6 L6,2 M2,6 L8,4 M2,6 L8,6" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="6" cy="2" r="0.8" fill="#6a9a40" opacity="0.85"/><path d="M6,2 L8,0" stroke="#5a8a35" stroke-width="0.5" stroke-linecap="round" opacity="0.85"/></svg>`,
    },
    bl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M6,2 L4,4 M6,2 L2,6 M6,2 L0,4 M6,2 L0,2" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="2" cy="6" r="0.8" fill="#6a9a40" opacity="0.85"/><path d="M2,6 L0,8" stroke="#5a8a35" stroke-width="0.5" stroke-linecap="round" opacity="0.85"/></svg>`,
    },
    br: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M2,2 L4,4 M2,2 L6,6 M2,2 L8,4 M2,2 L8,2" stroke="#5a8a35" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="6" cy="6" r="0.8" fill="#6a9a40" opacity="0.85"/><path d="M6,6 L8,8" stroke="#5a8a35" stroke-width="0.5" stroke-linecap="round" opacity="0.85"/></svg>`,
    },
  },
  1: {
    tl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="1" cy="1" r="0.5" fill="#a8854a" opacity="0.9"/><circle cx="3" cy="0.5" r="0.4" fill="#a8854a" opacity="0.7200000000000001"/><circle cx="0.5" cy="3" r="0.4" fill="#a8854a" opacity="0.7200000000000001"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="1" cy="1" r="0.7" fill="#b8965a" opacity="0.85"/><circle cx="2.5" cy="0.5" r="0.3" fill="#a8854a" opacity="0.85"/></svg>`,
    },
    tr: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="7" cy="1" r="0.5" fill="#a8854a" opacity="0.9"/><circle cx="5" cy="0.5" r="0.4" fill="#a8854a" opacity="0.7200000000000001"/><circle cx="7.5" cy="3" r="0.4" fill="#a8854a" opacity="0.7200000000000001"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="7" cy="1" r="0.7" fill="#b8965a" opacity="0.85"/><circle cx="5.5" cy="0.5" r="0.3" fill="#a8854a" opacity="0.85"/></svg>`,
    },
    bl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="1" cy="7" r="0.5" fill="#a8854a" opacity="0.9"/><circle cx="3" cy="7.5" r="0.4" fill="#a8854a" opacity="0.7200000000000001"/><circle cx="0.5" cy="5" r="0.4" fill="#a8854a" opacity="0.7200000000000001"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="1" cy="7" r="0.7" fill="#b8965a" opacity="0.85"/><circle cx="2.5" cy="7.5" r="0.3" fill="#a8854a" opacity="0.85"/></svg>`,
    },
    br: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="7" cy="7" r="0.5" fill="#a8854a" opacity="0.9"/><circle cx="5" cy="7.5" r="0.4" fill="#a8854a" opacity="0.7200000000000001"/><circle cx="7.5" cy="5" r="0.4" fill="#a8854a" opacity="0.7200000000000001"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="7" cy="7" r="0.7" fill="#b8965a" opacity="0.85"/><circle cx="5.5" cy="7.5" r="0.3" fill="#a8854a" opacity="0.85"/></svg>`,
    },
  },
  2: {
    tl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M0,4 Q2,2 4,4 M0,2 Q3,0 6,2" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M0,2 Q2,0 4,2 M0,4 Q2,2 4,4" stroke="#a8c0e0" stroke-width="0.4" fill="none" opacity="0.85"/></svg>`,
    },
    tr: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M8,4 Q6,2 4,4 M8,2 Q5,0 2,2" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M8,2 Q6,0 4,2 M8,4 Q6,2 4,4" stroke="#a8c0e0" stroke-width="0.4" fill="none" opacity="0.85"/></svg>`,
    },
    bl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M0,4 Q2,6 4,4 M0,6 Q3,8 6,6" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M0,6 Q2,8 4,6 M0,4 Q2,6 4,4" stroke="#a8c0e0" stroke-width="0.4" fill="none" opacity="0.85"/></svg>`,
    },
    br: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M8,4 Q6,6 4,4 M8,6 Q5,8 2,6" stroke="#a8c0e0" stroke-width="0.5" fill="none" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M8,6 Q6,8 4,6 M8,4 Q6,6 4,4" stroke="#a8c0e0" stroke-width="0.4" fill="none" opacity="0.85"/></svg>`,
    },
  },
  3: {
    tl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><polygon points="0,4 3,1 5,3 4,5 1,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><polygon points="0,3 2,0 4,2 3,4 1,4" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3" opacity="0.85"/></svg>`,
    },
    tr: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><polygon points="8,4 5,1 3,3 4,5 7,5" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><polygon points="8,3 6,0 4,2 5,4 7,4" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3" opacity="0.85"/></svg>`,
    },
    bl: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><polygon points="0,4 3,7 5,5 4,3 1,3" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><polygon points="0,5 2,8 4,6 3,4 1,4" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3" opacity="0.85"/></svg>`,
    },
    br: {
      convex: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><polygon points="8,4 5,7 3,5 4,3 7,3" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3" opacity="0.9"/></svg>`,
      concave: `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><polygon points="8,5 6,8 4,6 5,4 7,4" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3" opacity="0.85"/></svg>`,
    },
  },
};
