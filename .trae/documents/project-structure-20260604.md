# AntSimulator 项目结构文档

> 生成日期: 2026-06-04

## 项目概述

AntSimulator 是一个**从 C++/SFML 移植到 Web** 的蚂蚁群体行为模拟器，使用 **React + TypeScript + Canvas 2D** 实现。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **样式**: Tailwind CSS 3 + CSS 变量（暗色主题）
- **状态管理**: Zustand
- **图标**: lucide-react
- **路由**: react-router-dom

## 目录结构

```
src/
├── main.tsx                    # 入口，挂载 React
├── App.tsx                     # 根组件：Setup → Simulator 切换
├── index.css                   # 全局样式 + CSS 变量主题
│
├── store/
│   └── useStore.ts             # Zustand 全局状态（模拟参数、显示选项、工具等）
│
├── pages/
│   ├── SetupScreen.tsx         # 初始设置页（蚁群数、工蚁/兵蚁数量）
│   └── Simulator.tsx           # 模拟主界面（Canvas + 控制面板）
│
├── hooks/
│   ├── useSimulation.ts        # 模拟生命周期：初始化、主循环、FPS统计
│   ├── useCanvas.ts            # Canvas 交互：平移/缩放/工具应用
│   └── useTheme.ts             # 主题 hook
│
├── simulation/                 # 核心模拟逻辑（从 C++ 移植）
│   ├── types.ts                # 类型定义（Mode, Type 等）
│   ├── Config.ts               # 配置常量
│   ├── Simulation.ts           # 模拟主控：管理 World + Colonies
│   ├── World.ts                # 世界环境
│   ├── WorldGrid.ts            # 世界网格数据
│   ├── Colony.ts               # 蚁群（管理蚂蚁集合）
│   ├── ColonyBase.ts           # 蚁群基地
│   ├── Ant.ts                  # 蚂蚁实体
│   ├── AntUpdater.ts           # 蚂蚁行为更新
│   ├── WorkerUpdater.ts        # 工蚁行为
│   ├── SoldierUpdater.ts       # 兵蚁行为
│   └── FightSystem.ts          # 战斗系统
│
├── render/                     # Canvas 2D 渲染
│   ├── Renderer.ts             # 渲染主控 + 视口管理
│   ├── WorldRenderer.ts        # 世界渲染（标记、食物、墙壁）
│   └── ColonyRenderer.ts       # 蚁群渲染（蚂蚁、基地）
│
├── common/                     # 通用工具
│   ├── math.ts                 # 数学函数
│   ├── Direction.ts            # 方向管理
│   ├── Grid.ts                 # 通用二维网格
│   ├── Cooldown.ts             # 冷却时间
│   └── RNG.ts                  # 随机数生成器
│
└── components/                 # UI 组件
    ├── ControlPanel.tsx         # 控制面板（暂停/速度/FPS）
    ├── EditToolbar.tsx          # 编辑工具栏（食物/墙壁/橡皮擦）
    ├── DisplayOptions.tsx       # 显示选项（蚂蚁/标记/密度）
    ├── ColonyInfo.tsx           # 蚁群信息面板
    ├── ParameterSlider.tsx      # 参数滑块组件
    └── Empty.tsx                # 空状态组件
```

## 核心架构流程

```
SetupScreen (配置) → startSimulation →
  useSimulation (初始化 Simulation + Renderer) →
    requestAnimationFrame 主循环:
      sim.update(dt)  →  renderer.render(ctx)
      ↑ 状态同步到 Zustand → UI 更新
```

## 关键设计

1. **双版本共存**: `include/` 和 `src/main.cpp` 是原始 C++/SFML 版本，`src/` 下 `.ts/.tsx` 是 Web 移植版
2. **模拟与渲染分离**: `simulation/` 纯逻辑，`render/` 纯渲染，通过 `useSimulation` hook 桥接
3. **Zustand 单一状态源**: 所有 UI 状态（暂停、速度、工具、显示选项、蚁群统计）集中管理
4. **Canvas 交互**: `useCanvas` hook 处理平移/缩放/工具绘制，支持屏幕坐标→世界坐标转换

## 模块说明

### Simulation 模块

核心模拟逻辑，从 C++ 版本移植而来：

- **Simulation**: 顶层控制器，管理 World、Colonies、FightSystem，驱动 `update(dt)` 主循环
- **World**: 世界环境容器，管理网格地图、食物、标记、墙壁
- **WorldGrid**: 二维网格数据结构，每个 Cell 包含 markers（每蚁群）、food、wall、density
- **Colony**: 蚁群，管理蚂蚁集合和基地
- **Ant**: 蚂蚁实体，拥有位置、方向、阶段（ToFood/ToHome/Dead等）、类型（Worker/Soldier）
- **AntUpdater**: 蚂蚁行为更新分发，WorkerUpdater 和 SoldierUpdater 分别处理不同分工
- **FightSystem**: 蚁群间战斗系统

### Render 模块

Canvas 2D 渲染层：

- **Renderer**: 渲染主控，管理视口（平移/缩放），协调 WorldRenderer 和 ColonyRenderer
- **WorldRenderer**: 绘制世界网格（标记、食物、墙壁、密度）
- **ColonyRenderer**: 绘制蚂蚁和蚁群基地

### Store 模块

Zustand 全局状态：

- `started` / `setupConfig`: 启动阶段状态
- `paused` / `speed` / `maxSpeed`: 模拟控制
- `showAnts` / `showMarkers` / `showDensity`: 显示选项
- `activeTool` / `brushSize`: 编辑工具
- `colonyStats` / `fps`: 运行时统计

### Hooks 模块

- **useSimulation**: 初始化 Simulation 和 Renderer，驱动 requestAnimationFrame 主循环，同步状态到 Store
- **useCanvas**: 处理 Canvas 鼠标/滚轮事件，实现平移、缩放、工具绘制

## 蚂蚁行为模型

### 蚂蚁阶段（Mode）

| 阶段 | 说明 |
|------|------|
| ToFood | 寻找食物 |
| ToHome | 带食物回家 |
| ToHomeNoFood | 无食物回家（使用驱虫剂） |
| Refill | 能量不足需补给 |
| ToEnemy | 寻找敌人（兵蚁特有） |
| Dead | 死亡 |

### 蚂蚁类型（Type）

| 类型 | 说明 |
|------|------|
| Worker | 工蚁，负责觅食，体型较小 |
| Soldier | 兵蚁，负责战斗，体型2倍，伤害高 |

## 快捷键

| 按键 | 功能 |
|------|------|
| P / Space | 暂停/继续 |
| M | 显示/隐藏标记 |
| A | 显示/隐藏蚂蚁 |
| S | 最大速度模式 |
| W | 墙壁工具 |
| E | 橡皮擦工具 |
| F | 食物工具 |
| Esc | 取消工具 |
| 鼠标左键 | 平移视图 / 使用工具 |
| 鼠标右键 | 添加食物 |
| 滚轮 | 缩放 |
