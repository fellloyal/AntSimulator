#!/usr/bin/env node
// scripts/generate-terrain-tiles.mjs
// 24-tile 自动地形过渡的 SVG 资源生成器
// 输入：4 种基础地形（TERRAIN_TILES）
// 输出：src/render/assets/TerrainAutoTiles.ts
//       - 4 地形 × (16 边变体 + 4 角点变体) = 80 张 SVG
//
// 位布局约定（与 TerrainAdjacency.ts 一致）：
//   edgeMask: bit0=up, bit1=down, bit2=left, bit3=right
//   cornerMask: bit0=TL, bit1=TR, bit2=BL, bit3=BR
//   mask=0 表示该方向是异类，需要 feathering

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_PATH = path.join(ROOT, 'src', 'render', 'assets', 'TerrainAutoTiles.ts');

// ============================================================
// 基础地形定义（与 TerrainTiles.ts 保持一致的颜色/标识）
// ============================================================
const TERRAINS = [
  {
    id: 'grass',
    bg: '#3a5a20',
    accent: '#5a8a35',
    accent2: '#4a7a28',
    accentLight: '#6a9a40',
  },
  {
    id: 'sand',
    bg: '#c9a866',
    accent: '#a8854a',
    accentLight: '#b8965a',
  },
  {
    id: 'water',
    bg: '#3a5a8a',
    accent: '#7a9aca',
    accentLight: '#a8c0e0',
    accentDark: '#2a4a7a',
  },
  {
    id: 'rock',
    bg: '#6a6a72',
    accent: '#8a8a92',
    accent2: '#7a7a82',
    accentDark: '#3a3a52',
  },
];

// ============================================================
// 内部纹理（与 TerrainTiles.ts 保持一致）
// ============================================================
function internalTexture(t) {
  switch (t.id) {
    case 'grass':
      return `
        <path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="${t.accent}" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="${t.accent2}" stroke-width="0.5" fill="none" stroke-linecap="round"/>
        <circle cx="3" cy="3" r="0.5" fill="${t.accentLight}" opacity="0.4"/>
        <circle cx="14" cy="14" r="0.4" fill="${t.accentLight}" opacity="0.4"/>
        <circle cx="7" cy="6" r="0.3" fill="${t.accentLight}" opacity="0.3"/>`;
    case 'sand':
      return `
        <circle cx="3" cy="3" r="0.6" fill="${t.accent}" opacity="0.5"/>
        <circle cx="14" cy="7" r="0.5" fill="${t.accent}" opacity="0.4"/>
        <circle cx="7" cy="14" r="0.5" fill="${t.accent}" opacity="0.5"/>
        <circle cx="17" cy="13" r="0.4" fill="${t.accent}" opacity="0.4"/>
        <path d="M2,12 Q5,11 8,12" stroke="${t.accent}" stroke-width="0.3" fill="none" opacity="0.5"/>
        <path d="M10,5 Q13,4 16,5" stroke="${t.accent}" stroke-width="0.3" fill="none" opacity="0.5"/>`;
    case 'water':
      return `
        <path d="M0,5 Q5,3 10,5 T20,5" stroke="${t.accent}" stroke-width="0.6" fill="none" opacity="0.7"/>
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="${t.accent}" stroke-width="0.5" fill="none" opacity="0.6"/>
        <path d="M0,15 Q5,13 10,15 T20,15" stroke="${t.accent}" stroke-width="0.4" fill="none" opacity="0.5"/>`;
    case 'rock':
      return `
        <polygon points="3,8 8,4 13,9 10,14 5,13" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="0.3"/>
        <polygon points="14,15 18,12 19,18 16,19" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="0.3"/>
        <polygon points="2,17 5,16 6,19 3,19" fill="#9a9aa2" stroke="${t.accentDark}" stroke-width="0.3"/>`;
  }
  return '';
}

