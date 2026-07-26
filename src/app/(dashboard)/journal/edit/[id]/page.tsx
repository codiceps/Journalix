import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import TradeForm from "@/app/components/TradeForm";

export default async function EditTradePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  const userId = (session.user as any).id;
  const tradeId = params.id;

  const trade = await prisma.trade.findUnique({
    where: { id: tradeId },
    include: { journalEntry: true }
  });

  if (!trade || trade.userId !== userId) {
    redirect('/404');
  }

  // Format data for form
  const initialData = {
    id: trade.id,
    pair: trade.pair,
    direction: trade.direction as 'BUY' | 'SELL',
    positionSize: trade.positionSize.toString(),
    entryPrice: trade.entryPrice.toString(),
    exitPrice: trade.exitPrice !== null ? trade.exitPrice.toString() : '',
    stopLoss: trade.stopLoss !== null ? trade.stopLoss.toString() : '',
    takeProfit: trade.takeProfit !== null ? trade.takeProfit.toString() : '',
    contractMultiplier: trade.contractMultiplier !== null ? trade.contractMultiplier.toString() : '',
    date: new Date(trade.tradeDate).toISOString().split('T')[0],
    time: new Date(trade.tradeDate).toISOString().split('T')[1].substring(0, 5),
    notes: trade.journalEntry?.notes || '',
    emotionTags: trade.journalEntry?.emotionTags || [],
    screenshotUrl: trade.journalEntry?.screenshotUrl || null
  };

  return <TradeForm mode="edit" initialData={initialData} />;
}
