import prisma from '../src/lib/prisma';
async function run() {
  const trades = await prisma.trade.findMany({
    where: { user: { email: 'active@example.com' } },
    orderBy: { tradeDate: 'asc' },
    select: { id: true, tradeDate: true, entryPrice: true, exitPrice: true, direction: true, pair: true }
  });
  console.log("Total trades:", trades.length);
  trades.forEach(t => console.log(`${t.tradeDate.toISOString().split('T')[0]} | ${t.pair} | Entry: ${t.entryPrice} | Exit: ${t.exitPrice}`));
  await prisma.$disconnect();
}
run().catch(console.error);
