// TerrainAdjacency - 24-tile 自动地形过渡的邻接关系工具
// 提供纯函数：edge mask / corner mask 计算 + 角点查表
// 输入：TerrainGrid 接口（任何有 getTerrainAt(x,y) 方法的对象）
// 输出：用于 AssetRegistry 查找的 (terrain, edgeMask, cornerVariant) 三元组
import type { TerrainType } from './assets/TerrainTiles';

export type EdgeMask = number; // 0..15，位布局：bit0=up, bit1=down, bit2=left, bit3=right
export type CornerMask = number; // 0..15，位布局：bit0=TL, bit1=TR, bit2=BL, bit3=BR
export type Corner = 'tl' | 'tr' | 'bl' | 'br';
export type CornerVariant = 'convex' | 'concave';

export interface CornerDrawResult {
  draw: boolean;
  variant: CornerVariant;
}

// 8 邻居地形查询接口
// 越界返回 0（草地），与"无数据即草地"的语义一致
export interface TerrainGrid {
  getTerrainAt(x: number, y: number): TerrainType;
}

// === Edge Mask ===
// bit0=上, bit1=下, bit2=左, bit3=右
// 值为 1 表示该方向与中心 cell 同地形
export function computeEdgeMask(grid: TerrainGrid, x: number, y: number): EdgeMask {
  const t = grid.getTerrainAt(x, y);
  let mask = 0;
  if (grid.getTerrainAt(x, y - 1) === t) mask |= 1; // up
  if (grid.getTerrainAt(x, y + 1) === t) mask |= 2; // down
  if (grid.getTerrainAt(x - 1, y) === t) mask |= 4; // left
  if (grid.getTerrainAt(x + 1, y) === t) mask |= 8; // right
  return mask;
}

// === Corner Mask ===
// bit0=TL, bit1=TR, bit2=BL, bit3=BR
// 值为 1 表示该对角 cell 与中心 cell 同地形
export function computeCornerMask(grid: TerrainGrid, x: number, y: number): CornerMask {
  const t = grid.getTerrainAt(x, y);
  let mask = 0;
  if (grid.getTerrainAt(x - 1, y - 1) === t) mask |= 1; // TL
  if (grid.getTerrainAt(x + 1, y - 1) === t) mask |= 2; // TR
  if (grid.getTerrainAt(x - 1, y + 1) === t) mask |= 4; // BL
  if (grid.getTerrainAt(x + 1, y + 1) === t) mask |= 8; // BR
  return mask;
}

// === 角点查表 ===
// 凸角（Convex）：中心 cell 的地形"延伸"出尖角 → 需在角点叠加填充
// 凹角（Concave）：中心 cell 的地形"退缩" → 需在角点反向填补
//
// 触发条件（以 TL 角为例，其他 3 角对称）：
//   上=同类 AND 左=同类 AND 对角TL=异类 → 凸角（画 tl-convex 8x8 角贴片）
//   上=异类 AND 左=异类 AND 对角TL=同类 → 凹角（画 tl-concave 8x8 角贴片）
//   其他情况 → 跳过
const CORNER_CONFIG: Record<Corner, { upBit: number; sideBit: number; diagBit: number }> = {
  tl: { upBit: 1, sideBit: 4, diagBit: 1 }, // up + left + TL
  tr: { upBit: 1, sideBit: 8, diagBit: 2 }, // up + right + TR
  bl: { upBit: 2, sideBit: 4, diagBit: 4 }, // down + left + BL
  br: { upBit: 2, sideBit: 8, diagBit: 8 }, // down + right + BR
};

export function shouldDrawCorner(
  corner: Corner,
  edgeMask: EdgeMask,
  cornerMask: CornerMask,
): CornerDrawResult {
  const cfg = CORNER_CONFIG[corner];
  const upSame = (edgeMask & cfg.upBit) !== 0;
  const sideSame = (edgeMask & cfg.sideBit) !== 0;
  const diagSame = (cornerMask & cfg.diagBit) !== 0;

  if (upSame && sideSame && !diagSame) return { draw: true, variant: 'convex' };
  if (!upSame && !sideSame && diagSame) return { draw: true, variant: 'concave' };
  return { draw: false, variant: 'convex' };
}

// === 便捷：一次计算 4 角的查表结果 ===
// 返回 4 个角点的查表结果数组（索引顺序：tl, tr, bl, br）
export function computeAllCorners(
  edgeMask: EdgeMask,
  cornerMask: CornerMask,
): [CornerDrawResult, CornerDrawResult, CornerDrawResult, CornerDrawResult] {
  return [
    shouldDrawCorner('tl', edgeMask, cornerMask),
    shouldDrawCorner('tr', edgeMask, cornerMask),
    shouldDrawCorner('bl', edgeMask, cornerMask),
    shouldDrawCorner('br', edgeMask, cornerMask),
  ];
}

// === Adaptor: WorldGrid ===
// 把 WorldGrid (cells[y*width+x].terrain) 适配为 TerrainGrid
export function makeWorldGridAdapter(
  cells: ArrayLike<{ terrain: number }>,
  width: number,
  _height: number,
): TerrainGrid {
  return {
    getTerrainAt(x, y) {
      if (x < 0 || y < 0 || x >= width) return 0;
      const idx = y * width + x;
      const c = cells[idx];
      if (!c) return 0;
      return c.terrain as TerrainType;
    },
  };
}

// === Adaptor: PreviewGridData (从 MapPreviewRenderer 复用) ===
// 用 Map<number, number> (idx → terrain) 做快速查询
export function makePreviewGridAdapter(
  cellMap: Map<number, { terrain: number }>,
  width: number,
): TerrainGrid {
  return {
    getTerrainAt(x, y) {
      if (x < 0 || y < 0) return 0;
      const idx = y * width + x;
      const c = cellMap.get(idx);
      if (!c) return 0;
      return c.terrain as TerrainType;
    },
  };
}
