#!/usr/bin/env node
// scripts/gen-sample-map.mjs
// 为 24-tile autotile 计划生成示例地图 (autotile-demo)
// 覆盖：4 种地形 + 16 边掩码 + 4 角点凸/凹 + T 接点

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const W = 120;
const H = 90;
const CELL_SIZE = 4;

// 地形类型常量
const T = { GRASS: 0, SAND: 1, WATER: 2, ROCK: 3 };

// 障碍物类型
const OB = { BRICK: 1, ICE: 2, WOOD: 3, FENCE: 4 };

// 用 Map 存储非草地格（草地是默认值）
const terrainMap = new Map();
const walls = [];
const foods = [];

const key = (x, y) => y * W + x;

function setTerrain(x, y, t) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  terrainMap.set(key(x, y), t);
}

function fillRect(x0, y0, x1, y1, t) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) setTerrain(x, y, t);
  }
}

// ============================================================
// 1. 右上湖泊 (cx: 60-110, cy: 5-35)
// ============================================================
fillRect(60, 5, 110, 35, T.WATER);

// 沙岸环 (1 cell 宽) — 故意在四角留 1 cell 草地，制造 T 接点
fillRect(60, 3, 110, 4, T.SAND);   // top
fillRect(60, 36, 110, 37, T.SAND); // bottom
fillRect(58, 5, 59, 35, T.SAND);   // left
fillRect(111, 5, 112, 35, T.SAND); // right
// 四角缺 1 cell 形成 T 接点:
fillRect(58, 3, 59, 4, T.GRASS);   // TL: 草(58,3) 草(59,3) 草(58,4) 沙(59,4)
fillRect(111, 3, 112, 4, T.GRASS); // TR
fillRect(58, 36, 59, 37, T.GRASS); // BL
fillRect(111, 36, 112, 37, T.GRASS); // BR

// 湖中小岛 (cx: 78-85, cy: 15-22)
fillRect(78, 15, 85, 22, T.SAND); // 整个小岛是沙（孤岛，mask 0）
// 小岛周围的沙岸 → 水 (即小岛本身是沙, 周围是水)
fillRect(78, 15, 85, 22, T.SAND);
// 重置 4 边为水（让小岛漂浮）：
fillRect(78, 15, 85, 15, T.WATER); // top
fillRect(78, 22, 85, 22, T.WATER); // bottom
fillRect(78, 15, 78, 22, T.WATER); // left
fillRect(85, 15, 85, 22, T.WATER); // right
// 内部 (cx: 79-84, cy: 16-21) 是沙 → 6x6 沙岛 (mask 15 内部)

// ============================================================
// 2. 中部横贯河流 (cy: 45-55, cx: 0-115)
// ============================================================
fillRect(0, 45, 115, 55, T.WATER);

// 河流沙岸 (1 cell 宽)
fillRect(0, 44, 115, 44, T.SAND);
fillRect(0, 56, 115, 56, T.SAND);

// 河流左端变窄，自然渐变
fillRect(116, 45, 119, 55, T.GRASS); // 河右端出口
fillRect(117, 50, 117, 52, T.WATER); // 收窄

// 河流中的小沙岛 (用于放砖墙)
fillRect(35, 49, 38, 51, T.SAND);
fillRect(70, 49, 73, 51, T.SAND);

// ============================================================
// 3. 岩石区 A (cx: 5-15, cy: 65-75) — 散落岩石
// ============================================================
fillRect(5, 65, 12, 72, T.ROCK);

// 岩石区 B (cx: 18-25, cy: 80-87)
fillRect(18, 80, 25, 87, T.ROCK);

// 岩石区 C (cx: 90-110, cy: 70-85)
fillRect(90, 70, 110, 85, T.ROCK);

// 草地上的小石块 (单格, mask 0 测试)
setTerrain(30, 65, T.ROCK);
setTerrain(45, 75, T.ROCK);
setTerrain(60, 80, T.ROCK);

// ============================================================
// 4. 角点测试模式 (cx: 35-60, cy: 65-85)
// 显式构造 凸角 / 凹角 / T 接点
// ============================================================

// 凸角测试：(40, 70) sand, (40, 69) sand, (39, 70) sand, (39, 69) grass → TL 凸角
setTerrain(40, 70, T.SAND);
setTerrain(40, 69, T.SAND);
setTerrain(39, 70, T.SAND);
// (39, 69) 默认 grass → TL 凸角

// 凸角测试 TR：(45, 70) sand, (45, 69) sand, (46, 70) sand, (46, 69) grass → TR 凸角
setTerrain(45, 70, T.SAND);
setTerrain(45, 69, T.SAND);
setTerrain(46, 70, T.SAND);

// 凸角测试 BL：(40, 75) sand, (40, 76) sand, (39, 75) sand, (39, 76) grass → BL 凸角
setTerrain(40, 75, T.SAND);
setTerrain(40, 76, T.SAND);
setTerrain(39, 75, T.SAND);

