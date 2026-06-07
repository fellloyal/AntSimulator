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
  // 调优：缩短到中央 4-5 unit + 减量，避免与 4 边 feathering 在 4x4 cell 上叠加成网状
  switch (t.id) {
    case 'grass':
      // 2 条短草叶（5 unit 高）+ 2 个小点，居中 7-13 unit
      return `
        <path d="M8,13 L9,7 M12,13 L11,7" stroke="${t.accent}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7"/>
        <path d="M7,13 L8,9 M13,13 L12,9" stroke="${t.accent2}" stroke-width="0.4" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="9" cy="11" r="0.3" fill="${t.accentLight}" opacity="0.4"/>
        <circle cx="11" cy="11" r="0.3" fill="${t.accentLight}" opacity="0.4"/>`;
    case 'sand':
      // 2-3 个小圆点 + 1 条短曲线，居中
      return `
        <circle cx="9" cy="9" r="0.5" fill="${t.accent}" opacity="0.5"/>
        <circle cx="11" cy="11" r="0.4" fill="${t.accent}" opacity="0.4"/>
        <circle cx="10" cy="10" r="0.2" fill="${t.accentLight}" opacity="0.5"/>
        <path d="M8,12 Q10,11 12,12" stroke="${t.accent}" stroke-width="0.3" fill="none" opacity="0.4"/>`;
    case 'water':
      // 1 条中央波浪线（不再画 3 条）
      return `
        <path d="M0,10 Q5,8 10,10 T20,10" stroke="${t.accent}" stroke-width="0.3" fill="none" opacity="0.5"/>`;
    case 'rock':
      // 1-2 个 polygon 居中
      return `
        <polygon points="8,8 11,7 12,10 10,12 8,11" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="0.2" opacity="0.7"/>
        <polygon points="11,12 13,11 13,13 12,13" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="0.2" opacity="0.7"/>`;
  }
  return '';
}

