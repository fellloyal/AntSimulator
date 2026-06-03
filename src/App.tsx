import { useRef } from 'react';
import { useSimulation } from '@/hooks/useSimulation';
import { useCanvas } from '@/hooks/useCanvas';
import Simulator from '@/pages/Simulator';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { simulationRef, rendererRef } = useSimulation(canvasRef);

  const canvasHandlers = useCanvas(canvasRef, rendererRef, simulationRef);

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
