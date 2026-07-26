import React from 'react';
import ProfileForm from '@/app/components/ProfileForm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { calculateTradeMetrics, getDailyPnlAggregates, calculateMilestones } from '@/lib/tradeUtils';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect('/login');
  }
  
  const userId = (session.user as any).id;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { trades: true }
  });
  
  if (!user) {
    redirect('/login');
  }
  
  const metrics = calculateTradeMetrics(user.trades);
  
  const stats = {
    totalPnl: metrics.netPnl,
    winRate: metrics.winRate,
    profitFactor: metrics.profitFactor,
    totalTrades: metrics.completedTrades
  };

  const preferences = {
    isDarkMode: user.isDarkMode,
    emailNotifications: user.emailNotifications,
    isPublicProfile: user.isPublicProfile
  };

  const userData = {
    name: user.name || user.email.split('@')[0],
    email: user.email,
    role: user.role === 'ADMIN' ? 'ADMIN' : 'PRO TIER' // Hardcoded visual for role in UI based on design, adjust if needed
  };

  const dailyAggregates = await getDailyPnlAggregates(userId);
  const milestones = calculateMilestones(dailyAggregates);

  return (
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <ProfileForm 
        stats={stats}
        preferences={preferences}
        userData={userData}
        milestones={milestones}
      />
    </main>
  );
}
