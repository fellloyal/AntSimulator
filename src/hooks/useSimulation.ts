import { useRef, useCallback, useEffect } from 'react';
import type { RefObject } from 'react';
import { Simulation } from '@/simulation/Simulation';
import { Renderer } from '@/render/Renderer';
import { WorkerRenderer } from '@/render/WorkerRenderer';
import useStore, { type SetupConfig } from '@/store/useStore';
import { Config } from '@/simulation/Config';
import type { WorkerCommand, WorkerResponse } from '@/simulation/worker-protocol';

// Set to true to use Web Worker for simulation
const USE_WORKER = true;

export function useSimulation(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  started: boolean,
  setupConfig: SetupConfig
) {
  const simulationRef = useRef<Simulation | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const workerRendererRef = useRef<WorkerRenderer | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const fpsFramesRef = useRef<number>(0);
  const fpsTimeRef = useRef<number>(0);
  const useWorkerRef = useRef(USE_WORKER);

  // Latest data from worker
  const antDataRef = useRef<Float32Array | null>(null);
  const worldDataRef = useRef<Float32Array | null>(null);
  const fullUpdateRef = useRef<boolean>(true);
  const colonyBasesRef = useRef<Array<{ id: number; baseX: number; baseY: number; baseRadius: number; food: number; maxFood: number }>>([]);

  // Use refs for values that change often, to avoid re-creating the loop
  const pausedRef = useRef(false);
  const speedRef = useRef(1);
  const maxSpeedRef = useRef(false);
  const statsTimerRef = useRef(0);

  const paused = useStore((s) => s.paused);
  const speed = useStore((s) => s.speed);
  const maxSpeed = useStore((s) => s.maxSpeed);
  const showAnts = useStore((s) => s.showAnts);
  const showMarkers = useStore((s) => s.showMarkers);
  const showDensity = useStore((s) => s.showDensity);
  const togglePause = useStore((s) => s.togglePause);
  const setColonyStats = useStore((s) => s.setColonyStats);
  const setFps = useStore((s) => s.setFps);

  // Stable refs for callbacks to avoid stale closure in Worker.onmessage
  const setColonyStatsRef = useRef(setColonyStats);
  const setFpsRef = useRef(setFps);
  setColonyStatsRef.current = setColonyStats;
  setFpsRef.current = setFps;

  // Keep refs in sync
  pausedRef.current = paused;
  speedRef.current = speed;
  maxSpeedRef.current = maxSpeed;

  // === Worker mode: receive data from worker ===
  const handleWorkerMessage = useCallback(
    (e: MessageEvent<WorkerResponse>) => {
      const msg = e.data;
      if (msg.type === 'ready') {
        console.log('[Worker] Ready');
      }
      if (msg.type === 'frame') {
        antDataRef.current = new Float32Array(msg.antData);
        worldDataRef.current = new Float32Array(msg.worldData);
        fullUpdateRef.current = msg.fullUpdate;
        colonyBasesRef.current = msg.stats.map((s) => ({
          id: s.id, baseX: s.baseX, baseY: s.baseY, baseRadius: s.baseRadius, food: s.food, maxFood: s.maxFood,
        }));
        setColonyStatsRef.current(msg.stats);
        setFpsRef.current(msg.fps);
      }
    },
    [] // No deps - uses refs internally for stability
  );

  // === Initialize ===
  useEffect(() => {
    if (!started) return;

    if (useWorkerRef.current) {
      try {
        const worker = new Worker(
          new URL('../simulation/simulation-worker.ts', import.meta.url),
          { type: 'module' }
        );
        worker.onerror = (e) => {
          console.error('[Worker] Load error:', e.message, e.filename, e.lineno);
          // Worker failed to load - this is fatal, can't recover
        };
        worker.onmessage = handleWorkerMessage;
        workerRef.current = worker;

        const tempSim = new Simulation(setupConfig.mapWidth, setupConfig.mapHeight);
        const wr = new WorkerRenderer(tempSim.world.map.width, tempSim.world.map.height, tempSim.world.map.cellSize);
        workerRendererRef.current = wr;

        const colonyCount = setupConfig.colonyCount;
        wr.coloniesColor = Array.from({ length: colonyCount }, (_, i) => Config.COLONY_COLORS[i] || '#ffffff');

        const worldW = setupConfig.mapWidth || Config.WORLD_WIDTH;
        const worldH = setupConfig.mapHeight || Config.WORLD_HEIGHT;
        const resizeCanvas = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            wr.viewport.offsetX = (canvas.width - worldW) / 2;
            wr.viewport.offsetY = (canvas.height - worldH) / 2;
          }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        worker.postMessage({
          type: 'init',
          config: setupConfig,
        } satisfies WorkerCommand);

        return () => {
          window.removeEventListener('resize', resizeCanvas);
          worker.terminate();
          workerRef.current = null;
        };
      } catch (err) {
        console.error('[Worker] Failed to create, falling back to main thread:', err);
        useWorkerRef.current = false;
      }
    }

    if (!useWorkerRef.current) {
      const mapW = setupConfig.mapWidth || Config.WORLD_WIDTH;
      const mapH = setupConfig.mapHeight || Config.WORLD_HEIGHT;
      const sim = new Simulation(mapW, mapH);

      // Load map grid data if provided
      if (setupConfig.gridData) {
        try {
          const data = JSON.parse(setupConfig.gridData);
          const cs = data.cellSize || 4;
          for (const [cx, cy] of data.walls || []) {
            sim.world.addWallByCoords({ x: cx as number, y: cy as number });
          }
          for (const [cx, cy, qty] of data.foods || []) {
            const wx = (cx as number) * cs + cs / 2;
            const wy = (cy as number) * cs + cs / 2;
            sim.world.addFoodAt(wx, wy, qty as number);
          }
        } catch (e) {
          console.error('Failed to parse gridData:', e);
        }
      }

      const { workerCount, soldierCount, colonyCount } = setupConfig;
      const positions = setupConfig.colonyPositions;
      for (let i = 0; i < colonyCount; i++) {
        let cx: number, cy: number;
        if (positions && positions[i]) {
          cx = positions[i].x;
          cy = positions[i].y;
        } else {
          const angle = (i / colonyCount) * 2 * Math.PI;
          cx = mapW / 2 + Math.cos(angle) * 300;
          cy = mapH / 2 + Math.sin(angle) * 300;
        }
        sim.createColony(cx, cy, workerCount, soldierCount);
      }

      simulationRef.current = sim;
      rendererRef.current = new Renderer(sim.world);

      for (const colony of sim.colonies) {
        rendererRef.current.addColony(colony);
      }
      rendererRef.current.worldRenderer.coloniesColor = sim.colonies.map(
        (_, i) => Config.COLONY_COLORS[i] || '#ffffff'
      );

      const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          if (rendererRef.current) {
            rendererRef.current.viewport.offsetX = (canvas.width - mapW) / 2;
            rendererRef.current.viewport.offsetY = (canvas.height - mapH) / 2;
          }
        }
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  // Sync display options
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.renderAnts = showAnts;
      rendererRef.current.worldRenderer.drawMarkers = showMarkers;
      rendererRef.current.worldRenderer.drawDensity = showDensity;
    }
    if (workerRendererRef.current) {
      workerRendererRef.current.renderAnts = showAnts;
      workerRendererRef.current.drawMarkers = showMarkers;
      workerRendererRef.current.drawDensity = showDensity;
    }
  }, [showAnts, showMarkers, showDensity]);

  // Sync pause/speed to worker
  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'pause',
        paused,
      } satisfies WorkerCommand);
    }
  }, [paused]);

  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'speed',
        speed,
        maxSpeed,
      } satisfies WorkerCommand);
    }
  }, [speed, maxSpeed]);

  // === Main thread render loop (stable, reads from refs) ===
  const loop = useCallback(
    (time: number) => {
      const sim = simulationRef.current;
      const renderer = rendererRef.current;
      const canvas = canvasRef.current;
      if (!sim || !renderer || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }
      let dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;
      dt = Math.min(dt, 0.05);

      fpsFramesRef.current++;
      fpsTimeRef.current += dt;
      if (fpsTimeRef.current >= 1.0) {
        setFps(Math.round(fpsFramesRef.current / fpsTimeRef.current));
        fpsFramesRef.current = 0;
        fpsTimeRef.current = 0;
      }

      if (!pausedRef.current) {
        const steps = maxSpeedRef.current ? 5 : speedRef.current;
        const stepDt = dt / steps;
        // Frame time budget: limit simulation to 12ms per frame to keep UI responsive
        const budgetMs = 12;
        const startTime = performance.now();
        for (let i = 0; i < steps; i++) {
          sim.update(stepDt);
          if (performance.now() - startTime > budgetMs) break;
        }
      }

      renderer.render(ctx, canvas.width, canvas.height);

      // Throttle stats updates to ~4Hz to avoid excessive React re-renders
      statsTimerRef.current += dt;
      if (statsTimerRef.current >= 0.25) {
        statsTimerRef.current = 0;
        const stats = sim.colonies.map((colony) => ({
          id: colony.id,
          color: colony.antsColor,
          antCount: colony.ants.length,
          soldierCount: colony.soldiersCount(),
          food: Math.floor(colony.base.food),
        }));
        setColonyStats(stats);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    },
    [setColonyStats, setFps, canvasRef]
  );

  // === Worker render loop ===
  const workerLoop = useCallback(
    () => {
      const wr = workerRendererRef.current;
      const canvas = canvasRef.current;
      if (!wr || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Update world state incrementally
      if (worldDataRef.current) {
        wr.updateWorldData(worldDataRef.current, fullUpdateRef.current);
        worldDataRef.current = null;
      }

      // Update colony bases
      if (colonyBasesRef.current.length > 0) {
        wr.colonyBases = colonyBasesRef.current;
      }

      wr.render(ctx, canvas.width, canvas.height, antDataRef.current);

      animFrameRef.current = requestAnimationFrame(workerLoop);
    },
    [canvasRef]
  );

  // Start render loop
  useEffect(() => {
    if (!started) return;
    lastTimeRef.current = 0;

    if (useWorkerRef.current) {
      animFrameRef.current = requestAnimationFrame(workerLoop);
    } else {
      animFrameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [loop, workerLoop, started]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'p':
          e.preventDefault();
          togglePause();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePause]);

  return { simulationRef, rendererRef, workerRef, workerRendererRef };
}
