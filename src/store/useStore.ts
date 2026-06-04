import { create } from 'zustand';

export type EditTool = 'none' | 'food' | 'wall' | 'erase' | 'colony';
export type EditorTool = 'none' | 'wall' | 'food' | 'erase' | 'terrain' | 'obstacle';
export type AppPage = 'menu' | 'editor' | 'setup' | 'simulator';

export interface SetupConfig {
  workerCount: number;
  soldierCount: number;
  colonyCount: number;
  mapId?: number;
  mapWidth?: number;
  mapHeight?: number;
  colonyPositions?: Array<{ x: number; y: number }>;
  gridData?: string;
}

interface SimulatorState {
  // Page routing
  page: AppPage;
  setPage: (page: AppPage) => void;

  // Map editor
  editorMapId: number | null;
  editorMapName: string;
  editorMapWidth: number;
  editorMapHeight: number;
  editorGridData: string;
  setEditorMap: (id: number | null, name: string, width: number, height: number, gridData?: string) => void;

  // Game setup
  selectedMapId: number | null;
  setSelectedMapId: (id: number | null) => void;
  colonyPositions: Array<{ x: number; y: number }>;
  setColonyPositions: (positions: Array<{ x: number; y: number }>) => void;

  // Setup phase
  started: boolean;
  setupConfig: SetupConfig;
  startSimulation: (config: SetupConfig) => void;
  resetSimulation: () => void;

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
  page: 'menu',
  setPage: (page) => set({ page }),

  editorMapId: null,
  editorMapName: '',
  editorMapWidth: 1920,
  editorMapHeight: 1080,
  editorGridData: '',
  setEditorMap: (id, name, width, height, gridData) =>
    set({ editorMapId: id, editorMapName: name, editorMapWidth: width, editorMapHeight: height, editorGridData: gridData || '' }),

  selectedMapId: null,
  setSelectedMapId: (id) => set({ selectedMapId: id }),
  colonyPositions: [],
  setColonyPositions: (positions) => set({ colonyPositions: positions }),

  started: false,
  setupConfig: { workerCount: 400, soldierCount: 50, colonyCount: 1 },
  startSimulation: (config) => set({ started: true, setupConfig: config, page: 'simulator' }),
  resetSimulation: () => set({ started: false, page: 'menu', paused: false, speed: 1, maxSpeed: false }),

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
