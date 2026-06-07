# 2026-06-07-24-tile-feathering极限加粗-回退

## 背景

按 [2026-06-07-24-tile-feathering极限加粗-计划](./2026-06-07-24-tile-feathering极限加粗-计划.md) 实施极限加粗 feathering 后，用户重启浏览器反馈 **"仍然看不到任何变化"**。

进一步排查发现：**用户之前没有打开"自动地形过渡（24-tile）"开关**，所以根本没看到效果，不是 feathering 不可见的问题。

## 决策

**方案 B：只 revert 极限加粗 commit (`c7bce1b`)**，保留 dump 工具和样本。

### 理由

1. **回退目的明确**：仅回退 feathering 加粗变更，不动 24-tile 框架
2. **保留诊断工具**：`scripts/dump-autotile-samples.mjs` + `docs/autotile-samples/` 仍然有用，未来可重新 dump
3. **样本文件**：仍代表当前 4-5 unit feathering 状态（虽然不是新加粗版）— 命名上样本未更新，需要在文档中说明

### 保留/丢弃清单

| Commit | 内容 | 决策 | 原因 |
|---|---|---|---|
| `c7bce1b` | 极限加粗 feathering + 颜色加亮 + internalTexture 收缩 | **revert** | 之前决策基于"feathering 不可见"假设，现已不成立 |
| `5b4d7f0` | dump 脚本 + 4 个样本 SVG | 保留 | 诊断工具仍有价值 |
| `5500a44` | 加粗 feathering 4-5 unit | 保留 | 这是当前希望保留的 feathering 尺寸 |
| `a81509b` | 24-tile 实施结果文档 | 保留 | 框架文档 |
| `b88832b` | MapEditor 集成 drawEditorAutoTerrain | 保留 | 框架代码 |
| `76f4be7` | MapPreviewRenderer drawAutoTerrain | 保留 | 框架代码 |
| `8e91a18` | TerrainRenderer dual 路径 | 保留 | 框架代码 |
| `1044009` | 生成 96 张 SVG | 保留 | 资源生成脚本 |
| `4a46fbe` | TerrainAdjacency.ts | 保留 | 框架工具 |
| `af8fe13` | enableAutoTiles 灰度开关 | 保留 | 框架开关 |

## revert 计划

```bash
git revert --no-edit c7bce1b
```

revert commit 信息：`Revert "feat(autotile): 极限加粗 feathering (8-10 unit, 50% cell) + 颜色加亮 + internalTexture 收缩"`

### revert 后状态

- `scripts/generate-terrain-tiles.mjs`：回到 4-5 unit feathering + 旧颜色（旧 grass #5a8a35 等）
- `src/render/assets/TerrainAutoTiles.ts`：重新生成 96 张 SVG（4-5 unit feathering 版本）
- `docs/2026-06-07-24-tile-feathering极限加粗-计划.md`：保留（记录曾尝试的方向）
- `docs/2026-06-07-24-tile-feathering极限加粗-结果.md`：保留（结果为"不可见"已被推翻，但记录有价值）
- `docs/autotile-samples/`：保留（4 张 SVG 是 4-5 unit feathering 状态，命名 `edge_*_mask0.svg` 仍有效）

## 后续

- 浏览器**打开"自动地形过渡（24-tile）"开关**后，4-5 unit feathering 应该可见（zoom=1.0 时约 0.8-1.0 物理像素，AA 可见）
- 如果 4-5 unit feathering 在低 zoom 下仍不可见，再考虑 **方案 B（cellSize 4→8）** 或 **方案 C（zoom 固定下限）**
- 不再做"极限加粗"——根因是开关没打开，不是 feathering 尺寸
