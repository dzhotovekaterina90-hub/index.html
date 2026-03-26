'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/generator', label: 'Generator' }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-800 bg-slate-950/95 p-4 md:h-screen md:w-64 md:border-b-0 md:border-r md:p-6">
      <div className="mb-6 flex items-center justify-between md:block">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-400">GeoPilot</p>
          <h1 className="mt-1 text-xl font-semibold text-white">SaaS Console</h1>
        </div>
      </div>

      <nav className="flex gap-2 md:flex-col">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                active ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
