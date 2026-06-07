# 2026-06-07-24-tile-feathering极限加粗-结果

## 概要

按 [2026-06-07-24-tile-feathering极限加粗-计划](./2026-06-07-24-tile-feathering极限加粗-计划.md) 实施极限加粗 feathering，让自动地形过渡在 4×4 cell + zoom < 1 的 fit-to-view 场景下**物理上**可见。

## 改动文件

| 文件 | 改动 |
|---|---|
| `scripts/generate-terrain-tiles.mjs` | TERRAINS 颜色加亮 + internalTexture 收缩中央 + edgeFeather 占 50% cell + cornerFeather 占 6×6 区域 |
| `src/render/assets/TerrainAutoTiles.ts` | 重新生成（96 SVG，4 地形 × 16 边 + 4 角 × 2 variant）|
| `docs/2026-06-07-24-tile-feathering极限加粗-计划.md` | 新增计划文档 |

## feathering 尺寸对比

### 主体（edge）feather

| 地形 | 元素 | 旧 (4-5 unit) | 新 (8-10 unit) | zoom=0.5 屏像素 |
|---|---|---|---|---|
| grass | 草尖 fill 高度 | 0-5 unit | **0-9 unit (50% cell)** | **0.9 px** |
| grass | blade stroke 宽度 | 1.5 | **1.8** | 0.18 px |
| grass | 亮色高度 | 0-2 unit | **0-9 unit (rect)** | 0.9 px |
| sand | 圆点 r | 1.5-2.0 (3-4 直径) | **3.0-3.5 (6-7 直径)** | 0.6-0.7 px |
| water | 浪花硬色条宽度 | 2 unit | **4 unit** | 0.4 px |
| water | 浪花波浪 stroke-width | 2 | **3** | 0.3 px |
| water | 浪花点 r | 0.5-0.6 | **0.8-1.0** | 0.08-0.1 px |
| rock | 碎石多边形宽度 | 3 个 × 5-6 unit | **3 个 × 8-10 unit** | 0.8-1.0 px |
| rock | 黑色 stroke | 1 | **1.2** | 0.12 px |

### 角点（corner）feather

| 地形 | 元素 | 旧 (polygon) | 新 (rect 6×6 + accent) |
|---|---|---|---|
| grass | convex | polygon 0,4 4,0 | **rect 0,0 6,6 + 草叶 path** |
| grass | concave | circle r=2 | **rect 0,0 6,6 + 草叶 path** |
| sand | convex | 3 个 circle | **rect 0,0 6,6 + 2 个 circle** |
| sand | concave | circle r=2.5 | **rect 0,0 6,6 + circle r=1.5** |
| water | convex | path Q | **rect 0,0 6,6 + 水波 path** |
| water | concave | path M | **rect 0,0 6,6 + 粗水波 path** |
| rock | convex | polygon | **rect 0,0 6,6 + 黑色 stroke** |
| rock | concave | polygon | **rect 0,0 6,6 + 黑色 stroke** |

## 颜色加亮

feathering 元素颜色用更亮的版本（更易在低 zoom 下通过 AA 显示）：

| 地形 | accent 旧 | accent 新 | accentLight 旧 | accentLight 新 |
|---|---|---|---|---|
| grass | `#5a8a35` | `#7ab045` | `#6a9a40` | `#9ad85a` |
| sand | `#a8854a` | `#d4ad6a` | `#b8965a` | `#e8c890` |
| water | `#7a9aca` | `#a8c0e0` | `#a8c0e0` | `#d8e8f8` |
| rock | `#8a8a92` | `#b0b0b8` | `#7a7a82` | `#9a9aa2` |

## internalTexture 收缩

为了让出边缘给 feathering，cell 主体纹理缩小到中央 6×6 unit：

| 地形 | 旧 (散落全 cell) | 新 (中央 6×6) |
|---|---|---|
| grass | 4 条 path + 3 个 circle 散落 0-18 | **4 条 path 7-13 unit + 2 个小点 8-12 unit** |
| sand | 4 个 circle + 2 条 path 散落 0-17 | **3 个小点 9-11 unit** |
| water | 3 条 path 0-15 | **1 条 path 6-14 unit** |
| rock | 3 个 polygon 散落 0-19 | **2 个 polygon 8-13 unit** |

## 实施细节

### 1. edgeFeather 用 rect + path 双层

```javascript
// grass top
<rect x="0" y="0" width="20" height="9" fill="${accent}" opacity="0.7"/>  // 大色块
<path d="M0,9 Q2,0 4,9 Q6,0 8,9 Q10,0 12,9 Q14,0 16,9 Q18,0 20,9 L20,10 L0,10 Z" fill="${accent}" opacity="0.95"/>  // 草尖形状
<path d="..." stroke="${accentLight}" stroke-width="1.8" .../>  // 亮色草叶
```

