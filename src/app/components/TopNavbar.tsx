'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function TopNavbar() {
  return (
    <nav className="fixed w-full lg:w-[calc(100%-240px)] lg:ml-60 top-0 z-40 bg-ink border-b border-ink-border flex justify-between lg:justify-end items-center h-16 px-6">
      <div className="flex lg:hidden items-center">
        <img src="/images/Journalix1.png" alt="Journalix Logo" className="hidden dark:block h-8 w-auto object-contain" />
        <img src="/images/Journalix2.png" alt="Journalix Logo" className="block dark:hidden h-8 w-auto object-contain" />
      </div>
      <div className="flex items-center gap-4">
        {/* Mobile New Trade Button */}
        <div className="flex lg:hidden items-center">
          <Link href="/journal/new" className="bg-profit text-ink font-sans text-sm font-medium py-1.5 px-3 rounded-lg hover:opacity-90 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>add</span>
            Trade
          </Link>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-ink-light border border-ink-border text-slate-400 hover:text-error hover:border-error/30 shadow-sm btn-interactive"
          title="Keluar"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
        </button>
      </div>
    </nav>
  );
}
