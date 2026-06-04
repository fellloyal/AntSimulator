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

// World data layout (per cell, 4 floats = 16 bytes):
// [wall|food_packed, markerR_norm, markerG_norm, markerB_norm]
export const WORLD_FLOATS_PER_CELL = 4;

// Dirty cell data layout (per dirty cell, 5 floats = 20 bytes):
// [cellIndex, wall|food_packed, markerR_norm, markerG_norm, markerB_norm]
// Dirty frame format: [dirtyCount, ...dirtyCells]
// Total floats = 1 + dirtyCount * 5
export const WORLD_DIRTY_FLOATS_PER_CELL = 5;
