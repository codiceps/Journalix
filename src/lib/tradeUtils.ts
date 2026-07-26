import prisma from './prisma';

export interface DailyAggregate {
  date: string; // YYYY-MM-DD
  netPnl: number;
  totalTradesCount: number;
  completedTradesCount: number;
  winningTradesCount: number;
  hasOpenTrades: boolean;
}

export async function getDailyPnlAggregates(
  userId: string, 
  startDate?: Date, 
  endDate?: Date
): Promise<DailyAggregate[]> {
  const whereClause: any = { userId };
  
  if (startDate || endDate) {
    whereClause.tradeDate = {};
    if (startDate) whereClause.tradeDate.gte = startDate;
    if (endDate) whereClause.tradeDate.lte = endDate;
  }

  const trades = await prisma.trade.findMany({
    where: whereClause,
    orderBy: { tradeDate: 'asc' }
  });

  const dailyMap = new Map<string, DailyAggregate>();

  for (const trade of trades) {
    const dateStr = new Date(trade.tradeDate).toISOString().split('T')[0];

    if (!dailyMap.has(dateStr)) {
      dailyMap.set(dateStr, {
        date: dateStr,
        netPnl: 0,
        totalTradesCount: 0,
        completedTradesCount: 0,
        winningTradesCount: 0,
        hasOpenTrades: false
      });
    }

    const current = dailyMap.get(dateStr)!;
    current.totalTradesCount += 1;

    if (trade.exitPrice !== null && trade.exitPrice !== undefined) {
      const multiplier = trade.direction.toUpperCase() === 'BUY' ? 1 : -1;
      const contractMultiplier = trade.contractMultiplier ?? 1;
      const pnl = (trade.exitPrice - trade.entryPrice) * trade.positionSize * contractMultiplier * multiplier;
      
      current.netPnl += pnl;
      current.completedTradesCount += 1;
      
      if (pnl > 0) {
        current.winningTradesCount += 1;
      }
    } else {
      current.hasOpenTrades = true;
    }
  }

  // Convert map to sorted array
  const aggregates = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  return aggregates;
}

export interface TradeMetrics {
  totalTrades: number;
  completedTrades: number;
  winRate: number;
  netPnl: number;
  grossProfit: number;
  grossLoss: number;
  profitFactor: number | null;
  avgRiskReward: number | null;
  equityCurve: Array<{ date: Date; equity: number }>;
}

export function calculateTradeMetrics(trades: any[]): TradeMetrics {
  const totalTrades = trades.length;

  let totalNetPnl = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let winningTrades = 0;
  
  let totalRiskReward = 0;
  let tradesWithRR = 0;
  
  const equityCurve = [];

  for (const trade of trades) {
    if (trade.exitPrice !== null && trade.exitPrice !== undefined) {
      // Calculate Net PnL
      const multiplier = trade.direction.toUpperCase() === 'BUY' ? 1 : -1;
      const contractMultiplier = trade.contractMultiplier ?? 1;
      const pnl = (trade.exitPrice - trade.entryPrice) * trade.positionSize * contractMultiplier * multiplier;
      totalNetPnl += pnl;

      if (pnl > 0) {
        winningTrades++;
        grossProfit += pnl;
      } else if (pnl < 0) {
        grossLoss += Math.abs(pnl);
      }
      
      equityCurve.push({
        date: trade.tradeDate,
        equity: totalNetPnl
      });
    }

    // Calculate Risk/Reward if stopLoss and takeProfit are present
    if (trade.stopLoss !== null && trade.stopLoss !== undefined && trade.takeProfit !== null && trade.takeProfit !== undefined) {
      const contractMultiplier = trade.contractMultiplier ?? 1;
      const risk = Math.abs(trade.entryPrice - trade.stopLoss) * trade.positionSize * contractMultiplier;
      const reward = Math.abs(trade.takeProfit - trade.entryPrice) * trade.positionSize * contractMultiplier;
      
      if (risk > 0) { // prevent division by zero
        const rr = reward / risk;
        totalRiskReward += rr;
        tradesWithRR++;
      }
    }
  }

  const completedTrades = trades.filter(t => t.exitPrice !== null && t.exitPrice !== undefined).length;
  const winRate = completedTrades > 0 ? (winningTrades / completedTrades) * 100 : 0;
  const avgRiskReward = tradesWithRR > 0 ? totalRiskReward / tradesWithRR : null;

  let profitFactor: number | null = null;
  if (grossLoss === 0) {
    if (grossProfit > 0) {
      profitFactor = null; // High consistency edge case handled by null
    } else {
      profitFactor = null; // No profit, no loss handled by null but sorted lowest later
    }
  } else {
    profitFactor = grossProfit / grossLoss;
  }

  return {
    totalTrades,
    completedTrades,
    winRate,
    netPnl: totalNetPnl,
    grossProfit,
    grossLoss,
    profitFactor,
    avgRiskReward,
    equityCurve
  };
}

export interface Milestones {
  tenDayStreak: {
    achieved: boolean;
    maxStreak: number;
  };
  first10kMonth: {
    achieved: boolean;
    highestMonthPnl: number;
  };
}

export function calculateMilestones(dailyAggregates: DailyAggregate[]): Milestones {
  let maxStreak = 0;
  let currentStreak = 0;
  let previousDate: Date | null = null;
  
  const monthlyPnl: Record<string, number> = {};

  for (const agg of dailyAggregates) {
    // 10-Day Streak Logic
    const currentDate = new Date(agg.date);
    // Ignore time component for strict day diff
    currentDate.setUTCHours(0,0,0,0);

    const isPositiveDay = agg.netPnl > 0 && agg.completedTradesCount > 0;

    if (previousDate) {
      const diffTime = currentDate.getTime() - previousDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        if (isPositiveDay) {
          currentStreak += 1;
        } else {
          currentStreak = 0;
        }
      } else {
        // Gap in days breaks the streak
        currentStreak = isPositiveDay ? 1 : 0;
      }
    } else {
      currentStreak = isPositiveDay ? 1 : 0;
    }
    
    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }
    
    previousDate = currentDate;

    // First $10k Month Logic
    // Extract YYYY-MM
    const monthKey = agg.date.substring(0, 7);
    if (!monthlyPnl[monthKey]) {
      monthlyPnl[monthKey] = 0;
    }
    monthlyPnl[monthKey] += agg.netPnl;
  }

  let highestMonthPnl = 0;
  for (const pnl of Object.values(monthlyPnl)) {
    if (pnl > highestMonthPnl) {
      highestMonthPnl = pnl;
    }
  }

  return {
    tenDayStreak: {
      achieved: maxStreak >= 10,
      maxStreak
    },
    first10kMonth: {
      achieved: highestMonthPnl >= 10000,
      highestMonthPnl
    }
  };
}
