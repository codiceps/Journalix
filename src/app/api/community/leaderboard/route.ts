import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateTradeMetrics } from '@/lib/tradeUtils';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    let currentUserId: string | null = null;
    
    if (session && session.user) {
      currentUserId = (session.user as any).id;
    }
    // Leaderboard bisa diakses tanpa login? PRD bilang untuk sprint ini leaderboard opt-out dan
    // "Your Rank" dihitung dari posisi user login. Kalau belum login, mungkin yourRank = null.
    // Tapi karena ini /api/community/leaderboard, kita biarkan bisa akses atau harus login? 
    // Saya akan wajibkan login karena Dashboard dan Journalix secara umum dibelakang login.
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Ambil semua trader yang aktif dan profilnya publik
    const users = await prisma.user.findMany({
      where: {
        status: 'ACTIVE',
        isPublicProfile: true
      },
      include: {
        trades: true
      }
    });

    // 2. Hitung metrics tiap user
    const leaderboardData = [];
    
    for (const user of users) {
      const metrics = calculateTradeMetrics(user.trades);
      
      // Kecualikan yang belum punya trade berstatus close (0 completed trades)
      if (metrics.completedTrades > 0) {
        leaderboardData.push({
          userId: user.id,
          name: user.name || user.email.split('@')[0],
          winRate: metrics.winRate,
          profitFactor: metrics.profitFactor,
          netPnl: metrics.netPnl,
          grossProfit: metrics.grossProfit,
          grossLoss: metrics.grossLoss,
          completedTrades: metrics.completedTrades
        });
      }
    }

    // 3. Sorting (Ranking Engine)
    // Skema: Profit Factor DESC (null tertinggi jika GP>0, null terendah jika GP=0) -> Win Rate DESC -> Net PnL DESC
    leaderboardData.sort((a, b) => {
      // Helper function untuk mendapatkan skor sorting profit factor
      // - Infinity untuk Perfect
      // - Infinity negatif untuk Zero
      // - Nilai asli untuk finite
      const getPfScore = (item: any) => {
        if (item.profitFactor === null) {
          if (item.grossProfit > 0) return Number.MAX_VALUE; // Perfect
          return -Number.MAX_VALUE; // No profit no loss
        }
        return item.profitFactor;
      };

      const pfA = getPfScore(a);
      const pfB = getPfScore(b);

      if (pfA !== pfB) {
        return pfB - pfA; // DESC
      }

      // Tie-break 1: Win Rate DESC
      if (a.winRate !== b.winRate) {
        return b.winRate - a.winRate;
      }

      // Tie-break 2: Net PnL DESC
      return b.netPnl - a.netPnl;
    });

    // 4. Hitung urutan (Rank) dan temukan rank user login
    let yourRank = null;
    let yourData = null;

    const rankedData = leaderboardData.map((item, index) => {
      const rank = index + 1;
      
      // Deteksi badge
      const badges = [];
      if (item.profitFactor === null && item.grossProfit > 0 && item.completedTrades >= 5) {
        badges.push("Perfect Consistency");
      } else if (item.profitFactor !== null && item.profitFactor > 2 && item.completedTrades >= 5) {
        badges.push("Top Consistency");
      }
      
      const entry = {
        rank,
        userId: item.userId,
        name: item.name,
        winRate: item.winRate,
        profitFactor: item.profitFactor,
        netPnl: item.netPnl,
        badges,
        isCurrentUser: item.userId === currentUserId
      };

      if (item.userId === currentUserId) {
        yourRank = rank;
        yourData = entry;
      }

      return entry;
    });

    // Jika user login tidak ada di leaderboard (isPublicProfile false, atau 0 trades), yourRank tetap null
    // Tapi kita bisa memberikan data rank "N/A".
    
    return NextResponse.json({
      leaderboard: rankedData,
      yourRank: yourRank,
      yourData: yourData
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch leaderboard error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
