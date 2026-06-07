// 验证脚本：导出 mask=0 (4 边都 feather) 的边缘变体
// 让用户能直接打开 SVG 看 feathering 效果
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = fs.readFileSync(path.join(ROOT, 'src/render/assets/TerrainAutoTiles.ts'), 'utf-8');

const OUT_DIR = path.join(ROOT, 'docs/autotile-samples');
fs.mkdirSync(OUT_DIR, { recursive: true });

// 只截取 TERRAIN_AUTO_EDGE 段（从 "export const TERRAIN_AUTO_EDGE" 到 "};"）
const startMarker = 'export const TERRAIN_AUTO_EDGE';
const startIdx = SRC.indexOf(startMarker);
if (startIdx === -1) {
  console.error('TERRAIN_AUTO_EDGE not found');
  process.exit(1);
}
// 找段结束：匹配 "};" 在 TERRAIN_AUTO_EDGE 起始后第一个
// 由于源文件有嵌套 { }，最简单方法是用大括号计数
let braceDepth = 0;
let endIdx = -1;
let inString = false;
for (let i = startIdx; i < SRC.length; i++) {
  const c = SRC[i];
  if (c === '`') inString = !inString;
  else if (!inString) {
    if (c === '{') braceDepth++;
    else if (c === '}') {
      braceDepth--;
      if (braceDepth === 0) { endIdx = i; break; }
    }
  }
}
if (endIdx === -1) {
  console.error('end of TERRAIN_AUTO_EDGE not found');
  process.exit(1);
}
const edgeSection = SRC.substring(startIdx, endIdx + 1);
console.log(`Scanning TERRAIN_AUTO_EDGE section: ${startIdx}-${endIdx} (${edgeSection.length} chars)`);

const lines = edgeSection.split('\n');
let currentTerrain = -1;
const edges = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // 匹配 terrain 起始: "  N: {"
  const tIdx = line.indexOf('  ');
  if (tIdx === 0 && line.endsWith('{')) {
    const numStr = line.substring(2, line.indexOf(':'));
    const n = parseInt(numStr);
    if (!isNaN(n) && n >= 0 && n <= 3) {
      currentTerrain = n;
      edges[currentTerrain] = {};
      continue;
    }
  }
  // 匹配 edge mask 起始: "    M: `"
  if (line.startsWith('    ') && currentTerrain >= 0 && line.includes(': ')) {
    const colonIdx = line.indexOf(': ');
    const numStr = line.substring(4, colonIdx);
    const m = parseInt(numStr);
    const bt = line.substring(colonIdx + 2, colonIdx + 3);
    if (!isNaN(m) && m >= 0 && m <= 15 && bt === '`') {
      let svg = line.substring(colonIdx + 3);
      i++;
      while (i < lines.length) {
        const next = lines[i];
        const endIdx = next.indexOf('`,');
        if (endIdx !== -1) {
          svg += '\n' + next.substring(0, endIdx);
          break;
        }
        svg += '\n' + next;
        i++;
      }
      edges[currentTerrain][m] = svg;
    }
  }
}

const TERRAIN_NAMES = ['grass', 'sand', 'water', 'rock'];

for (let t = 0; t < 4; t++) {
  const svg = edges[t]?.[0];
  if (!svg) {
    console.warn(`missing edge[${t}][0], edges[${t}] keys: ${Object.keys(edges[t] || {})}`);
    continue;
  }
  const out = path.join(OUT_DIR, `edge_${TERRAIN_NAMES[t]}_mask0.svg`);
  fs.writeFileSync(out, svg);
  console.log(`wrote ${out} (${svg.length} chars)`);
}

console.log(`\nEdge samples exported to ${OUT_DIR}`);
console.log('打开任一 .svg 文件即可在浏览器查看 feathering 效果');
console.log('建议缩放到 4x4 像素看 cell 渲染（20x20 viewBox → 4x4 pixel）');
