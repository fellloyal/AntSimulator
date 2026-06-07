import { Map, Play } from 'lucide-react';
import useStore from '@/store/useStore';

export default function MainMenu() {
  const setPage = useStore((s) => s.setPage);

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.08) 1px, transparent 0)`,
        backgroundSize: '32px 32px',
      }} />

      <div className="glass-panel p-10 w-[480px] relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-wide" style={{ color: 'var(--accent-green)' }}>
            AntSimulator
          </h1>
          <p className="text-base mt-2" style={{ color: 'var(--text-secondary)' }}>
            蚂蚁群体行为模拟游戏
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => setPage('editor')}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-base font-bold tracking-wider transition-all"
            style={{
              background: 'rgba(66, 153, 66, 0.15)',
              color: 'var(--accent-green)',
              border: '1px solid rgba(66, 153, 66, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(66, 153, 66, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(66, 153, 66, 0.15)';
            }}
          >
            <Map size={20} />
            制作地图
          </button>

          <button
            onClick={() => setPage('setup')}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-base font-bold tracking-wider transition-all"
            style={{
              background: 'var(--accent-green)',
              color: '#000',
            }}
          >
            <Play size={20} />
            选择地图开始
          </button>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
          制作地图后可选择地图设定蚁群开始模拟
        </p>
      </div>
    </div>
  );
}
