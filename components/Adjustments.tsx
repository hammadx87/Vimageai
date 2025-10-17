import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className="px-2 py-1 text-xs font-mono bg-gray-900/50 border border-gray-700 rounded-md">{value > 0 ? '+' : ''}{value}</span>
      </div>
      <input
        type="range"
        min="-50"
        max="50"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
      />
    </div>
  );
};


interface AdjustmentsProps {
    brightness: number;
    onBrightnessChange: (value: number) => void;
    contrast: number;
    onContrastChange: (value: number) => void;
    saturation: number;
    onSaturationChange: (value: number) => void;
}

export const Adjustments: React.FC<AdjustmentsProps> = ({
    brightness,
    onBrightnessChange,
    contrast,
    onContrastChange,
    saturation,
    onSaturationChange,
}) => {
  return (
    <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
        <Slider label="Brightness" value={brightness} onChange={onBrightnessChange} />
        <Slider label="Contrast" value={contrast} onChange={onContrastChange} />
        <Slider label="Saturation" value={saturation} onChange={onSaturationChange} />
    </div>
  );
};
