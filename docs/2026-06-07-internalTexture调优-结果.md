# 2026-06-07-internalTexture调优-结果

## 概要

按 [2026-06-07-internalTexture调优-计划](./2026-06-07-internalTexture调优-计划.md) 调优 `internalTexture` 和 water feathering，解决 4-5 unit feathering 版本在 4x4 cell 上的视觉问题：
- 草地"奇怪的几何形状"（mask=0 4 边 feathering + 4 条长草叶叠加成网格）
- 水中"很大的不完整浪花"（mask=0 4 边硬色条 + 粗波浪叠加成框）

## 改动文件

| 文件 | 改动 |
|---|---|
| `scripts/generate-terrain-tiles.mjs` | internalTexture 全部缩短 + water feathering 简化 |
| `src/render/assets/TerrainAutoTiles.ts` | 重新生成（96 SVG）|
| `docs/2026-06-07-internalTexture调优-计划.md` | 新增计划文档 |

## 调优细节

### 1. internalTexture（4 地形）

| 地形 | 旧元素 | 新元素 | 旧尺寸 | 新尺寸 |
|---|---|---|---|---|
| grass | 4 条长草叶 (M2,18 L4,8 等) + 2 条副叶 + 3 个圆点 | 2 条短草叶 (M8,13 L9,7) + 2 条副叶 + 2 个圆点 | 9-13 unit 高 | **4-5 unit 高，居中 7-13** |
| sand | 4 个圆点 + 2 条曲线 散落 | 2-3 个圆点 + 1 条短曲线 居中 | 0-17 散落 | **8-12 居中** |
| water | 3 条横波浪线 | 1 条横波浪线 | y=5/10/15 3 条 | **y=10 中央 1 条** |
| rock | 3 个 polygon 散落 | 1-2 个 polygon 居中 | 0-19 散落 | **8-13 居中** |

### 2. water feathering 简化（mask=0 关键）

| 元素 | 旧 (4-5 unit) | 新 |
|---|---|---|
| 硬色条 rect 高度/宽度 | **4 unit** | **2 unit**（减半）|
| 硬色条 opacity | 0.6 | 0.5 |
| 粗波浪线 stroke-width | **2** | **1**（减半）|
| 次粗波浪线 stroke-width | 1.5 | **移除** |
| 浪花圆点 r=0.5-0.6 | 12 个 (4 边 × 3) | **移除** |
| 单边 feathering 元素数 | 6 | **2**（rect + 波浪线）|
| mask=0 总元素数 | 24+ | **8** |

### 3. grass / sand / rock feathering 不变

只在 internalTexture 调优，feathering 元素不变（4 边草尖/沙粒/碎石）。

## 视觉效果

### 草地 mask=0（4 边都异类）

**调优前**（4 边 feathering + 4 条长草叶）：
- 4 条长 9-13 unit 草叶 = 4 条 2 px 高的垂直线
- 4 边草尖 path 在 cell 上叠加
- 视觉：网格状，元素过多

**调优后**：
- 2 条 4-5 unit 短草叶 = 2 条 1 px 高的垂直线（居中 7-13 unit）
- 4 边草尖 path 仍叠加，但中央 6x6 区域有 internalTexture 视觉锚
- 视觉：feathering 主导，主体纹理仅作细节

### 水 mask=0（4 边都异类）

**调优前**：
- 4 边 rect 20x4 + 4 边粗波浪 stroke 2 = 满亮蓝 4x4 框
- 视觉："很大"的浪花框

**调优后**：
- 4 边 rect 20x2 + 4 边细波浪 stroke 1 = 浅亮蓝 4x4 框
- 视觉：水边明显但不刺眼

## 实施细节

### 代码 diff 摘要

```javascript
// internalTexture grass 旧 → 新
// 旧: 4 条长草叶（9-13 unit 高）
<path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" .../>

// 新: 2 条短草叶（4-5 unit 高，居中）
<path d="M8,13 L9,7 M12,13 L11,7" .../>
<path d="M7,13 L8,9 M13,13 L12,9" .../>
<circle cx="9" cy="11" r="0.3" .../>
<circle cx="11" cy="11" r="0.3" .../>
```

```javascript
// water feathering 旧 → 新
// 旧: rect 20x4 + 2 波浪线 + 3 圆点
<path d="M0,3 L20,3 L20,5 L0,5 Z" .../>
<path d="M0,2.5 Q4,0 8,2.5 ..." stroke-width="2" .../>
<path d="M0,4.5 Q5,3 10,4.5 ..." stroke-width="1.5" .../>
<circle cx="3" cy="1.5" r="0.6" .../>
... 3 个圆点

// 新: rect 20x2 + 1 波浪线（无圆点）
<path d="M0,2 L20,2 L20,4 L0,4 Z" .../>
<path d="M0,2.5 Q4,0 8,2.5 ..." stroke-width="1" .../>
```

## 验证

### TypeScript 编译

```bash
npx tsc --noEmit
# exit 0，无错误
```

### 视觉验证（用户在浏览器）

1. 启动 dev：`cd server && npm run dev` + `npm run dev`
2. 刷新地图编辑器
3. 期望视觉变化（vs 4-5 unit 未调优版）：
   - 孤立草地 cell：4 边草尖仍可见，主体纹理不再"长条状"
   - 孤立水 cell：4 边水边仍可见，但不再形成满亮蓝框
   - 沙地/岩石：internalTexture 居中，与 feathering 不冲突

## 已知权衡

- **草地主体纹理可见度降低**：草叶从 9-13 unit → 4-5 unit，颜色 stroke 减半，4x4 cell 上草叶仅 1 px
  - 缓解：feathering 仍主导，主体纹理仅作细节
- **水主体纹理减少**：从 3 条横波 → 1 条
  - 缓解：水 mask=0 cell 主要靠 feathering 区分

## 风险评估

| 风险 | 等级 | 缓解 |
|---|---|---|
| 主体纹理过弱 | 低 | feathering 已足够区分地形 |
| 失去部分细节 | 低 | 接受为调优 |
| mask=0 4 边 feathering 仍叠加 | 中 | 元素已大幅减少（24+ → 8）|

## 提交

（commit hash 待补充）
