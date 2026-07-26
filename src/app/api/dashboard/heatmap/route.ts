import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { getDailyPnlAggregates } from '@/lib/tradeUtils';

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

    const aggregates = await getDailyPnlAggregates(userId);

    return NextResponse.json({ aggregates }, { status: 200 });
  } catch (error) {
    console.error("Heatmap aggregate error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
