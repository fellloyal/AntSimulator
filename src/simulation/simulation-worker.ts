/**
 * Simulation Web Worker
 * Runs the ant simulation off the main thread.
 */
import { Simulation } from './Simulation';
import { Config } from './Config';
import { Mode } from './types';
import { World } from './World';
import { ANT_FLOATS_PER_ANT, WORLD_FLOATS_PER_CELL } from './worker-protocol';
import type { WorkerCommand, ColonyStatsPayload } from './worker-protocol';

const sim: { current: Simulation | null } = { current: null };
let paused = false;
let speed = 1;
let maxSpeed = false;
let lastTime = 0;
let fpsFrames = 0;
let fpsTime = 0;
let currentFps = 0;

// Pre-allocated buffers (grown as needed)
let antBuffer: Float32Array = new Float32Array(0);
let worldBuffer: Float32Array = new Float32Array(0);

function ensureAntBuffer(antCount: number): void {
  const needed = antCount * ANT_FLOATS_PER_ANT;
  if (antBuffer.length < needed) {
    antBuffer = new Float32Array(needed * 2); // over-allocate
  }
}

function ensureWorldBuffer(cellCount: number): void {
  const needed = cellCount * WORLD_FLOATS_PER_CELL;
  if (worldBuffer.length < needed) {
    worldBuffer = new Float32Array(needed);
  }
}

function serializeAnts(): ArrayBuffer {
  const s = sim.current;
  if (!s) return new ArrayBuffer(0);

  let totalAnts = 0;
  for (const colony of s.colonies) {
    totalAnts += colony.ants.length;
  }

  ensureAntBuffer(totalAnts);
  let offset = 0;

  for (const colony of s.colonies) {
    for (const ant of colony.ants) {
      antBuffer[offset++] = ant.position.x;
      antBuffer[offset++] = ant.position.y;
      antBuffer[offset++] = ant.direction.angle;
      antBuffer[offset++] = ant.phase as number;
      antBuffer[offset++] = ant.type as number;
      antBuffer[offset++] = ant.wobblePhase;
      antBuffer[offset++] = ant.dyingTimer;
      antBuffer[offset++] = ant.isPaused ? 1.0 : 0.0;
    }
  }

  return antBuffer.buffer.slice(0, offset * 4);
}

function serializeWorld(): ArrayBuffer {
  const s = sim.current;
  if (!s) return new ArrayBuffer(0);

  const map = s.world.map;
  const cellCount = map.width * map.height;
  ensureWorldBuffer(cellCount);

  const numColonies = s.colonies.length;
  const intensityFactor = 255.0 / Config.MARKER_INTENSITY;

  // Pre-compute colony colors
  const colonyRgb: Array<{ r: number; g: number; b: number }> = [];
  for (let ci = 0; ci < numColonies; ci++) {
    const hex = Config.COLONY_COLORS[ci] || '#ffffff';
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    colonyRgb.push(result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 255, g: 255, b: 255 });
  }

  let offset = 0;
  for (let i = 0; i < cellCount; i++) {
    const cell = map.cells[i];
    // Pack wall and food into first float
    worldBuffer[offset++] = cell.wall * 10000 + cell.food;

    let r = 0, g = 0, b = 0;

    if (!cell.wall && cell.food === 0) {
      for (let ci = 0; ci < numColonies; ci++) {
        const mc = cell.markers[ci];
        const toHomeI = mc.intensity[Mode.ToHome];
        const toFoodI = mc.intensity[Mode.ToFood];
        const toEnemyI = mc.intensity[Mode.ToEnemy];
        const repellent = mc.repellent;

        if (toHomeI > 0.1 || toFoodI > 0.1 || toEnemyI > 0.1 || repellent > 0.1) {
          const rgb = colonyRgb[ci];
          if (toHomeI > 0.1) {
            const f = intensityFactor * toHomeI;
            r += rgb.r * 0.8 * f;
            g += rgb.g * 0.3 * f;
            b += rgb.b * 0.3 * f;
          }
          if (toFoodI > 0.1) {
            const f = intensityFactor * toFoodI;
            r += rgb.r * 0.3 * f;
            g += rgb.g * 0.8 * f;
            b += rgb.b * 0.3 * f;
          }
          if (toEnemyI > 0.1) {
            const f = intensityFactor * toEnemyI;
            r += 200 * f;
            b += 200 * f;
          }
          if (repellent > 0.1) {
            const f = intensityFactor * repellent;
            b += 255 * f;
          }
        }
      }
    }

    worldBuffer[offset++] = Math.min(255, r) / 255;
    worldBuffer[offset++] = Math.min(255, g) / 255;
    worldBuffer[offset++] = Math.min(255, b) / 255;
  }

  return worldBuffer.buffer.slice(0, offset * 4);
}

