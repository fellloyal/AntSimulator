import { useState } from 'react';
import { Play, Bug, Shield, Users } from 'lucide-react';
import type { SetupConfig } from '@/store/useStore';

interface SetupScreenProps {
  onStart: (config: SetupConfig) => void;
}

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [workerCount, setWorkerCount] = useState(800);
  const [soldierCount, setSoldierCount] = useState(200);
  const [colonyCount, setColonyCount] = useState(1);

  const totalAnts = (workerCount + soldierCount) * colonyCount;

  const handleStart = () => {
    onStart({ workerCount, soldierCount, colonyCount });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.08) 1px, transparent 0)`,
        backgroundSize: '32px 32px',
      }} />

      <div className="glass-panel p-8 w-[420px] relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-wide" style={{ color: 'var(--accent-green)' }}>
            🐜 AntSimulator
          </h1>
          <p className="text-base mt-1" style={{ color: 'var(--text-secondary)' }}>
            蚂蚁群体行为模拟器
          </p>
        </div>

        {/* Colony count */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-base mb-2" style={{ color: 'var(--text-secondary)' }}>
            <Users size={14} />
            蚁群数量
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setColonyCount(n)}
                className="flex-1 py-2 rounded-lg text-base font-medium transition-all"
                style={{
                  background: colonyCount === n
                    ? 'var(--accent-green)'
                    : 'rgba(0,0,0,0.05)',
                  color: colonyCount === n ? '#000' : 'var(--text-secondary)',
                  border: colonyCount === n ? 'none' : '1px solid var(--border-glass)',
                }}
              >
                {n}
              </button>
            ))}
          </div>
          {colonyCount > 1 && (
            <div className="flex gap-1 mt-2">
              {Array.from({ length: colonyCount }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{ background: ['#ff4944', '#4488ff', '#ffdd44', '#32ffff'][i] }}
                />
              ))}
              <span className="text-sm ml-1" style={{ color: 'var(--text-secondary)' }}>
                蚁群颜色
              </span>
            </div>
          )}
        </div>

        {/* Worker count */}
        <div className="mb-5">
          <label className="flex items-center justify-between text-base mb-2">
            <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <Bug size={14} />
              工蚁数量
            </span>
            <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{workerCount}</span>
          </label>
          <input
            type="range"
            min={100}
            max={4000}
            step={100}
            value={workerCount}
            onChange={(e) => setWorkerCount(Number(e.target.value))}
            className="w-full custom-range"
          />
        </div>

        {/* Soldier count */}
        <div className="mb-6">
          <label className="flex items-center justify-between text-base mb-2">
            <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <Shield size={14} />
              兵蚁数量
            </span>
            <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{soldierCount}</span>
          </label>
          <input
            type="range"
            min={0}
            max={1000}
            step={50}
            value={soldierCount}
            onChange={(e) => setSoldierCount(Number(e.target.value))}
            className="w-full custom-range"
          />
        </div>

        {/* Summary */}
        <div className="rounded-lg p-3 mb-6 text-center" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border-glass)' }}>
          <span className="text-base" style={{ color: 'var(--text-secondary)' }}>
            总蚂蚁数: <span className="font-mono font-bold" style={{ color: 'var(--accent-green)' }}>{totalAnts.toLocaleString()}</span>
          </span>
          <span className="text-sm ml-3" style={{ color: 'var(--text-secondary)' }}>
            ({colonyCount} 蚁群 × {workerCount + soldierCount}/群)
          </span>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="w-full py-3 rounded-lg text-base font-bold tracking-wider transition-all flex items-center justify-center gap-2"
          style={{
            background: 'var(--accent-green)',
            color: '#000',
          }}
        >
          <Play size={16} />
          开始模拟
        </button>

        {/* Keyboard hint */}
        <p className="text-center text-sm mt-4" style={{ color: 'var(--text-secondary)' }}>
          快捷键: P 暂停 · M 标记 · A 蚂蚁 · S 加速
        </p>
      </div>
    </div>
  );
}
