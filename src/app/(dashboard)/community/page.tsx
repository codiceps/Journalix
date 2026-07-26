'use client';

import React, { useEffect, useState } from 'react';
import LeaderboardTable, { LeaderboardEntry } from '@/app/components/LeaderboardTable';
import YourRankHighlight from '@/app/components/YourRankHighlight';

export default function CommunityPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [yourData, setYourData] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/community/leaderboard');
        if (!res.ok) {
          throw new Error('Gagal memuat leaderboard');
        }
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
        setYourData(data.yourData || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Hitung stats untuk Bento box top
  const topConsistency = leaderboard.find(l => l.badges.includes("Perfect Consistency") || l.badges.includes("Top Consistency"));
  
  // Calculate average profit factor of top 10
  const top10 = leaderboard.slice(0, 10);
  const top10WithPf = top10.filter(l => l.profitFactor !== null);
  const avgPf = top10WithPf.length > 0 
    ? (top10WithPf.reduce((sum, l) => sum + (l.profitFactor as number), 0) / top10WithPf.length) 
    : 0;

  return (
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-on-surface-variant mb-2">
          <span className="material-symbols-outlined text-sm">groups</span>
          <span className="text-body-sm font-body-sm uppercase tracking-wider">Community</span>
        </div>
        <h2 className="text-headline-lg font-headline-lg text-on-surface">Trader Leaderboard</h2>
        <p className="text-body-md font-body-md text-on-surface-variant mt-2 max-w-2xl">
          Ranking based on our proprietary Consistency Score, rewarding steady risk management over volatile singular gains.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-4xl mr-2">sync</span>
          Memuat Leaderboard...
        </div>
      ) : error ? (
        <div className="bg-error-container text-on-error-container p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          {/* Metrics Row (Bento-style overview) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-surface-container border border-outline-variant rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-1">Top Consistency</p>
              {topConsistency ? (
                <>
                  <p className="text-display font-display text-primary">
                    {topConsistency.winRate.toFixed(1)}<span className="text-headline-md">%</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center">
                      <span className="text-[10px] font-bold text-on-surface-variant">{topConsistency.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                    <span className="text-body-sm font-body-sm">{topConsistency.name}</span>
                  </div>
                </>
              ) : (
                <p className="text-display font-display text-on-surface-variant">-</p>
              )}
            </div>

            <div className="bg-surface-container border border-outline-variant rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/10 rounded-full blur-2xl group-hover:bg-tertiary/20 transition-all"></div>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-1">Avg Profit Factor (Top 10)</p>
              <p className="text-display font-display text-on-surface">
                {avgPf > 0 ? avgPf.toFixed(1) : '-'}<span className="text-headline-md font-mono-data">x</span>
              </p>
              <div className="flex items-center gap-1 mt-2 text-primary">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span className="text-body-sm font-body-sm">Global average</span>
              </div>
            </div>

            <YourRankHighlight yourData={yourData} totalTraders={leaderboard.length} />
          </div>

          <LeaderboardTable data={leaderboard} />
        </>
      )}
    </main>
  );
}
