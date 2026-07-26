'use client';

import React, { useEffect, useState } from 'react';
import CalendarGrid from '@/app/components/CalendarGrid';
import MonthSummarySidebar from '@/app/components/MonthSummarySidebar';
import { DailyAggregate } from '@/lib/tradeUtils';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [aggregates, setAggregates] = useState<DailyAggregate[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12

  useEffect(() => {
    const fetchCalendarData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/calendar?year=${year}&month=${month}`);
        if (!res.ok) {
          throw new Error('Gagal memuat data kalender');
        }
        const data = await res.json();
        setAggregates(data.aggregates || []);
        setSummary(data.summary || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const monthName = monthNames[currentDate.getMonth()];

  return (
    <div className="flex-1 overflow-y-auto w-full pb-12 flex flex-col md:flex-row gap-6">
      {/* Calendar Section */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Calendar Header */}
        <div className="flex justify-between items-end mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-50">
              {monthName} {year}
            </h2>
            <div className="flex gap-1">
              <button 
                onClick={handlePrevMonth}
                className="p-1 border border-ink-border rounded hover:bg-ink-light text-slate-300 transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-1 border border-ink-border rounded hover:bg-ink-light text-slate-300 transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        {error ? (
          <div className="flex-1 flex items-center justify-center bg-ink border border-ink-border rounded p-8">
            <div className="text-loss-text flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              <p>{error}</p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center bg-ink border border-ink-border rounded p-8">
            <div className="flex flex-col items-center gap-4 text-slate-400">
              <span className="material-symbols-outlined animate-spin text-4xl">sync</span>
              <p className="font-mono text-sm">Memuat {monthName} {year}...</p>
            </div>
          </div>
        ) : (
          <CalendarGrid year={year} month={month} aggregates={aggregates} />
        )}
      </div>

      {/* Right Sidebar: Performance Summary */}
      {summary && !loading && !error && (
        <MonthSummarySidebar summary={summary} monthName={monthName} year={year} />
      )}
    </div>
  );
}
