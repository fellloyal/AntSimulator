import { useRef } from 'react';
import { useSimulation } from '@/hooks/useSimulation';
import { useCanvas } from '@/hooks/useCanvas';
import Simulator from '@/pages/Simulator';
import SetupScreen from '@/pages/SetupScreen';
import useStore from '@/store/useStore';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const started = useStore((s) => s.started);
  const setupConfig = useStore((s) => s.setupConfig);
  const startSimulation = useStore((s) => s.startSimulation);

  const { simulationRef, rendererRef } = useSimulation(canvasRef, started, setupConfig);

  const canvasHandlers = useCanvas(canvasRef, rendererRef, simulationRef);

  if (!started) {
    return <SetupScreen onStart={startSimulation} />;
  }

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
