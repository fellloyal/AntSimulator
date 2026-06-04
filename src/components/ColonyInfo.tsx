import useStore from '@/store/useStore';

export default function ColonyInfo() {
  const colonyStats = useStore((s) => s.colonyStats);

  if (colonyStats.length === 0) {
    return (
      <div className="px-3 py-2 text-xs text-[#8a9a8a] font-sans">
        暂无蚁群
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 px-3 py-2">
      {colonyStats.map((colony) => {
        const soldierRatio =
          colony.antCount > 0 ? colony.soldierCount / colony.antCount : 0;

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
                蚁群 {colony.id + 1}
              </span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[10px]">
              <div>
                <span className="text-[#8a9a8a] font-sans">蚂蚁</span>
                <p className="font-mono tabular-nums text-[#e0e8e0]">
                  {colony.antCount}
                </p>
              </div>
              <div>
                <span className="text-[#8a9a8a] font-sans">兵蚁</span>
                <p className="font-mono tabular-nums text-[#e0e8e0]">
                  {colony.soldierCount}
                </p>
              </div>
              <div>
                <span className="text-[#8a9a8a] font-sans">食物</span>
                <p className="font-mono tabular-nums text-[#e0e8e0]">
                  {colony.food.toFixed(1)}
                </p>
              </div>
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
