import prisma from '../src/lib/prisma';

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'active@example.com' }
  });
  
  if (!user) {
    console.log("User active@example.com not found!");
    return;
  }
  
  const userId = user.id;

  // 1. Fetch metrics (including equity curve)
  const tradesForMetrics = await prisma.trade.findMany({
    where: { userId },
    orderBy: { tradeDate: 'asc' }
  });

  let totalNetPnl = 0;
  const equityCurve = [];

  for (const trade of tradesForMetrics) {
    if (trade.exitPrice !== null && trade.exitPrice !== undefined) {
      const multiplier = trade.direction.toUpperCase() === 'BUY' ? 1 : -1;
      const pnl = (trade.exitPrice - trade.entryPrice) * trade.positionSize * multiplier;
      totalNetPnl += pnl;
      
      equityCurve.push({
        date: trade.tradeDate,
        equity: totalNetPnl
      });
    }
  }

  console.log("--- EQUITY CURVE ---");
  console.log(JSON.stringify(equityCurve, null, 2));

  // 2. Fetch Recent Executions (limit=5)
  const recentTrades = await prisma.trade.findMany({
    where: { userId },
    orderBy: { tradeDate: 'desc' },
    take: 5
  });

  const recentWithPnL = recentTrades.map(trade => {
    let netPnl = null;
    if (trade.exitPrice !== null && trade.exitPrice !== undefined) {
      const multiplier = trade.direction.toUpperCase() === 'BUY' ? 1 : -1;
      netPnl = (trade.exitPrice - trade.entryPrice) * trade.positionSize * multiplier;
    }
    return {
      id: trade.id,
      pair: trade.pair,
      direction: trade.direction,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice,
      netPnl,
      tradeDate: trade.tradeDate
    };
  });

  console.log("\n--- RECENT EXECUTIONS (GET /api/trades?limit=5) ---");
  console.log(JSON.stringify(recentWithPnL, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
