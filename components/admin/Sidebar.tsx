'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Articles', href: '/admin/articles', icon: 'FileText' },
  { label: 'Myths', href: '/admin/myths', icon: 'Lightbulb' },
  { label: 'Resources', href: '/admin/resources', icon: 'FolderOpen' },
  { label: 'Games', href: '/admin/games', icon: 'Gamepad2' },
  { label: 'Glossary', href: '/admin/glossary', icon: 'BookOpen' },
  { label: 'Inquiries', href: '/admin/inquiries', icon: 'MessageSquare' },
  { label: 'Subscribers', href: '/admin/subscribers', icon: 'Users' },
  { label: 'Analytics', href: '/admin/analytics', icon: 'BarChart3' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
];

// Simple icon renderer (placeholder for Lucide icons)
function NavIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    LayoutDashboard: '📊',
    FileText: '📝',
    Lightbulb: '💡',
    FolderOpen: '📂',
    Gamepad2: '🎮',
    BookOpen: '📖',
    MessageSquare: '💬',
    Users: '👥',
    BarChart3: '📈',
    Settings: '⚙️',
  };
  return <span className="text-base w-5 text-center">{icons[name] || '•'}</span>;
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#1c1c1e] text-white flex flex-col z-40">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#1a3c2a] flex items-center justify-center">
            <span className="text-white font-bold text-xs">PF</span>
          </div>
          <div>
            <p className="text-sm font-bold">Paper Foundation</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || 
              (item.href !== '/admin' && pathname?.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors
                    ${
                      active
                        ? 'bg-[#1a3c2a] text-white font-medium'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#1a3c2a] flex items-center justify-center text-xs font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-white/40 truncate">admin@paperfoundation.in</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