// ============================================================
// Edge feathering（4 边各异）
// 关键：feathering 必须在 4×4 cell 渲染下可见，因此 SVG units 取 2-4
// 20×20 viewBox → 4×4 像素时，每单位 = 0.2px，所以 2-4 单位 = 0.4-0.8px（AA 可见）
// 每种地形在 cell 边缘画一组明显的外延元素（草尖/沙粒/水波/碎裂纹）
// ============================================================
function edgeFeather(t, side) {
  switch (t.id) {
    case 'grass': {
      // 草尖：4-5 条 4-5 单位宽的"草丛"（1.0-1.2 像素可见）
      if (side === 'top') {
        return `
          <path d="M0,4 Q1,0 3,4 Q4,0 6,4 Q7,0 9,4 Q10,0 12,4 Q13,0 15,4 Q16,0 18,4 Q19,0 20,4 L20,5 L0,5 Z" fill="${t.accent}" opacity="0.85"/>
          <path d="M2,4 Q2.5,1 3,4 M7,4 Q7.5,1 8,4 M12,4 Q12.5,1 13,4 M17,4 Q17.5,1 18,4" stroke="${t.accentLight}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,2 L1,0.5 M6,2 L6,0.5 M11,2 L11,0.5 M16,2 L16,0.5" stroke="${t.accent2}" stroke-width="0.8" fill="none" stroke-linecap="round"/>`;
      }
      if (side === 'bottom') {
        return `
          <path d="M0,16 Q1,20 3,16 Q4,20 6,16 Q7,20 9,16 Q10,20 12,16 Q13,20 15,16 Q16,20 18,16 Q19,20 20,16 L20,15 L0,15 Z" fill="${t.accent}" opacity="0.85"/>
          <path d="M2,16 Q2.5,19 3,16 M7,16 Q7.5,19 8,16 M12,16 Q12.5,19 13,16 M17,16 Q17.5,19 18,16" stroke="${t.accentLight}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M1,18 L1,19.5 M6,18 L6,19.5 M11,18 L11,19.5 M16,18 L16,19.5" stroke="${t.accent2}" stroke-width="0.8" fill="none" stroke-linecap="round"/>`;
      }
      if (side === 'left') {
        return `
          <path d="M4,0 Q0,1 4,3 Q0,4 4,6 Q0,7 4,9 Q0,10 4,12 Q0,13 4,15 Q0,16 4,18 Q0,19 4,20 L5,20 L5,0 Z" fill="${t.accent}" opacity="0.85"/>
          <path d="M4,2 Q1,2.5 4,3 M4,7 Q1,7.5 4,8 M4,12 Q1,12.5 4,13 M4,17 Q1,17.5 4,18" stroke="${t.accentLight}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
          <path d="M2,1 L0.5,1 M2,6 L0.5,6 M2,11 L0.5,11 M2,16 L0.5,16" stroke="${t.accent2}" stroke-width="0.8" fill="none" stroke-linecap="round"/>`;
      }
      // right
      return `
        <path d="M16,0 Q20,1 16,3 Q20,4 16,6 Q20,7 16,9 Q20,10 16,12 Q20,13 16,15 Q20,16 16,18 Q20,19 16,20 L15,20 L15,0 Z" fill="${t.accent}" opacity="0.85"/>
        <path d="M16,2 Q19,2.5 16,3 M16,7 Q19,7.5 16,8 M16,12 Q19,12.5 16,13 M16,17 Q19,17.5 16,18" stroke="${t.accentLight}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.95"/>
        <path d="M18,1 L19.5,1 M18,6 L19.5,6 M18,11 L19.5,11 M18,16 L19.5,16" stroke="${t.accent2}" stroke-width="0.8" fill="none" stroke-linecap="round"/>`;
    }
    case 'sand': {
      // 沙粒：5-6 个大圆点 r=1.8-2.0 (3-4 单位直径 → 0.6-0.8 像素)
      if (side === 'top') {
        return `
          <circle cx="1.5" cy="2" r="2" fill="${t.accent}" opacity="0.85"/>
          <circle cx="5" cy="1" r="1.8" fill="${t.accent}" opacity="0.8"/>
          <circle cx="8.5" cy="2" r="2" fill="${t.accent}" opacity="0.85"/>
          <circle cx="12" cy="1" r="1.8" fill="${t.accent}" opacity="0.8"/>
          <circle cx="15.5" cy="2" r="2" fill="${t.accent}" opacity="0.85"/>
          <circle cx="19" cy="1" r="1.5" fill="${t.accentLight}" opacity="0.9"/>
          <circle cx="3.5" cy="0.5" r="1" fill="${t.accentLight}" opacity="0.85"/>
          <circle cx="10" cy="0.5" r="0.8" fill="${t.accentLight}" opacity="0.85"/>
          <circle cx="17" cy="0.5" r="1" fill="${t.accentLight}" opacity="0.85"/>`;
      }
      if (side === 'bottom') {
        return `
          <circle cx="1.5" cy="18" r="2" fill="${t.accent}" opacity="0.85"/>
          <circle cx="5" cy="19" r="1.8" fill="${t.accent}" opacity="0.8"/>
          <circle cx="8.5" cy="18" r="2" fill="${t.accent}" opacity="0.85"/>
          <circle cx="12" cy="19" r="1.8" fill="${t.accent}" opacity="0.8"/>
          <circle cx="15.5" cy="18" r="2" fill="${t.accent}" opacity="0.85"/>
          <circle cx="19" cy="19" r="1.5" fill="${t.accentLight}" opacity="0.9"/>
          <circle cx="3.5" cy="19.5" r="1" fill="${t.accentLight}" opacity="0.85"/>
          <circle cx="10" cy="19.5" r="0.8" fill="${t.accentLight}" opacity="0.85"/>
          <circle cx="17" cy="19.5" r="1" fill="${t.accentLight}" opacity="0.85"/>`;
      }
      if (side === 'left') {
        return `
          <circle cx="2" cy="1.5" r="2" fill="${t.accent}" opacity="0.85"/>
          <circle cx="1" cy="5" r="1.8" fill="${t.accent}" opacity="0.8"/>
          <circle cx="2" cy="8.5" r="2" fill="${t.accent}" opacity="0.85"/>
          <circle cx="1" cy="12" r="1.8" fill="${t.accent}" opacity="0.8"/>
          <circle cx="2" cy="15.5" r="2" fill="${t.accent}" opacity="0.85"/>
          <circle cx="1" cy="19" r="1.5" fill="${t.accentLight}" opacity="0.9"/>
          <circle cx="0.5" cy="3.5" r="1" fill="${t.accentLight}" opacity="0.85"/>
          <circle cx="0.5" cy="10" r="0.8" fill="${t.accentLight}" opacity="0.85"/>
          <circle cx="0.5" cy="17" r="1" fill="${t.accentLight}" opacity="0.85"/>`;
      }
      // right
      return `
        <circle cx="18" cy="1.5" r="2" fill="${t.accent}" opacity="0.85"/>
        <circle cx="19" cy="5" r="1.8" fill="${t.accent}" opacity="0.8"/>
        <circle cx="18" cy="8.5" r="2" fill="${t.accent}" opacity="0.85"/>
        <circle cx="19" cy="12" r="1.8" fill="${t.accent}" opacity="0.8"/>
        <circle cx="18" cy="15.5" r="2" fill="${t.accent}" opacity="0.85"/>
        <circle cx="19" cy="19" r="1.5" fill="${t.accentLight}" opacity="0.9"/>
        <circle cx="19.5" cy="3.5" r="1" fill="${t.accentLight}" opacity="0.85"/>
        <circle cx="19.5" cy="10" r="0.8" fill="${t.accentLight}" opacity="0.85"/>
        <circle cx="19.5" cy="17" r="1" fill="${t.accentLight}" opacity="0.85"/>`;
    }
    case 'water': {
      // 调优：硬色条宽度减半(4→2)，波浪 stroke 减半(2→1, 1.5→0.8)，移除圆点
      // 4 边叠加时更"轻"，避免在 4x4 cell 上形成满亮蓝框
      if (side === 'top') {
        return `
          <path d="M0,2 L20,2 L20,4 L0,4 Z" fill="${t.accentLight}" opacity="0.5"/>
          <path d="M0,2.5 Q4,0 8,2.5 T16,2.5 T20,2.5" stroke="${t.accentLight}" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>`;
      }
      if (side === 'bottom') {
        return `
          <path d="M0,16 L20,16 L20,18 L0,18 Z" fill="${t.accentLight}" opacity="0.5"/>
          <path d="M0,17.5 Q4,20 8,17.5 T16,17.5 T20,17.5" stroke="${t.accentLight}" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>`;
      }
      if (side === 'left') {
        return `
          <path d="M2,0 L4,0 L4,20 L2,20 Z" fill="${t.accentLight}" opacity="0.5"/>
          <path d="M2.5,0 Q0,4 2.5,8 T2.5,16 T2.5,20" stroke="${t.accentLight}" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>`;
      }
      // right
      return `
        <path d="M16,0 L18,0 L18,20 L16,20 Z" fill="${t.accentLight}" opacity="0.5"/>
        <path d="M17.5,0 Q20,4 17.5,8 T17.5,16 T17.5,20" stroke="${t.accentLight}" stroke-width="1" fill="none" opacity="0.85" stroke-linecap="round"/>`;
    }
    case 'rock': {
      // 碎石：3-4 个大块（3-5 单位宽）+ 黑色边
      if (side === 'top') {
        return `
          <polygon points="0,4 3,0 5,1 6,3 4,5 1,5" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1" opacity="0.95"/>
          <polygon points="6,4 9,0 12,1 13,3 11,5 7,5" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="1" opacity="0.95"/>
          <polygon points="13,4 16,0 18,1 19,3 17,5 14,5" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1" opacity="0.95"/>
          <path d="M3,1 L4,0.5 M9,1 L10,0.5 M16,1 L17,0.5" stroke="${t.accentDark}" stroke-width="1" fill="none" opacity="0.8"/>`;
      }
      if (side === 'bottom') {
        return `
          <polygon points="0,16 3,20 5,19 6,17 4,15 1,15" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1" opacity="0.95"/>
          <polygon points="6,16 9,20 12,19 13,17 11,15 7,15" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="1" opacity="0.95"/>
          <polygon points="13,16 16,20 18,19 19,17 17,15 14,15" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1" opacity="0.95"/>
          <path d="M3,19 L4,19.5 M9,19 L10,19.5 M16,19 L17,19.5" stroke="${t.accentDark}" stroke-width="1" fill="none" opacity="0.8"/>`;
      }
      if (side === 'left') {
        return `
          <polygon points="4,0 0,3 1,5 3,6 5,4 5,1" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1" opacity="0.95"/>
          <polygon points="4,6 0,9 1,12 3,13 5,11 5,7" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="1" opacity="0.95"/>
          <polygon points="4,13 0,16 1,18 3,19 5,17 5,14" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1" opacity="0.95"/>
          <path d="M1,3 L0.5,4 M1,9 L0.5,10 M1,16 L0.5,17" stroke="${t.accentDark}" stroke-width="1" fill="none" opacity="0.8"/>`;
      }
      // right
      return `
        <polygon points="16,0 20,3 19,5 17,6 15,4 15,1" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1" opacity="0.95"/>
        <polygon points="16,6 20,9 19,12 17,13 15,11 15,7" fill="${t.accent2}" stroke="${t.accentDark}" stroke-width="1" opacity="0.95"/>
        <polygon points="16,13 20,16 19,18 17,19 15,17 15,14" fill="${t.accent}" stroke="${t.accentDark}" stroke-width="1" opacity="0.95"/>
        <path d="M19,3 L19.5,4 M19,9 L19.5,10 M19,16 L19.5,17" stroke="${t.accentDark}" stroke-width="1" fill="none" opacity="0.8"/>`;
    }
  }
  return '';
}

