import useStore from '@/store/useStore';

interface ToggleProps {
  active: boolean;
  onToggle: () => void;
  label: string;
}

function Toggle({ active, onToggle, label }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-sans text-[#5a7a5a]">{label}</span>
      <div
        className={`toggle-switch ${active ? 'active' : ''}`}
        onClick={onToggle}
        role="switch"
        aria-checked={active}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      />
    </div>
  );
}

export default function DisplayOptions() {
  const showAnts = useStore((s) => s.showAnts);
  const showMarkers = useStore((s) => s.showMarkers);
  const showDensity = useStore((s) => s.showDensity);
  const toggleShowAnts = useStore((s) => s.toggleShowAnts);
  const toggleShowMarkers = useStore((s) => s.toggleShowMarkers);
  const toggleShowDensity = useStore((s) => s.toggleShowDensity);

  return (
    <div className="flex flex-col gap-2.5 px-3 py-2">
      <Toggle active={showAnts} onToggle={toggleShowAnts} label="显示蚂蚁 (A)" />
      <Toggle active={showMarkers} onToggle={toggleShowMarkers} label="显示标记 (M)" />
      <Toggle active={showDensity} onToggle={toggleShowDensity} label="显示密度" />
    </div>
  );
}
