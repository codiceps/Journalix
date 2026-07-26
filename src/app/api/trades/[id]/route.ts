import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { tradeSchema } from "../route";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized: Anda belum login." }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
       return NextResponse.json({ error: "Unauthorized: ID User tidak valid." }, { status: 401 });
    }

    const tradeId = params.id;

    // Ambil data trade beserta journalEntry
    const trade = await prisma.trade.findUnique({
      where: { id: tradeId },
      include: {
        journalEntry: true,
      }
    });

    if (!trade) {
      return NextResponse.json({ error: "Trade tidak ditemukan." }, { status: 404 });
    }

    // Zero-trust: pastikan trade milik user yang login
    if (trade.userId !== userId) {
      // Kita kembalikan 404 untuk menghindari membocorkan keberadaan trade orang lain
      return NextResponse.json({ error: "Trade tidak ditemukan." }, { status: 404 });
    }

    // Jika ada screenshotUrl (yang berupa path supabase), generate signed URL
    let signedScreenshotUrl = null;
    if (trade.journalEntry && trade.journalEntry.screenshotUrl) {
      try {
        const { getSupabaseClient } = await import('@/lib/supabase');
        const supabase = getSupabaseClient();
        
        const { data, error } = await supabase
          .storage
          .from('trade-screenshots')
          .createSignedUrl(trade.journalEntry.screenshotUrl, 60 * 60); // 1 jam = 3600 detik

        if (error) {
          console.error("Supabase Signed URL error:", error);
        } else if (data) {
          signedScreenshotUrl = data.signedUrl;
        }
      } catch (err) {
        console.error("Failed to init Supabase or generate signed URL:", err);
        // Supabase fail, keep signedScreenshotUrl as null but DON'T crash the request
      }
    }

    // Format response agar lebih rapi untuk frontend (replace screenshotUrl original dengan signedUrl)
    const responseData = {
      ...trade,
      journalEntry: trade.journalEntry ? {
        ...trade.journalEntry,
        screenshotUrl: signedScreenshotUrl // timpa dengan signed URL yang bisa diakses client, atau null jika gagal
      } : null
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error("Detail trade error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized: Anda belum login." }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
       return NextResponse.json({ error: "Unauthorized: ID User tidak valid." }, { status: 401 });
    }

    const tradeId = params.id;

    // Check ownership first
    const existingTrade = await prisma.trade.findUnique({
      where: { id: tradeId },
      include: { journalEntry: true }
    });

    if (!existingTrade) {
      return NextResponse.json({ error: "Trade tidak ditemukan." }, { status: 404 });
    }

    if (existingTrade.userId !== userId) {
      return NextResponse.json({ error: "Trade tidak ditemukan." }, { status: 404 });
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
    const hasJournalData = notes || (emotionTags && emotionTags.length > 0) || screenshotPath || existingTrade.journalEntry;

    const updatedTrade = await prisma.trade.update({
      where: { id: tradeId },
      data: {
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
            upsert: {
              create: {
                notes: notes || null,
                emotionTags: emotionTags || [],
                screenshotUrl: screenshotPath || null
              },
              update: {
                notes: notes || null,
                emotionTags: emotionTags || [],
                // only update screenshot if a new one was provided, otherwise keep the old one
                ...(screenshotPath !== undefined && screenshotPath !== null ? { screenshotUrl: screenshotPath } : {})
              }
            }
          }
        })
      },
    });

    return NextResponse.json({ trade: updatedTrade }, { status: 200 });

  } catch (error) {
    console.error("Update trade error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
