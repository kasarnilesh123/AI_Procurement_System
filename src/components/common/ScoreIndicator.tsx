import React from 'react';

interface ScoreIndicatorProps {
  score: number; // 0-100
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showBar?: boolean;
  className?: string;
}

export const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({
  score,
  maxScore = 100,
  size = 'md',
  showBar = false,
  className = '',
}) => {
  const percentage = (score / maxScore) * 100;

  const getColorClasses = (val: number) => {
    if (val >= 85) return {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      bar: 'bg-emerald-600',
    };
    if (val >= 70) return {
      text: 'text-sky-700',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      bar: 'bg-sky-600',
    };
    if (val >= 50) return {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      bar: 'bg-amber-500',
    };
    return {
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      bar: 'bg-rose-600',
    };
  };

  const colors = getColorClasses(percentage);

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono font-medium border ${colors.bg} ${colors.text} ${colors.border} ${className}`}
      >
        {score.toFixed(1)}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`flex flex-col items-start ${className}`}>
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-bold font-mono tracking-tight ${colors.text}`}>
            {score.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400 font-normal">/ {maxScore}</span>
        </div>
        {showBar && (
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${colors.bar}`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  // Medium (default)
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
      >
        {score.toFixed(1)}
      </span>
      {showBar && (
        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${colors.bar}`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      )}
    </div>
  );
};
