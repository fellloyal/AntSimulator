import { useRef, useCallback } from 'react';
import type { RefObject } from 'react';
import useStore, { type EditTool } from '@/store/useStore';
import type { Renderer } from '@/render/Renderer';
import type { Simulation } from '@/simulation/Simulation';
import { Config } from '@/simulation/Config';
import { Mode } from '@/simulation/types';
import { World } from '@/simulation/World';

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
  simulationRef: RefObject<Simulation | null>
): CanvasInteractionHandlers {
  const isPanningRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const isToolActiveRef = useRef(false);

  const activeTool = useStore((s) => s.activeTool);
  const brushSize = useStore((s) => s.brushSize);

  // Convert screen coordinates to world coordinates
  const screenToWorld = useCallback(
    (screenX: number, screenY: number): { x: number; y: number } => {
      const renderer = rendererRef.current;
      if (!renderer) return { x: 0, y: 0 };
      const { offsetX, offsetY, zoom } = renderer.viewport;
      return {
        x: (screenX - offsetX) / zoom,
        y: (screenY - offsetY) / zoom,
      };
    },
    [rendererRef]
  );

  // Apply the active tool at the given world position
  const applyTool = useCallback(
    (worldX: number, worldY: number, tool: EditTool) => {
      const sim = simulationRef.current;
      if (!sim) return;

      const cellSize = sim.world.map.cellSize;
      const halfBrush = Math.floor(brushSize / 2);
      const baseCX = Math.floor(worldX / cellSize);
      const baseCY = Math.floor(worldY / cellSize);

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
              // Also clear all markers
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
    [simulationRef, brushSize]
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      if (activeTool !== 'none' && e.button === 0) {
        // Tool mode - apply tool
        isToolActiveRef.current = true;
        const world = screenToWorld(screenX, screenY);
        applyTool(world.x, world.y, activeTool);
      } else if (e.button === 0) {
        // Pan mode
        isPanningRef.current = true;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
      } else if (e.button === 2) {
        // Right click - add food at world position
        const world = screenToWorld(screenX, screenY);
        const sim = simulationRef.current;
        if (sim) {
          sim.world.addFoodAt(world.x, world.y, 10);
        }
      }
    },
    [activeTool, screenToWorld, applyTool, canvasRef, simulationRef]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const renderer = rendererRef.current;
      if (!renderer) return;

      if (isPanningRef.current) {
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        renderer.pan(dx, dy);
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
    [rendererRef, activeTool, screenToWorld, applyTool, canvasRef]
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
      }

      if (isToolActiveRef.current) {
        // Handle colony creation on mouse up
        if (activeTool === 'colony') {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            const screenX = e.clientX - rect.left;
            const screenY = e.clientY - rect.top;
            const world = screenToWorld(screenX, screenY);
            const sim = simulationRef.current;
            const renderer = rendererRef.current;
            if (sim && renderer) {
              if (sim.colonies.length < Config.MAX_COLONIES_COUNT) {
                const colony = sim.createColony(world.x, world.y);
                renderer.addColony(colony);
                renderer.worldRenderer.coloniesColor = sim.colonies.map(
                  (c, i) => Config.COLONY_COLORS[i] || '#ffffff'
                );
              }
            }
          }
        }
        isToolActiveRef.current = false;
      }
    },
    [activeTool, screenToWorld, canvasRef, simulationRef, rendererRef]
  );

  const onWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const renderer = rendererRef.current;
      if (!renderer) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      renderer.zoomAt(e.deltaY * 0.01, screenX, screenY);
    },
    [rendererRef, canvasRef]
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
