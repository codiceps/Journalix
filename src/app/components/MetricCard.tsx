import React from 'react';

interface MetricCardProps {
  title: string;
  icon: string;
  value: string | number;
  trendText?: string;
  trendIcon?: string;
  trendColor?: 'primary' | 'error' | 'surface-variant';
  subtitle?: string;
}

export default function MetricCard({ title, icon, value, trendText, trendIcon, trendColor = 'primary', subtitle }: MetricCardProps) {
  const trendColorClass = trendColor === 'primary' ? 'text-profit-text' : trendColor === 'error' ? 'text-loss-text' : 'text-slate-400';

  return (
    <div className="bg-ink-light border border-ink-border rounded-lg p-4 flex flex-col gap-2 hover:border-slate-500 transition-colors duration-200 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-profit/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex justify-between items-center z-10">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <span className="material-symbols-outlined text-slate-500 opacity-50 text-lg">{icon}</span>
      </div>
      
      <div className="flex items-end gap-3 z-10">
        <span className="font-mono text-3xl font-semibold text-slate-50 tracking-tight">{value}</span>
      </div>
      
      {(trendText || subtitle) && (
        <div className="flex items-center gap-1 mt-1 z-10">
          {trendIcon && (
            <span className={`material-symbols-outlined text-sm ${trendColorClass}`}>{trendIcon}</span>
          )}
          {trendText && (
            <span className={`font-mono text-sm ${trendColorClass}`}>{trendText}</span>
          )}
          {subtitle && (
            <span className="font-mono text-xs text-slate-500 ml-1">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
