import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  trend,
  icon,
  badge,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-slate-200/80 p-4 shadow-card hover:border-slate-300 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-subtle' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        {icon && <div className="text-slate-400 p-1.5 rounded-md bg-slate-50 border border-slate-100">{icon}</div>}
        {badge}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.isPositive ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
      {subValue && <p className="mt-1 text-xs text-slate-500">{subValue}</p>}
    </div>
  );
};
