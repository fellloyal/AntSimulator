# 2026-06-07-示例地图autotile-demo-计划

## 目的

为 24-tile autotile 计划（见 [2026-06-07-地图地形自动过渡-计划](./2026-06-07-地图地形自动过渡-计划.md)）提供一张**故意构造**的示例地图，覆盖：
- 16 种边掩码（mask 0-15）形态
- 4 个角点（tl/tr/bl/br）的凸/凹场景
- 3 种地形交汇的 T 接点
- 草/沙/水/岩 4 种地形并存

方便在 24-tile 资源就绪后，直接打开地图验证视觉；也方便美术对照 reference 调 feathering 形态。

## 规格

- **尺寸**：120 × 90（每格 4 像素 → 480 × 360 像素渲染尺寸）
- **地形分布**：
  - 草地（grass, type=0）：地图主体（~60%）
  - 水面（water, type=2）：右上湖泊 + 中部横贯河流（~15%）
  - 沙地（sand, type=1）：水边岸滩（~15%）
  - 岩石（rock, type=3）：右下装饰区（~10%）
- **附加元素**：
  - 砖墙（obstacleType=1）：河流中段 2 道，模拟水闸
  - 食物（foodType=0，qty=30）：左上 + 右下两个 2×2 糖块（验证食物共存）
  - 蚂蚁巢穴（colony）：左上角 1 个，右下角 1 个（多 colony 验证）

## 布局设计

```
y\x  0    10   20   30   40   50   60   70   80   90   100  110
0    .....GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG.
10   .....GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG.
20   .....GGGGGGGGGGGGGGSSSSSSSSSSSSWWWWWWWWWWWWWWWWWWWWWWWWWWSS.
30   .....GGGGGGGGGGGGGSSSSSSSSSSSSSSWWWWWWWWWWWWWWWWWWWWWWWWSSSS.
40   .....GGGGGGGGGGSSSSSSSSSSSSSSSSWWWWWWWWWWWWWWWWWWWWWWSSSSSS.
50   .....GGGGGGGGGGSSSSSSSSSSSSSSS_WWWWWWWWWWWWWWWWWWWWSSSSSS...
60   .....GGGGGGGGGGGSSSSSSSSSSSSS_WWWWWWWWWWWWWWWWWWWSSSSSS.....
70   .....GGGGGGGGGGGGGSSSSSSSSSSSWWWWWWWWWWWWWWWWWWWSSSSSSS.....
80   .....GGGGGGGGGGGGGGSSSSSSSSSSSWWWWWWWWWWWWWSSSSSSSSSS......
89   .....GGGGGGGGGGGGGGGGSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS.......
```

（简化示意，实际会有更多变化）

### 关键测试场景落点

| 场景 | 位置 | 目的 |
|---|---|---|
| 孤岛（mask 0） | 沙地中央小岛 | 验证 4 边 feathering |
| 垂直贯通（mask 3） | 河流纵向沙岸 | 验证左右 feathering |
| 水平贯通（mask 12） | 河流横向沙岸 | 验证上下 feathering |
| 3 边接（mask 7/11/13/14） | 草地凸入水面的半岛 | 验证 1 边 feathering |
| 2 边对角（mask 5/6/9/10） | 草地伸入水中的尖角 | 验证 L 形 feathering |
| T 接点（3 地形角） | 草+沙+水 三角交界 | 验证凸角贴片 |
| 草地内湖岸 | 湖周围的 1-2 cell 沙带 | 验证湿沙带（方案 B 混合） |
| 岩块孤岛 | 草地中的 3×3 岩石 | 验证草→岩 过渡 |

## 实施步骤

1. **新建 `scripts/gen-sample-map.mjs`**：纯 Node 脚本，无依赖（用 `node:fs` 和 `node:http`）
2. **脚本流程**：
   - 定义布局（硬编码 terrain 数组 + 简单几何）
   - 生成 GridData JSON
   - 写入 `server/data/samples/sample-autotile-demo.json`
   - 调用 `POST /api/maps` 创建记录（若 `http://localhost:3001` 可达）
   - 调用 `PUT /api/maps/:id` 上传 grid_data + 缩略图
3. **生成缩略图**：用 `node:canvas` 不可行（需 native 依赖），改为生成纯色块 PNG（用一个简单 base64 占位）—— 缩略图本次不强求
4. **结果文档** `docs/2026-06-07-示例地图autotile-demo-结果.md`：
   - ASCII 预览图（缩放版）
   - 16 边掩码覆盖清单
   - 4 角点凸/凹案例位置
   - DB 中的 map id（便于查证）

## 数据格式

```json
{
  "cellSize": 4,
  "terrain": [
    [10, 5, 0],   // [cx, cy, terrainType]
    ...
  ],
  "walls": [
    [40, 50, 1],  // [cx, cy, obstacleType=1=红砖]
    ...
  ],
  "foods": [
    [10, 10, 30, 0],  // [cx, cy, qty, foodType]
    ...
  ]
}
```

## 验收

- 脚本运行成功，输出 JSON 文件
- 后端运行时，DB 中存在 `autotile-demo` 记录，可在地图选择界面看到
- 16 种边掩码至少有 1 个对应 cell
- 4 个角点位置都有 T 接点或孤岛角
- 草/沙/水/岩 4 种地形都存在

## 风险与回退

- **后端未运行** → 脚本仅生成 JSON，输出一行 `WARN: backend not reachable, skipped DB insert`
- **重复运行** → 脚本检查同名地图，**先 DELETE 旧记录**再 POST 新记录
- **缩略图缺失** → 缩略图字段为 null，地图选择界面显示"暂无预览"

## 不在本次范围

- 程序化生成"自然"地图（噪声 + 多边形）—— 本次是构造测试用例
- 缩略图生成 —— 用空白占位
- 多 colony 的视觉对齐 —— 1 个 colony 即可验证多蚁群逻辑
- 24-tile 资源本身 —— 资源生成见自动过渡计划
