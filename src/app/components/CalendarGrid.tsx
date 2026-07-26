'use client';

import React, { useState } from 'react';
import { DailyAggregate } from '@/lib/tradeUtils';

interface CalendarGridProps {
  year: number;
  month: number;
  aggregates: DailyAggregate[];
}

export default function CalendarGrid({ year, month, aggregates }: CalendarGridProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    dateStr: string;
    agg?: DailyAggregate;
    x: number;
    y: number;
    alignRight: boolean;
  } | null>(null);

  const monthIndex = month - 1;
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

  // Calculate grid dates
  const gridDates: Date[] = [];
  
  // Backfill from previous month to align to Monday (1) through Sunday (0 -> 7)
  let startDay = firstDayOfMonth.getDay(); // 0 is Sunday
  startDay = startDay === 0 ? 7 : startDay; // Make Monday=1, Sunday=7
  
  const startOffset = startDay - 1;
  
  for (let i = startOffset; i > 0; i--) {
    const d = new Date(year, monthIndex, 1 - i);
    gridDates.push(d);
  }

  // Add all days of current month
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const d = new Date(year, monthIndex, i);
    gridDates.push(d);
  }

  // Forward fill next month to align to Sunday
  let endDay = lastDayOfMonth.getDay();
  endDay = endDay === 0 ? 7 : endDay;
  const endOffset = 7 - endDay;
  
  for (let i = 1; i <= endOffset; i++) {
    const d = new Date(year, monthIndex + 1, i);
    gridDates.push(d);
  }

  // Map aggregates
  const aggregateMap = new Map<string, DailyAggregate>();
  aggregates.forEach(agg => aggregateMap.set(agg.date, agg));

  let maxProfit = 0;
  let maxLoss = 0;
  aggregates.forEach(agg => {
    if (agg.netPnl > 0 && agg.netPnl > maxProfit) maxProfit = agg.netPnl;
    if (agg.netPnl < 0 && Math.abs(agg.netPnl) > maxLoss) maxLoss = Math.abs(agg.netPnl);
  });

  const formatCurrency = (val: number) => {
    const isPositive = val >= 0;
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(val));
    return isPositive ? `+${formatted}` : `-${formatted}`;
  };

  const getCellClasses = (date: Date) => {
    const isCurrentMonth = date.getMonth() === monthIndex;
    const baseClasses = "aspect-square p-2 flex flex-col justify-between cursor-pointer transition-colors relative border border-transparent";
    
    if (!isCurrentMonth) {
      return `${baseClasses} bg-ink-light opacity-50`;
    }

    // Format local date manually to avoid timezone shift on output
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 10);
    const dateStr = localISOTime;
    
    const agg = aggregateMap.get(dateStr);

    if (!agg || (agg.completedTradesCount === 0 && !agg.hasOpenTrades)) {
      return `${baseClasses} bg-ink hover:bg-ink-light`; // cell-empty
    }

    if (agg.hasOpenTrades && agg.completedTradesCount === 0) {
      // e. dashed border, transparent
      return `${baseClasses} bg-transparent border-dashed border border-slate-500 hover:bg-ink`;
    }

    // Has closed trades, might have open trades too
    let colorClass = 'bg-ink';
    const pnl = agg.netPnl;
    
    if (pnl > 0) {
      const ratio = maxProfit > 0 ? pnl / maxProfit : 0;
      if (ratio > 0.75) colorClass = 'bg-profit';
      else if (ratio > 0.50) colorClass = 'bg-profit/70';
      else if (ratio > 0.25) colorClass = 'bg-profit/40';
      else colorClass = 'bg-profit/20';
    } else if (pnl < 0) {
      const ratio = maxLoss > 0 ? Math.abs(pnl) / maxLoss : 0;
      if (ratio > 0.75) colorClass = 'bg-loss';
      else if (ratio > 0.50) colorClass = 'bg-loss/80';
      else if (ratio > 0.25) colorClass = 'bg-loss/50';
      else colorClass = 'bg-loss/20';
    }

    // If it has open trades AND completed trades, we will add an indicator element inside it, 
    // but the background is normal
    return `${baseClasses} ${colorClass} hover:opacity-80`;
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="text-xs font-mono text-slate-500 uppercase text-center py-2">{d}</div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-ink-border rounded overflow-hidden flex-1 border border-ink-border">
        {gridDates.map((date, idx) => {
          const isCurrentMonth = date.getMonth() === monthIndex;
          const tzOffset = date.getTimezoneOffset() * 60000;
          const dateStr = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 10);
          const agg = isCurrentMonth ? aggregateMap.get(dateStr) : undefined;
          
          return (
            <div 
              key={idx} 
              className={getCellClasses(date)}
              onMouseEnter={(e) => {
                if (!isCurrentMonth) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const alignRight = rect.right + 200 > window.innerWidth;
                setHoveredCell({
                  dateStr,
                  agg,
                  x: alignRight ? rect.left - 10 : rect.right + 10,
                  y: rect.top,
                  alignRight
                });
              }}
              onMouseLeave={() => setHoveredCell(null)}
            >
              <span className={`text-sm font-medium ${isCurrentMonth ? 'text-slate-300' : 'text-slate-600'}`}>
                {date.getDate()}
              </span>
              
              {/* Data Display */}
              {isCurrentMonth && agg && (
                <>
                  {(agg.completedTradesCount > 0) && (
                    <div className={`text-[10px] sm:text-[11px] font-mono mt-auto self-end font-bold truncate px-1.5 py-0.5 rounded bg-ink/80 backdrop-blur-sm shadow-sm border border-ink-border/50 ${agg.netPnl >= 0 ? 'text-profit-text' : 'text-loss-text'}`}>
                      {formatCurrency(agg.netPnl)}
                    </div>
                  )}
                  {/* Indicator dot for open trades when there are also closed trades */}
                  {agg.hasOpenTrades && agg.completedTradesCount > 0 && (
                     <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.8)] border border-white/20"></div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Fixed Tooltip */}
      {hoveredCell && (
        <div 
          className="fixed z-[100] flex flex-col bg-ink border border-ink-border rounded p-3 shadow-xl pointer-events-none w-56"
          style={{
            top: hoveredCell.y,
            left: hoveredCell.x,
            transform: hoveredCell.alignRight ? 'translate(-100%, 0)' : 'translate(0, 0)'
          }}
        >
          <p className="font-mono text-xs text-slate-400 mb-2 pb-2 border-b border-ink-border">{hoveredCell.dateStr}</p>
          
          {hoveredCell.agg ? (
            <div className="flex flex-col gap-2">
               {hoveredCell.agg.completedTradesCount > 0 && (
                 <div>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Net PnL</p>
                    <p className={`font-mono text-sm font-bold ${hoveredCell.agg.netPnl >= 0 ? 'text-profit-text' : 'text-loss-text'}`}>
                      {formatCurrency(hoveredCell.agg.netPnl)}
                    </p>
                 </div>
               )}
               <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-400">Total Trades</span>
                 <span className="font-mono text-slate-50">{hoveredCell.agg.totalTradesCount}</span>
               </div>
               
               {hoveredCell.agg.hasOpenTrades && (
                 <div className="mt-1 flex items-start gap-1.5 text-[10px] text-blue-400 bg-blue-500/10 p-1.5 rounded border border-blue-500/20">
                   <span className="material-symbols-outlined text-[14px]">info</span>
                   Ada posisi yang masih terbuka
                 </div>
               )}
            </div>
          ) : (
            <p className="font-mono text-sm text-slate-500">Tidak ada aktivitas trade</p>
          )}
        </div>
      )}
    </div>
  );
}
