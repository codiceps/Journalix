'use client';

import React from 'react';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  winRate: number;
  profitFactor: number | null;
  grossProfit: number;
  netPnl: number;
  badges: string[];
  isCurrentUser: boolean;
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
}

export default function LeaderboardTable({ data }: LeaderboardTableProps) {
  const formatCurrency = (val: number) => {
    const isPositive = val >= 0;
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(val));
    return isPositive ? `+${formatted}` : `-${formatted}`;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm border border-primary/30">1</span>;
    }
    if (rank === 2) {
      return <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-400/20 text-blue-400 font-bold text-sm border border-blue-400/30">2</span>;
    }
    if (rank === 3) {
      return <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-400/20 text-orange-400 font-bold text-sm border border-orange-400/30">3</span>;
    }
    return <span className="text-body-md font-body-md text-on-surface-variant font-medium">{rank}</span>;
  };

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      {/* Table Controls */}
      <div className="p-4 border-b border-outline-variant bg-surface-container-high flex justify-between items-center">
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded text-body-sm font-body-sm font-medium hover:bg-primary/20 transition-colors">Global</button>
          <button className="px-3 py-1.5 bg-transparent text-on-surface-variant border border-outline-variant rounded text-body-sm font-body-sm opacity-50 cursor-not-allowed">Following</button>
        </div>
        <button className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant hover:text-on-surface transition-colors" disabled>
          <span className="material-symbols-outlined text-sm">filter_list</span>
          Filter
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-highest/50 border-b border-outline-variant">
              <th className="py-3 px-4 text-mono-label font-mono-label text-on-surface-variant uppercase tracking-wider w-16 text-center">Rank</th>
              <th className="py-3 px-4 text-mono-label font-mono-label text-on-surface-variant uppercase tracking-wider">Trader</th>
              <th className="py-3 px-4 text-mono-label font-mono-label text-primary uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  Consistency Score
                  <span className="material-symbols-outlined text-xs">arrow_downward</span>
                </div>
              </th>
              <th className="py-3 px-4 text-mono-label font-mono-label text-on-surface-variant uppercase tracking-wider text-right">Win Rate</th>
              <th className="py-3 px-4 text-mono-label font-mono-label text-on-surface-variant uppercase tracking-wider text-right">Profit Factor</th>
              <th className="py-3 px-4 text-mono-label font-mono-label text-on-surface-variant uppercase tracking-wider text-right">Total P&amp;L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            {data.map((item) => (
              <tr key={item.userId} className={`hover:bg-surface-container-high/50 transition-colors group ${item.isCurrentUser ? 'bg-primary/5' : ''}`}>
                <td className="py-4 px-4 text-center">
                  {getRankBadge(item.rank)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant flex items-center justify-center">
                      <span className="text-body-md font-bold text-on-surface-variant">{item.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-body-md font-body-md font-medium text-on-surface group-hover:text-primary transition-colors">
                          {item.name}
                        </p>
                        {item.badges.map((badge, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-tertiary/20 text-tertiary text-[10px] rounded border border-tertiary/30 font-semibold tracking-wide">
                            {badge}
                          </span>
                        ))}
                      </div>
                      <p className="text-mono-label font-mono-label text-on-surface-variant">@{item.name.toLowerCase().replace(/\s+/g, '_')}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {/* Menggunakan proporsi logis WinRate untuk visualisasi skor sementara, 
                        karena "Consistency Score" tunggal belum dirumuskan matematis selain dari urutan */}
                    <span className="text-mono-data font-mono-data text-primary">{item.winRate.toFixed(1)}</span>
                    <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(item.winRate, 100)}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right text-mono-data font-mono-data text-on-surface">
                  {item.winRate.toFixed(1)}%
                </td>
                <td className="py-4 px-4 text-right text-mono-data font-mono-data text-on-surface">
                  {item.profitFactor === null ? (item.grossProfit > 0 ? "Perfect" : "-") : item.profitFactor.toFixed(2)}
                </td>
                <td className={`py-4 px-4 text-right text-mono-data font-mono-data ${item.netPnl >= 0 ? 'text-primary' : 'text-error'}`}>
                  {formatCurrency(item.netPnl)}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-on-surface-variant">
                  Tidak ada data yang tersedia di Leaderboard.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
