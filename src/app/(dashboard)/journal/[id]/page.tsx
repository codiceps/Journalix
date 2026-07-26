'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function TradeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [trade, setTrade] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const fetchTrade = async () => {
      try {
        const res = await fetch(`/api/trades/${id}`);
        if (res.status === 404) {
          setError("Trade tidak ditemukan atau bukan milik Anda.");
          setLoading(false);
          return;
        }
        if (!res.ok) {
          throw new Error("Gagal memuat trade detail");
        }
        const data = await res.json();
        setTrade(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrade();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-4xl text-slate-500">sync</span>
          <p className="text-slate-400 font-mono">Memuat detail trade...</p>
        </div>
      </div>
    );
  }

  if (error || !trade) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] p-8 mt-4 text-center">
        <div className="bg-loss/10 border border-loss text-loss-text px-6 py-4 rounded-lg flex flex-col items-center gap-3 max-w-md">
          <span className="material-symbols-outlined text-4xl">error</span>
          <h2 className="text-xl font-semibold">Trade Tidak Ditemukan</h2>
          <p className="text-sm opacity-80">{error || "Trade ini mungkin telah dihapus atau Anda tidak memiliki akses."}</p>
          <Link href="/journal" className="mt-4 px-4 py-2 bg-loss text-ink rounded font-medium text-sm hover:opacity-90">
            Kembali ke Journal
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (val: number | null) => {
    if (val === null || val === undefined) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
           ' • ' + 
           date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const isLong = trade.direction.toUpperCase() === 'BUY';
  const isOpen = trade.exitPrice === null || trade.exitPrice === undefined;
  
  // Calculate Net PnL if closed
  let netPnl = null;
  if (trade.exitPrice !== null) {
    const multiplier = trade.direction === 'BUY' ? 1 : -1;
    const contractMultiplier = trade.contractMultiplier ?? 1;
    netPnl = (trade.exitPrice - trade.entryPrice) * trade.positionSize * contractMultiplier * multiplier;
  }
  
  const isProfit = netPnl !== null && netPnl >= 0;

  // Calculate R:R
  let riskReward = null;
  if (trade.stopLoss !== null && trade.takeProfit !== null) {
    const risk = Math.abs(trade.entryPrice - trade.stopLoss) * trade.positionSize;
    const reward = Math.abs(trade.takeProfit - trade.entryPrice) * trade.positionSize;
    if (risk > 0) {
      riskReward = reward / risk;
    }
  }

  // Define ALL possible emotions to show inactive ones if needed (optional)
  const allEmotions = ['Disiplin', 'Percaya Diri', 'FOMO', 'Ragu'];
  const tradeEmotions = trade.journalEntry?.emotionTags || [];

  return (
    <main className="flex-1 overflow-y-auto w-full pb-12">
      {/* Breadcrumb & Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Link className="hover:text-primary transition-colors" href="/journal">Journal</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Trade #{trade.id.substring(0, 8)}</span>
          </div>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-slate-50">{trade.pair} {isLong ? 'Long' : 'Short'}</h2>
            {isOpen ? (
               <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-mono uppercase font-bold tracking-wider border border-blue-500/30">
                 OPEN
               </span>
            ) : (
              <span className={`px-2 py-1 rounded text-xs font-mono uppercase font-bold tracking-wider border ${isProfit ? 'bg-profit/20 text-profit-text border-profit/30' : 'bg-loss/20 text-loss-text border-loss/30'}`}>
                {isProfit ? 'WIN' : 'LOSS'}
              </span>
            )}
          </div>
          <div className="text-sm text-slate-400 mt-2">{formatDate(trade.tradeDate)}</div>
        </div>
        <div className="flex gap-2">
          <Link href={`/journal/edit/${trade.id}`} className="px-4 py-2 border border-ink-border text-slate-300 rounded text-sm hover:bg-ink-light transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">edit</span> Edit
          </Link>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Metrics & Tags (1/3 width) */}
        <div className="xl:col-span-1 space-y-6">
          {/* Performance Metrics Card */}
          <div className="bg-ink/50 border border-ink-border backdrop-blur-md rounded-lg p-6 shadow-sm">
            <h3 className="text-sm text-slate-400 font-medium mb-4 uppercase tracking-wider">Execution Metrics</h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <div className="text-sm text-slate-400 mb-1">Entry Price</div>
                <div className="text-[15px] font-mono font-semibold text-slate-50">{formatCurrency(trade.entryPrice)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Exit Price</div>
                <div className="text-[15px] font-mono font-semibold text-slate-50">
                  {isOpen ? <span className="text-slate-500 italic">-</span> : formatCurrency(trade.exitPrice)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Position Size</div>
                <div className="text-[15px] font-mono font-semibold text-slate-50">{trade.positionSize}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Risk / Reward</div>
                <div className="text-[15px] font-mono font-semibold text-slate-50">
                  {riskReward !== null ? `1 : ${riskReward.toFixed(2)}` : '-'}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-ink-border/50">
              <div className="text-sm text-slate-400 mb-1">Net PnL</div>
              <div className={`text-2xl font-bold ${isOpen ? 'text-slate-500' : isProfit ? 'text-profit-text' : 'text-loss-text'}`}>
                {isOpen ? 'Belum ditutup' : (isProfit ? `+${formatCurrency(netPnl)}` : `-${formatCurrency(Math.abs(netPnl!))}`)}
              </div>
            </div>
          </div>

          {/* Emotion / Psych Tags */}
          {trade.journalEntry && (
            <div className="bg-ink/50 border border-ink-border backdrop-blur-md rounded-lg p-6 shadow-sm">
              <h3 className="text-sm text-slate-400 font-medium mb-4 uppercase tracking-wider">Psychology</h3>
              <div className="flex flex-wrap gap-2">
                {allEmotions.map(tag => {
                  const isActive = tradeEmotions.includes(tag);
                  if (!isActive) return null; // Or render as inactive if preferred
                  return (
                    <span key={tag} className="px-3 py-1.5 rounded-full border border-primary text-primary text-xs font-mono bg-primary/10 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">done</span> {tag}
                    </span>
                  );
                })}
                {tradeEmotions.length === 0 && (
                   <span className="text-sm text-slate-500 italic">Tidak ada tag emosi</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Chart & Narrative (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Chart Screenshot */}
          {trade.journalEntry?.screenshotUrl ? (
            <div className="bg-ink/50 rounded-lg overflow-hidden border border-ink-border relative group shadow-sm">
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={trade.journalEntry.screenshotUrl} target="_blank" rel="noopener noreferrer" className="p-2 flex bg-ink-light/80 backdrop-blur rounded border border-ink-border text-slate-50 hover:bg-ink-light transition-colors">
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
              <div className="aspect-video w-full bg-ink relative flex items-center justify-center">
                <img 
                  alt="Trade Chart Screenshot" 
                  className="w-full h-full object-cover" 
                  src={trade.journalEntry.screenshotUrl}
                />
              </div>
            </div>
          ) : (
            <div className="bg-ink/50 rounded-lg border border-dashed border-ink-border aspect-video flex flex-col items-center justify-center text-slate-500">
               <span className="material-symbols-outlined text-4xl mb-2 opacity-50">image_not_supported</span>
               <p className="text-sm">Tidak ada screenshot untuk trade ini</p>
            </div>
          )}

          {/* Narrative / Journal Entry */}
          <div className="bg-ink/50 border border-ink-border backdrop-blur-md rounded-lg p-6 shadow-sm">
            <h3 className="text-sm text-slate-400 font-medium mb-4 uppercase tracking-wider">Trade Narrative</h3>
            {trade.journalEntry?.notes ? (
              <div className="prose prose-invert max-w-none text-slate-50 leading-relaxed whitespace-pre-wrap">
                {trade.journalEntry.notes}
              </div>
            ) : (
              <div className="text-slate-500 italic text-sm py-4 text-center">
                Belum ada catatan jurnal untuk trade ini.
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
