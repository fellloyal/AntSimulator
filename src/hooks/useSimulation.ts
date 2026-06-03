import { useRef, useCallback, useEffect } from 'react';
import type { RefObject } from 'react';
import { Simulation } from '@/simulation/Simulation';
import { Renderer } from '@/render/Renderer';
import useStore, { type SetupConfig } from '@/store/useStore';
import { Config } from '@/simulation/Config';

export function useSimulation(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  started: boolean,
  setupConfig: SetupConfig
) {
  const simulationRef = useRef<Simulation | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const fpsFramesRef = useRef<number>(0);
  const fpsTimeRef = useRef<number>(0);

  const paused = useStore((s) => s.paused);
  const speed = useStore((s) => s.speed);
  const maxSpeed = useStore((s) => s.maxSpeed);
  const showAnts = useStore((s) => s.showAnts);
  const showMarkers = useStore((s) => s.showMarkers);
  const showDensity = useStore((s) => s.showDensity);
  const togglePause = useStore((s) => s.togglePause);
  const setColonyStats = useStore((s) => s.setColonyStats);
  const setFps = useStore((s) => s.setFps);

  // Initialize simulation when user clicks "Start"
  useEffect(() => {
    if (!started) return;

    const sim = new Simulation();

    // Create colonies based on setup config
    const { workerCount, soldierCount, colonyCount } = setupConfig;
    for (let i = 0; i < colonyCount; i++) {
      const angle = (i / colonyCount) * 2 * Math.PI;
      const cx = Config.WORLD_WIDTH / 2 + Math.cos(angle) * 300;
      const cy = Config.WORLD_HEIGHT / 2 + Math.sin(angle) * 300;
      sim.createColony(cx, cy, workerCount, soldierCount);
    }

    simulationRef.current = sim;
    rendererRef.current = new Renderer(sim.world);

    // Add colonies to renderer and set colors
    for (const colony of sim.colonies) {
      rendererRef.current.addColony(colony);
    }
    rendererRef.current.worldRenderer.coloniesColor = sim.colonies.map(
      (c, i) => Config.COLONY_COLORS[i] || '#ffffff'
    );

    // Resize canvas to fill window
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (rendererRef.current) {
          rendererRef.current.viewport.offsetX =
            (canvas.width - Config.WORLD_WIDTH) / 2;
          rendererRef.current.viewport.offsetY =
            (canvas.height - Config.WORLD_HEIGHT) / 2;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  // Sync display options to renderer
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.renderAnts = showAnts;
      rendererRef.current.worldRenderer.drawMarkers = showMarkers;
      rendererRef.current.worldRenderer.drawDensity = showDensity;
    }
  }, [showAnts, showMarkers, showDensity]);

  // Main loop
  const loop = useCallback(
    (time: number) => {
      const sim = simulationRef.current;
      const renderer = rendererRef.current;
      const canvas = canvasRef.current;
      if (!sim || !renderer || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Calculate delta time
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }
      let dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Clamp dt to avoid spiral of death
      dt = Math.min(dt, 0.05);

      // FPS counter
      fpsFramesRef.current++;
      fpsTimeRef.current += dt;
      if (fpsTimeRef.current >= 1.0) {
        setFps(Math.round(fpsFramesRef.current / fpsTimeRef.current));
        fpsFramesRef.current = 0;
        fpsTimeRef.current = 0;
      }

      // Update simulation
      if (!paused) {
        const steps = maxSpeed ? 5 : speed;
        const stepDt = dt / steps;
        for (let i = 0; i < steps; i++) {
          sim.update(stepDt);
        }
      }

      // Render
      renderer.render(ctx, canvas.width, canvas.height);

      // Update colony stats
      const stats = sim.colonies.map((colony) => ({
        id: colony.id,
        color: colony.antsColor,
        antCount: colony.ants.length,
        soldierCount: colony.soldiersCount(),
        food: Math.floor(colony.base.food),
      }));
      setColonyStats(stats);

      animFrameRef.current = requestAnimationFrame(loop);
    },
    [paused, speed, maxSpeed, setColonyStats, setFps, canvasRef]
  );

  // Start / stop loop
  useEffect(() => {
    if (!started) return;
    lastTimeRef.current = 0;
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [loop, started]);

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

  return { simulationRef, rendererRef };
}
