'use client';

import React, { useEffect, useState } from 'react';

interface Trade {
  id: string;
  pair: string;
  direction: string;
  entryPrice: number;
  exitPrice: number | null;
  positionSize: number;
  tradeDate: string;
  netPnl: number | null;
}

export default function RecentExecutionsTable() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await fetch('/api/trades?limit=5');
        if (!res.ok) throw new Error('Gagal memuat trade terbaru');
        const data = await res.json();
        setTrades(data.trades);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toISOString().replace('T', ' ').substring(0, 16);
  };

  const formatCurrency = (val: number | null) => {
    if (val === null) return '-';
    return new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2 }).format(val);
  };

  const formatPnL = (val: number | null) => {
    if (val === null) return '-';
    const isPositive = val >= 0;
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(val));
    return isPositive ? `+${formatted}` : `-${formatted}`;
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400 font-mono text-sm animate-pulse">Memuat recent executions...</div>;
  }

  if (error) {
    return <div className="p-4 text-loss-text text-sm">{error}</div>;
  }

  if (trades.length === 0) {
    return <div className="p-8 text-center text-slate-400 font-mono text-sm">Belum ada eksekusi trade.</div>;
  }

  return (
    <section className="bg-ink border border-ink-border rounded-lg overflow-hidden flex flex-col mt-4">
      <div className="p-4 border-b border-ink-border flex justify-between items-center bg-ink-light">
        <h3 className="text-xl font-semibold text-slate-50">Recent Executions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ink-light/50 border-b border-ink-border">
              <th className="py-2.5 px-4 text-xs font-mono text-slate-400 uppercase tracking-wider font-medium">Date & Time</th>
              <th className="py-2.5 px-4 text-xs font-mono text-slate-400 uppercase tracking-wider font-medium">Pair</th>
              <th className="py-2.5 px-4 text-xs font-mono text-slate-400 uppercase tracking-wider font-medium">Type</th>
              <th className="py-2.5 px-4 text-xs font-mono text-slate-400 uppercase tracking-wider font-medium">Entry</th>
              <th className="py-2.5 px-4 text-xs font-mono text-slate-400 uppercase tracking-wider font-medium">Exit</th>
              <th className="py-2.5 px-4 text-xs font-mono text-slate-400 uppercase tracking-wider font-medium text-right">Net PnL</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {trades.map((trade) => {
              const isLong = trade.direction.toUpperCase() === 'BUY';
              const pnlValue = trade.netPnl;
              const isProfit = pnlValue !== null && pnlValue >= 0;
              
              return (
                <tr key={trade.id} className="border-b border-ink-border/50 hover:bg-ink-light/50 transition-colors">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{formatDate(trade.tradeDate)}</td>
                  <td className="py-3 px-4 text-slate-50 font-semibold">{trade.pair}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${isLong ? 'bg-profit/10 text-profit-text border-profit/20' : 'bg-loss/10 text-loss-text border-loss/20'}`}>
                      {isLong ? 'Long' : 'Short'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-50">{formatCurrency(trade.entryPrice)}</td>
                  <td className="py-3 px-4 text-slate-50">{formatCurrency(trade.exitPrice)}</td>
                  <td className={`py-3 px-4 text-right font-bold ${pnlValue === null ? 'text-slate-500' : isProfit ? 'text-profit-text' : 'text-loss-text'}`}>
                    {formatPnL(pnlValue)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
