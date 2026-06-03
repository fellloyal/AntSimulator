import { create } from 'zustand';

export type EditTool = 'none' | 'food' | 'wall' | 'erase' | 'colony';

interface SimulatorState {
  paused: boolean;
  speed: number;
  maxSpeed: boolean;
  showAnts: boolean;
  showMarkers: boolean;
  showDensity: boolean;
  activeTool: EditTool;
  brushSize: number;
  colonyStats: Array<{
    id: number;
    color: string;
    antCount: number;
    soldierCount: number;
    food: number;
  }>;
  fps: number;

  togglePause: () => void;
  setSpeed: (speed: number) => void;
  toggleMaxSpeed: () => void;
  toggleShowAnts: () => void;
  toggleShowMarkers: () => void;
  toggleShowDensity: () => void;
  setActiveTool: (tool: EditTool) => void;
  setBrushSize: (size: number) => void;
  setColonyStats: (stats: SimulatorState['colonyStats']) => void;
  setFps: (fps: number) => void;
}

const useStore = create<SimulatorState>((set) => ({
  paused: false,
  speed: 1,
  maxSpeed: false,
  showAnts: true,
  showMarkers: true,
  showDensity: false,
  activeTool: 'none',
  brushSize: 3,
  colonyStats: [],
  fps: 0,

  togglePause: () => set((s) => ({ paused: !s.paused })),
  setSpeed: (speed) => set({ speed, maxSpeed: false }),
  toggleMaxSpeed: () => set((s) => ({ maxSpeed: !s.maxSpeed })),
  toggleShowAnts: () => set((s) => ({ showAnts: !s.showAnts })),
  toggleShowMarkers: () => set((s) => ({ showMarkers: !s.showMarkers })),
  toggleShowDensity: () => set((s) => ({ showDensity: !s.showDensity })),
  setActiveTool: (tool) =>
    set((s) => ({ activeTool: s.activeTool === tool ? 'none' : tool })),
  setBrushSize: (brushSize) => set({ brushSize }),
  setColonyStats: (colonyStats) => set({ colonyStats }),
  setFps: (fps) => set({ fps }),
}));

export default useStore;
