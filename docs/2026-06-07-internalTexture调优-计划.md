# 2026-06-07-internalTexture调优-计划

## 背景

Revert 极限加粗后（[2026-06-07-24-tile-feathering极限加粗-回退](./2026-06-07-24-tile-feathering极限加粗-回退.md)），用户开启"自动地形过渡"开关看到 4-5 unit feathering 效果，但反馈：

1. **水中会生成很大的不完整浪花** — water mask=0 在 4x4 cell 上 4 边硬色条 + 粗波浪 stroke 叠加成 4 像素宽的"框"
2. **草地会生成看起来很奇怪的几何形状** — grass mask=0 4 边 feathering + 4 条长 9-13 unit 草叶 internalTexture 在 4x4 cell 上叠加成网格

## 根因

| 问题 | 元素 | 尺寸/数量 | 在 4x4 cell 效果 |
|---|---|---|---|
| 草地几何 | internalTexture 4 条草叶 (M2,18 L4,8 等) | 长 9-13 unit | 4 条 2 px 高垂直线 + 4 边 feathering 叠加 |
| 草地几何 | 4 边 feathering 草尖 path | Q 曲线 0-5/15-20 unit | top+bottom+left+right 4 边草尖在 4x4 cell 上交叠 |
| 水浪花 | 4 边硬色条 rect 20x4 | stroke=0.8 px 高 | 4 边 0.8 px 高硬色 = 4x4 cell 几乎全亮蓝 |
| 水浪花 | 4 边粗波浪 stroke 3-4 | stroke=0.6-0.8 px | 4 边粗波浪叠加成网状 |
| 水浪花 | 4 边浪花圆点 r=0.5-1.0 | 多达 12 个 | 圆点散布在 cell 内 |

mask=0 = 4 边都异类 = cell 完全被 feathering 主导。当前 4-5 unit feathering 在 4x4 cell 上元素过多，叠加混乱。

## 目标

1. **internalTexture 缩短 + 减量**：4 条 → 2 条草叶，长度 9-13 unit → 4-5 unit
2. **水 feathering 简化**：硬色条宽度减半，波浪 stroke 减半，移除圆点
3. **保留 4 边 feathering**：不删左右边，只减元素

## 方案

### 1. grass internalTexture 调优

**当前**（4 条长草叶，9-13 unit）：
```javascript
<path d="M2,18 L4,8 M8,18 L7,5 M12,18 L13,9 M16,18 L15,6" stroke="#5a8a35" stroke-width="1" .../>
<path d="M4,18 L3,11 M10,18 L11,9 M14,18 L13,8" stroke="#4a7a28" stroke-width="0.5" .../>
<circle cx="3" cy="3" r="0.5" .../>
<circle cx="14" cy="14" r="0.4" .../>
<circle cx="7" cy="6" r="0.3" .../>
```

**新版**（2 条短草叶 + 2 小点，4-5 unit 中央）：
```javascript
<path d="M8,12 L9,7 M12,12 L11,7" stroke="#5a8a35" stroke-width="0.6" .../>
<path d="M7,12 L8,9 M13,12 L12,9" stroke="#4a7a28" stroke-width="0.4" .../>
<circle cx="9" cy="10" r="0.3" fill="#6a9a40" opacity="0.4"/>
<circle cx="11" cy="10" r="0.3" fill="#6a9a40" opacity="0.4"/>
```

### 2. sand internalTexture 调优

**当前**：4 circle + 2 path 散落
**新版**：2-3 个圆点中央 + 1 条细曲线

### 3. water internalTexture 调优

**当前**：3 条横波浪线 stroke 0.4-0.6
**新版**：1 条横波浪线 stroke 0.3（在 y=10 位置）

### 4. rock internalTexture 调优

**当前**：3 个 polygon 散落
**新版**：1-2 个 polygon 中央 8x8

### 5. water feathering 简化

**当前 mask=0 元素清单**：
- top: rect 20x4, 4-thick 波浪线, 1.5-thick 次粗波浪, 3 个圆点 r=0.5-1
- bottom: 同上（镜像）
- left: rect 4x20, 4-thick 波浪线, 1.5-thick 次粗, 3 个圆点
- right: 同上

**新版**：
- top: rect 20x2 (宽度减半), 1.5-thick 波浪线（无次粗），无圆点
- bottom: 同上
- left: rect 2x20 (宽度减半), 1.5-thick 波浪线，无圆点
- right: 同上

总元素数：12+ → 8（水浪花更"轻"）

### 6. grass / sand / rock feathering 不变

只调优 water feathering，其他地形 4 边 feathering 在 4x4 cell 上视觉尚可。

## 实施步骤

1. 修改 `scripts/generate-terrain-tiles.mjs`
   - internalTexture grass/sand/water/rock 全部缩短
   - water feathering 简化（硬色条宽度减半，波浪 stroke 减半，移除圆点）
2. 重新生成 `node scripts/generate-terrain-tiles.mjs`
3. `npx tsc --noEmit` 验证
4. 写结果文档
5. commit

## 风险

- internalTexture 太短可能 cell 主体看起来"空"
- water feathering 太轻可能失去"水边"识别度
- 解决：先实施，再浏览器视觉验证

## 回退

```bash
git revert HEAD
```
