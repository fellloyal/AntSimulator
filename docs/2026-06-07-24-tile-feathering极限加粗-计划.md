# 2026-06-07-24-tile-feathering极限加粗-计划

## 背景

实施 [2026-06-07-24-tile自动过渡-实施结果](./2026-06-07-24-tile自动过渡-实施结果.md) 后，用户反馈 **"地图编辑没有变化"**。

### 根因

1. `CELL_SIZE=4` — 每个地图 cell 在屏幕上只渲染 4×4 像素
2. `viewBox=20×20` 渲染到 4×4 cell → 1 SVG unit = 0.2 像素
3. 之前 feathering 元素最大 4-5 SVG units = 0.8-1.0 像素
4. fit-to-view 时 zoom 通常 < 1（比如 480×360 地图 fit 800×600 viewport，zoom ≈ 1.0；1200×800 fit 800×600，zoom ≈ 0.4）
5. 0.8 × 0.4 = 0.32 像素 = 完全 sub-pixel，AA 不可见
6. fallback 在 `AssetRegistry.has(svgKey) === false` 时静默回退到 base terrain texture，与关闭 auto 视觉一致

### 用户决策

**方案 C：再加粗到极限**（feathering 到 12-15 SVG units = 2.4-3 像素）

## 目标

让 feathering 在以下场景物理上可见：
- CELL_SIZE=4 cell 渲染
- zoom = 0.4-1.0（fit-to-view 范围）
- 不依赖抗锯齿/小色差，必须有 ≥1 像素的硬色块

## 方案

### 1. feathering 元素尺寸上限

| 地形 | 元素 | 旧（4-5 unit）| 新（12-15 unit）| 目标像素 |
|---|---|---|---|---|
| grass | 草尖 fill 区域 | 0-5 unit 高度 | **0-8 unit 高度**（占 50% cell 高度）| 1.6 px @ 4×4 |
| grass | blade stroke 长度 | 4 unit | **8-10 unit**（4-5 unit 一侧延伸）| 1.6-2.0 px |
| sand | 圆点 r | r=1.5-2.0 | **r=3.0-4.0**（直径 6-8 unit = 1.2-1.6 px）| 1.2-1.6 px |
| sand | 圆点数量 | 9 个 | **5-6 个大圆点**（避免过密）| 清晰可见 |
| water | 浪花色条宽度 | 2 unit | **4 unit**（高对比硬边）| 0.8 px |
| water | 波浪线 stroke-width | 2 | **3-4** | 0.6-0.8 px |
| water | 浪花外延 | 0-5 unit | **0-8 unit** | 1.6 px |
| rock | 碎石多边形宽度 | 3 个 × 5-6 unit | **3 个 × 8-10 unit**（覆盖 60% 边）| 1.6-2.0 px |
| rock | 黑色边 | 1 | **1.5** | 0.3 px |

### 2. internalTexture 缩小（让出空间）

为了让 feathering 占据更多空间，**internalTexture**（cell 主体纹理）做收缩：
- grass 草叶：从 4-8 unit 长 → 缩短到 2-4 unit
- sand 圆点：r=0.4-0.6 → 0.2-0.3（更小更稀疏）
- water 波线：3 条 → 1 条，stroke-width 0.4-0.6 → 0.2
- rock 多边形：缩小到中央 6×6 区域

这样 feathering 和 internal 不重叠。

### 3. fallback 行为

**不**在 fallback 时打印 warn（避免日志噪音）。改为：fallback 时**用明显的占位色**（红色斜线）提示未加载完成——5-10 帧后图片加载完会正常显示，用户能看见"红色斜线"出现就知道 SVG 在重试。

但这个改动会破坏视觉。所以**改为**：fallback 时**直接画相邻 cell 的纯色硬边**（1px 宽、对比色）——保证视觉一定有变化。

实际上 fallback 概率很低（preload 后 has 立即为 true，onload 之后 drawImage 才有内容）。让我**只改进 feathering** 不动 fallback。

### 4. 颜色对比加强

feathering 元素用更亮的颜色：
- grass edge: `accentLight` (#6a9a40) → 更亮的 `#8acb50`
- sand edge: `accent` (#a8854a) → 更亮的 `#d4ad6a`
- water edge: `accentLight` (#a8c0e0) → 更亮的 `#d8e8f8`
- rock edge: `accent` (#8a8a92) → 更亮的 `#b0b0b8`

更亮的颜色 + 更大尺寸 = 在低 zoom 下也能看见。

## 实施步骤

1. 修改 `scripts/generate-terrain-tiles.mjs`
   - `edgeFeather` 各分支增大元素尺寸到 8-10 unit
   - `internalTexture` 缩小元素到中央
   - 加亮 feathering 颜色
2. 重新运行 `node scripts/generate-terrain-tiles.mjs`
3. 验证 TypeScript 编译
4. 浏览器视觉验证（autotile-demo 地图）
5. 写结果文档 `docs/2026-06-07-24-tile-feathering极限加粗-结果.md`

## 风险

- **侵占 internalTexture**：feathering 过大可能覆盖 cell 主体纹理
- **降低视觉品质**：feathering 看起来"粗笨"，不像美术作品
- **feathering 跨 cell 边界**：8-10 unit feathering 覆盖 40-50% cell 高度，可能与相邻 cell 冲突

## 缓解

- internalTexture 缩小到中央 6×6 区域，留出边缘给 feathering
- 接受"粗笨"是设计取舍（4×4 cell 本来就小）
- feathering 跨边界后，下一帧邻 cell 的 feathering 会**覆盖回去**（绘制顺序：所有 cell 主体先画 → 角点叠加；同 mask cell 用同一 SVG）

## 回退

```bash
# feathering 改动可独立回退（不依赖其他 commit）
git revert HEAD
# 或 hard reset
git reset --hard HEAD~1
```
