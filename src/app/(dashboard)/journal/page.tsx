'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await fetch('/api/trades'); // Tanpa limit, ambil semua
        if (!res.ok) throw new Error('Gagal memuat histori jurnal');
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
    if (val === null) return 'OPEN';
    const isPositive = val >= 0;
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(val));
    return isPositive ? `+${formatted}` : `-${formatted}`;
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-slate-50 tracking-tight mb-8">Journal</h1>
        <div className="p-8 text-center text-slate-400 font-mono text-sm animate-pulse">Memuat data trade...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-slate-50 tracking-tight mb-8">Journal</h1>
        <div className="p-4 text-loss-text text-sm">{error}</div>
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full flex flex-col items-center justify-center mt-20">
        <div className="w-20 h-20 bg-ink-light border border-ink-border rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-slate-400">history_edu</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-50 mb-2">Belum Ada Trade</h2>
        <p className="text-slate-400 mb-8 max-w-md text-center">Anda belum mencatat trade apapun. Mulai jurnal trading Anda sekarang untuk melacak performa.</p>
        <Link 
          href="/journal/new"
          className="bg-primary hover:bg-primary-fixed text-on-primary px-6 py-3 rounded-lg font-semibold shadow-lg shadow-primary/20 btn-interactive flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Trade
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-50 tracking-tight">Journal</h1>
        <Link 
          href="/journal/new"
          className="bg-primary hover:bg-primary-fixed text-on-primary px-4 py-2 rounded-lg font-semibold shadow-sm btn-interactive flex items-center gap-2 text-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Trade
        </Link>
      </div>

      <section className="bg-ink border border-ink-border rounded-lg overflow-hidden flex flex-col mt-4 shadow-sm">
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
                const isOpen = pnlValue === null;
                const isProfit = !isOpen && pnlValue >= 0;
                
                return (
                  <tr 
                    key={trade.id} 
                    onClick={() => router.push(`/journal/${trade.id}`)}
                    className="border-b border-ink-border/50 hover:bg-ink-light transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap group-hover:text-slate-300 transition-colors">{formatDate(trade.tradeDate)}</td>
                    <td className="py-4 px-4 text-slate-50 font-semibold group-hover:text-primary transition-colors">{trade.pair}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${isLong ? 'bg-profit/10 text-profit-text border-profit/20' : 'bg-loss/10 text-loss-text border-loss/20'}`}>
                        {isLong ? 'Long' : 'Short'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-50">{formatCurrency(trade.entryPrice)}</td>
                    <td className="py-4 px-4 text-slate-50">{formatCurrency(trade.exitPrice)}</td>
                    <td className="py-4 px-4 text-right">
                      {isOpen ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono uppercase font-bold tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          OPEN
                        </span>
                      ) : (
                        <span className={`font-bold ${isProfit ? 'text-profit-text' : 'text-loss-text'}`}>
                          {formatPnL(pnlValue)}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
