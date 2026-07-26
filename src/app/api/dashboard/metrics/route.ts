import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateTradeMetrics } from '@/lib/tradeUtils';

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

    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { tradeDate: 'asc' }
    });

    const tradeMetrics = calculateTradeMetrics(trades);

    return NextResponse.json({
      metrics: {
        totalTrades: tradeMetrics.totalTrades,
        winRate: tradeMetrics.winRate,
        netPnl: tradeMetrics.netPnl,
        avgRiskReward: tradeMetrics.avgRiskReward,
        completedTrades: tradeMetrics.completedTrades
      },
      equityCurve: tradeMetrics.equityCurve
    });

  } catch (error) {
    console.error("Fetch metrics error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
