import { useRef, useCallback } from 'react';
import type { RefObject } from 'react';
import useStore, { type EditTool } from '@/store/useStore';
import type { Renderer } from '@/render/Renderer';
import type { WorkerRenderer } from '@/render/WorkerRenderer';
import type { Simulation } from '@/simulation/Simulation';
import { Config } from '@/simulation/Config';
import { Mode } from '@/simulation/types';
import { World } from '@/simulation/World';
import type { WorkerCommand } from '@/simulation/worker-protocol';

interface CanvasInteractionHandlers {
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void;
  onContextMenu: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export function useCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  rendererRef: RefObject<Renderer | null>,
  simulationRef: RefObject<Simulation | null>,
  workerRef?: RefObject<Worker | null>,
  workerRendererRef?: RefObject<WorkerRenderer | null>
): CanvasInteractionHandlers {
  const isPanningRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const isToolActiveRef = useRef(false);

  const activeTool = useStore((s) => s.activeTool);
  const brushSize = useStore((s) => s.brushSize);
  const setupConfig = useStore((s) => s.setupConfig);
  const setupConfigRef = useRef(setupConfig);
  setupConfigRef.current = setupConfig;

  // Convert screen coordinates to world coordinates
  const screenToWorld = useCallback(
    (screenX: number, screenY: number): { x: number; y: number } => {
      // Try worker renderer first, then fallback
      const wr = workerRendererRef?.current;
      if (wr) {
        const { offsetX, offsetY, zoom } = wr.viewport;
        return {
          x: (screenX - offsetX) / zoom,
          y: (screenY - offsetY) / zoom,
        };
      }
      const renderer = rendererRef.current;
      if (!renderer) return { x: 0, y: 0 };
      const { offsetX, offsetY, zoom } = renderer.viewport;
      return {
        x: (screenX - offsetX) / zoom,
        y: (screenY - offsetY) / zoom,
      };
    },
    [rendererRef, workerRendererRef]
  );

  // Apply the active tool at the given world position
  const applyTool = useCallback(
    (worldX: number, worldY: number, tool: EditTool) => {
      const cellSize = 4; // Config cellSize
      const halfBrush = Math.floor(brushSize / 2);
      const baseCX = Math.floor(worldX / cellSize);
      const baseCY = Math.floor(worldY / cellSize);

      // Try worker mode first
      const worker = workerRef?.current;
      if (worker) {
        for (let dy = -halfBrush; dy <= halfBrush; dy++) {
          for (let dx = -halfBrush; dx <= halfBrush; dx++) {
            const cx = baseCX + dx;
            const cy = baseCY + dy;
            switch (tool) {
              case 'food':
                worker.postMessage({ type: 'addFood', x: worldX + dx * cellSize, y: worldY + dy * cellSize, quantity: 10 } satisfies WorkerCommand);
                break;
              case 'wall':
                worker.postMessage({ type: 'addWall', cx, cy } satisfies WorkerCommand);
                break;
              case 'erase':
                worker.postMessage({ type: 'eraseCell', cx, cy } satisfies WorkerCommand);
                break;
              case 'colony':
                break;
            }
          }
        }
        return;
      }

      // Fallback: main thread mode
      const sim = simulationRef.current;
      if (!sim) return;

      for (let dy = -halfBrush; dy <= halfBrush; dy++) {
        for (let dx = -halfBrush; dx <= halfBrush; dx++) {
          const cx = baseCX + dx;
          const cy = baseCY + dy;
          const coords = { x: cx, y: cy };

          switch (tool) {
            case 'food':
              sim.world.map.addFoodByCoords(coords, 10);
              sim.world.map.addMarkerByCoords(coords, Mode.ToFood, 1.0, 0, true);
              break;
            case 'wall':
              sim.world.addWallByCoords(coords);
              break;
            case 'erase':
              sim.world.map.clearCell(coords);
              if (sim.world.map.checkCoords(coords)) {
                const cell = sim.world.map.getByCoords(coords);
                cell.wall = 0;
                cell.food = 0;
                cell.density = 0;
                for (let ci = 0; ci < Config.MAX_COLONIES_COUNT; ci++) {
                  World.clearMarkersOfCell(cell.markers[ci]);
                }
              }
              break;
            case 'colony':
              break;
          }
        }
      }
    },
    [simulationRef, workerRef, brushSize]
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      if (activeTool !== 'none' && e.button === 0) {
        isToolActiveRef.current = true;
        const world = screenToWorld(screenX, screenY);
        applyTool(world.x, world.y, activeTool);
      } else if (e.button === 0) {
        isPanningRef.current = true;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
      } else if (e.button === 2) {
        // Right click - add food
        const world = screenToWorld(screenX, screenY);
        const worker = workerRef?.current;
        if (worker) {
          worker.postMessage({ type: 'addFood', x: world.x, y: world.y, quantity: 10 } satisfies WorkerCommand);
        } else {
          const sim = simulationRef.current;
          if (sim) {
            sim.world.addFoodAt(world.x, world.y, 10);
          }
        }
      }
    },
    [activeTool, screenToWorld, applyTool, canvasRef, simulationRef, workerRef]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Try worker renderer first for pan
      const wr = workerRendererRef?.current;
      const renderer = rendererRef.current;
      const panTarget = wr || renderer;

      if (isPanningRef.current && panTarget) {
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        panTarget.pan(dx, dy);
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
      } else if (isToolActiveRef.current && activeTool !== 'none') {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const world = screenToWorld(screenX, screenY);
        applyTool(world.x, world.y, activeTool);
      }
    },
    [rendererRef, workerRendererRef, activeTool, screenToWorld, applyTool, canvasRef]
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
      }

      if (isToolActiveRef.current) {
        if (activeTool === 'colony') {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            const screenX = e.clientX - rect.left;
            const screenY = e.clientY - rect.top;
            const world = screenToWorld(screenX, screenY);

            // Try worker mode
            const worker = workerRef?.current;
            if (worker) {
              worker.postMessage({ type: 'addColony', x: world.x, y: world.y, workerCount: setupConfigRef.current.workerCount, soldierCount: setupConfigRef.current.soldierCount } satisfies WorkerCommand);
              // Update WorkerRenderer colors for the new colony
              const wr = workerRendererRef?.current;
              if (wr) {
                const currentCount = wr.coloniesColor.length;
                if (currentCount < Config.MAX_COLONIES_COUNT) {
                  wr.coloniesColor.push(Config.COLONY_COLORS[currentCount] || '#ffffff');
                }
              }
            } else {
              const sim = simulationRef.current;
              const renderer = rendererRef.current;
              if (sim && renderer) {
                if (sim.colonies.length < Config.MAX_COLONIES_COUNT) {
                  const colony = sim.createColony(world.x, world.y, setupConfigRef.current.workerCount, setupConfigRef.current.soldierCount);
                  renderer.addColony(colony);
                  renderer.worldRenderer.coloniesColor = sim.colonies.map(
                    (_, i) => Config.COLONY_COLORS[i] || '#ffffff'
                  );
                }
              }
            }
          }
        }
        isToolActiveRef.current = false;
      }
    },
    [activeTool, screenToWorld, canvasRef, simulationRef, rendererRef, workerRef, workerRendererRef]
  );

  const onWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const wr = workerRendererRef?.current;
      const renderer = rendererRef.current;
      const zoomTarget = wr || renderer;
      if (!zoomTarget) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      zoomTarget.zoomAt(e.deltaY * 0.01, screenX, screenY);
    },
    [rendererRef, workerRendererRef, canvasRef]
  );

  const onContextMenu = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
  }, []);

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    onContextMenu,
  };
}
