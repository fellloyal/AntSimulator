import { useEffect, useCallback, useState } from 'react';
import { ChevronRight, ChevronLeft, PlusCircle, ArrowLeft } from 'lucide-react';
import useStore from '@/store/useStore';
import ControlPanel from '@/components/ControlPanel';
import EditToolbar from '@/components/EditToolbar';
import ColonyInfo from '@/components/ColonyInfo';
import DisplayOptions from '@/components/DisplayOptions';

interface SimulatorProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onWheel: (e: React.WheelEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export default function Simulator({
  canvasRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onWheel,
  onContextMenu,
}: SimulatorProps) {
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const togglePause = useStore((s) => s.togglePause);
  const toggleShowMarkers = useStore((s) => s.toggleShowMarkers);
  const toggleShowAnts = useStore((s) => s.toggleShowAnts);
  const toggleMaxSpeed = useStore((s) => s.toggleMaxSpeed);
  const setActiveTool = useStore((s) => s.setActiveTool);
  const resetSimulation = useStore((s) => s.resetSimulation);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't capture when user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'p':
        case ' ':
          e.preventDefault();
          togglePause();
          break;
        case 'm':
          toggleShowMarkers();
          break;
        case 'a':
          toggleShowAnts();
          break;
        case 's':
          toggleMaxSpeed();
          break;
        case 'w':
          setActiveTool('wall');
          break;
        case 'e':
          setActiveTool('erase');
          break;
        case 'f':
          setActiveTool('food');
          break;
        case 'escape':
          setActiveTool('none');
          break;
      }
    },
    [togglePause, toggleShowMarkers, toggleShowAnts, toggleMaxSpeed, setActiveTool]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0a0f0a]">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-crosshair"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onWheel={onWheel}
        onContextMenu={onContextMenu}
      />

      {/* Control Panel - top left */}
      <div className="absolute left-4 top-4 z-10 flex items-start gap-2">
        <button
          onClick={resetSimulation}
          className="flex items-center gap-1 rounded-lg bg-white/5 px-3 py-2 text-xs text-[#8a9a8a] transition-colors hover:bg-white/10 hover:text-[#e0e8e0]"
          title="返回主菜单"
        >
          <ArrowLeft size={14} />
          菜单
        </button>
        <ControlPanel />
      </div>

      {/* Edit Toolbar - left side */}
      <div className="absolute left-4 top-20 z-10">
        <EditToolbar />
      </div>

      {/* Right panel toggle */}
      <button
        onClick={() => setRightPanelOpen((v) => !v)}
        className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center
                   rounded-lg bg-white/5 text-[#8a9a8a] transition-colors hover:bg-white/10 hover:text-[#e0e8e0]"
        title={rightPanelOpen ? '收起面板' : '展开面板'}
      >
        {rightPanelOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Right panel */}
      <div
        className={`glass-panel absolute right-4 top-16 z-10 flex flex-col overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${rightPanelOpen ? 'w-56 opacity-100' : 'w-0 opacity-0'}`}
      >
        {/* Display Options section */}
        <div className="border-b border-white/5">
          <div className="px-3 pt-3 pb-1">
            <h3 className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#8a9a8a]">
              显示
            </h3>
          </div>
          <DisplayOptions />
        </div>

        {/* Colony Info section */}
        <div className="flex-1 overflow-y-auto border-b border-white/5">
          <div className="px-3 pt-3 pb-1">
            <h3 className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#8a9a8a]">
              蚁群
            </h3>
          </div>
          <ColonyInfo />
        </div>

        {/* Add Colony button */}
        <div className="p-3">
          <button
            onClick={() => setActiveTool('colony')}
            className="flex w-full items-center justify-center gap-2 rounded-lg
                       bg-[#429942]/20 px-3 py-2 text-xs font-sans text-[#429942]
                       transition-colors hover:bg-[#429942]/30"
          >
            <PlusCircle size={14} />
            添加蚁群
          </button>
        </div>
      </div>
    </div>
  );
}
