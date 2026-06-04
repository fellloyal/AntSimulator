import useStore from '@/store/useStore';

export default function ColonyInfo() {
  const colonyStats = useStore((s) => s.colonyStats);

  if (colonyStats.length === 0) {
    return (
      <div className="px-3 py-2 text-xs text-[#8a9a8a] font-sans">
        No colonies yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 px-3 py-2">
      {colonyStats.map((colony) => {
        const soldierRatio =
          colony.antCount > 0 ? colony.soldierCount / colony.antCount : 0;
        const healthRatio = colony.queenAlive ? colony.queenHealth / 100.0 : 0;

        return (
          <div
            key={colony.id}
            className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5"
          >
            {/* Header */}
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: colony.color }}
              />
              <span className="text-xs font-sans font-medium text-[#e0e8e0]">
                Colony {colony.id + 1}
              </span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[10px]">
              <div>
                <span className="text-[#8a9a8a] font-sans">Ants</span>
                <p className="font-mono tabular-nums text-[#e0e8e0]">
                  {colony.antCount}
                </p>
              </div>
              <div>
                <span className="text-[#8a9a8a] font-sans">Soldiers</span>
                <p className="font-mono tabular-nums text-[#e0e8e0]">
                  {colony.soldierCount}
                </p>
              </div>
              <div>
                <span className="text-[#8a9a8a] font-sans">Food</span>
                <p className="font-mono tabular-nums text-[#e0e8e0]">
                  {colony.food}
                </p>
              </div>
            </div>

            {/* Queen status */}
            <div className="mt-2">
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-[#8a9a8a] font-sans">Queen:</span>
                <span
                  className={`font-sans font-medium ${
                    colony.queenAlive ? 'text-[#4ade80]' : 'text-[#f87171]'
                  }`}
                >
                  {colony.queenAlive ? 'Alive' : 'Dead'}
                </span>
              </div>
              
              {/* Queen health bar */}
              {colony.queenAlive && (
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${healthRatio * 100}%`,
                      backgroundColor:
                        healthRatio > 0.5 ? '#4ade80' : healthRatio > 0.25 ? '#fbbf24' : '#f87171',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Soldier ratio bar */}
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${soldierRatio * 100}%`,
                  backgroundColor: colony.color,
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
