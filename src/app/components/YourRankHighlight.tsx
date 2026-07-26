'use client';

import React from 'react';
import { LeaderboardEntry } from './LeaderboardTable';

interface YourRankProps {
  yourData: LeaderboardEntry | null;
  totalTraders: number;
}

export default function YourRankHighlight({ yourData, totalTraders }: YourRankProps) {
  if (!yourData) {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-xl p-6 relative overflow-hidden flex flex-col justify-center">
        <div className="flex justify-between items-center mb-4">
          <span className="text-body-sm font-body-sm text-on-surface-variant">Your Rank</span>
          <span className="px-2 py-1 bg-surface-container-high rounded text-mono-label font-mono-label border border-outline-variant text-on-surface-variant">N/A</span>
        </div>
        <div className="w-full bg-surface-container-highest rounded-full h-2 mb-2">
          <div className="bg-surface-variant h-2 rounded-full" style={{ width: '0%' }}></div>
        </div>
        <p className="text-body-sm font-body-sm text-on-surface-variant text-right">No trades yet</p>
      </div>
    );
  }

  const percentile = totalTraders > 0 ? Math.ceil((yourData.rank / totalTraders) * 100) : 0;
  
  // Handle edge case where user is the only one in leaderboard
  let topText = `Top ${percentile}%`;
  if (totalTraders === 1) {
    topText = "Peringkat Tunggal";
  }

  // Flip the visual bar so rank #1 means full bar (or near full)
  // Example: Top 1% -> 99% progress bar width, Top 99% -> 1% width
  const visualProgress = Math.max(5, 100 - percentile + (percentile === 100 ? 5 : 0));

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-6 relative overflow-hidden flex flex-col justify-center">
      <div className="flex justify-between items-center mb-4">
        <span className="text-body-sm font-body-sm text-on-surface-variant">Your Rank</span>
        <span className="px-2 py-1 bg-surface-container-high rounded text-mono-label font-mono-label border border-outline-variant text-on-surface">
          #{yourData.rank}
        </span>
      </div>
      <div className="w-full bg-surface-container-highest rounded-full h-2 mb-2 overflow-hidden">
        <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${visualProgress}%` }}></div>
      </div>
      <p className="text-body-sm font-body-sm text-on-surface-variant text-right">{topText}</p>
    </div>
  );
}
