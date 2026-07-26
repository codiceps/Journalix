import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { getDailyPnlAggregates } from '@/lib/tradeUtils';
import { z } from 'zod';

const calendarQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized: Anda belum login." }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
       return NextResponse.json({ error: "Unauthorized: ID User tidak valid." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsed = calendarQuerySchema.safeParse({
      year: searchParams.get('year'),
      month: searchParams.get('month')
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid year or month parameter." }, { status: 400 });
    }

    const { year, month } = parsed.data;

    // Use JS local timezone logic if possible, or UTC. Since Prisma uses UTC, we should align.
    // However, JS Date(year, monthIndex) creates local dates. 
    // Let's use local date range so that it aligns with user's calendar view.
    // 0 = January, 11 = December.
    const monthIndex = month - 1;
    
    // First day of the month at 00:00:00
    const startDate = new Date(year, monthIndex, 1, 0, 0, 0, 0);
    // Last day of the month at 23:59:59.999
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

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
    
    // We compute Avg Day based on days that have completed trades (realized PnL).
    const daysWithRealizedPnl = aggregates.filter(d => d.completedTradesCount > 0).length;
    const avgDay = daysWithRealizedPnl > 0 ? netPnl / daysWithRealizedPnl : 0;
    const winRate = totalCompletedTrades > 0 ? (totalWinningTrades / totalCompletedTrades) * 100 : 0;

    return NextResponse.json({
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
    }, { status: 200 });
  } catch (error) {
    console.error("Calendar aggregate error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
