'use client';

import React from 'react';

interface MonthSummaryProps {
  summary: {
    netPnl: number;
    grossProfit: number;
    grossLoss: number;
    bestDay: number;
    avgDay: number;
    winRate: number;
    totalCompletedTrades: number;
  };
  monthName: string;
  year: number;
}

export default function MonthSummarySidebar({ summary, monthName, year }: MonthSummaryProps) {
  const formatCurrency = (val: number) => {
    const isPositive = val >= 0;
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(val));
    return isPositive ? `+${formatted}` : `-${formatted}`;
  };

  const isProfit = summary.netPnl >= 0;

  return (
    <div className="w-full xl:w-72 bg-ink/50 border border-ink-border rounded-lg p-6 flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-1 text-slate-100">Month Summary</h3>
        <p className="text-sm text-slate-400">{monthName} {year}</p>
      </div>
      
      <div className="flex flex-col gap-4">
        {/* Net PnL */}
        <div className="bg-ink border border-ink-border rounded p-4 shadow-sm">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">Net P&amp;L</div>
          <div className={`text-2xl font-bold ${isProfit ? 'text-profit-text' : 'text-loss-text'}`}>
            {formatCurrency(summary.netPnl)}
          </div>
        </div>
        
        {/* Gross Profit & Loss */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-ink border border-ink-border rounded p-3 shadow-sm">
            <div className="text-[9px] font-mono text-slate-400 uppercase mb-1 truncate">Gross Profit</div>
            <div className="text-sm font-mono font-semibold text-profit-text">{formatCurrency(summary.grossProfit)}</div>
          </div>
          <div className="bg-ink border border-ink-border rounded p-3 shadow-sm">
            <div className="text-[9px] font-mono text-slate-400 uppercase mb-1 truncate">Gross Loss</div>
            <div className="text-sm font-mono font-semibold text-loss-text">{formatCurrency(summary.grossLoss)}</div>
          </div>
        </div>
        
        {/* Win Rate */}
        <div className="bg-ink border border-ink-border rounded p-4 shadow-sm">
          <div className="flex justify-between items-end mb-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Win Rate</div>
            <div className="text-base font-semibold text-slate-200">{summary.winRate.toFixed(1)}%</div>
          </div>
          <div className="w-full bg-ink-light rounded-full h-1.5 overflow-hidden">
            <div className="bg-profit h-1.5 rounded-full" style={{ width: `${summary.winRate}%` }}></div>
          </div>
          <div className="flex justify-between font-mono text-slate-500 mt-2 text-[10px]">
            <span>{summary.totalCompletedTrades} Completed Trades</span>
          </div>
        </div>
        
        {/* Best Day */}
        <div className="bg-ink border border-ink-border rounded p-4 flex justify-between items-center shadow-sm">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Best Day</div>
            <div className="text-xs text-slate-200">PnL Terbesar</div>
          </div>
          <div className="text-sm font-mono font-semibold text-profit-text">{formatCurrency(summary.bestDay)}</div>
        </div>
        
        {/* Average Day */}
        <div className="bg-ink border border-ink-border rounded p-4 flex justify-between items-center shadow-sm">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Avg Day</div>
            <div className="text-xs text-slate-200">Hari Aktif</div>
          </div>
          <div className={`text-sm font-mono font-semibold ${summary.avgDay >= 0 ? 'text-profit-text' : 'text-loss-text'}`}>
            {formatCurrency(summary.avgDay)}
          </div>
        </div>
      </div>
    </div>
  );
}
