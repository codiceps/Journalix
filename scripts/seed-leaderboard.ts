import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function run() {
  // Create 2 test users
  const pwd = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'protrader@example.com' },
    update: {},
    create: {
      email: 'protrader@example.com',
      name: 'Pro Trader',
      password: pwd,
      role: 'TRADER',
      status: 'ACTIVE',
      isPublicProfile: true
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'newbie@example.com' },
    update: {},
    create: {
      email: 'newbie@example.com',
      name: 'Newbie Trader',
      password: pwd,
      role: 'TRADER',
      status: 'ACTIVE',
      isPublicProfile: true
    }
  });

  // Seed trades for Pro Trader (Perfect consistency, high win rate)
  await prisma.trade.createMany({
    data: [
      { userId: user1.id, pair: 'BTC/USD', direction: 'LONG', entryPrice: 60000, exitPrice: 61000, positionSize: 1, tradeDate: new Date('2026-07-01') },
      { userId: user1.id, pair: 'ETH/USD', direction: 'LONG', entryPrice: 3000, exitPrice: 3200, positionSize: 2, tradeDate: new Date('2026-07-02') },
      { userId: user1.id, pair: 'SOL/USD', direction: 'SHORT', entryPrice: 150, exitPrice: 140, positionSize: 10, tradeDate: new Date('2026-07-03') },
    ]
  });

  // Seed trades for Newbie Trader (Some wins, some losses, bad profit factor)
  await prisma.trade.createMany({
    data: [
      { userId: user2.id, pair: 'DOGE/USD', direction: 'LONG', entryPrice: 0.10, exitPrice: 0.15, positionSize: 10000, tradeDate: new Date('2026-07-01') }, // +500
      { userId: user2.id, pair: 'BTC/USD', direction: 'LONG', entryPrice: 65000, exitPrice: 64000, positionSize: 1, tradeDate: new Date('2026-07-02') }, // -1000
      { userId: user2.id, pair: 'SOL/USD', direction: 'LONG', entryPrice: 160, exitPrice: 150, positionSize: 50, tradeDate: new Date('2026-07-03') }, // -500
    ]
  });

  console.log("Seeded 2 users and trades.");
}

run();
