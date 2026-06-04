// ObstacleTiles - 4 种障碍物 SVG 常量
export type ObstacleType = 0 | 1 | 2 | 3 | 4; // 0=none 1=brick 2=ice 3=wood 4=fence

export interface ObstacleTile {
  id: 'none' | 'brick' | 'ice' | 'wood' | 'fence';
  svg: string;
}

export const OBSTACLE_TILES: Record<ObstacleType, ObstacleTile> = {
  0: { id: 'none', svg: '' },
  1: {
    id: 'brick',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 24 12">
      <rect width="24" height="6" fill="#a04020" stroke="#3a1808" stroke-width="0.3"/>
      <rect y="6" width="24" height="6" fill="#8a3818" stroke="#3a1808" stroke-width="0.3"/>
      <line x1="0" y1="6" x2="24" y2="6" stroke="#2a0808" stroke-width="0.3"/>
      <line x1="12" y1="0" x2="12" y2="6" stroke="#2a0808" stroke-width="0.3"/>
      <line x1="6" y1="6" x2="6" y2="12" stroke="#2a0808" stroke-width="0.3"/>
      <line x1="18" y1="6" x2="18" y2="12" stroke="#2a0808" stroke-width="0.3"/>
    </svg>`,
  },
  2: {
    id: 'ice',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 24 12">
      <rect width="24" height="6" fill="#a0c8e8" stroke="#3a5a7a" stroke-width="0.3"/>
      <rect y="6" width="24" height="6" fill="#80b0d8" stroke="#3a5a7a" stroke-width="0.3"/>
      <line x1="0" y1="6" x2="24" y2="6" stroke="#1a3a5a" stroke-width="0.3"/>
      <line x1="12" y1="0" x2="12" y2="6" stroke="#1a3a5a" stroke-width="0.3"/>
      <line x1="6" y1="6" x2="6" y2="12" stroke="#1a3a5a" stroke-width="0.3"/>
      <line x1="18" y1="6" x2="18" y2="12" stroke="#1a3a5a" stroke-width="0.3"/>
    </svg>`,
  },
  3: {
    id: 'wood',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 24 12">
      <rect width="24" height="6" fill="#a08050" stroke="#3a2010" stroke-width="0.3"/>
      <rect y="6" width="24" height="6" fill="#806040" stroke="#3a2010" stroke-width="0.3"/>
      <line x1="0" y1="6" x2="24" y2="6" stroke="#2a1a08" stroke-width="0.3"/>
      <line x1="12" y1="0" x2="12" y2="6" stroke="#2a1a08" stroke-width="0.3"/>
      <line x1="6" y1="6" x2="6" y2="12" stroke="#2a1a08" stroke-width="0.3"/>
      <line x1="18" y1="6" x2="18" y2="12" stroke="#2a1a08" stroke-width="0.3"/>
    </svg>`,
  },
  4: {
    id: 'fence',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 24 12">
      <rect width="24" height="6" fill="#7a7a82" stroke="#1a1a22" stroke-width="0.3"/>
      <rect y="6" width="24" height="6" fill="#5a5a62" stroke="#1a1a22" stroke-width="0.3"/>
      <line x1="4" y1="0" x2="4" y2="6" stroke="#1a1a22" stroke-width="0.5"/>
      <line x1="12" y1="0" x2="12" y2="6" stroke="#1a1a22" stroke-width="0.5"/>
      <line x1="20" y1="0" x2="20" y2="6" stroke="#1a1a22" stroke-width="0.5"/>
      <line x1="0" y1="6" x2="24" y2="6" stroke="#1a1a22" stroke-width="0.4"/>
    </svg>`,
  },
};
