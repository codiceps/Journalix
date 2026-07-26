import { getDailyPnlAggregates } from '../src/lib/tradeUtils';

async function run() {
  const userId = 'cmrt5v6pm00001cuhvkg9u5fn';
  const year = 2026;
  const month = 7;
  
  const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const aggregates = await getDailyPnlAggregates(userId, startDate, endDate);

  let netPnl = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let bestDay = 0;
  let totalCompletedTrades = 0;
  let totalWinningTrades = 0;

  for (const day of aggregates) {
    netPnl += day.netPnl;
    
    if (day.netPnl > 0) grossProfit += day.netPnl;
    if (day.netPnl < 0) grossLoss += Math.abs(day.netPnl);
    
    if (day.netPnl > bestDay) bestDay = day.netPnl;
    
    totalCompletedTrades += day.completedTradesCount;
    totalWinningTrades += day.winningTradesCount;
  }
  
  const daysWithRealizedPnl = aggregates.filter(d => d.completedTradesCount > 0).length;
  const avgDay = daysWithRealizedPnl > 0 ? netPnl / daysWithRealizedPnl : 0;
  const winRate = totalCompletedTrades > 0 ? (totalWinningTrades / totalCompletedTrades) * 100 : 0;

  const result = {
    aggregates,
    summary: {
      netPnl,
      grossProfit,
      grossLoss,
      bestDay,
      avgDay,
      winRate,
      totalCompletedTrades
    }
  };

  console.log("=== API CALENDAR RESPONSE (SIMULATED) ===");
  console.log(JSON.stringify(result, null, 2));
}
run();
