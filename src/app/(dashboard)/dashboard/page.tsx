'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import MetricCard from '@/app/components/MetricCard';
import EquityChart from '@/app/components/EquityChart';
import RecentExecutionsTable from '@/app/components/RecentExecutionsTable';
import PnlMatrix from '@/app/components/PnlMatrix';

interface Metrics {
  totalTrades: number;
  winRate: number;
  netPnl: number;
  avgRiskReward: number | null;
  completedTrades: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [equityCurve, setEquityCurve] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/dashboard/metrics');
        if (!res.ok) {
          throw new Error('Gagal memuat metrik');
        }
        const data = await res.json();
        setMetrics(data.metrics);
        setEquityCurve(data.equityCurve || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-4xl text-slate-500">sync</span>
          <p className="text-slate-400 font-mono">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="bg-loss/10 border border-loss text-loss-text px-6 py-4 rounded-lg flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!metrics || metrics.totalTrades === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] bg-ink-light/30 border border-ink-border rounded-xl p-8 mt-4 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">query_stats</span>
        <h2 className="text-2xl font-semibold text-slate-50 mb-2">Belum ada trade</h2>
        <p className="text-slate-400 mb-6 max-w-md">Mulai catat trade pertamamu untuk melihat analitik, win rate, dan laporan performa di dashboard ini.</p>
        <Link href="/journal/new" className="px-6 py-3 bg-profit text-ink font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-sm">add</span>
          Catat Trade Baru
        </Link>
      </div>
    );
  }

  // Format PnL
  const pnlIsPositive = metrics.netPnl >= 0;
  const formattedPnl = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(metrics.netPnl);
  
  // Format Risk/Reward
  let rrDisplay = "Belum ada data";
  if (metrics.avgRiskReward !== null) {
    rrDisplay = `1 : ${metrics.avgRiskReward.toFixed(2)}`;
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-6 w-full pb-12">
      <header className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-3xl font-semibold text-slate-50">Overview</h2>
          <p className="text-sm text-slate-400 mt-1">Ringkasan performa trading Anda</p>
        </div>
      </header>

      {/* Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Net PnL"
          icon="account_balance_wallet"
          value={(pnlIsPositive ? '+' : '') + formattedPnl}
          trendIcon={pnlIsPositive ? 'trending_up' : 'trending_down'}
          trendColor={pnlIsPositive ? 'primary' : 'error'}
        />
        
        <MetricCard
          title="Win Rate"
          icon="pie_chart"
          value={`${metrics.winRate.toFixed(1)}%`}
          subtitle={`dari ${metrics.completedTrades} trade selesai`}
        />
        
        <MetricCard
          title="Total Trades"
          icon="swap_horiz"
          value={metrics.totalTrades}
        />
        
        <MetricCard
          title="Avg Risk/Reward"
          icon="balance"
          value={metrics.avgRiskReward !== null ? rrDisplay : '-'}
          subtitle={metrics.avgRiskReward === null ? 'Belum ada data' : 'Rata-rata terencana'}
        />
      </section>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-2">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <EquityChart data={equityCurve} />
          <RecentExecutionsTable />
        </div>
        <div className="lg:col-span-4">
          <PnlMatrix />
        </div>
      </div>
    </div>
  );
}
