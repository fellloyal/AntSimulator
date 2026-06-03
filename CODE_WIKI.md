# AntSimulator Code Wiki

## 项目概述

AntSimulator 是一个基于 SFML 的蚂蚁行为模拟器，用 C++ 17 开发。它模拟了多蚁群在二维世界中的行为，包括觅食、标记路径、蚁群间战斗以及蚂蚁的不同分工（工蚁和兵蚁）。

## 目录结构

```
/workspace
├── include/                    # 头文件
│   ├── common/                # 通用工具类
│   ├── editor/                # 编辑器模块
│   │   └── GUI/               # 图形用户界面组件
│   ├── render/                # 渲染模块
│   └── simulation/            # 模拟核心模块
│       ├── ant/               # 蚂蚁相关
│       ├── colony/            # 蚁群相关
│       └── world/             # 世界环境相关
├── src/
│   └── main.cpp               # 程序入口
├── res/                       # 资源文件
├── img/                       # 图片资源
├── CMakeLists.txt             # CMake 配置
└── README.md
```

## 核心模块架构

### 1. Simulation 模块

Simulation 模块是整个模拟器的核心，负责管理世界状态、蚁群和模拟更新。

#### 关键类

##### Simulation
**文件**: [`include/simulation/simulation.hpp`](file:///workspace/include/simulation/simulation.hpp)

主要功能：
- 管理世界状态（`world`）
- 管理多个蚁群（`colonies`）
- 管理渲染器（`renderer`）
- 处理战斗系统（`fight_system`）
- 管理距离场构建（`distance_field_builder`）

核心方法：
- `update(float dt)`: 更新整个模拟
- `createColony(float x, float y)`: 创建新的蚁群
- `loadMap(const std::string& filename)`: 加载地图
- `render(sf::RenderTarget& target)`: 渲染整个模拟

---

##### World
**文件**: [`include/simulation/world/world.hpp`](file:///workspace/include/simulation/world/world.hpp)

主要功能：
- 表示模拟世界的容器
- 管理格子地图（`map`）
- 提供添加/查询食物、标记、墙壁的功能

核心属性：
- `sf::Vector2f size`: 世界大小
- `WorldGrid map`: 世界网格
- `WorldRenderer renderer`: 世界渲染器

核心方法：
- `update(float dt)`: 更新世界
- `addMarker()`: 添加路径标记
- `addFoodAt()`: 添加食物
- `addWall()`: 添加墙壁
- `clearMarkers()`: 清除标记

---

##### WorldGrid
**文件**: [`include/simulation/world/world_grid.hpp`](file:///workspace/include/simulation/world/world_grid.hpp)

主要功能：
- 继承自 `Grid<WorldCell>`
- 管理整个世界的网格细胞
- 每个 `WorldCell` 包含：
  - `ColonyCell markers[]`: 每个蚁群的标记
  - `uint32_t food`: 食物数量
  - `uint32_t wall`: 是否有墙壁
  - `float density`: 蚂蚁密度

核心方法：
- `getFirstHit()`: 获取碰撞检测结果
- `addMarker()`: 添加标记
- `pickFood()`: 拾取食物

---

##### Colony
**文件**: [`include/simulation/colony/colony.hpp`](file:///workspace/include/simulation/colony/colony.hpp)

主要功能：
- 表示一个蚁群
- 管理蚁群中的所有蚂蚁
- 管理蚁群基地

核心属性：
- `ColonyBase base`: 蚁群基地
- `civ::Vector<Ant> ants`: 蚂蚁集合
- `uint8_t id`: 蚁群ID
- `sf::Color ants_color`: 蚂蚁颜色

核心方法：
- `update(float dt, World& world)`: 更新蚁群
- `createWorker()`: 创建工蚁
- `specializeSoldier()`: 特化为兵蚁
- `killWeakAnts()`: 移除虚弱的蚂蚁

---

##### Ant
**文件**: [`include/simulation/ant/ant.hpp`](file:///workspace/include/simulation/ant/ant.hpp)

主要功能：
- 表示一只蚂蚁
- 管理蚂蚁的状态和行为

核心属性：
- `sf::Vector2f position`: 位置
- `Direction direction`: 方向
- `Mode phase`: 当前阶段（寻找食物/回家）
- `Type type`: 蚂蚁类型（工蚁/兵蚁）
- `float autonomy`: 自主时间（能量）

核心方法：
- `updatePosition(World& world, float dt)`: 更新位置
- `checkFood(World& world)`: 检查是否找到食物
- `checkColony(ColonyBase& base)`: 检查是否到达蚁群
- `addMarker(World& world)`: 添加路径标记
- `attack(float dt)`: 攻击敌人

---

##### AntUpdater
**文件**: [`include/simulation/ant/ant_updater.hpp`](file:///workspace/include/simulation/ant/ant_updater.hpp)

主要功能：
- 蚂蚁行为的更新逻辑
- 分工处理（Worker/Soldier）

核心方法：
- `initialUpdate(Ant& ant, World& world, float dt)`: 初始更新
- `update(Ant& ant, World& world, float dt)`: 主要更新

---

##### Config
**文件**: [`include/simulation/config.hpp`](file:///workspace/include/simulation/config.hpp)

主要功能：
- 配置常量和默认值
- 管理用户配置
- 静态配置参数

核心常量：
- `WIN_WIDTH` / `WIN_HEIGHT`: 窗口大小
- `WORLD_WIDTH` / `WORLD_HEIGHT`: 世界大小
- `ANTS_COUNT`: 默认蚂蚁数量
- `MARKER_INTENSITY`: 标记强度
- `MAX_COLONIES_COUNT`: 最大蚁群数量（4）

---

### 2. Render 模块

Render 模块负责所有可视化渲染工作。

#### 关键类

##### Renderer
**文件**: [`include/render/renderer.hpp`](file:///workspace/include/render/renderer.hpp)

主要功能：
- 协调各部分渲染
- 管理视口

核心方法：
- `render(World& world, sf::RenderTarget& target)`: 渲染整个模拟
- `addColony(civ::Ref<Colony>& colony)`: 添加要渲染的蚁群

---

##### ColonyRenderer
**文件**: [`include/render/colony_renderer.hpp`](file:///workspace/include/render/colony_renderer.hpp)

主要功能：
- 渲染单个蚁群及其蚂蚁

---

##### WorldRenderer
**文件**: [`include/render/world_renderer.hpp`](file:///workspace/include/render/world_renderer.hpp)

主要功能：
- 渲染世界地图（标记、墙壁、食物等）

---

### 3. Editor 模块

Editor 模块提供用户界面，用于与模拟交互。

#### 关键类

##### EditorScene
**文件**: [`include/editor/editor_scene.hpp`](file:///workspace/include/editor/editor_scene.hpp)

主要功能：
- 继承自 `GUI::Scene`
- 编辑器场景的主控制器

核心组件：
- `Toolbox`: 工具箱面板
- `WorldView`: 世界视图
- `ToolSelector`: 工具选择器
- `DisplayOption`: 显示选项
- `ColonyCreator`: 蚁群创建器
- `TimeController`: 时间控制器

---

##### GUI::Scene
**文件**: [`include/editor/GUI/scene.hpp`](file:///workspace/include/editor/GUI/scene.hpp)

主要功能：
- GUI 场景基类
- 管理事件和渲染

核心方法：
- `update()`: 更新并处理事件
- `render()`: 渲染
- `addItem()`: 添加 GUI 元素

---

### 4. Common 模块

Common 模块提供通用工具类和函数。

#### 关键类

##### ViewportHandler
**文件**: [`include/common/viewport_handler.hpp`](file:///workspace/include/common/viewport_handler.hpp)

主要功能：
- 处理视口缩放和平移

---

##### EventManager
**文件**: [`include/common/event_manager.hpp`](file:///workspace/include/common/event_manager.hpp)

主要功能：
- SFML 事件处理的封装

---

##### Grid<T>
**文件**: [`include/common/grid.hpp`](file:///workspace/include/common/grid.hpp)

主要功能：
- 通用二维网格容器

---

##### Direction
**文件**: [`include/common/direction.hpp`](file:///workspace/include/common/direction.hpp)

主要功能：
- 方向管理和插值

---

##### Cooldown
**文件**: [`include/common/cooldown.hpp`](file:///workspace/include/common/cooldown.hpp)

主要功能：
- 冷却时间管理

---

##### utils.hpp
**文件**: [`include/common/utils.hpp`](file:///workspace/include/common/utils.hpp)

主要功能：
- 数学工具函数
- 向量操作
- 模板辅助函数

常用函数：
- `getLength(sf::Vector2<T> v)`: 向量长度
- `getNormalized(sf::Vector2<T> v)`: 归一化
- `clamp(T value, T min, T max)`: 限制范围
- `create<T>(...)`: 创建 shared_ptr 的快捷方式

---

## 蚂蚁行为流程

### 蚂蚁的主要阶段（Mode）

1. **ToFood** - 寻找食物阶段
2. **ToHome** - 带着食物回家阶段
3. **ToHomeNoFood** - 没有食物的回家阶段（使用驱虫剂）
4. **Refill** - 能量不足需要补给阶段
5. **ToEnemy** - 寻找敌人阶段（兵蚁特有）
6. **Dead** - 死亡阶段

### 蚂蚁的类型（Type）

1. **Worker** - 工蚁
   - 主要负责觅食
   - 体型较小
2. **Soldier** - 兵蚁
   - 负责战斗
   - 体型较大（2倍），伤害高

### 工蚁行为流程

```
开始
  ↓
出生 → ToFood 阶段
  ↓
移动 → 检测碰撞 → 避障
  ↓
添加路径标记（ToHome）
  ↓
找到食物 → ToHome 阶段
  ↓
返回 → 添加路径标记（ToFood）
  ↓
回到蚁群 → 交付食物 → 重新 ToFood
  ↓
能量耗尽 → 死亡
```

### 兵蚁行为流程

```
ToEnemy 阶段
  ↓
寻找敌人
  ↓
发现敌人 → 请求战斗 → 开始战斗
  ↓
攻击 → 降低敌方能量
  ↓
战斗结束 → 回蚁群
```

## 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         main.cpp                                │
├─────────────────────────────────────────────────────────────────┤
│  1. 加载配置                                                     │
│  2. 初始化 SFML 窗口                                              │
│  3. 创建 Simulation 对象                                          │
│  4. 创建 EditorScene                                             │
│  5. 主循环：                                                      │
│     └── scene->update()                                          │
│     └── scene->render()                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          │                                       │
    ┌─────▼───────┐                      ┌────────▼─────────┐
    │ Simulation  │                      │   EditorScene    │
    └─────┬───────┘                      └────────┬─────────┘
          │                                       │
    ┌─────▼───────┐                      ┌────────▼─────────┐
    │   World     │                      │   GUI System     │
    └─────┬───────┘                      └────────┬─────────┘
          │                                       │
    ┌─────▼───────┐                      ┌────────▼─────────┐
    │  Colonies   │                      │   World View     │
    └─────┬───────┘                      └────────┬─────────┘
          │                                       │
    ┌─────▼───────┐                      ┌────────▼─────────┐
    │    Ants     │                      │   Toolbox        │
    └─────┬───────┘                      └────────┬─────────┘
          │                                       │
    ┌─────▼───────┐                      ┌────────▼─────────┐
    │   Renderer  │◄─────────────────────┤ Display Options  │
    └─────────────┘                      └──────────────────┘
```

## 依赖关系

### 外部依赖
- **SFML 2.x** - 简单快速多媒体库
  - `sfml-graphics`: 图形渲染
  - `sfml-window`: 窗口管理
  - `sfml-system`: 系统工具
- **C++17** - C++ 标准
- **Threads** - 多线程支持

### 内部依赖关系
```
main.cpp
  ├─> simulation/config.hpp
  ├─> simulation/simulation.hpp
  └─> editor/editor_scene.hpp

simulation/simulation.hpp
  ├─> simulation/world/world.hpp
  ├─> simulation/colony/colony.hpp
  ├─> simulation/ant/fight_system.hpp
  └─> render/renderer.hpp

simulation/ant/ant.hpp
  ├─> simulation/world/world.hpp
  ├─> simulation/ant/ant_mode.hpp
  └─> simulation/colony/colony_base.hpp

render/renderer.hpp
  ├─> render/colony_renderer.hpp
  └─> simulation/world/world.hpp

editor/editor_scene.hpp
  ├─> editor/GUI/scene.hpp
  ├─> editor/toolbox.hpp
  ├─> editor/world_view.hpp
  └─> simulation/simulation.hpp
```

## 编译与运行

### Linux (使用 install.sh)

```bash
cd /workspace
./install.sh
```

### Docker 构建

```bash
cd /workspace
docker build -t myimages/ant-simulator:latest .
```

### 手动 CMake 构建

```bash
mkdir build
cd build
cmake ..
make
```

### 配置文件

创建 `conf.txt` 配置文件（参考 [`conf_example.txt`](file:///workspace/conf_example.txt)）：

```
# Window width
1920
# Window height
1080
# Window mode 0 -> Windowed, 1 -> Fullscreen
0
# GUI scale
1.0
# Maximum ants count per colony
4000
```

## 快捷键控制

| 按键 | 功能 |
|------|------|
| P | 暂停/继续模拟 |
| M | 显示/隐藏路径标记 |
| A | 显示/隐藏蚂蚁 |
| S | 最大速度模式 |
| W | 墙壁模式 |
| E | 橡皮擦模式 |
| 鼠标右键 | 添加食物 |
| 鼠标左键 | 移动视图 |
| 滚轮 | 缩放 |

## 数据结构

### civ::Vector<T>
自定义索引向量容器，用于高效的元素管理和引用保持。

### DoubleObject<T>
双缓冲对象，用于渲染时避免数据竞争。

---

## 扩展开发

### 添加新的蚂蚁类型

1. 在 [`Ant::Type`](file:///workspace/include/simulation/ant/ant.hpp#L34-L36) 枚举中添加新类型
2. 在 [`AntUpdater`](file:///workspace/include/simulation/ant/ant_updater.hpp) 中添加对应的更新逻辑
3. 实现新的行为类（类似 `WorkerUpdater` 和 `SoldierUpdater`）

### 添加新的 GUI 组件

1. 在 `include/editor/GUI/` 中创建新的组件类
2. 继承自 `Item` 或其他合适的基类
3. 在 `EditorScene::initialize()` 中实例化并添加

### 配置新的模拟参数

在 [`config.hpp`](file:///workspace/include/simulation/config.hpp) 的 `DefaultConf` 模板类中添加新的静态成员变量。

---

## 注意事项

1. **性能考虑**：蚂蚁数量较多时（如>4000），可能需要降低速度
2. **多蚁群**：最多支持 4 个蚁群同时存在
3. **线程安全**：注意渲染和模拟更新的同步问题
4. **SFML 版本**：确保使用兼容的 SFML 2.x 版本

---

## 相关文件链接

- 主入口: [`main.cpp`](file:///workspace/src/main.cpp)
- 配置文件: [`conf_example.txt`](file:///workspace/conf_example.txt)
- CMake配置: [`CMakeLists.txt`](file:///workspace/CMakeLists.txt)
