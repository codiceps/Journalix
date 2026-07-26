'use client';

import { signOut } from 'next-auth/react';

export default function TopNavbar() {
  return (
    <nav className="fixed w-[calc(100%-240px)] ml-60 top-0 z-40 bg-ink border-b border-ink-border flex justify-end items-center h-16 px-6">
      <div className="flex items-center gap-4">
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
