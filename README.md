# AntSimulator - 蚂蚁群体行为模拟器

基于 Web 的蚂蚁群体行为模拟游戏，使用 React + TypeScript + Canvas 2D 构建。模拟蚂蚁在信息素引导下的觅食、战斗、死亡等群体行为。

## 功能概览

- **地图编辑器**：可视化编辑地形（草地/沙地/水/石头）、障碍物（红砖/冰砖/木板/铁栅）、食物（鸡腿/苹果/面包/浆果），支持自定义地图尺寸和比例
- **游戏配置**：选择地图、设置蚁群数量（1-4）、工蚁/兵蚁比例、手动放置蚁巢位置
- **实时模拟**：基于信息素的蚂蚁群体行为模拟，支持暂停/加速/最大速度
- **交互式操作**：模拟过程中可实时放置食物、墙壁、擦除，添加新蚁群
- **多蚁群对抗**：最多 4 个蚁群同场竞技，兵蚁主动攻击敌方蚂蚁

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与启动

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server && npm install && cd ..

# 启动（需要两个终端）
# 终端1：启动后端（端口 3001）
cd server && npm run dev

# 终端2：启动前端（端口 5173）
npm run dev
```

或使用一键脚本（Linux/macOS）：

```bash
chmod +x dev.sh
./dev.sh start    # 启动前后端
./dev.sh stop     # 停止
./dev.sh status   # 查看状态
./dev.sh restart  # 重启
```

访问 http://localhost:5173

### 构建

```bash
npm run build
```

## 项目架构

```
ant-cn/
├── src/
│   ├── simulation/          # 模拟核心（运行在 Web Worker 中）
│   │   ├── Simulation.ts    # 模拟主循环
│   │   ├── Ant.ts           # 蚂蚁实体
│   │   ├── Colony.ts        # 蚁群管理
│   │   ├── ColonyBase.ts    # 蚁巢基座
│   │   ├── World.ts         # 世界管理
│   │   ├── WorldGrid.ts     # 网格系统（信息素/食物/墙壁）
│   │   ├── WorkerUpdater.ts # 工蚁行为更新
│   │   ├── SoldierUpdater.ts# 兵蚁行为更新
│   │   ├── FightSystem.ts   # 战斗系统
│   │   ├── AntUpdater.ts    # 蚂蚁通用更新
│   │   ├── Config.ts        # 全局配置
│   │   ├── types.ts         # 类型定义
│   │   ├── simulation-worker.ts  # Worker 入口
│   │   └── worker-protocol.ts    # Worker 通信协议
│   │
│   ├── render/              # 渲染层（主线程 Canvas 2D）
│   │   ├── WorkerRenderer.ts    # Worker 数据驱动渲染器
│   │   ├── WorldRenderer.ts     # 信息素/地形渲染
│   │   ├── ColonyRenderer.ts    # 蚁巢渲染
│   │   ├── FoodPileRenderer.ts  # 食物堆渲染
│   │   ├── ObstacleRenderer.ts  # 障碍物渲染
│   │   ├── TerrainRenderer.ts   # 地形渲染
│   │   ├── MapPreviewRenderer.ts# 地图预览渲染
│   │   ├── AssetRegistry.ts     # SVG/纹理缓存注册表
│   │   ├── Renderer.ts          # 主渲染器
│   │   └── assets/              # SVG 纹理资源
│   │       ├── TerrainTiles.ts   # 地形 SVG 定义
│   │       ├── ObstacleTiles.ts  # 障碍物 SVG 定义
│   │       ├── FoodSprites.ts    # 食物精灵定义
│   │       ├── NestOverlay.ts    # 蚁巢覆盖层
│   │       └── WornPath.ts       # 磨损路径
│   │
│   ├── pages/               # 页面组件
│   │   ├── MainMenu.tsx     # 主菜单
│   │   ├── MapEditor.tsx    # 地图编辑器
│   │   ├── GameSetup.tsx    # 游戏配置
│   │   └── Simulator.tsx    # 模拟器界面
│   │
│   ├── components/          # UI 组件
│   │   ├── ControlPanel.tsx # 播放/暂停/速度控制
│   │   ├── EditToolbar.tsx  # 模拟中编辑工具栏
│   │   ├── ColonyInfo.tsx   # 蚁群信息面板
│   │   ├── DisplayOptions.tsx # 显示选项
│   │   ├── ParameterSlider.tsx # 参数滑块
│   │   └── ConfirmDialog.tsx  # 确认弹窗
│   │
│   ├── store/
│   │   └── useStore.ts      # Zustand 全局状态
│   │
│   ├── api/
│   │   └── maps.ts          # 地图 API 客户端
│   │
│   ├── common/              # 通用工具
│   │   ├── RNG.ts           # 随机数生成器
│   │   ├── Direction.ts     # 方向向量
│   │   ├── Grid.ts          # 网格工具
│   │   ├── Cooldown.ts      # 冷却计时器
│   │   └── math.ts          # 数学工具
│   │
│   └── hooks/               # React Hooks
│       ├── useCanvas.ts     # Canvas 交互
│       ├── useSimulation.ts # 模拟控制
│       └── useTheme.ts      # 主题管理
│
├── server/                  # 后端服务（Fastify + SQLite）
│   ├── src/
│   │   ├── index.ts         # 服务入口（端口 3001）
│   │   ├── routes.ts        # REST API 路由
│   │   └── db.ts            # SQLite 数据库
│   └── package.json
│
├── vite.config.ts           # Vite 配置（含 API 代理）
├── tailwind.config.js       # Tailwind CSS 配置
└── dev.sh                   # 一键启停脚本
```

### 架构设计原则

1. **模拟与渲染分离**：`simulation/` 运行在 Web Worker 中，`render/` 运行在主线程，通过 `worker-protocol.ts` 定义的二进制协议通信
2. **增量数据传输**：Worker 每帧只发送变化的数据（dirty region），减少主线程与 Worker 之间的数据拷贝
3. **单数据源**：Zustand 作为 UI 状态的唯一数据源
4. **纹理缓存**：AssetRegistry 将 SVG 预渲染为 128x128 位图缓存，避免重复解码

## 游戏逻辑

### 蚂蚁行为

蚂蚁有两种类型，行为模式不同：

#### 工蚁（Worker）

| 属性 | 值 |
|------|-----|
| 伤害 | 30 |
| 移动速度 | 40 像素/秒 |
| 最大寿命 | 300 秒（5 分钟） |

工蚁的行为状态机：

```
ToFood → 采到食物 → ToHome → 到达蚁巢 → Refill → ToFood
  ↓                      ↓
  没找到食物              没有食物可带
  ↓                      ↓
