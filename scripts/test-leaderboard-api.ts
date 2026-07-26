import prisma from '../src/lib/prisma';
import { calculateTradeMetrics } from '../src/lib/tradeUtils';

async function run() {
  const currentUserId = 'cmrt5v6pm00001cuhvkg9u5fn';

  const users = await prisma.user.findMany({
    where: {
      status: 'ACTIVE',
      isPublicProfile: true
    },
    include: {
      trades: true
    }
  });

  const leaderboardData = [];
  
  for (const user of users) {
    const metrics = calculateTradeMetrics(user.trades);
    
    if (metrics.completedTrades > 0) {
      leaderboardData.push({
        userId: user.id,
        name: user.name || user.email.split('@')[0],
        winRate: metrics.winRate,
        profitFactor: metrics.profitFactor,
        netPnl: metrics.netPnl,
        grossProfit: metrics.grossProfit,
        grossLoss: metrics.grossLoss,
        completedTrades: metrics.completedTrades
      });
    }
  }

  leaderboardData.sort((a, b) => {
    const getPfScore = (item: any) => {
      if (item.profitFactor === null) {
        if (item.grossProfit > 0) return Number.MAX_VALUE; // Perfect
        return -Number.MAX_VALUE; // No profit no loss
      }
      return item.profitFactor;
    };

    const pfA = getPfScore(a);
    const pfB = getPfScore(b);

    if (pfA !== pfB) {
      return pfB - pfA; // DESC
    }

    if (a.winRate !== b.winRate) {
      return b.winRate - a.winRate; // DESC
    }

    return b.netPnl - a.netPnl; // DESC
  });

  let yourRank = null;
  let yourData = null;

  const rankedData = leaderboardData.map((item, index) => {
    const rank = index + 1;
    
    const badges = [];
    if (item.profitFactor === null && item.grossProfit > 0 && item.completedTrades >= 5) {
      badges.push("Perfect Consistency");
    } else if (item.profitFactor !== null && item.profitFactor > 2 && item.completedTrades >= 5) {
      badges.push("Top Consistency");
    }
    
    const entry = {
      rank,
      userId: item.userId,
      name: item.name,
      winRate: item.winRate,
      profitFactor: item.profitFactor,
      netPnl: item.netPnl,
      badges,
      isCurrentUser: item.userId === currentUserId
    };

    if (item.userId === currentUserId) {
      yourRank = rank;
      yourData = entry;
    }

    return entry;
  });

  const res = {
    leaderboard: rankedData,
    yourRank: yourRank,
    yourData: yourData
  };

  console.log("=== API LEADERBOARD RESPONSE (SIMULATED) ===");
  console.log(JSON.stringify(res, null, 2));
}

run();
