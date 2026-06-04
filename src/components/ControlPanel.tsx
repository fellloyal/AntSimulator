import { Play, Pause, Zap } from 'lucide-react';
import useStore from '@/store/useStore';

const SPEED_OPTIONS = [1, 2, 4] as const;

export default function ControlPanel() {
  const paused = useStore((s) => s.paused);
  const speed = useStore((s) => s.speed);
  const maxSpeed = useStore((s) => s.maxSpeed);
  const fps = useStore((s) => s.fps);
  const togglePause = useStore((s) => s.togglePause);
  const setSpeed = useStore((s) => s.setSpeed);
  const toggleMaxSpeed = useStore((s) => s.toggleMaxSpeed);

  return (
    <div className="glass-panel flex items-center gap-2 px-3 py-2">
      {/* Play/Pause */}
      <button
        onClick={togglePause}
        className="flex h-8 w-8 items-center justify-center rounded-lg
                   bg-white/5 text-[#e0e8e0] transition-colors hover:bg-white/10"
        title={paused ? '继续 (空格)' : '暂停 (空格)'}
      >
        {paused ? <Play size={16} /> : <Pause size={16} />}
      </button>

      {/* Speed buttons */}
      <div className="flex items-center gap-1">
        {SPEED_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`h-7 rounded-md px-2 text-xs font-mono transition-colors
              ${
                speed === s && !maxSpeed
                  ? 'bg-[#429942] text-white'
                  : 'bg-white/5 text-[#8a9a8a] hover:bg-white/10 hover:text-[#e0e8e0]'
              }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Max speed toggle */}
      <button
        onClick={toggleMaxSpeed}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors
          ${
            maxSpeed
              ? 'bg-yellow-600/80 text-yellow-100'
              : 'bg-white/5 text-[#8a9a8a] hover:bg-white/10 hover:text-[#e0e8e0]'
          }`}
        title="最大速度 (S)"
      >
        <Zap size={16} />
      </button>

      {/* Divider */}
      <div className="mx-1 h-5 w-px bg-white/10" />

      {/* FPS counter */}
      <div className="flex items-center gap-1 text-xs">
        <span className="text-[#8a9a8a] font-sans">FPS</span>
        <span className="font-mono tabular-nums text-[#e0e8e0]">{fps}</span>
      </div>
    </div>
  );
}
