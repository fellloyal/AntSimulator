// ObstacleTiles - 4 种障碍物 SVG 常量
// 设计要点：12x12 正方形 viewBox，对称 2x2 砖块布局
// 这样无论横竖向放置，砖块图案都能无缝拼接成连续线条
export type ObstacleType = 0 | 1 | 2 | 3 | 4; // 0=none 1=brick 2=ice 3=wood 4=fence

export interface ObstacleTile {
  id: 'none' | 'brick' | 'ice' | 'wood' | 'fence';
  svg: string;
}

export const OBSTACLE_TILES: Record<ObstacleType, ObstacleTile> = {
  0: { id: 'none', svg: '' },
  1: {
    id: 'brick',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
      <rect width="12" height="6" fill="#a04020" stroke="#3a1808" stroke-width="0.3"/>
      <rect y="6" width="12" height="6" fill="#8a3818" stroke="#3a1808" stroke-width="0.3"/>
      <line x1="0" y1="6" x2="12" y2="6" stroke="#2a0808" stroke-width="0.3"/>
      <line x1="6" y1="0" x2="6" y2="12" stroke="#2a0808" stroke-width="0.3"/>
    </svg>`,
  },
  2: {
    id: 'ice',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
      <rect width="12" height="6" fill="#a0c8e8" stroke="#3a5a7a" stroke-width="0.3"/>
      <rect y="6" width="12" height="6" fill="#80b0d8" stroke="#3a5a7a" stroke-width="0.3"/>
      <line x1="0" y1="6" x2="12" y2="6" stroke="#1a3a5a" stroke-width="0.3"/>
      <line x1="6" y1="0" x2="6" y2="12" stroke="#1a3a5a" stroke-width="0.3"/>
    </svg>`,
  },
  3: {
    id: 'wood',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
      <rect width="12" height="6" fill="#a08050" stroke="#3a2010" stroke-width="0.3"/>
      <rect y="6" width="12" height="6" fill="#806040" stroke="#3a2010" stroke-width="0.3"/>
      <line x1="0" y1="6" x2="12" y2="6" stroke="#2a1a08" stroke-width="0.3"/>
      <line x1="6" y1="0" x2="6" y2="12" stroke="#2a1a08" stroke-width="0.3"/>
    </svg>`,
  },
  4: {
    id: 'fence',
    // 围栏：上下两条横杆 + 中间两根立柱，对称布局
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
      <rect width="12" height="12" fill="#7a7a82" stroke="#1a1a22" stroke-width="0.3"/>
      <line x1="0" y1="3" x2="12" y2="3" stroke="#1a1a22" stroke-width="0.4"/>
      <line x1="0" y1="9" x2="12" y2="9" stroke="#1a1a22" stroke-width="0.4"/>
      <line x1="3" y1="0" x2="3" y2="12" stroke="#1a1a22" stroke-width="0.5"/>
      <line x1="9" y1="0" x2="9" y2="12" stroke="#1a1a22" stroke-width="0.5"/>
    </svg>`,
  },
};
