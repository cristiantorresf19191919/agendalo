'use client';

import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Scissors,
  Users,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  locale: string;
  translations: {
    overview: string;
    services: string;
    professionals: string;
    calendar: string;
    settings: string;
  };
}

export function Sidebar({ translations }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard/overview' as const, label: translations.overview, icon: LayoutDashboard },
    { href: '/dashboard/services' as const, label: translations.services, icon: Scissors },
    { href: '/dashboard/professionals' as const, label: translations.professionals, icon: Users },
    { href: '/dashboard/settings' as const, label: translations.settings, icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-white/[0.06] bg-card/50 backdrop-blur-xl">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gradient-primary">
          Agendalo
        </h1>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href}>
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <div
                  className={cn(
                    'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive ? 'text-emerald-500' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
