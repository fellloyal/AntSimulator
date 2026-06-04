import { useRef } from 'react';
import { useSimulation } from '@/hooks/useSimulation';
import { useCanvas } from '@/hooks/useCanvas';
import Simulator from '@/pages/Simulator';
import MainMenu from '@/pages/MainMenu';
import MapEditor from '@/pages/MapEditor';
import GameSetup from '@/pages/GameSetup';
import useStore from '@/store/useStore';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const page = useStore((s) => s.page);
  const started = useStore((s) => s.started);
  const setupConfig = useStore((s) => s.setupConfig);

  const { simulationRef, rendererRef, workerRef, workerRendererRef } = useSimulation(canvasRef, started, setupConfig);
  const canvasHandlers = useCanvas(canvasRef, rendererRef, simulationRef, workerRef, workerRendererRef);

  if (page === 'menu') {
    return <MainMenu />;
  }

  if (page === 'editor') {
    return <MapEditor />;
  }

  if (page === 'setup') {
    return <GameSetup />;
  }

  // page === 'simulator'
  return (
    <Simulator
      canvasRef={canvasRef}
      onMouseDown={canvasHandlers.onMouseDown}
      onMouseMove={canvasHandlers.onMouseMove}
      onMouseUp={canvasHandlers.onMouseUp}
      onWheel={canvasHandlers.onWheel}
      onContextMenu={canvasHandlers.onContextMenu}
    />
  );
}