// ============================================================
// Edge feathering（4 边各异）
// 每种地形在 cell 边缘画一组向外延伸的小元素（草尖/沙粒/水波/碎裂纹）
// ============================================================
function edgeFeather(t, side) {
  // side: 'top' | 'bottom' | 'left' | 'right'
  // feathering 集中在边缘 1-3px 范围
  switch (t.id) {
    case 'grass': {
      // 草尖：每边 3-4 个小尖刺
      if (side === 'top') {
        return `
          <path d="M2,2 L2.5,0.5 M6,2 L6.5,0.5 M10,2 L10.5,0.5 M14,2 L14.5,0.5 M18,2 L17.5,0.5" stroke="${t.accent}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,2 L4,1 M12,2 L12,1 M16,2 L16,1" stroke="${t.accent2}" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>`;
      }
      if (side === 'bottom') {
        return `
          <path d="M2,18 L2.5,19.5 M6,18 L6.5,19.5 M10,18 L10.5,19.5 M14,18 L14.5,19.5 M18,18 L17.5,19.5" stroke="${t.accent}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M4,18 L4,19 M12,18 L12,19 M16,18 L16,19" stroke="${t.accent2}" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>`;
      }
      if (side === 'left') {
        return `
          <path d="M2,2 L0.5,2.5 M2,6 L0.5,6.5 M2,10 L0.5,10.5 M2,14 L0.5,14.5 M2,18 L0.5,17.5" stroke="${t.accent}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
          <path d="M2,4 L1,4 M2,12 L1,12 M2,16 L1,16" stroke="${t.accent2}" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>`;
      }
      // right
      return `
        <path d="M18,2 L19.5,2.5 M18,6 L19.5,6.5 M18,10 L19.5,10.5 M18,14 L19.5,14.5 M18,18 L19.5,17.5" stroke="${t.accent}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/>
        <path d="M18,4 L19,4 M18,12 L19,12 M18,16 L19,16" stroke="${t.accent2}" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.7"/>`;
    }
    case 'sand': {
      // 沙粒：每边 4-5 个小圆点
      if (side === 'top') {
        return `
          <circle cx="2" cy="1" r="0.4" fill="${t.accent}" opacity="0.7"/>
          <circle cx="5" cy="0.5" r="0.4" fill="${t.accent}" opacity="0.6"/>
          <circle cx="9" cy="1" r="0.3" fill="${t.accent}" opacity="0.7"/>
          <circle cx="13" cy="0.5" r="0.4" fill="${t.accent}" opacity="0.6"/>
          <circle cx="17" cy="1" r="0.3" fill="${t.accent}" opacity="0.7"/>`;
      }
      if (side === 'bottom') {
        return `
          <circle cx="2" cy="19" r="0.4" fill="${t.accent}" opacity="0.7"/>
          <circle cx="5" cy="19.5" r="0.4" fill="${t.accent}" opacity="0.6"/>
          <circle cx="9" cy="19" r="0.3" fill="${t.accent}" opacity="0.7"/>
          <circle cx="13" cy="19.5" r="0.4" fill="${t.accent}" opacity="0.6"/>
          <circle cx="17" cy="19" r="0.3" fill="${t.accent}" opacity="0.7"/>`;
      }
      if (side === 'left') {
        return `
          <circle cx="1" cy="2" r="0.4" fill="${t.accent}" opacity="0.7"/>
          <circle cx="0.5" cy="6" r="0.4" fill="${t.accent}" opacity="0.6"/>
          <circle cx="1" cy="10" r="0.3" fill="${t.accent}" opacity="0.7"/>
          <circle cx="0.5" cy="14" r="0.4" fill="${t.accent}" opacity="0.6"/>
          <circle cx="1" cy="18" r="0.3" fill="${t.accent}" opacity="0.7"/>`;
      }
      // right
      return `
        <circle cx="19" cy="2" r="0.4" fill="${t.accent}" opacity="0.7"/>
        <circle cx="19.5" cy="6" r="0.4" fill="${t.accent}" opacity="0.6"/>
        <circle cx="19" cy="10" r="0.3" fill="${t.accent}" opacity="0.7"/>
        <circle cx="19.5" cy="14" r="0.4" fill="${t.accent}" opacity="0.6"/>
        <circle cx="19" cy="18" r="0.3" fill="${t.accent}" opacity="0.7"/>`;
    }
    case 'water': {
      // 水波/浪花：每边 1-2 条波浪线
      if (side === 'top') {
        return `
          <path d="M0,1 Q3,0 6,1 T12,1 T18,1 T20,1" stroke="${t.accentLight}" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,2.5 Q4,2 8,2.5 T16,2.5" stroke="${t.accent}" stroke-width="0.4" fill="none" opacity="0.5"/>`;
      }
      if (side === 'bottom') {
        return `
          <path d="M0,18.5 Q3,19.5 6,18.5 T12,18.5 T18,18.5 T20,18.5" stroke="${t.accentLight}" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M0,17.5 Q4,18 8,17.5 T16,17.5" stroke="${t.accent}" stroke-width="0.4" fill="none" opacity="0.5"/>`;
      }
      if (side === 'left') {
        return `
          <path d="M1,0 Q0,3 1,6 T1,12 T1,18 T1,20" stroke="${t.accentLight}" stroke-width="0.5" fill="none" opacity="0.7"/>
          <path d="M2.5,0 Q2,4 2.5,8 T2.5,16" stroke="${t.accent}" stroke-width="0.4" fill="none" opacity="0.5"/>`;
      }
      // right
      return `
        <path d="M19,0 Q20,3 19,6 T19,12 T19,18 T19,20" stroke="${t.accentLight}" stroke-width="0.5" fill="none" opacity="0.7"/>
        <path d="M17.5,0 Q18,4 17.5,8 T17.5,16" stroke="${t.accent}" stroke-width="0.4" fill="none" opacity="0.5"/>`;
    }
    case 'rock': {
      // 石头裂纹：每边 2-3 个小碎裂纹
      if (side === 'top') {
        return `
          <path d="M3,2 L3,0.5 M8,2 L8.5,0.5 M14,2 L13.5,0.5 M17,2 L17,0.5" stroke="${t.accentDark}" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,2 L5.5,0.8 M11,2 L10.5,0.8 M16,2 L16.5,0.8" stroke="${t.accentDark}" stroke-width="0.3" fill="none" opacity="0.6"/>`;
      }
      if (side === 'bottom') {
        return `
          <path d="M3,18 L3,19.5 M8,18 L8.5,19.5 M14,18 L13.5,19.5 M17,18 L17,19.5" stroke="${t.accentDark}" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M5,18 L5.5,19.2 M11,18 L10.5,19.2 M16,18 L16.5,19.2" stroke="${t.accentDark}" stroke-width="0.3" fill="none" opacity="0.6"/>`;
      }
      if (side === 'left') {
        return `
          <path d="M2,3 L0.5,3 M2,8 L0.5,8.5 M2,14 L0.5,13.5 M2,17 L0.5,17" stroke="${t.accentDark}" stroke-width="0.4" fill="none" opacity="0.7"/>
          <path d="M2,5 L0.8,5.5 M2,11 L0.8,10.5 M2,16 L0.8,16.5" stroke="${t.accentDark}" stroke-width="0.3" fill="none" opacity="0.6"/>`;
      }
      // right
      return `
        <path d="M18,3 L19.5,3 M18,8 L19.5,8.5 M18,14 L19.5,13.5 M18,17 L19.5,17" stroke="${t.accentDark}" stroke-width="0.4" fill="none" opacity="0.7"/>
        <path d="M18,5 L19.2,5.5 M18,11 L19.2,10.5 M18,16 L19.2,16.5" stroke="${t.accentDark}" stroke-width="0.3" fill="none" opacity="0.6"/>`;
    }
  }
  return '';
}