// 凸角测试 BR：(45, 75) sand, (45, 76) sand, (46, 75) sand, (46, 76) grass → BR 凸角
setTerrain(45, 75, T.SAND);
setTerrain(45, 76, T.SAND);
setTerrain(46, 75, T.SAND);

// 凹角测试：(50, 70) sand, (50, 69) grass, (49, 70) grass, (49, 69) sand → TL 凹角
setTerrain(50, 70, T.SAND);
setTerrain(49, 69, T.SAND);

// 凹角测试 TR：(55, 70) sand, (55, 69) grass, (56, 70) grass, (56, 69) sand
setTerrain(55, 70, T.SAND);
setTerrain(56, 69, T.SAND);

// 凹角测试 BL：(50, 75) sand, (50, 76) grass, (49, 75) grass, (49, 76) sand
setTerrain(50, 75, T.SAND);
setTerrain(49, 76, T.SAND);

// 凹角测试 BR：(55, 75) sand, (55, 76) grass, (56, 75) grass, (56, 76) sand
setTerrain(55, 75, T.SAND);
setTerrain(56, 76, T.SAND);

// T 接点测试 1：3 地形在 1 点交汇 (草+沙+水)
// (60, 44) sand 旁边是 (60, 45) water 和 (59, 44) grass → 上+右=草+水
// 但我们的河流沙岸 cy:44, cx:0-115 已经在 y=44 都是 sand
// 改成：让 cy=43 也成 sand, 但 cy=42 留 grass, 制造阶梯
fillRect(0, 44, 115, 44, T.SAND); // 重申
// 在 (28, 43)-(32, 43) 处挖一个 grass 凹陷, 制造 T
fillRect(28, 43, 32, 43, T.GRASS);
fillRect(28, 42, 32, 42, T.GRASS);
// 现在 (28, 43) = grass, (28, 44) = sand, (28, 45) = water → T 接点 (3 地形)
// diag TL of (28, 44) is (27, 43) = grass (默认), diag TR is (29, 43) = grass

// T 接点测试 2：沙嵌入草地
fillRect(40, 65, 42, 65, T.SAND);
fillRect(40, 65, 40, 67, T.SAND);
// (40, 65) 是 L 形沙地，2 边接，2 角点可测试

// ============================================================
// 5. 障碍物（砖墙） — 放在河流沙岛上
// ============================================================
walls.push([36, 50, OB.BRICK]);
walls.push([37, 50, OB.BRICK]);
walls.push([71, 50, OB.BRICK]);
walls.push([72, 50, OB.BRICK]);

// 草地上一堵小砖墙
walls.push([15, 40, OB.BRICK]);
walls.push([16, 40, OB.BRICK]);
walls.push([17, 40, OB.BRICK]);

// ============================================================
// 6. 食物（2x2 糖块）
// ============================================================
// 左上
foods.push([5, 5, 30, 0]);
foods.push([6, 5, 30, 0]);
foods.push([5, 6, 30, 0]);
foods.push([6, 6, 30, 0]);
// 右下
foods.push([110, 80, 30, 0]);
foods.push([111, 80, 30, 0]);
foods.push([110, 81, 30, 0]);
foods.push([111, 81, 30, 0]);
// 中部
foods.push([60, 10, 30, 0]);
foods.push([61, 10, 30, 0]);
foods.push([60, 11, 30, 0]);
foods.push([61, 11, 30, 0]);

// ============================================================
// 输出: GridData
// ============================================================
const terrain = [];
for (const [k, t] of terrainMap) {
  const x = k % W;
  const y = Math.floor(k / W);
  terrain.push([x, y, t]);
}

const gridData = { cellSize: CELL_SIZE, terrain, walls, foods };

// ============================================================
// 写 JSON 文件
// ============================================================
const sampleDir = path.join(ROOT, 'server', 'data', 'samples');
if (!fs.existsSync(sampleDir)) fs.mkdirSync(sampleDir, { recursive: true });
const jsonPath = path.join(sampleDir, 'sample-autotile-demo.json');
fs.writeFileSync(jsonPath, JSON.stringify(gridData, null, 2));
console.log(`OK: wrote ${jsonPath}`);
console.log(`  terrain cells: ${terrain.length}`);
console.log(`  walls: ${walls.length}`);
console.log(`  foods: ${foods.length}`);

// ============================================================
// 统计 16 边掩码覆盖 + 角点触发
// ============================================================
function getTerrain(x, y) {
  if (x < 0 || x >= W || y < 0 || y >= H) return T.GRASS;
  return terrainMap.get(key(x, y)) ?? T.GRASS;
}

