'use client';

import React, { useEffect, useState } from 'react';
import { DailyAggregate } from '@/lib/tradeUtils';

export default function PnlMatrix() {
  const [aggregates, setAggregates] = useState<DailyAggregate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCell, setHoveredCell] = useState<{
    dateStr: string;
    agg?: DailyAggregate;
    x: number;
    y: number;
    alignRight: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const res = await fetch('/api/dashboard/heatmap');
        if (!res.ok) throw new Error('Gagal memuat PnL Matrix');
        const data = await res.json();
        setAggregates(data.aggregates);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmap();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400 font-mono text-sm animate-pulse">Memuat PnL Matrix...</div>;
  }

  if (error) {
    return <div className="p-4 text-loss-text text-sm">{error}</div>;
  }

  // Generate grid for the last 8 weeks (56 days) up to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const numWeeks = 8;
  const daysInWeek = 7;
  
  // Find the end date (Saturday of the current week)
  const endDate = new Date(today);
  const endDay = endDate.getDay(); // 0 is Sunday, 6 is Saturday
  endDate.setDate(endDate.getDate() + (6 - endDay));
  
  // Find the start date (Sunday of the week 8 weeks ago)
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (numWeeks * daysInWeek - 1));

  // Build the dates array
  const gridDates: Date[] = [];
  let curr = new Date(startDate);
  while (curr <= endDate) {
    gridDates.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }

  // Map aggregates for quick lookup
  const aggregateMap = new Map<string, DailyAggregate>();
  aggregates.forEach(agg => aggregateMap.set(agg.date, agg));

  // Determine min and max for scaling
  let maxProfit = 0;
  let maxLoss = 0;
  aggregates.forEach(agg => {
    if (agg.netPnl > 0 && agg.netPnl > maxProfit) maxProfit = agg.netPnl;
    if (agg.netPnl < 0 && Math.abs(agg.netPnl) > maxLoss) maxLoss = Math.abs(agg.netPnl);
  });

  const getCellColor = (pnl?: number) => {
    if (pnl === undefined || pnl === 0) return 'bg-ink-border';
    if (pnl > 0) return 'bg-profit';
    return 'bg-loss';
  };

  const formatCurrency = (val: number) => {
    const isPositive = val >= 0;
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(val));
    return isPositive ? `+${formatted}` : `-${formatted}`;
  };

  // Split into weeks
  const weeks = [];
  for (let i = 0; i < gridDates.length; i += daysInWeek) {
    weeks.push(gridDates.slice(i, i + daysInWeek));
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <section className="bg-ink border border-ink-border rounded-lg p-5 flex flex-col mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-slate-50">PnL Matrix</h3>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-between w-full overflow-x-auto pb-2">
          {/* Days column labels */}
          <div className="flex flex-col gap-[3px] text-[10px] text-slate-500 font-mono leading-none opacity-70">
            <div className="h-4 mb-1"></div>
            <div className="h-6 flex items-center justify-end">S</div>
            <div className="h-6 flex items-center justify-end">M</div>
            <div className="h-6 flex items-center justify-end">T</div>
            <div className="h-6 flex items-center justify-end">W</div>
            <div className="h-6 flex items-center justify-end">T</div>
            <div className="h-6 flex items-center justify-end">F</div>
            <div className="h-6 flex items-center justify-end">S</div>
          </div>
          
          {/* Weeks grid */}
          {weeks.map((week, weekIdx) => {
            // Check if this week starts a new month
            const isFirstWeekOfMonth = week[0].getDate() <= 7;
            const monthLabel = isFirstWeekOfMonth ? monthNames[week[0].getMonth()] : "";

            return (
              <div key={weekIdx} className="flex flex-col gap-[3px]">
                <div className="h-4 text-[10px] text-slate-500 font-mono flex items-end opacity-70 mb-1">
                  {monthLabel}
                </div>
                {week.map((date, dayIdx) => {
                  if (date > today) {
                    return <div key={dayIdx} className="w-6 h-6 rounded-[2px] bg-transparent"></div>;
                  }
                  
                  const dateStr = date.toISOString().split('T')[0];
                  const agg = aggregateMap.get(dateStr);
                  const colorClass = getCellColor(agg?.netPnl);
                  
                  return (
                    <div 
                      key={dayIdx} 
                      className={`w-6 h-6 rounded-[2px] cursor-crosshair transition-colors ${colorClass}`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const alignRight = rect.right + 150 > window.innerWidth;
                        setHoveredCell({
                          dateStr,
                          agg,
                          x: alignRight ? rect.right - 10 : rect.left + 10,
                          y: rect.top,
                          alignRight
                        });
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                    ></div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Fixed Tooltip */}
      {hoveredCell && (
        <div 
          className="fixed z-[100] flex flex-col bg-ink border border-ink-border rounded p-2 shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            top: hoveredCell.y - 10,
            left: hoveredCell.x,
            transform: hoveredCell.alignRight ? 'translate(-100%, -100%)' : 'translate(0, -100%)'
          }}
        >
          <p className="font-mono text-xs text-slate-400 mb-1">{hoveredCell.dateStr}</p>
          {hoveredCell.agg ? (
            <>
              <p className="font-mono text-sm font-bold text-slate-50">{formatCurrency(hoveredCell.agg.netPnl)}</p>
              <p className="text-xs text-slate-500 mt-0.5">{hoveredCell.agg.completedTradesCount} trade(s) (Daily)</p>
            </>
          ) : (
            <p className="font-mono text-sm text-slate-500">Tidak ada trade</p>
          )}
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Loss</span>
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-[2px] bg-loss"></div>
          <div className="w-6 h-6 rounded-[2px] bg-profit"></div>
        </div>
        <span>Profit</span>
      </div>
    </section>
  );
}
