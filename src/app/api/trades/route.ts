import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

export const tradeSchema = z.object({
  pair: z.string().min(1, "Pair wajib diisi"),
  direction: z.enum(["Buy", "Sell", "BUY", "SELL"], { message: "Direction harus BUY atau SELL" }),
  entryPrice: z.number().positive("Harga masuk harus positif"),
  exitPrice: z.number().positive("Harga keluar harus positif").optional().nullable(),
  positionSize: z.number().positive("Ukuran posisi harus positif"),
  stopLoss: z.number().positive("Stop loss harus positif").optional().nullable(),
  takeProfit: z.number().positive("Take profit harus positif").optional().nullable(),
  contractMultiplier: z.number().positive("Contract multiplier harus positif").optional(),
  tradeDate: z.string().datetime({ message: "Format tanggal tidak valid (gunakan ISO-8601)" }),
  // Journal fields
  notes: z.string().optional().nullable(),
  emotionTags: z.array(z.string()).optional(),
  screenshotPath: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized: Anda belum login." }, { status: 401 });
    }

    const userId = (session.user as any).id;

    if (!userId) {
       return NextResponse.json({ error: "Unauthorized: ID User tidak valid." }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = tradeSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const { pair, direction, entryPrice, exitPrice, positionSize, stopLoss, takeProfit, contractMultiplier, tradeDate, notes, emotionTags, screenshotPath } = validatedData.data;

    // Check if there is journal data
    const hasJournalData = notes || (emotionTags && emotionTags.length > 0) || screenshotPath;

    const newTrade = await prisma.trade.create({
      data: {
        userId,
        pair,
        direction: direction.toUpperCase(),
        entryPrice,
        exitPrice,
        positionSize,
        stopLoss,
        takeProfit,
        contractMultiplier: contractMultiplier ?? 1,
        tradeDate: new Date(tradeDate),
        ...(hasJournalData && {
          journalEntry: {
            create: {
              notes: notes || null,
              emotionTags: emotionTags || [],
              screenshotUrl: screenshotPath || null
            }
          }
        })
      },
    });

    return NextResponse.json({ message: "Trade berhasil ditambahkan", trade: newTrade }, { status: 201 });
  } catch (error) {
    console.error("Create trade error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

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
    const limit = searchParams.get('limit');
    
    const queryOptions: any = {
      where: { userId },
      orderBy: { tradeDate: 'desc' },
    };

    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit)) {
        queryOptions.take = parsedLimit;
      }
    }

    const trades = await prisma.trade.findMany(queryOptions);

    // Calculate Net PnL for each trade to simplify frontend
    const recentTrades = trades.map(trade => {
      let netPnl = null;
      if (trade.exitPrice !== null && trade.exitPrice !== undefined) {
        const multiplier = trade.direction.toUpperCase() === 'BUY' ? 1 : -1;
        const contractMultiplier = trade.contractMultiplier ?? 1;
        netPnl = (trade.exitPrice - trade.entryPrice) * trade.positionSize * contractMultiplier * multiplier;
      }
      return {
        ...trade,
        netPnl
      };
    });

    return NextResponse.json({ trades: recentTrades }, { status: 200 });
  } catch (error) {
    console.error("Get trades error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
