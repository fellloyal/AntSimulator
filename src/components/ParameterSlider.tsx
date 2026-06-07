interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export default function ParameterSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: ParameterSliderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#5a7a5a] font-sans">{label}</span>
        <span className="text-[#1a2e1a] font-mono tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
