import prisma from '../src/lib/prisma';

async function run() {
  const tradeOpen = 'cmrvolg8q0000qkuhsa7vyu30'; // Open trade
  // Let's create a closed trade with full journal
  const userId = 'cmrt5v6pm00001cuhvkg9u5fn';
  
  const closedWithJournal = await prisma.trade.create({
    data: {
      userId,
      pair: 'SOL/USD',
      direction: 'SELL',
      entryPrice: 150,
      exitPrice: 140, // Winner!
      positionSize: 10,
      tradeDate: new Date(),
      journalEntry: {
        create: {
          notes: 'Perfect short setup on the 1H timeframe.',
          emotionTags: ['Disiplin', 'Percaya Diri'],
          // Dummy screenshot path
          screenshotUrl: 'cmrt5v6pm00001cuhvkg9u5fn/dummy.png'
        }
      }
    }
  });
  console.log("Created Closed Trade with Journal:", closedWithJournal.id);
}
run();