// ============================================================
// Corner feathering（4 角）
// 8x8 角贴片，2 种 variant (convex 凸出 / concave 凹入)
// 用 4 角方向 (tl/tr/bl/br) 区分
// ============================================================
function cornerFeather(t, corner, variant) {
  // corner: 'tl' | 'tr' | 'bl' | 'br'
  // variant: 'convex' | 'concave'
  // 输出：8x8 SVG，仅含角点贴片本体（不含 cell 底色）
  const opacity = variant === 'convex' ? 0.9 : 0.85;
  switch (t.id) {
    case 'grass': {
      // 草尖
      if (variant === 'convex') {
        // 凸角：中心 cell 草地向角点外延伸
        if (corner === 'tl') return `<path d="M6,6 L4,4 M6,6 L2,2 M6,6 L0,4 M6,6 L0,6" stroke="${t.accent}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="${opacity}"/>`;
        if (corner === 'tr') return `<path d="M2,6 L4,4 M2,6 L6,2 M2,6 L8,4 M2,6 L8,6" stroke="${t.accent}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="${opacity}"/>`;
        if (corner === 'bl') return `<path d="M6,2 L4,4 M6,2 L2,6 M6,2 L0,4 M6,2 L0,2" stroke="${t.accent}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="${opacity}"/>`;
        // br
        return `<path d="M2,2 L4,4 M2,2 L6,6 M2,2 L8,4 M2,2 L8,2" stroke="${t.accent}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="${opacity}"/>`;
      } else {
        // 凹角：补一个小草尖填角
        if (corner === 'tl') return `<circle cx="2" cy="2" r="0.8" fill="${t.accentLight}" opacity="${opacity}"/><path d="M2,2 L0,0" stroke="${t.accent}" stroke-width="0.5" stroke-linecap="round" opacity="${opacity}"/>`;
        if (corner === 'tr') return `<circle cx="6" cy="2" r="0.8" fill="${t.accentLight}" opacity="${opacity}"/><path d="M6,2 L8,0" stroke="${t.accent}" stroke-width="0.5" stroke-linecap="round" opacity="${opacity}"/>`;
        if (corner === 'bl') return `<circle cx="2" cy="6" r="0.8" fill="${t.accentLight}" opacity="${opacity}"/><path d="M2,6 L0,8" stroke="${t.accent}" stroke-width="0.5" stroke-linecap="round" opacity="${opacity}"/>`;
        // br
        return `<circle cx="6" cy="6" r="0.8" fill="${t.accentLight}" opacity="${opacity}"/><path d="M6,6 L8,8" stroke="${t.accent}" stroke-width="0.5" stroke-linecap="round" opacity="${opacity}"/>`;
      }
    }
    case 'sand': {
      // 沙粒
      if (variant === 'convex') {
        if (corner === 'tl') return `<circle cx="1" cy="1" r="0.5" fill="${t.accent}" opacity="${opacity}"/><circle cx="3" cy="0.5" r="0.4" fill="${t.accent}" opacity="${opacity * 0.8}"/><circle cx="0.5" cy="3" r="0.4" fill="${t.accent}" opacity="${opacity * 0.8}"/>`;
        if (corner === 'tr') return `<circle cx="7" cy="1" r="0.5" fill="${t.accent}" opacity="${opacity}"/><circle cx="5" cy="0.5" r="0.4" fill="${t.accent}" opacity="${opacity * 0.8}"/><circle cx="7.5" cy="3" r="0.4" fill="${t.accent}" opacity="${opacity * 0.8}"/>`;
        if (corner === 'bl') return `<circle cx="1" cy="7" r="0.5" fill="${t.accent}" opacity="${opacity}"/><circle cx="3" cy="7.5" r="0.4" fill="${t.accent}" opacity="${opacity * 0.8}"/><circle cx="0.5" cy="5" r="0.4" fill="${t.accent}" opacity="${opacity * 0.8}"/>`;
        // br
        return `<circle cx="7" cy="7" r="0.5" fill="${t.accent}" opacity="${opacity}"/><circle cx="5" cy="7.5" r="0.4" fill="${t.accent}" opacity="${opacity * 0.8}"/><circle cx="7.5" cy="5" r="0.4" fill="${t.accent}" opacity="${opacity * 0.8}"/>`;
      } else {
        if (corner === 'tl') return `<circle cx="1" cy="1" r="0.7" fill="${t.accentLight}" opacity="${opacity}"/><circle cx="2.5" cy="0.5" r="0.3" fill="${t.accent}" opacity="${opacity}"/>`;
        if (corner === 'tr') return `<circle cx="7" cy="1" r="0.7" fill="${t.accentLight}" opacity="${opacity}"/><circle cx="5.5" cy="0.5" r="0.3" fill="${t.accent}" opacity="${opacity}"/>`;
        if (corner === 'bl') return `<circle cx="1" cy="7" r="0.7" fill="${t.accentLight}" opacity="${opacity}"/><circle cx="2.5" cy="7.5" r="0.3" fill="${t.accent}" opacity="${opacity}"/>`;
        // br
        return `<circle cx="7" cy="7" r="0.7" fill="${t.accentLight}" opacity="${opacity}"/><circle cx="5.5" cy="7.5" r="0.3" fill="${t.accent}" opacity="${opacity}"/>`;
      }
    }
    case 'water': {
      // 浪花
      if (variant === 'convex') {
        if (corner === 'tl') return `<path d="M0,4 Q2,2 4,4 M0,2 Q3,0 6,2" stroke="${t.accentLight}" stroke-width="0.5" fill="none" opacity="${opacity}"/>`;
        if (corner === 'tr') return `<path d="M8,4 Q6,2 4,4 M8,2 Q5,0 2,2" stroke="${t.accentLight}" stroke-width="0.5" fill="none" opacity="${opacity}"/>`;
        if (corner === 'bl') return `<path d="M0,4 Q2,6 4,4 M0,6 Q3,8 6,6" stroke="${t.accentLight}" stroke-width="0.5" fill="none" opacity="${opacity}"/>`;
        // br
        return `<path d="M8,4 Q6,6 4,4 M8,6 Q5,8 2,6" stroke="${t.accentLight}" stroke-width="0.5" fill="none" opacity="${opacity}"/>`;
      } else {
        if (corner === 'tl') return `<path d="M0,2 Q2,0 4,2 M0,4 Q2,2 4,4" stroke="${t.accentLight}" stroke-width="0.4" fill="none" opacity="${opacity}"/>`;
        if (corner === 'tr') return `<path d="M8,2 Q6,0 4,2 M8,4 Q6,2 4,4" stroke="${t.accentLight}" stroke-width="0.4" fill="none" opacity="${opacity}"/>`;
        if (corner === 'bl') return `<path d="M0,6 Q2,8 4,6 M0,4 Q2,6 4,4" stroke="${t.accentLight}" stroke-width="0.4" fill="none" opacity="${opacity}"/>`;
        // br
        return `<path d="M8,6 Q6,8 4,6 M8,4 Q6,6 4,4" stroke="${t.accentLight}" stroke-width="0.4" fill="none" opacity="${opacity}"/>`;
      }
    }
    case 'rock': {
      // 碎石
      if (variant === 'convex') {
        if (corner === 'tl') return `<polygon points="0,4 3,1 5,3 4,5 1,5" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="0.3" opacity="${opacity}"/>`;
        if (corner === 'tr') return `<polygon points="8,4 5,1 3,3 4,5 7,5" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="0.3" opacity="${opacity}"/>`;
        if (corner === 'bl') return `<polygon points="0,4 3,7 5,5 4,3 1,3" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="0.3" opacity="${opacity}"/>`;
        // br
        return `<polygon points="8,4 5,7 3,5 4,3 7,3" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="0.3" opacity="${opacity}"/>`;
      } else {
        if (corner === 'tl') return `<polygon points="0,3 2,0 4,2 3,4 1,4" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="0.3" opacity="${opacity}"/>`;
        if (corner === 'tr') return `<polygon points="8,3 6,0 4,2 5,4 7,4" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="0.3" opacity="${opacity}"/>`;
        if (corner === 'bl') return `<polygon points="0,5 2,8 4,6 3,4 1,4" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="0.3" opacity="${opacity}"/>`;
        // br
        return `<polygon points="8,5 6,8 4,6 5,4 7,4" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="0.3" opacity="${opacity}"/>`;
      }
    }
  }
  return '';
}

