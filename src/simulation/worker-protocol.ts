/**
 * Simulation Worker Protocol
 * Messages between main thread and simulation worker.
 */

// Main → Worker commands
export type WorkerCommand =
  | { type: 'init'; config: {
      workerCount: number;
      soldierCount: number;
      colonyCount: number;
      mapWidth?: number;
      mapHeight?: number;
      colonyPositions?: Array<{ x: number; y: number }>;
      gridData?: string;
      enableVisualTheme?: boolean;  // UI美化（task 19）：true=启用信息素环境渲染，false=退回原#111黑底
    } }
  | { type: 'pause'; paused: boolean }
  | { type: 'speed'; speed: number; maxSpeed: boolean }
  | { type: 'addFood'; x: number; y: number; quantity: number }
  | { type: 'addWall'; cx: number; cy: number }
  | { type: 'eraseCell'; cx: number; cy: number }
  | { type: 'addColony'; x: number; y: number; workerCount: number; soldierCount: number };

// Worker → Main responses
export type WorkerResponse =
  | { type: 'frame'; antData: ArrayBuffer; worldData: ArrayBuffer; fullUpdate: boolean; stats: ColonyStatsPayload[]; fps: number }
  | { type: 'ready' };

export interface ColonyStatsPayload {
  id: number;
  color: string;
  antCount: number;
  soldierCount: number;
  food: number;
  baseX: number;
  baseY: number;
  baseRadius: number;
  maxFood: number;
}

// Ant data layout (per ant, 9 floats = 36 bytes):
// [x, y, angle, phase, type, colId, wobblePhase, dyingTimer, isPaused]
export const ANT_FLOATS_PER_ANT = 9;

// World data layout (per cell, 8 floats = 32 bytes):
// [wall|food_packed, markerR_norm, markerG_norm, markerB_norm,
//  terrain, obstacle, foodType, wearLevel]
// UI美化（task 19）：worker 协议扩展，新增 terrain/obstacle/foodType/wearLevel 4 字段
//  - terrain: 0=grass, 1=sand, 2=water, 3=rock
//  - obstacle: 0=none, 1=brick, 2=ice, 3=wood, 4=fence
//  - foodType: 0=chicken, 1=apple, 2=bread, 3=berry
//  - wearLevel: 0..1 (>0.3 触发磨损土路渲染)
export const WORLD_FLOATS_PER_CELL = 8;

// Dirty cell data layout (per dirty cell, 9 floats = 36 bytes):
// [cellIndex, wall|food_packed, markerR_norm, markerG_norm, markerB_norm,
//  terrain, obstacle, foodType, wearLevel]
// Dirty frame format: [dirtyCount, ...dirtyCells]
// Total floats = 1 + dirtyCount * 9
export const WORLD_DIRTY_FLOATS_PER_CELL = 9;
