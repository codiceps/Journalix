import prisma from '../src/lib/prisma';

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'active@example.com' }
  });

  if (!user) {
    console.log("User active@example.com not found!");
    return;
  }

  // Trade 1: Lengkap dengan SL & TP (Profit)
  const trade1 = await prisma.trade.create({
    data: {
      userId: user.id,
      pair: "ETH/USD",
      direction: "BUY",
      entryPrice: 3000,
      exitPrice: 3200,
      positionSize: 2,
      stopLoss: 2900,
      takeProfit: 3200,
      tradeDate: new Date(),
    }
  });

  // Trade 2: Tanpa SL & TP (Nullable, tetap bisa submit) (Profit)
  const trade2 = await prisma.trade.create({
    data: {
      userId: user.id,
      pair: "SOL/USD",
      direction: "BUY",
      entryPrice: 100,
      exitPrice: 150,
      positionSize: 10,
      tradeDate: new Date(),
    }
  });

  // Trade 3: Hasil Loss (lengkap dengan SL & TP untuk pengujian R:R loss case)
  const trade3 = await prisma.trade.create({
    data: {
      userId: user.id,
      pair: "BTC/USD",
      direction: "SELL",
      entryPrice: 60000,
      exitPrice: 61000, // Short (SELL) but exit higher => Loss
      positionSize: 0.5,
      stopLoss: 61000,
      takeProfit: 55000,
      tradeDate: new Date(),
    }
  });

  console.log("Successfully created 3 test trades.");
  
  // Output the query from DB
  const trades = await prisma.trade.findMany({
    where: { userId: user.id }
  });
  console.log("All trades for user:", JSON.stringify(trades, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
