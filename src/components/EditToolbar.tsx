import { Apple, Square, Eraser, PlusCircle } from 'lucide-react';
import useStore, { type EditTool } from '@/store/useStore';
import ParameterSlider from './ParameterSlider';

const TOOLS: { id: EditTool; icon: typeof Apple; label: string; color: string }[] = [
  { id: 'food', icon: Apple, label: '食物 (F)', color: '#429942' },
  { id: 'wall', icon: Square, label: '墙壁 (W)', color: '#8a8a8a' },
  { id: 'erase', icon: Eraser, label: '擦除 (E)', color: '#ff8844' },
  { id: 'colony', icon: PlusCircle, label: '蚁群', color: '#ff4944' },
];

export default function EditToolbar() {
  const activeTool = useStore((s) => s.activeTool);
  const brushSize = useStore((s) => s.brushSize);
  const setActiveTool = useStore((s) => s.setActiveTool);
  const setBrushSize = useStore((s) => s.setBrushSize);

  const showBrush = activeTool === 'wall' || activeTool === 'erase';

  return (
    <div className="glass-panel flex flex-col items-center gap-1 p-2">
      {TOOLS.map(({ id, icon: Icon, label, color }) => {
        const isActive = activeTool === id;
        return (
          <button
            key={id}
            onClick={() => setActiveTool(id)}
            className={`group relative flex h-9 w-9 items-center justify-center rounded-lg
                        transition-all duration-150
              ${
                isActive
                  ? 'ring-1 ring-white/20'
                  : 'text-[#8a9a8a] hover:bg-white/10 hover:text-[#e0e8e0]'
              }`}
            style={isActive ? { backgroundColor: `${color}40`, color } : undefined}
            title={label}
          >
            <Icon size={18} />
          </button>
        );
      })}

      {/* Brush size slider */}
      {showBrush && (
        <div className="mt-1 w-full border-t border-white/10 px-1 pt-2">
          <ParameterSlider
            label="笔刷"
            value={brushSize}
            min={1}
            max={10}
            step={1}
            onChange={setBrushSize}
          />
        </div>
      )}
    </div>
  );
}
