'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface TradeFormData {
  id?: string;
  pair: string;
  direction: 'BUY' | 'SELL';
  positionSize: string;
  entryPrice: string;
  exitPrice: string;
  stopLoss: string;
  takeProfit: string;
  contractMultiplier: string;
  date: string;
  time: string;
  notes: string;
  emotionTags: string[];
  screenshotUrl: string | null;
}

interface TradeFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<TradeFormData>;
}

export default function TradeForm({ mode, initialData }: TradeFormProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    pair: initialData?.pair || '',
    direction: initialData?.direction || 'BUY',
    positionSize: initialData?.positionSize || '',
    entryPrice: initialData?.entryPrice || '',
    exitPrice: initialData?.exitPrice || '',
    stopLoss: initialData?.stopLoss || '',
    takeProfit: initialData?.takeProfit || '',
    contractMultiplier: initialData?.contractMultiplier || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    time: initialData?.time || new Date().toISOString().split('T')[1].substring(0, 5),
    notes: initialData?.notes || '',
  });
  
  const [emotionTags, setEmotionTags] = useState<string[]>(initialData?.emotionTags || []);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [existingScreenshotUrl, setExistingScreenshotUrl] = useState<string | null>(initialData?.screenshotUrl || null);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: [] }));
    }
  };

  const handleTagToggle = (tag: string) => {
    setEmotionTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshotFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setToastMessage('');

    try {
      let tradeDate;
      try {
        tradeDate = new Date(`${formData.date}T${formData.time}`).toISOString();
      } catch (err) {
        setErrors({ tradeDate: ['Format tanggal atau waktu tidak valid'] });
        setIsSubmitting(false);
        return;
      }

      let screenshotPath = mode === 'edit' ? undefined : null;
      if (screenshotFile) {
        const fileFormData = new FormData();
        fileFormData.append('file', screenshotFile);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: fileFormData
        });
        
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          setToastMessage(uploadData.error || 'Gagal mengupload gambar');
          setIsSubmitting(false);
          return;
        }
        screenshotPath = uploadData.path;
      }

      const payload = {
        pair: formData.pair,
        direction: formData.direction,
        positionSize: formData.positionSize ? parseFloat(formData.positionSize) : undefined,
        entryPrice: formData.entryPrice ? parseFloat(formData.entryPrice) : undefined,
        exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
        stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : undefined,
        takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : undefined,
        contractMultiplier: formData.contractMultiplier ? parseFloat(formData.contractMultiplier) : undefined,
        tradeDate,
        notes: formData.notes,
        emotionTags: emotionTags.length > 0 ? emotionTags : undefined,
        ...(screenshotPath !== undefined && { screenshotPath })
      };

      const endpoint = mode === 'edit' && initialData?.id ? `/api/trades/${initialData.id}` : '/api/trades';
      const method = mode === 'edit' ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details && data.details.fieldErrors) {
          setErrors(data.details.fieldErrors);
        } else {
          setToastMessage(data.error || 'Terjadi kesalahan');
        }
      } else {
        setToastMessage(mode === 'edit' ? 'Trade berhasil diupdate!' : 'Trade berhasil disimpan!');
        setTimeout(() => {
          if (mode === 'edit' && initialData?.id) {
            router.push(`/journal/${initialData.id}`);
          } else {
            router.push('/journal');
          }
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setToastMessage('Gagal menghubungi server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto flex justify-center items-start w-full">
      <style dangerouslySetInnerHTML={{__html: `
        .input-minimal {
            background-color: var(--color-ink);
            border: 1px solid var(--color-ink-border);
            color: var(--color-slate-50);
            transition: border-color 0.2s ease;
        }
        .input-minimal:focus {
            border-color: #94a3b8;
            outline: none;
            box-shadow: none;
        }
        .toggle-radio:checked + label {
            background-color: var(--color-ink-light);
            border-color: var(--color-ink-border-hover);
            color: var(--color-slate-50);
        }
        .toggle-radio.buy:checked + label {
            border-left: 3px solid var(--color-profit-bg);
            color: var(--color-profit-text);
        }
        .toggle-radio.sell:checked + label {
            border-left: 3px solid var(--color-loss-bg);
            color: var(--color-loss-text);
        }
      `}} />
      <div className="w-full max-w-3xl bg-ink-light/70 backdrop-blur-md border border-ink-border rounded-xl shadow-lg relative overflow-hidden mt-4 md:mt-8 mb-12">
        {/* Subtle Gradient Header */}
        <div className="h-2 w-full bg-gradient-to-r from-slate-700 via-profit to-slate-700 opacity-50"></div>
        
        <div className="p-6 md:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-50 mb-2">{mode === 'edit' ? 'Edit Trade' : 'Log New Trade'}</h2>
              <p className="text-sm text-slate-400">{mode === 'edit' ? 'Update your trade details and journal.' : 'Record your setup, execution details, and psychological state.'}</p>
            </div>
            <Link href={mode === 'edit' && initialData?.id ? `/journal/${initialData.id}` : "/journal"} className="text-slate-400 hover:text-slate-50 transition-colors flex items-center gap-1 text-sm font-medium">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              {mode === 'edit' ? 'Back to Trade' : 'Back to Journal'}
            </Link>
          </div>

          {toastMessage && (
            <div className={`mb-6 p-4 rounded-lg font-medium text-sm ${toastMessage.includes('berhasil') ? 'bg-profit/20 text-profit-text' : 'bg-loss/20 text-loss-text'}`}>
              {toastMessage}
            </div>
          )}
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Row 1: Instrument & Direction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-mono text-slate-50 uppercase tracking-wider text-xs">Instrument / Pair</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <span className="material-symbols-outlined text-sm">search</span>
                  </span>
                  <input 
                    name="pair"
                    value={formData.pair}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg input-minimal text-base font-mono ${errors.pair ? 'border-loss' : ''}`} 
                    placeholder="e.g. BTC/USD, AAPL, EUR/USD" 
                    type="text" 
                  />
                </div>
                {errors.pair && <p className="text-loss-text text-xs mt-1">{errors.pair[0]}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block font-mono text-slate-50 uppercase tracking-wider text-xs">Direction</label>
                <div className="flex bg-ink rounded-lg p-1 border border-ink-border">
                  <div className="flex-1 relative">
                    <input 
                      className="sr-only toggle-radio buy" 
                      id="dir-buy" 
                      name="direction" 
                      type="radio" 
                      value="BUY" 
                      checked={formData.direction === 'BUY'}
                      onChange={handleChange}
                    />
                    <label className="flex items-center justify-center py-2 px-4 rounded text-sm font-medium cursor-pointer text-slate-400 border border-transparent transition-all duration-200" htmlFor="dir-buy">
                      <span className="material-symbols-outlined text-sm mr-1">trending_up</span> Buy / Long
                    </label>
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      className="sr-only toggle-radio sell" 
                      id="dir-sell" 
                      name="direction" 
                      type="radio" 
                      value="SELL"
                      checked={formData.direction === 'SELL'}
                      onChange={handleChange}
                    />
                    <label className="flex items-center justify-center py-2 px-4 rounded text-sm font-medium cursor-pointer text-slate-400 border border-transparent transition-all duration-200" htmlFor="dir-sell">
                      <span className="material-symbols-outlined text-sm mr-1">trending_down</span> Sell / Short
                    </label>
                  </div>
                </div>
                {errors.direction && <p className="text-loss-text text-xs mt-1">{errors.direction[0]}</p>}
              </div>
            </div>
            
            <hr className="border-ink-border" />
            
            {/* Row 2: Execution Details */}
            <div>
              <h3 className="text-base text-slate-50 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-sm">analytics</span> Execution Data
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block font-mono text-slate-400 text-xs">Position Size</label>
                  <input 
                    name="positionSize"
                    value={formData.positionSize}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg input-minimal text-base font-mono text-right ${errors.positionSize ? 'border-loss' : ''}`} 
                    placeholder="Lots / Units" 
                    step="0.01" 
                    type="number" 
                  />
                  {errors.positionSize && <p className="text-loss-text text-xs mt-1">{errors.positionSize[0]}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-slate-400 text-xs">Entry Price</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-mono text-sm">$</span>
                    <input 
                      name="entryPrice"
                      value={formData.entryPrice}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-4 py-3 rounded-lg input-minimal text-base font-mono text-right ${errors.entryPrice ? 'border-loss' : ''}`} 
                      placeholder="0.00" 
                      step="0.00001" 
                      type="number" 
                    />
                  </div>
                  {errors.entryPrice && <p className="text-loss-text text-xs mt-1">{errors.entryPrice[0]}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-slate-400 text-xs">Exit Price <span className="text-slate-500">(Optional)</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-mono text-sm">$</span>
                    <input 
                      name="exitPrice"
                      value={formData.exitPrice}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-4 py-3 rounded-lg input-minimal text-base font-mono text-right ${errors.exitPrice ? 'border-loss' : ''}`} 
                      placeholder="0.00" 
                      step="0.00001" 
                      type="number" 
                    />
                  </div>
                  {errors.exitPrice && <p className="text-loss-text text-xs mt-1">{errors.exitPrice[0]}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-slate-400 text-xs">Stop Loss <span className="text-slate-500">(Optional)</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-mono text-sm">$</span>
                    <input 
                      name="stopLoss"
                      value={formData.stopLoss}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-4 py-3 rounded-lg input-minimal text-base font-mono text-right ${errors.stopLoss ? 'border-loss' : ''}`} 
                      placeholder="0.00" 
                      step="0.00001" 
                      type="number" 
                    />
                  </div>
                  {errors.stopLoss && <p className="text-loss-text text-xs mt-1">{errors.stopLoss[0]}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-slate-400 text-xs">Take Profit <span className="text-slate-500">(Optional)</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-mono text-sm">$</span>
                    <input 
                      name="takeProfit"
                      value={formData.takeProfit}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-4 py-3 rounded-lg input-minimal text-base font-mono text-right ${errors.takeProfit ? 'border-loss' : ''}`} 
                      placeholder="0.00" 
                      step="0.00001" 
                      type="number" 
                    />
                  </div>
                  {errors.takeProfit && <p className="text-loss-text text-xs mt-1">{errors.takeProfit[0]}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-slate-400 text-xs">Contract Multiplier <span className="text-slate-500">(Optional)</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-mono text-sm">x</span>
                    <input 
                      name="contractMultiplier"
                      value={formData.contractMultiplier}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-4 py-3 rounded-lg input-minimal text-base font-mono text-right ${errors.contractMultiplier ? 'border-loss' : ''}`} 
                      placeholder="1" 
                      step="0.00001" 
                      type="number" 
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono leading-tight">
                    Kosongkan untuk 1 (default crypto). Contoh: 100 untuk emas/XAUUSD, 100000 untuk forex standard lot.
                  </p>
                  {errors.contractMultiplier && <p className="text-loss-text text-xs mt-1">{errors.contractMultiplier[0]}</p>}
                </div>
              </div>
            </div>

            {/* Row 3: Timing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-mono text-slate-50 uppercase tracking-wider text-xs">Date</label>
                <input 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg input-minimal text-base font-mono ${errors.tradeDate ? 'border-loss' : ''}`} 
                  type="date" 
                />
              </div>
              <div className="space-y-2">
                <label className="block font-mono text-slate-50 uppercase tracking-wider text-xs">Time (Local)</label>
                <input 
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg input-minimal text-base font-mono ${errors.tradeDate ? 'border-loss' : ''}`} 
                  type="time" 
                />
              </div>
              {errors.tradeDate && <div className="col-span-2"><p className="text-loss-text text-xs">{errors.tradeDate[0]}</p></div>}
            </div>

            <hr className="border-ink-border" />

            {/* Row 4: Qualitative Data */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 space-y-4">
                <h3 className="text-base text-slate-50 flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-500 text-sm">psychology</span> Psychology & Notes
                </h3>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg input-minimal text-base resize-none" 
                  placeholder="What was your mental state? Did you follow your rules? Describe the setup..." 
                  rows={6}
                />
                <div className="flex gap-2 flex-wrap">
                  {['Disiplin', 'Percaya Diri', 'FOMO', 'Ragu'].map(tag => (
                    <span 
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full border text-xs cursor-pointer transition-colors ${
                        emotionTags.includes(tag) 
                          ? 'border-profit text-profit-text bg-profit/10' 
                          : 'border-ink-border text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      + {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-5 space-y-4 flex flex-col">
                <h3 className="text-base text-slate-50 flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-500 text-sm">image</span> Chart Screenshot
                </h3>
                <div className={`flex-1 min-h-[160px] rounded-lg border-2 border-dashed transition-colors flex flex-col items-center justify-center p-6 cursor-pointer group relative overflow-hidden ${
                  screenshotFile ? 'border-profit bg-profit/5' : 'border-ink-border hover:border-slate-500 bg-ink'
                }`}>
                  <span className={`material-symbols-outlined mb-2 transition-colors text-3xl ${screenshotFile ? 'text-profit-text' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    {screenshotFile ? 'check_circle' : (existingScreenshotUrl && !screenshotFile ? 'image' : 'cloud_upload')}
                  </span>
                  <p className={`text-sm text-center ${screenshotFile ? 'text-profit-text' : 'text-slate-400 group-hover:text-slate-300'}`}>
                    {screenshotFile ? screenshotFile.name : (
                      <>
                        {existingScreenshotUrl ? 'Screenshot exists. Upload new to replace.' : 'Drag & drop image here'}
                        <br/>
                        <span className="text-xs opacity-70">or click to browse (Max 5MB)</span>
                      </>
                    )}
                  </p>
                  <input 
                    accept="image/png, image/jpeg, image/webp" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    type="file" 
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-ink-border flex justify-end gap-4 mt-8">
              <Link href={mode === 'edit' && initialData?.id ? `/journal/${initialData.id}` : "/journal"} className="px-6 py-2.5 rounded text-sm font-medium border border-ink-border text-slate-300 hover:bg-ink-light transition-colors flex items-center">
                Cancel
              </Link>
              <button disabled={isSubmitting} className="px-8 py-2.5 rounded text-sm font-medium bg-profit text-ink hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" type="submit">
                {isSubmitting ? (
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-sm">save</span>
                )}
                {isSubmitting ? 'Saving...' : 'Save Trade'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
