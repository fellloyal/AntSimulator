/**
 * Simulation Worker Protocol
 * Messages between main thread and simulation worker.
 */

// Main → Worker commands
export type WorkerCommand =
  | { type: 'init'; config: { workerCount: number; soldierCount: number; colonyCount: number } }
  | { type: 'pause'; paused: boolean }
  | { type: 'speed'; speed: number; maxSpeed: boolean }
  | { type: 'addFood'; x: number; y: number; quantity: number }
  | { type: 'addWall'; cx: number; cy: number }
  | { type: 'eraseCell'; cx: number; cy: number }
  | { type: 'addColony'; x: number; y: number }
  | { type: 'resize'; offsetX: number; offsetY: number };

// Worker → Main responses
export type WorkerResponse =
  | { type: 'frame'; antData: ArrayBuffer; worldData: ArrayBuffer; stats: ColonyStatsPayload[]; fps: number }
  | { type: 'ready' };

export interface ColonyStatsPayload {
  id: number;
  color: string;
  antCount: number;
  soldierCount: number;
  food: number;
}

// Ant data layout (per ant, 8 floats = 32 bytes):
// [x, y, angle, phase, type, wobblePhase, dyingTimer, isPaused]
export const ANT_FLOATS_PER_ANT = 8;

// World data layout (per cell, 4 floats = 16 bytes):
// [wall, food, r, g, b, a] — we pack into 4 floats for alignment
// Actually: [wall|food_packed, markerR, markerG, markerB]
// wall|food_packed: wall * 1000 + food (both small integers)
export const WORLD_FLOATS_PER_CELL = 4;
