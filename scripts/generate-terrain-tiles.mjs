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
    // 加亮 feathering 颜色（提高低 zoom 下的可视性）
    accent: '#7ab045',       // 草尖主色（亮于原 #5a8a35）
    accent2: '#5a8a35',
    accentLight: '#9ad85a',  // 草叶高亮（亮于原 #6a9a40）
  },
  {
    id: 'sand',
    bg: '#c9a866',
    accent: '#d4ad6a',       // 沙粒主色（亮于原 #a8854a）
    accentLight: '#e8c890',  // 沙粒高亮（亮于原 #b8965a）
  },
  {
    id: 'water',
    bg: '#3a5a8a',
    accent: '#a8c0e0',       // 浪花主色
    accentLight: '#d8e8f8',  // 浪花高亮（亮于原 #a8c0e0）
    accentDark: '#2a4a7a',
  },
  {
    id: 'rock',
    bg: '#6a6a72',
    accent: '#b0b0b8',       // 碎石主色（亮于原 #8a8a92）
    accent2: '#9a9aa2',      // 碎石副色（亮于原 #7a7a82）
    accentDark: '#3a3a52',
  },
];

// ============================================================
// 内部纹理（与 TerrainTiles.ts 保持一致）
// ============================================================
function internalTexture(t) {
  // 极限加粗版：internalTexture 收缩到中央 6x6 区域，让出边缘 7 unit 给 feathering
  switch (t.id) {
    case 'grass':
      return `
        <path d="M7,7 L8,9 M11,7 L12,9 M9,7 L10,10 M13,7 L13,9" stroke="${t.accent2}" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <circle cx="8" cy="11" r="0.3" fill="${t.accentLight}" opacity="0.3"/>
        <circle cx="12" cy="11" r="0.2" fill="${t.accentLight}" opacity="0.3"/>`;
    case 'sand':
      return `
        <circle cx="9" cy="9" r="0.3" fill="${t.accent}" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="${t.accent}" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="${t.accentLight}" opacity="0.5"/>`;
    case 'water':
      return `
        <path d="M6,10 Q10,9 14,10" stroke="${t.accent}" stroke-width="0.3" fill="none" opacity="0.5"/>`;
    case 'rock':
      return `
        <polygon points="8,7 11,6 12,9 10,11 8,10" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,11 13,10 13,12 12,12" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="0.2" opacity="0.7"/>`;
  }
  return '';
}