ToHomeNoFood           ToFood
```

- **ToFood**：跟随 ToFood 信息素寻找食物，同时释放 ToHome 信息素
- **ToHome**：携带食物返回蚁巢，释放 ToFood 信息素
- **Refill**：在蚁巢短暂停留后重新出发
- **ToHomeNoFood**：未找到食物时返回蚁巢

#### 兵蚁（Soldier）

| 属性 | 值 |
|------|-----|
| 伤害 | 120 |
| 移动速度 | 40 像素/秒 |
| 最大寿命 | 300 秒（5 分钟） |

兵蚁的行为状态机：

```
ToEnemy → 发现敌人 → Fighting → 敌人死亡 → ToEnemy
  ↓
  受到攻击 → Flee → 逃跑后 → ToEnemy
```

- **ToEnemy**：主动搜索敌方信息素，向敌人聚集区域移动
- **Fighting**：与敌方蚂蚁近战，每秒造成一次伤害
- **Flee**：生命值低时逃离战斗

### 信息素系统

每个网格单元为每个蚁群维护三种信息素：

| 信息素类型 | 释放时机 | 作用 |
|-----------|---------|------|
| ToHome | 蚂蚁离开蚁巢时 | 引导其他蚂蚁找到回家的路 |
| ToFood | 蚂蚁找到食物时 | 引导其他蚂蚁找到食物 |
| ToEnemy | 兵蚁发现敌人时 | 召集更多兵蚁参战 |

信息素特性：
- 初始强度 8000，随时间自然衰减
- 蚁巢周围 64 个格子有永久的 ToHome 标记（强度 10）
- 蚂蚁通过双触角采样（左右 ±25°~29°）感知信息素梯度，调整行进方向
- 驱避信息素（Repellent）：蚂蚁在危险区域释放，使同族蚂蚁回避

### 战斗系统

- 攻击冷却：1.0 秒
- 工蚁伤害 30，兵蚁伤害 120（兵蚁可一击杀死工蚁）
- 战斗检测：每 3 帧进行一次全量扫描，其余帧只处理待决的战斗请求
- 伤害机制：攻击将伤害值累加到被攻击蚂蚁的 `autonomy` 字段，当 `autonomy >= maxAutonomy(300)` 时蚂蚁死亡
- 死亡过程：蚂蚁进入 Dying 阶段，持续 2 秒动画后彻底移除
- 携带食物的蚂蚁死亡时，食物掉落在原地

### 蚁群补充

蚁群根据食物储备持续补充新蚂蚁：
- 补充冷却：0.125 秒/只
- 无上限：只要有食物就会不断产生新蚂蚁
- 新蚂蚁从蚁巢位置出发

### 地图系统

#### 地形类型

| 类型 | 颜色 | 可通行 | 说明 |
|------|------|--------|------|
| 草地 | #4a7a2a | 是 | 默认地形 |
| 沙地 | #c8a878 | 是 | 装饰性地形 |
| 水 | #3a5a8a | 否 | 不可通过，视为墙壁 |
| 石头 | #6a6a6a | 是 | 装饰性地形，可通行 |

#### 障碍物类型

| 类型 | 颜色 | 说明 |
|------|------|------|
| 红砖 | #a04030 | 标准墙壁 |
| 冰砖 | #9acfe0 | 冰面障碍 |
| 木板 | #8a5a30 | 木制障碍 |
| 铁栅 | #7a7a82 | 金属栅栏 |

#### 食物类型

| 类型 | 说明 |
|------|------|
| 鸡腿 | 默认食物 |
| 苹果 | 水果类 |
| 面包 | 面包类 |
| 浆果 | 浆果类 |

食物支持 1x1 到 4x4 的块大小，在地图编辑器中独立设置。

### 磨损路径

蚂蚁经过的格子会累积 `wearLevel`（0~1），当 `wearLevel > 0.3` 时渲染为磨损土路效果，形成自然的蚁道。

## 操作说明

### 地图编辑器

| 操作 | 快捷键 |
|------|--------|
| 地形工具 | T |
| 障碍工具 | O |
| 食物工具 | F |
| 擦除工具 | E |
| 平移画布 | Alt + 拖拽 |
| 缩放 | 鼠标滚轮 |
| 直线绘制 | Shift + 左键拖拽 |

### 模拟器

| 操作 | 快捷键 |
|------|--------|
| 暂停/继续 | P / 空格 |
| 显示/隐藏信息素 | M |
| 显示/隐藏蚂蚁 | A |
| 最大速度 | S |
| 食物工具 | F |
| 墙壁工具 | W |
| 擦除工具 | E |
| 取消工具 | Esc |

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 构建 | Vite 6 |
| 状态管理 | Zustand |
| 样式 | Tailwind CSS |
| 渲染 | Canvas 2D |
| 模拟计算 | Web Worker |
| 后端 | Fastify 5 + better-sqlite3 |
| 图标 | Lucide React |

## Worker 通信协议

主线程与模拟 Worker 通过 `postMessage` 通信，使用二进制 Float32Array 传输数据以最小化序列化开销。

### 主线程 → Worker

| 命令 | 说明 |
|------|------|
| `init` | 初始化模拟（地图尺寸、蚁群配置、网格数据） |
| `pause` | 暂停/继续 |
| `speed` | 设置模拟速度 |
| `addFood` | 在指定位置添加食物 |
| `addWall` | 在指定位置添加墙壁 |
| `eraseCell` | 擦除指定格子 |
| `addColony` | 添加新蚁群 |

### Worker → 主线程

| 响应 | 说明 |
|------|------|
| `frame` | 每帧数据（蚂蚁位置/世界状态/统计数据） |
| `ready` | Worker 初始化完成 |

### 数据布局

**蚂蚁数据**（每只 9 个 float）：
`[x, y, angle, phase, type, colId, wobblePhase, dyingTimer, isPaused]`

**世界数据**（每格 8 个 float）：
`[wall|food_packed, markerR, markerG, markerB, terrain, obstacle, foodType, wearLevel]`

**增量更新**（每格 9 个 float）：
`[cellIndex, wall|food_packed, markerR, markerG, markerB, terrain, obstacle, foodType, wearLevel]`

## API 接口

后端运行在 `http://localhost:3001`，前端通过 Vite 代理 `/api` 前缀访问。

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/maps` | 获取地图列表 |
| GET | `/api/maps/:id` | 获取地图详情 |
| POST | `/api/maps` | 创建地图 |
| PUT | `/api/maps/:id` | 更新地图 |
| DELETE | `/api/maps/:id` | 删除地图 |

## 许可证

参见 [LICENSE](LICENSE)