// ============================================================
// 生成函数
// ============================================================
function makeEdgeSvg(t, mask) {
  // mask: 0..15
  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">`);
  parts.push(`<rect width="20" height="20" fill="${t.bg}"/>`);
  parts.push(internalTexture(t));
  if (!(mask & 1)) parts.push(edgeFeather(t, 'top'));
  if (!(mask & 2)) parts.push(edgeFeather(t, 'bottom'));
  if (!(mask & 4)) parts.push(edgeFeather(t, 'left'));
  if (!(mask & 8)) parts.push(edgeFeather(t, 'right'));
  parts.push(`</svg>`);
  return parts.join('');
}

function makeCornerSvg(t, corner, variant) {
  // 8x8 角贴片（带透明背景）
  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">`);
  parts.push(cornerFeather(t, corner, variant));
  parts.push(`</svg>`);
  return parts.join('');
}

// ============================================================
// 输出：生成 TypeScript 源文件
// ============================================================
function buildOutput() {
  const lines = [];
  lines.push(`// TerrainAutoTiles - 24-tile 自动地形过渡的 SVG 资源`);
  lines.push(`// 由 scripts/generate-terrain-tiles.mjs 自动生成，请勿手工编辑`);
  lines.push(`// 共 4 地形 × (16 边变体 + 4 角点×2 variant) = 80 张`);
  lines.push(``);
  lines.push(`import type { TerrainType } from './TerrainTiles';`);
  lines.push(`import type { Corner, CornerVariant } from '../TerrainAdjacency';`);
  lines.push(``);
  lines.push(`export type TerrainId = 'grass' | 'sand' | 'water' | 'rock';`);
  lines.push(``);
  lines.push(`// 边变体：4 地形 × 16 掩码 = 64 张`);
  lines.push(`export const TERRAIN_AUTO_EDGE: Record<TerrainType, Record<number, string>> = {`);
  for (let ti = 0; ti < TERRAINS.length; ti++) {
    const t = TERRAINS[ti];
    lines.push(`  ${ti}: {`);
    for (let mask = 0; mask < 16; mask++) {
      const svg = makeEdgeSvg(t, mask).replace(/`/g, '\\`').replace(/\$/g, '\\$');
      lines.push(`    ${mask}: \`${svg}\`,`);
    }
    lines.push(`  },`);
  }
  lines.push(`};`);
  lines.push(``);
  lines.push(`// 角点变体：4 地形 × 4 角 × 2 variant = 32 张`);
  lines.push(`export const TERRAIN_AUTO_CORNER: Record<TerrainType, Record<Corner, Record<CornerVariant, string>>> = {`);
  for (let ti = 0; ti < TERRAINS.length; ti++) {
    const t = TERRAINS[ti];
    lines.push(`  ${ti}: {`);
    for (const corner of ['tl', 'tr', 'bl', 'br']) {
      lines.push(`    ${corner}: {`);
      for (const variant of ['convex', 'concave']) {
        const svg = makeCornerSvg(t, corner, variant).replace(/`/g, '\\`').replace(/\$/g, '\\$');
        lines.push(`      ${variant}: \`${svg}\`,`);
      }
      lines.push(`    },`);
    }
    lines.push(`  },`);
  }
  lines.push(`};`);
  lines.push(``);
  return lines.join('\n');
}

// ============================================================
// 主入口
// ============================================================
const out = buildOutput();
fs.writeFileSync(OUT_PATH, out);
console.log(`OK: wrote ${OUT_PATH}`);
console.log(`  4 地形 × 16 边变体 = 64 SVG`);
console.log(`  4 地形 × 4 角 × 2 variant = 32 SVG`);
console.log(`  Total: 96 SVG (实际只用 80: 4 角 × 2 = 8 角贴片, 16 边 = 80)`);
