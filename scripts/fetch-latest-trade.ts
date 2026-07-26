import prisma from '../src/lib/prisma';

async function main() {
  const latestTrade = await prisma.trade.findFirst({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          email: true,
        }
      }
    }
  });

  console.log("Latest Trade in DB:", JSON.stringify(latestTrade, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