function getStats(): ColonyStatsPayload[] {
  if (!sim.current) return [];
  return sim.current.colonies.map((colony) => ({
    id: colony.id,
    color: colony.antsColor,
    antCount: colony.ants.length,
    soldierCount: colony.soldiersCount(),
    food: Math.floor(colony.base.food),
  }));
}

function loop(time: number): void {
  if (!sim.current) return;

  // Calculate dt
  if (lastTime === 0) lastTime = time;
  let dt = (time - lastTime) / 1000;
  lastTime = time;
  dt = Math.min(dt, 0.05);

  // FPS counter
  fpsFrames++;
  fpsTime += dt;
  if (fpsTime >= 1.0) {
    currentFps = Math.round(fpsFrames / fpsTime);
    fpsFrames = 0;
    fpsTime = 0;
  }

  // Update simulation
  if (!paused) {
    const steps = maxSpeed ? 5 : speed;
    const stepDt = dt / steps;
    for (let i = 0; i < steps; i++) {
      sim.current.update(stepDt);
    }
  }

  // Serialize and send data
  const antData = serializeAnts();
  const worldData = serializeWorld();
  const stats = getStats();

  (self as unknown as Worker).postMessage(
    { type: 'frame', antData, worldData, stats, fps: currentFps },
    [antData, worldData] as unknown as Transferable[]
  );

  // Schedule next frame
  requestAnimationFrame(loop);
}

// Handle messages from main thread
self.onmessage = (e: MessageEvent<WorkerCommand>) => {
  const msg = e.data;

  switch (msg.type) {
    case 'init': {
      const s = new Simulation();
      const { workerCount, soldierCount, colonyCount } = msg.config;
      for (let i = 0; i < colonyCount; i++) {
        const angle = (i / colonyCount) * 2 * Math.PI;
        const cx = Config.WORLD_WIDTH / 2 + Math.cos(angle) * 300;
        const cy = Config.WORLD_HEIGHT / 2 + Math.sin(angle) * 300;
        s.createColony(cx, cy, workerCount, soldierCount);
      }
      sim.current = s;
      lastTime = 0;
      (self as unknown as Worker).postMessage({ type: 'ready' });
      requestAnimationFrame(loop);
      break;
    }
    case 'pause':
      paused = msg.paused;
      break;
    case 'speed':
      speed = msg.speed;
      maxSpeed = msg.maxSpeed;
      break;
    case 'addFood': {
      if (sim.current) {
        sim.current.world.addFoodAt(msg.x, msg.y, msg.quantity);
      }
      break;
    }
    case 'addWall': {
      if (sim.current) {
        sim.current.world.addWallByCoords({ x: msg.cx, y: msg.cy });
      }
      break;
    }
    case 'eraseCell': {
      if (sim.current) {
        const map = sim.current.world.map;
        const coords = { x: msg.cx, y: msg.cy };
        map.clearCell(coords);
        if (map.checkCoords(coords)) {
          const cell = map.getByCoords(coords);
          cell.wall = 0;
          cell.food = 0;
          cell.density = 0;
          for (let ci = 0; ci < Config.MAX_COLONIES_COUNT; ci++) {
            World.clearMarkersOfCell(cell.markers[ci]);
          }
        }
      }
      break;
    }
    case 'addColony': {
      if (sim.current && sim.current.colonies.length < Config.MAX_COLONIES_COUNT) {
        sim.current.createColony(msg.x, msg.y);
      }
      break;
    }
    case 'resize':
      // Viewport offset handled in main thread
      break;
  }
};
