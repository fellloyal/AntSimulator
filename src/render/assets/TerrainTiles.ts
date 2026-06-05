// TerrainTiles - 4 种地形 SVG 常量
export type TerrainType = 0 | 1 | 2 | 3; // 0=grass 1=sand 2=water 3=rock

export interface TerrainTile {
  id: 'grass' | 'sand' | 'water' | 'rock';
  svg: string;
  bg: string;
  accent: string;
  passable: boolean;
}

export const TERRAIN_TILES: Record<TerrainType, TerrainTile> = {
  0: {
    id: 'grass',
    bg: '#3a5a20',
    accent: '#5a8a35',
    passable: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <rect width="20" height="20" fill="#3a5a20"/>
      <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" fill="none" stroke-linecap="round"/>
      <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" fill="none" stroke-linecap="round"/>
      <circle cx="3" cy="3" r="0.5" fill="#6a9a40" opacity="0.4"/>
      <circle cx="14" cy="14" r="0.4" fill="#6a9a40" opacity="0.4"/>
      <circle cx="7" cy="6" r="0.3" fill="#6a9a40" opacity="0.3"/>
    </svg>`,
  },
  1: {
    id: 'sand',
    bg: '#c9a866',
    accent: '#a8854a',
    passable: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <rect width="20" height="20" fill="#c9a866"/>
      <circle cx="3" cy="3" r="0.6" fill="#a8854a" opacity="0.5"/>
      <circle cx="14" cy="7" r="0.5" fill="#a8854a" opacity="0.4"/>
      <circle cx="7" cy="14" r="0.5" fill="#a8854a" opacity="0.5"/>
      <circle cx="17" cy="13" r="0.4" fill="#a8854a" opacity="0.4"/>
      <path d="M2,12 Q5,11 8,12" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
      <path d="M10,5 Q13,4 16,5" stroke="#a8854a" stroke-width="0.3" fill="none" opacity="0.5"/>
    </svg>`,
  },
  2: {
    id: 'water',
    bg: '#3a5a8a',
    accent: '#7a9aca',
    passable: false,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <rect width="20" height="20" fill="#3a5a8a"/>
      <path d="M0,5 Q5,3 10,5 T20,5" stroke="#7a9aca" stroke-width="0.6" fill="none" opacity="0.7"/>
      <path d="M0,10 Q5,8 10,10 T20,10" stroke="#7a9aca" stroke-width="0.5" fill="none" opacity="0.6"/>
      <path d="M0,15 Q5,13 10,15 T20,15" stroke="#7a9aca" stroke-width="0.4" fill="none" opacity="0.5"/>
    </svg>`,
  },
  3: {
    id: 'rock',
    bg: '#6a6a72',
    accent: '#8a8a92',
    // UI美化（task 20）：石头地形自动挡路（与 water 一致）
    passable: false,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <rect width="20" height="20" fill="#6a6a72"/>
      <polygon points="3,8 8,4 13,9 10,14 5,13" fill="#8a8a92" stroke="#3a3a52" stroke-width="0.3"/>
      <polygon points="14,15 18,12 19,18 16,19" fill="#7a7a82" stroke="#3a3a52" stroke-width="0.3"/>
      <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="#3a3a52" stroke-width="0.3"/>
    </svg>`,
  },
};

export function isTerrainPassable(t: TerrainType): boolean {
  return TERRAIN_TILES[t].passable;
}
