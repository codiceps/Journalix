'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ user }: { user?: { name?: string | null, email?: string | null, role?: string | null } }) {
  const role = user?.role || 'TRADER';
  const pathname = usePathname();

  let navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { label: 'Calendar', href: '/calendar', icon: 'calendar_month' },
    { label: 'Journal', href: '/journal', icon: 'auto_stories' },
    { label: 'Community', href: '/community', icon: 'groups' },
    { label: 'Profile', href: '/profile', icon: 'person' },
  ];

  if (role === 'ADMIN') {
    navItems = [
      { label: 'Community', href: '/community', icon: 'groups' },
      { label: 'Admin Panel', href: '/admin', icon: 'shield_person' },
    ];
  }

  return (
    <aside className="fixed h-screen w-60 left-0 top-0 bg-ink-light border-r border-ink-border flex flex-col py-8 z-50">
      {/* Brand */}
      {role !== 'ADMIN' && (
        <div className="px-6 mb-8 flex flex-col gap-1">
          <div className="mb-2">
            <img src="/images/Journalix1.png" alt="Journalix Logo" className="hidden dark:block h-16 w-auto object-contain" />
            <img src="/images/Journalix2.png" alt="Journalix Logo" className="block dark:hidden h-16 w-auto object-contain" />
          </div>
        </div>
      )}

      {/* CTA */}
      {role !== 'ADMIN' && (
        <div className="px-6 mb-8">
          <Link href="/journal/new" className="w-full bg-profit text-ink font-sans text-base font-medium py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>add</span>
            New Trade
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg scale-100 active:scale-95 transition-all duration-150 border-r-2 ${isActive
                ? 'text-profit-text font-bold border-profit bg-ink-border'
                : 'text-slate-400 font-medium hover:text-slate-50 hover:bg-ink-border border-transparent'
                }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Mini Profile at bottom */}
      <div className="px-6 mt-auto">
        <Link href="/profile" className="pt-4 border-t border-ink-border flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-ink-border overflow-hidden flex items-center justify-center text-slate-50 font-bold text-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-sans font-medium text-slate-50 truncate">{user?.name || 'Unknown User'}</span>
            <span className="text-[12px] font-mono text-slate-400 truncate">{user?.email || role}</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