第一层 rect 提供稳定底色（不依赖 path 抗锯齿），第二层 path 提供草尖轮廓，第三层 stroke 提供细节。

### 2. cornerFeather 用 rect 满铺

```javascript
// sand corner
<rect x="0" y="0" width="6" height="6" fill="${accent}" opacity="0.95"/>  // 满铺 6×6
<circle cx="2" cy="2" r="1.2" fill="${accentLight}" opacity="1"/>  // 亮色沙粒
```

rect 6×6 在 8×8 viewBox 渲染到 8×8 像素时 = 6×6 物理像素（清晰可见）。

### 3. feathering 跨 cell 边界

feathering 元素 0-9 / 11-20 unit 在 cell 内绘制，但绘制顺序保证**后画的 cell 覆盖**：

```javascript
// MapEditor drawEditorAutoTerrain
for (let y = sy; y <= ey; y++) {
  for (let x = sx; x <= ex; x++) {
    // 1. 画当前 cell 主体（4×4）
    AssetRegistry.drawTile(ctx, svgKey, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
  }
}
// 2. 角点叠加
for (let y = sy; y <= ey; y++) {
  for (let x = sx; x <= ex; x++) {
    // 画 8×8 角贴片在 cell 角位置
  }
}
```

角点 8×8 跨 2×2 cell，所以**后画的 cell 的角贴片会覆盖**前一 cell 的边缘 feathering。这与"凸角"语义一致（凸角的 cell 突出，凹角的 cell 让位）。

## 验证

### TypeScript 编译

```bash
npx tsc --noEmit
# exit 0，无错误
```

### 视觉验证（待用户在浏览器）

1. 启动 dev：`cd server && npm run dev` + `npm run dev`
2. 进入地图编辑 autotile-demo 地图
3. 开启"自动地形过渡（24-tile）"开关
4. 期望视觉变化：
   - 湖岸四周：硬切 → 草尖/沙粒向水面延伸
   - 河流沙岸两端：水波浪花/沙粒渐变清晰
   - 沙岛外围：水→沙 边缘明显
   - 4 角点位置：6×6 角贴片清晰覆盖

### 性能预估

极限加粗后 SVG 复杂度增加（更多 path/circle/polygon）但仍是单 cell 单 drawImage 调用，drawTile 性能不变。AssetRegistry 缓存 128×128 位图，drawTile 仍是 1 次 drawImage。

预期性能：与上一版（4-5 unit feathering）几乎相同。

## 已知问题

1. **feathering 侵占 internalTexture 视觉空间**
   - 主体纹理被推到中央 6×6，cell 边缘 50% 都是 feathering
   - 单地形 cell 看起来"满"是 feathering 颜色，不是 base 颜色
   - 缓解：feathering 用 `accent` (亮于 base)，让"满"看起来是 design choice

2. **跨 cell feathering 重复绘制**
   - 左 cell 的 right edge feathering 和 右 cell 的 left edge feathering 重叠
   - 后画的覆盖前者 → 视觉一致（按 mask 选择 SVG，mask=0/8/4 等不同）

3. **fallback 静默回退未改**
   - `drawEditorAutoTerrain` 仍在 AssetRegistry.has() === false 时回退到 base
   - 没打 warn（避免日志噪音）
   - 用户可在浏览器 console 手动验证 preload 是否成功：`AssetRegistry.has('auto_edge_grass_0')`

## 风险评估

| 风险 | 等级 | 缓解 |
|---|---|---|
| feathering 颜色与 base terrain 颜色差距大 | 中 | feathering 用 accent 系列（亮于 base），保持同色系 |
| 视觉"满"效果不像传统地图 | 中 | 接受为设计取舍（4×4 cell 本来就小） |
| 性能下降 | 低 | 仍是单 drawImage，drawTile 性能不变 |
| 跨 cell 重复 feathering 视觉错乱 | 低 | mask 0 草地 vs mask 8 沙地边缘：edge mask 决定 feathering 颜色 |

## 提交

```
5500a44 (HEAD) feat(autotile): 加粗 feathering 到 4-5 SVG units (0.8-1.0px @ 4x4 cell)
... (后续 commit: 极限加粗 + 颜色加亮 + internalTexture 收缩)
```

## 下一步

1. **浏览器视觉验证**：截图对比 on/off
2. **美术 review**：根据视觉效果判断是否需要回退到 4-5 unit + 改其他方案（cellSize 4→8）
3. **WorkerRenderer 集成**：当前未支持，灰度开关在游戏运行时无效果
4. **建立 CI 截图对比**：autotile-demo 地图 on/off 截图，作为视觉回归基线