// ============================================================
// Corner feathering（4 角）— 方案 F 重设计版
// 8x8 角贴片（保留），2 种 variant (convex 凸出 / concave 凹入)
// 关键改动：移除 5x5 unit 满铺色块，只画 0.3-1.5 unit 细线条/小圆点
// 8x8 viewBox → 8x8 像素（跨 2x2 cell），但内部细节只占 1-1.5 像素
// 4 cell 角点叠加时 = 4 条细 stroke 集中 = 自然细节群，无大色块
// ============================================================
function cornerFeather(t, corner, variant) {
  switch (t.id) {
    case 'grass': {
      if (variant === 'convex') {
        // 凸角：3 像素细草叶 V 形 + 1 个小亮点（无 fill 满铺）
        if (corner === 'tl') return `<path d="M2,5 L3,2 M3,2 L4,1 M2,5 L4,1" stroke="${t.accentLight}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="2.5" cy="1.5" r="0.3" fill="${t.accentLight}" opacity="0.9"/>`;
        if (corner === 'tr') return `<path d="M6,5 L5,2 M5,2 L4,1 M6,5 L4,1" stroke="${t.accentLight}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="5.5" cy="1.5" r="0.3" fill="${t.accentLight}" opacity="0.9"/>`;
        if (corner === 'bl') return `<path d="M2,3 L3,6 M3,6 L4,7 M2,3 L4,7" stroke="${t.accentLight}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="2.5" cy="6.5" r="0.3" fill="${t.accentLight}" opacity="0.9"/>`;
        return `<path d="M6,3 L5,6 M5,6 L4,7 M6,3 L4,7" stroke="${t.accentLight}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="5.5" cy="6.5" r="0.3" fill="${t.accentLight}" opacity="0.9"/>`;
      } else {
        // 凹角：2 个小亮点 + 1 条细线
        if (corner === 'tl') return `<circle cx="2" cy="2" r="0.4" fill="${t.accentLight}" opacity="0.95"/><circle cx="3" cy="3" r="0.3" fill="${t.accent}" opacity="0.85"/><path d="M1.5,1.5 L2.5,2.5" stroke="${t.accentLight}" stroke-width="0.4" fill="none"/>`;
        if (corner === 'tr') return `<circle cx="6" cy="2" r="0.4" fill="${t.accentLight}" opacity="0.95"/><circle cx="5" cy="3" r="0.3" fill="${t.accent}" opacity="0.85"/><path d="M6.5,1.5 L5.5,2.5" stroke="${t.accentLight}" stroke-width="0.4" fill="none"/>`;
        if (corner === 'bl') return `<circle cx="2" cy="6" r="0.4" fill="${t.accentLight}" opacity="0.95"/><circle cx="3" cy="5" r="0.3" fill="${t.accent}" opacity="0.85"/><path d="M1.5,6.5 L2.5,5.5" stroke="${t.accentLight}" stroke-width="0.4" fill="none"/>`;
        return `<circle cx="6" cy="6" r="0.4" fill="${t.accentLight}" opacity="0.95"/><circle cx="5" cy="5" r="0.3" fill="${t.accent}" opacity="0.85"/><path d="M6.5,6.5 L5.5,5.5" stroke="${t.accentLight}" stroke-width="0.4" fill="none"/>`;
      }
    }
    case 'sand': {
      if (variant === 'convex') {
        // 凸角:2 个细沙粒小点(无 fill 满铺)
        if (corner === 'tl') return `<circle cx="1.5" cy="1.5" r="0.35" fill="${t.accentLight}" opacity="0.9"/><circle cx="3" cy="2.8" r="0.3" fill="${t.accent}" opacity="0.85"/>`;
        if (corner === 'tr') return `<circle cx="6.5" cy="1.5" r="0.35" fill="${t.accentLight}" opacity="0.9"/><circle cx="5" cy="2.8" r="0.3" fill="${t.accent}" opacity="0.85"/>`;
        if (corner === 'bl') return `<circle cx="1.5" cy="6.5" r="0.35" fill="${t.accentLight}" opacity="0.9"/><circle cx="3" cy="5.2" r="0.3" fill="${t.accent}" opacity="0.85"/>`;
        return `<circle cx="6.5" cy="6.5" r="0.35" fill="${t.accentLight}" opacity="0.9"/><circle cx="5" cy="5.2" r="0.3" fill="${t.accent}" opacity="0.85"/>`;
      } else {
        // 凹角:1 颗小沙粒 + 1 条细沙纹线
        if (corner === 'tl') return `<circle cx="2" cy="2" r="0.4" fill="${t.accent}" opacity="0.9"/><path d="M1,3.5 Q2,3 3,3.5" stroke="${t.accentLight}" stroke-width="0.4" fill="none"/>`;
        if (corner === 'tr') return `<circle cx="6" cy="2" r="0.4" fill="${t.accent}" opacity="0.9"/><path d="M5,3.5 Q6,3 7,3.5" stroke="${t.accentLight}" stroke-width="0.4" fill="none"/>`;
        if (corner === 'bl') return `<circle cx="2" cy="6" r="0.4" fill="${t.accent}" opacity="0.9"/><path d="M1,4.5 Q2,5 3,4.5" stroke="${t.accentLight}" stroke-width="0.4" fill="none"/>`;
        return `<circle cx="6" cy="6" r="0.4" fill="${t.accent}" opacity="0.9"/><path d="M5,4.5 Q6,5 7,4.5" stroke="${t.accentLight}" stroke-width="0.4" fill="none"/>`;
      }
    }
    case 'water': {
      if (variant === 'convex') {
        // 凸角:1 条细浪花线 + 1 个小亮点(无 fill 满铺)
        if (corner === 'tl') return `<path d="M1,3 Q2.5,1.5 4,3" stroke="${t.accentLight}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="3.5" cy="1.5" r="0.3" fill="${t.accentLight}" opacity="0.9"/>`;
        if (corner === 'tr') return `<path d="M7,3 Q5.5,1.5 4,3" stroke="${t.accentLight}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="4.5" cy="1.5" r="0.3" fill="${t.accentLight}" opacity="0.9"/>`;
        if (corner === 'bl') return `<path d="M1,5 Q2.5,6.5 4,5" stroke="${t.accentLight}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="3.5" cy="6.5" r="0.3" fill="${t.accentLight}" opacity="0.9"/>`;
        return `<path d="M7,5 Q5.5,6.5 4,5" stroke="${t.accentLight}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.95"/><circle cx="4.5" cy="6.5" r="0.3" fill="${t.accentLight}" opacity="0.9"/>`;
      } else {
        // 凹角:1 条细水波线 + 1 个小亮点
        if (corner === 'tl') return `<path d="M1,4 Q2.5,2.5 4,4" stroke="${t.accentLight}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/><circle cx="2" cy="2" r="0.3" fill="${t.accentLight}" opacity="0.9"/>`;
        if (corner === 'tr') return `<path d="M7,4 Q5.5,2.5 4,4" stroke="${t.accentLight}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/><circle cx="6" cy="2" r="0.3" fill="${t.accentLight}" opacity="0.9"/>`;
        if (corner === 'bl') return `<path d="M1,4 Q2.5,5.5 4,4" stroke="${t.accentLight}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/><circle cx="2" cy="6" r="0.3" fill="${t.accentLight}" opacity="0.9"/>`;
        return `<path d="M7,4 Q5.5,5.5 4,4" stroke="${t.accentLight}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.9"/><circle cx="6" cy="6" r="0.3" fill="${t.accentLight}" opacity="0.9"/>`;
      }
    }
    case 'rock': {
      if (variant === 'convex') {
        // 凸角:2 条细裂纹 + 1 个小亮点(无 fill 满铺)
        if (corner === 'tl') return `<path d="M1,4 L3,2 M3,2 L4,1" stroke="${t.accentDark}" stroke-width="0.5" fill="none" stroke-linecap="round" opacity="0.95"/><path d="M0.5,2.5 L1.5,3.5" stroke="${t.accentDark}" stroke-width="0.4" fill="none"/><circle cx="3.5" cy="3" r="0.3" fill="${t.accent2}" opacity="0.85"/>`;
        if (corner === 'tr') return `<path d="M7,4 L5,2 M5,2 L4,1" stroke="${t.accentDark}" stroke-width="0.5" fill="none" stroke-linecap="round" opacity="0.95"/><path d="M7.5,2.5 L6.5,3.5" stroke="${t.accentDark}" stroke-width="0.4" fill="none"/><circle cx="4.5" cy="3" r="0.3" fill="${t.accent2}" opacity="0.85"/>`;
        if (corner === 'bl') return `<path d="M1,4 L3,6 M3,6 L4,7" stroke="${t.accentDark}" stroke-width="0.5" fill="none" stroke-linecap="round" opacity="0.95"/><path d="M0.5,5.5 L1.5,4.5" stroke="${t.accentDark}" stroke-width="0.4" fill="none"/><circle cx="3.5" cy="5" r="0.3" fill="${t.accent2}" opacity="0.85"/>`;
        return `<path d="M7,4 L5,6 M5,6 L4,7" stroke="${t.accentDark}" stroke-width="0.5" fill="none" stroke-linecap="round" opacity="0.95"/><path d="M7.5,5.5 L6.5,4.5" stroke="${t.accentDark}" stroke-width="0.4" fill="none"/><circle cx="4.5" cy="5" r="0.3" fill="${t.accent2}" opacity="0.85"/>`;
      } else {
        // 凹角:1 个小暗点 + 1 条短裂纹
        if (corner === 'tl') return `<circle cx="2" cy="2" r="0.4" fill="${t.accentDark}" opacity="0.9"/><path d="M1,1 L1.8,1.8" stroke="${t.accentDark}" stroke-width="0.4" fill="none"/><circle cx="3.5" cy="3.5" r="0.25" fill="${t.accent2}" opacity="0.7"/>`;
        if (corner === 'tr') return `<circle cx="6" cy="2" r="0.4" fill="${t.accentDark}" opacity="0.9"/><path d="M7,1 L6.2,1.8" stroke="${t.accentDark}" stroke-width="0.4" fill="none"/><circle cx="4.5" cy="3.5" r="0.25" fill="${t.accent2}" opacity="0.7"/>`;
        if (corner === 'bl') return `<circle cx="2" cy="6" r="0.4" fill="${t.accentDark}" opacity="0.9"/><path d="M1,7 L1.8,6.2" stroke="${t.accentDark}" stroke-width="0.4" fill="none"/><circle cx="3.5" cy="4.5" r="0.25" fill="${t.accent2}" opacity="0.7"/>`;
        return `<circle cx="6" cy="6" r="0.4" fill="${t.accentDark}" opacity="0.9"/><path d="M7,7 L6.2,6.2" stroke="${t.accentDark}" stroke-width="0.4" fill="none"/><circle cx="4.5" cy="4.5" r="0.25" fill="${t.accent2}" opacity="0.7"/>`;
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
