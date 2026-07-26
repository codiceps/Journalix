import prisma from '../src/lib/prisma';
import { getDailyPnlAggregates } from '../src/lib/tradeUtils';

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'active@example.com' }
  });
  
  if (!user) {
    console.log("User active@example.com not found!");
    return;
  }

  const aggregates = await getDailyPnlAggregates(user.id);

  console.log("--- PNL MATRIX DAILY AGGREGATES ---");
  console.log(JSON.stringify(aggregates, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