const edgeMaskCount = new Array(16).fill(0);
const cornerCount = { tl: { conv: 0, conc: 0 }, tr: { conv: 0, conc: 0 }, bl: { conv: 0, conc: 0 }, br: { conv: 0, conc: 0 } };

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const t = getTerrain(x, y);
    let edgeMask = 0;
    if (getTerrain(x, y - 1) === t) edgeMask |= 1;
    if (getTerrain(x, y + 1) === t) edgeMask |= 2;
    if (getTerrain(x - 1, y) === t) edgeMask |= 4;
    if (getTerrain(x + 1, y) === t) edgeMask |= 8;
    edgeMaskCount[edgeMask]++;

    // 角点检测
    const corners = {
      tl: { up: 1, side: 4, diagDx: -1, diagDy: -1 },
      tr: { up: 1, side: 8, diagDx: 1, diagDy: -1 },
      bl: { up: 2, side: 4, diagDx: -1, diagDy: 1 },
      br: { up: 2, side: 8, diagDx: 1, diagDy: 1 },
    };
    for (const c of ['tl', 'tr', 'bl', 'br']) {
      const cfg = corners[c];
      // cfg.up 对 tl/tr 是 bit0 (up), 对 bl/br 是 bit1 (down)
      const upSame = (edgeMask & cfg.up) !== 0;
      const sideSame = (edgeMask & cfg.side) !== 0;
      const diagX = x + cfg.diagDx;
      const diagY = y + cfg.diagDy;
      const diagSame = getTerrain(diagX, diagY) === t;
      if (upSame && sideSame && !diagSame) cornerCount[c].conv++;
      if (!upSame && !sideSame && diagSame) cornerCount[c].conc++;
    }
  }
}

console.log('  edge mask distribution:');
for (let m = 0; m < 16; m++) {
  console.log(`    mask ${m.toString(2).padStart(4, '0')}: ${edgeMaskCount[m]}`);
}
console.log('  corner triggers:');
for (const c of ['tl', 'tr', 'bl', 'br']) {
  console.log(`    ${c}: convex=${cornerCount[c].conv} concave=${cornerCount[c].conc}`);
}

// ============================================================
// ASCII 预览 (缩放 1/4，每 4 cell 取 1 char)
// ============================================================
const SYM = { 0: '.', 1: 's', 2: '~', 3: 'r' }; // grass, sand, water, rock
const SX = 4, SY = 4; // 缩放: 4x4 cells → 1 char
const pw = Math.ceil(W / SX);
const ph = Math.ceil(H / SY);
let ascii = '';
for (let py = 0; py < ph; py++) {
  for (let px = 0; px < pw; px++) {
    // 取该区域的中心
    const cx = px * SX + Math.floor(SX / 2);
    const cy = py * SY + Math.floor(SY / 2);
    ascii += SYM[getTerrain(cx, cy)];
  }
  ascii += '\n';
}
console.log('\n  ASCII preview (each char = 4x4 cells):');
for (const line of ascii.split('\n')) console.log('    ' + line);

// ============================================================
// 调后端 API 插入数据库
// ============================================================
function httpReq(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function insertToDb() {
  // 1. 检查后端可达性
  const listRes = await httpReq({ hostname: 'localhost', port: 3001, path: '/api/maps', method: 'GET' });
  if (listRes.status !== 200) {
    console.warn(`\nWARN: backend not reachable (status ${listRes.status}), skipped DB insert`);
    return null;
  }
  console.log('\n  backend reachable.');

  // 2. 检查同名地图
  const maps = JSON.parse(listRes.body);
  const existing = maps.find((m) => m.name === 'autotile-demo');
  if (existing) {
    console.log(`  found existing map id=${existing.id}, deleting...`);
    await httpReq({ hostname: 'localhost', port: 3001, path: `/api/maps/${existing.id}`, method: 'DELETE' });
  }

  // 3. POST 创建
  const createRes = await httpReq(
    { hostname: 'localhost', port: 3001, path: '/api/maps', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    JSON.stringify({ name: 'autotile-demo', width: W, height: H }),
  );
  if (createRes.status !== 200) {
    console.error(`\nFAIL: create map returned ${createRes.status}: ${createRes.body}`);
    return null;
  }
  const { id } = JSON.parse(createRes.body);
  console.log(`  created map id=${id}`);

  // 4. PUT 上传 grid_data
  const updateRes = await httpReq(
    { hostname: 'localhost', port: 3001, path: `/api/maps/${id}`, method: 'PUT', headers: { 'Content-Type': 'application/json' } },
    JSON.stringify({ grid_data: JSON.stringify(gridData) }),
  );
  if (updateRes.status !== 200) {
    console.error(`\nFAIL: update map returned ${updateRes.status}: ${updateRes.body}`);
    return null;
  }
  console.log(`OK: inserted to DB as id=${id}, name='autotile-demo'`);
  return id;
}

try {
  const id = await insertToDb();
  if (id !== null) {
    console.log(`\nDONE. Open map id=${id} in map selector.`);
  }
} catch (e) {
  console.warn(`\nWARN: ${e.message}, skipped DB insert`);
}