// ============================================================
// Edge feathering（4 边各异）
// 极限加粗版：feathering 占据边缘 8-10 unit（50% cell 高度）
// 20×20 viewBox → 4×4 像素时，每单位 = 0.2px，10 unit = 2px（zoom=0.5 仍有 1px 可见）
// 关键：feathering 必须侵入 cell 主体，让低 zoom 下也能看见
// ============================================================
function edgeFeather(t, side) {
  switch (t.id) {
    case 'grass': {
      // 草尖：填满 0-10 unit 高度（50% cell），用 1.8 stroke blade 让线条更粗
      if (side === 'top') {
        return `
          <rect x="0" y="0" width="20" height="9" fill="${t.accent}" opacity="0.7"/>
          <path d="M0,9 Q2,0 4,9 Q6,0 8,9 Q10,0 12,9 Q14,0 16,9 Q18,0 20,9 L20,10 L0,10 Z" fill="${t.accent}" opacity="0.95"/>
          <path d="M2,9 Q2.5,1 3,9 M7,9 Q7.5,1 8,9 M12,9 Q12.5,1 13,9 M17,9 Q17.5,1 18,9" stroke="${t.accentLight}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,5 L1,2 M6,5 L6,2 M11,5 L11,2 M16,5 L16,2" stroke="${t.accentLight}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
      }
      if (side === 'bottom') {
        return `
          <rect x="0" y="11" width="20" height="9" fill="${t.accent}" opacity="0.7"/>
          <path d="M0,11 Q2,20 4,11 Q6,20 8,11 Q10,20 12,11 Q14,20 16,11 Q18,20 20,11 L20,10 L0,10 Z" fill="${t.accent}" opacity="0.95"/>
          <path d="M2,11 Q2.5,19 3,11 M7,11 Q7.5,19 8,11 M12,11 Q12.5,19 13,11 M17,11 Q17.5,19 18,11" stroke="${t.accentLight}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M1,15 L1,18 M6,15 L6,18 M11,15 L11,18 M16,15 L16,18" stroke="${t.accentLight}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
      }
      if (side === 'left') {
        return `
          <rect x="0" y="0" width="9" height="20" fill="${t.accent}" opacity="0.7"/>
          <path d="M9,0 Q0,2 9,4 Q0,6 9,8 Q0,10 9,12 Q0,14 9,16 Q0,18 9,20 L10,20 L10,0 Z" fill="${t.accent}" opacity="0.95"/>
          <path d="M9,2 Q1,2.5 9,3 M9,7 Q1,7.5 9,8 M9,12 Q1,12.5 9,13 M9,17 Q1,17.5 9,18" stroke="${t.accentLight}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
          <path d="M5,1 L2,1 M5,6 L2,6 M5,11 L2,11 M5,16 L2,16" stroke="${t.accentLight}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
      }
      // right
      return `
        <rect x="11" y="0" width="9" height="20" fill="${t.accent}" opacity="0.7"/>
        <path d="M11,0 Q20,2 11,4 Q20,6 11,8 Q20,10 11,12 Q20,14 11,16 Q20,18 11,20 L10,20 L10,0 Z" fill="${t.accent}" opacity="0.95"/>
        <path d="M11,2 Q19,2.5 11,3 M11,7 Q19,7.5 11,8 M11,12 Q19,12.5 11,13 M11,17 Q19,17.5 11,18" stroke="${t.accentLight}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="1"/>
        <path d="M15,1 L18,1 M15,6 L18,6 M15,11 L18,11 M15,16 L18,16" stroke="${t.accentLight}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    }
    case 'sand': {
      // 沙粒：5 个大圆点 r=3.5（直径 7 unit = 1.4 px @ 4x4 cell）
      if (side === 'top') {
        return `
          <circle cx="2" cy="4" r="3.5" fill="${t.accent}" opacity="0.85"/>
          <circle cx="7" cy="3" r="3" fill="${t.accent}" opacity="0.8"/>
          <circle cx="12" cy="4" r="3.5" fill="${t.accent}" opacity="0.85"/>
          <circle cx="17" cy="3" r="3" fill="${t.accent}" opacity="0.8"/>
          <circle cx="10" cy="0.5" r="1.5" fill="${t.accentLight}" opacity="0.9"/>
          <circle cx="5" cy="0.5" r="1.2" fill="${t.accentLight}" opacity="0.85"/>
          <circle cx="15" cy="0.5" r="1.2" fill="${t.accentLight}" opacity="0.85"/>`;
      }
      if (side === 'bottom') {
        return `
          <circle cx="2" cy="16" r="3.5" fill="${t.accent}" opacity="0.85"/>
          <circle cx="7" cy="17" r="3" fill="${t.accent}" opacity="0.8"/>
          <circle cx="12" cy="16" r="3.5" fill="${t.accent}" opacity="0.85"/>
          <circle cx="17" cy="17" r="3" fill="${t.accent}" opacity="0.8"/>
          <circle cx="10" cy="19.5" r="1.5" fill="${t.accentLight}" opacity="0.9"/>
          <circle cx="5" cy="19.5" r="1.2" fill="${t.accentLight}" opacity="0.85"/>
          <circle cx="15" cy="19.5" r="1.2" fill="${t.accentLight}" opacity="0.85"/>`;
      }
      if (side === 'left') {
        return `
          <circle cx="4" cy="2" r="3.5" fill="${t.accent}" opacity="0.85"/>
          <circle cx="3" cy="7" r="3" fill="${t.accent}" opacity="0.8"/>
          <circle cx="4" cy="12" r="3.5" fill="${t.accent}" opacity="0.85"/>
          <circle cx="3" cy="17" r="3" fill="${t.accent}" opacity="0.8"/>
          <circle cx="0.5" cy="10" r="1.5" fill="${t.accentLight}" opacity="0.9"/>
          <circle cx="0.5" cy="5" r="1.2" fill="${t.accentLight}" opacity="0.85"/>
          <circle cx="0.5" cy="15" r="1.2" fill="${t.accentLight}" opacity="0.85"/>`;
      }
      // right
      return `
        <circle cx="16" cy="2" r="3.5" fill="${t.accent}" opacity="0.85"/>
        <circle cx="17" cy="7" r="3" fill="${t.accent}" opacity="0.8"/>
        <circle cx="16" cy="12" r="3.5" fill="${t.accent}" opacity="0.85"/>
        <circle cx="17" cy="17" r="3" fill="${t.accent}" opacity="0.8"/>
        <circle cx="19.5" cy="10" r="1.5" fill="${t.accentLight}" opacity="0.9"/>
        <circle cx="19.5" cy="5" r="1.2" fill="${t.accentLight}" opacity="0.85"/>
        <circle cx="19.5" cy="15" r="1.2" fill="${t.accentLight}" opacity="0.85"/>`;
    }
    case 'water': {
      // 浪花：4 unit 硬色条 + 4-thick 波浪线 + 大点
      if (side === 'top') {
        return `
          <rect x="0" y="0" width="20" height="4" fill="${t.accentLight}" opacity="0.7"/>
          <path d="M0,5 L20,5 L20,9 L0,9 Z" fill="${t.accent}" opacity="0.85"/>
          <path d="M0,3 Q4,0 8,3 T16,3 T20,3" stroke="${t.accentLight}" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,7 Q5,5 10,7 T20,7" stroke="${t.accentLight}" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="2" r="1" fill="${t.accentLight}" opacity="1"/>
          <circle cx="10" cy="1.5" r="0.8" fill="${t.accentLight}" opacity="1"/>
          <circle cx="17" cy="2" r="1" fill="${t.accentLight}" opacity="1"/>`;
      }
      if (side === 'bottom') {
        return `
          <rect x="0" y="16" width="20" height="4" fill="${t.accentLight}" opacity="0.7"/>
          <path d="M0,11 L20,11 L20,15 L0,15 Z" fill="${t.accent}" opacity="0.85"/>
          <path d="M0,17 Q4,20 8,17 T16,17 T20,17" stroke="${t.accentLight}" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M0,13 Q5,15 10,13 T20,13" stroke="${t.accentLight}" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="3" cy="18" r="1" fill="${t.accentLight}" opacity="1"/>
          <circle cx="10" cy="18.5" r="0.8" fill="${t.accentLight}" opacity="1"/>
          <circle cx="17" cy="18" r="1" fill="${t.accentLight}" opacity="1"/>`;
      }
      if (side === 'left') {
        return `
          <rect x="0" y="0" width="4" height="20" fill="${t.accentLight}" opacity="0.7"/>
          <path d="M5,0 L9,0 L9,20 L5,20 Z" fill="${t.accent}" opacity="0.85"/>
          <path d="M3,0 Q0,4 3,8 T3,16 T3,20" stroke="${t.accentLight}" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
          <path d="M7,0 Q5,5 7,10 T7,20" stroke="${t.accentLight}" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
          <circle cx="2" cy="3" r="1" fill="${t.accentLight}" opacity="1"/>
          <circle cx="1.5" cy="10" r="0.8" fill="${t.accentLight}" opacity="1"/>
          <circle cx="2" cy="17" r="1" fill="${t.accentLight}" opacity="1"/>`;
      }
      // right
      return `
        <rect x="16" y="0" width="4" height="20" fill="${t.accentLight}" opacity="0.7"/>
        <path d="M11,0 L15,0 L15,20 L11,20 Z" fill="${t.accent}" opacity="0.85"/>
        <path d="M17,0 Q20,4 17,8 T17,16 T17,20" stroke="${t.accentLight}" stroke-width="3" fill="none" opacity="1" stroke-linecap="round"/>
        <path d="M13,0 Q15,5 13,10 T13,20" stroke="${t.accentLight}" stroke-width="2" fill="none" opacity="0.95" stroke-linecap="round"/>
        <circle cx="18" cy="3" r="1" fill="${t.accentLight}" opacity="1"/>
        <circle cx="18.5" cy="10" r="0.8" fill="${t.accentLight}" opacity="1"/>
        <circle cx="18" cy="17" r="1" fill="${t.accentLight}" opacity="1"/>`;
    }
    case 'rock': {
      // 碎石：3 块大碎石（8-10 unit 宽），覆盖 50% cell 高度
      if (side === 'top') {
        return `
          <polygon points="0,8 3,0 7,1 8,3 6,9 1,9" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 11,0 15,1 16,3 14,9 9,9" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="1.2" opacity="1"/>
          <polygon points="16,8 19,0 20,1 20,3 18,9 17,9" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1.2" opacity="1"/>
          <path d="M3,2 L4,1 M11,2 L12,1 M18,2 L19,1" stroke="${t.accentDark}" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,7 L20,7" stroke="${t.accentDark}" stroke-width="0.5" fill="none" opacity="0.4"/>`;
      }
      if (side === 'bottom') {
        return `
          <polygon points="0,12 3,20 7,19 8,17 6,11 1,11" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1.2" opacity="1"/>
          <polygon points="8,12 11,20 15,19 16,17 14,11 9,11" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="1.2" opacity="1"/>
          <polygon points="16,12 19,20 20,19 20,17 18,11 17,11" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1.2" opacity="1"/>
          <path d="M3,18 L4,19 M11,18 L12,19 M18,18 L19,19" stroke="${t.accentDark}" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M0,13 L20,13" stroke="${t.accentDark}" stroke-width="0.5" fill="none" opacity="0.4"/>`;
      }
      if (side === 'left') {
        return `
          <polygon points="8,0 0,3 1,7 3,8 9,6 9,1" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1.2" opacity="1"/>
          <polygon points="8,8 0,11 1,15 3,16 9,14 9,9" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="1.2" opacity="1"/>
          <polygon points="8,16 0,19 1,20 3,20 9,18 9,17" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1.2" opacity="1"/>
          <path d="M2,3 L1,4 M2,11 L1,12 M2,18 L1,19" stroke="${t.accentDark}" stroke-width="0.8" fill="none" opacity="0.9"/>
          <path d="M7,0 L7,20" stroke="${t.accentDark}" stroke-width="0.5" fill="none" opacity="0.4"/>`;
      }
      // right
      return `
        <polygon points="12,0 20,3 19,7 17,8 11,6 11,1" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1.2" opacity="1"/>
        <polygon points="12,8 20,11 19,15 17,16 11,14 11,9" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="1.2" opacity="1"/>
        <polygon points="12,16 20,19 19,20 17,20 11,18 11,17" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1.2" opacity="1"/>
        <path d="M18,3 L19,4 M18,11 L19,12 M18,18 L19,19" stroke="${t.accentDark}" stroke-width="0.8" fill="none" opacity="0.9"/>
        <path d="M13,0 L13,20" stroke="${t.accentDark}" stroke-width="0.5" fill="none" opacity="0.4"/>`;
    }
  }
  return '';
}

// ============================================================
// Corner feathering（4 角）
// 8x8 角贴片，2 种 variant (convex 凸出 / concave 凹入)
// 极限加粗版：填充 6x6 区域，让角点在 8x8 像素下物理清晰
// ============================================================
function cornerFeather(t, corner, variant) {
  // corner: 'tl' | 'tr' | 'bl' | 'br'
  // variant: 'convex' | 'concave'
  switch (t.id) {
    case 'grass': {
      if (variant === 'convex') {
        // 凸角：草尖填充对角三角
        if (corner === 'tl') return `<rect x="0" y="0" width="6" height="6" fill="${t.accent}" opacity="0.9"/><path d="M1,5 L2,1 L3,5 M2,1 L3,0 L4,1 M2,5 L4,5" stroke="${t.accentLight}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="1"/>`;
        if (corner === 'tr') return `<rect x="2" y="0" width="6" height="6" fill="${t.accent}" opacity="0.9"/><path d="M7,5 L6,1 L5,5 M6,1 L5,0 L4,1 M6,5 L4,5" stroke="${t.accentLight}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="1"/>`;
        if (corner === 'bl') return `<rect x="0" y="2" width="6" height="6" fill="${t.accent}" opacity="0.9"/><path d="M1,3 L2,7 L3,3 M2,7 L3,8 L4,7 M2,3 L4,3" stroke="${t.accentLight}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="1"/>`;
        return `<rect x="2" y="2" width="6" height="6" fill="${t.accent}" opacity="0.9"/><path d="M7,3 L6,7 L5,3 M6,7 L5,8 L4,7 M6,3 L4,3" stroke="${t.accentLight}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="1"/>`;
      } else {
        // 凹角：填一个圆形草丛
        if (corner === 'tl') return `<rect x="0" y="0" width="6" height="6" fill="${t.accent}" opacity="0.95"/><path d="M1,5 L1,1 M3,5 L3,1 M5,5 L5,1" stroke="${t.accentLight}" stroke-width="1" fill="none" stroke-linecap="round" opacity="1"/>`;
        if (corner === 'tr') return `<rect x="2" y="0" width="6" height="6" fill="${t.accent}" opacity="0.95"/><path d="M3,5 L3,1 M5,5 L5,1 M7,5 L7,1" stroke="${t.accentLight}" stroke-width="1" fill="none" stroke-linecap="round" opacity="1"/>`;
        if (corner === 'bl') return `<rect x="0" y="2" width="6" height="6" fill="${t.accent}" opacity="0.95"/><path d="M1,3 L1,7 M3,3 L3,7 M5,3 L5,7" stroke="${t.accentLight}" stroke-width="1" fill="none" stroke-linecap="round" opacity="1"/>`;
        return `<rect x="2" y="2" width="6" height="6" fill="${t.accent}" opacity="0.95"/><path d="M3,3 L3,7 M5,3 L5,7 M7,3 L7,7" stroke="${t.accentLight}" stroke-width="1" fill="none" stroke-linecap="round" opacity="1"/>`;
      }
    }
    case 'sand': {
      if (variant === 'convex') {
        if (corner === 'tl') return `<rect x="0" y="0" width="6" height="6" fill="${t.accent}" opacity="0.95"/><circle cx="2" cy="2" r="1.2" fill="${t.accentLight}" opacity="1"/><circle cx="4" cy="0.5" r="0.8" fill="${t.accentLight}" opacity="1"/>`;
        if (corner === 'tr') return `<rect x="2" y="0" width="6" height="6" fill="${t.accent}" opacity="0.95"/><circle cx="6" cy="2" r="1.2" fill="${t.accentLight}" opacity="1"/><circle cx="4" cy="0.5" r="0.8" fill="${t.accentLight}" opacity="1"/>`;
        if (corner === 'bl') return `<rect x="0" y="2" width="6" height="6" fill="${t.accent}" opacity="0.95"/><circle cx="2" cy="6" r="1.2" fill="${t.accentLight}" opacity="1"/><circle cx="4" cy="7.5" r="0.8" fill="${t.accentLight}" opacity="1"/>`;
        return `<rect x="2" y="2" width="6" height="6" fill="${t.accent}" opacity="0.95"/><circle cx="6" cy="6" r="1.2" fill="${t.accentLight}" opacity="1"/><circle cx="4" cy="7.5" r="0.8" fill="${t.accentLight}" opacity="1"/>`;
      } else {
        if (corner === 'tl') return `<rect x="0" y="0" width="6" height="6" fill="${t.accent}" opacity="1"/><circle cx="2" cy="2" r="1.5" fill="${t.accentLight}" opacity="1"/>`;
        if (corner === 'tr') return `<rect x="2" y="0" width="6" height="6" fill="${t.accent}" opacity="1"/><circle cx="6" cy="2" r="1.5" fill="${t.accentLight}" opacity="1"/>`;
        if (corner === 'bl') return `<rect x="0" y="2" width="6" height="6" fill="${t.accent}" opacity="1"/><circle cx="2" cy="6" r="1.5" fill="${t.accentLight}" opacity="1"/>`;
        return `<rect x="2" y="2" width="6" height="6" fill="${t.accent}" opacity="1"/><circle cx="6" cy="6" r="1.5" fill="${t.accentLight}" opacity="1"/>`;
      }
    }
    case 'water': {
      if (variant === 'convex') {
        if (corner === 'tl') return `<rect x="0" y="0" width="6" height="6" fill="${t.accentLight}" opacity="0.95"/><path d="M0,4 Q2,2 4,4 Q2,0 0,2" fill="${t.accent}" opacity="0.9"/><path d="M0,2 Q3,0 5,2" stroke="${t.accent}" stroke-width="1" fill="none" opacity="0.7"/>`;
        if (corner === 'tr') return `<rect x="2" y="0" width="6" height="6" fill="${t.accentLight}" opacity="0.95"/><path d="M8,4 Q6,2 4,4 Q6,0 8,2" fill="${t.accent}" opacity="0.9"/><path d="M8,2 Q5,0 3,2" stroke="${t.accent}" stroke-width="1" fill="none" opacity="0.7"/>`;
        if (corner === 'bl') return `<rect x="0" y="2" width="6" height="6" fill="${t.accentLight}" opacity="0.95"/><path d="M0,4 Q2,6 4,4 Q2,8 0,6" fill="${t.accent}" opacity="0.9"/><path d="M0,6 Q3,8 5,6" stroke="${t.accent}" stroke-width="1" fill="none" opacity="0.7"/>`;
        return `<rect x="2" y="2" width="6" height="6" fill="${t.accentLight}" opacity="0.95"/><path d="M8,4 Q6,6 4,4 Q6,8 8,6" fill="${t.accent}" opacity="0.9"/><path d="M8,6 Q5,8 3,6" stroke="${t.accent}" stroke-width="1" fill="none" opacity="0.7"/>`;
      } else {
        if (corner === 'tl') return `<rect x="0" y="0" width="6" height="6" fill="${t.accentLight}" opacity="0.9"/><path d="M0,4 Q2,2 4,4 M0,2 Q3,0 5,2" stroke="${t.accent}" stroke-width="1.5" fill="none" opacity="1"/><path d="M0,2 Q2,0 4,2" stroke="${t.accent}" stroke-width="1" fill="none" opacity="0.7"/>`;
        if (corner === 'tr') return `<rect x="2" y="0" width="6" height="6" fill="${t.accentLight}" opacity="0.9"/><path d="M8,4 Q6,2 4,4 M8,2 Q5,0 3,2" stroke="${t.accent}" stroke-width="1.5" fill="none" opacity="1"/><path d="M8,2 Q6,0 4,2" stroke="${t.accent}" stroke-width="1" fill="none" opacity="0.7"/>`;
        if (corner === 'bl') return `<rect x="0" y="2" width="6" height="6" fill="${t.accentLight}" opacity="0.9"/><path d="M0,4 Q2,6 4,4 M0,6 Q3,8 5,6" stroke="${t.accent}" stroke-width="1.5" fill="none" opacity="1"/><path d="M0,6 Q2,8 4,6" stroke="${t.accent}" stroke-width="1" fill="none" opacity="0.7"/>`;
        return `<rect x="2" y="2" width="6" height="6" fill="${t.accentLight}" opacity="0.9"/><path d="M8,4 Q6,6 4,4 M8,6 Q5,8 3,6" stroke="${t.accent}" stroke-width="1.5" fill="none" opacity="1"/><path d="M8,6 Q6,8 4,6" stroke="${t.accent}" stroke-width="1" fill="none" opacity="0.7"/>`;
      }
    }
    case 'rock': {
      if (variant === 'convex') {
        if (corner === 'tl') return `<rect x="0" y="0" width="6" height="6" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1" opacity="1"/>`;
        if (corner === 'tr') return `<rect x="2" y="0" width="6" height="6" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1" opacity="1"/>`;
        if (corner === 'bl') return `<rect x="0" y="2" width="6" height="6" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1" opacity="1"/>`;
        return `<rect x="2" y="2" width="6" height="6" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1" opacity="1"/>`;
      } else {
        if (corner === 'tl') return `<rect x="0" y="0" width="6" height="6" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="1" opacity="1"/><path d="M2,2 L2,1 M3,2 L3,0.5" stroke="${t.accentDark}" stroke-width="0.8" fill="none"/>`;
        if (corner === 'tr') return `<rect x="2" y="0" width="6" height="6" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="1" opacity="1"/><path d="M6,2 L6,1 M5,2 L5,0.5" stroke="${t.accentDark}" stroke-width="0.8" fill="none"/>`;
        if (corner === 'bl') return `<rect x="0" y="2" width="6" height="6" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="1" opacity="1"/><path d="M2,6 L2,7 M3,6 L3,7.5" stroke="${t.accentDark}" stroke-width="0.8" fill="none"/>`;
        return `<rect x="2" y="2" width="6" height="6" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="1" opacity="1"/><path d="M6,6 L6,7 M5,6 L5,7.5" stroke="${t.accentDark}" stroke-width="0.8" fill="none"/>`;
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
