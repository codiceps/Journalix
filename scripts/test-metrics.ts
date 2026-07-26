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

  const trades = await prisma.trade.findMany({
    where: { userId },
  });

  const totalTrades = trades.length;

  let totalNetPnl = 0;
  let winningTrades = 0;
  
  let totalRiskReward = 0;
  let tradesWithRR = 0;

  for (const trade of trades) {
    if (trade.exitPrice !== null && trade.exitPrice !== undefined) {
      // Calculate Net PnL
      const multiplier = trade.direction.toUpperCase() === 'BUY' ? 1 : -1;
      const pnl = (trade.exitPrice - trade.entryPrice) * trade.positionSize * multiplier;
      totalNetPnl += pnl;

      if (pnl > 0) {
        winningTrades++;
      }
    }

    // Calculate Risk/Reward if stopLoss and takeProfit are present
    if (trade.stopLoss !== null && trade.stopLoss !== undefined && trade.takeProfit !== null && trade.takeProfit !== undefined) {
      const risk = Math.abs(trade.entryPrice - trade.stopLoss) * trade.positionSize;
      const reward = Math.abs(trade.takeProfit - trade.entryPrice) * trade.positionSize;
      
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

  const response = {
    metrics: {
      totalTrades,
      winRate,
      netPnl: totalNetPnl,
      avgRiskReward,
      completedTrades
    }
  };

  console.log("API Response Data:", JSON.stringify(response, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
