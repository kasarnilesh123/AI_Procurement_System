import React from 'react';
import { Criterion } from '../../types/procurement';

interface WeightSliderProps {
  criterion: Criterion;
  onChange: (newWeight: number) => void;
  disabled?: boolean;
}

export const WeightSlider: React.FC<WeightSliderProps> = ({
  criterion,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-card hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-900 truncate">
              {criterion.label}
            </h4>
            {criterion.isMandatory && (
              <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                Mandatory
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{criterion.description}</p>
        </div>

        {/* Input box */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              value={criterion.weight}
              disabled={disabled}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                onChange(Math.max(0, Math.min(100, val)));
              }}
              className="w-16 h-8 text-right font-mono font-bold text-sm px-2 pr-5 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-800 focus:border-slate-800 disabled:bg-slate-100 disabled:text-slate-400"
            />
            <span className="absolute right-2 top-1.5 text-xs text-slate-400 font-medium">%</span>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="mt-3 flex items-center gap-3">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={criterion.weight}
          disabled={disabled}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-800 disabled:cursor-not-allowed"
        />
      </div>

      {criterion.benchmark && (
        <div className="mt-2 text-[11px] text-slate-500 bg-slate-50/80 px-2 py-1 rounded border border-slate-100">
          <span className="font-medium text-slate-700">Benchmark:</span> {criterion.benchmark}
        </div>
      )}
    </div>
  );
};
