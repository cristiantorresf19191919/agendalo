'use client';

import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  LayoutDashboard,
  Scissors,
  Users,
  Settings,
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  Menu,
  BarChart3,
  Star,
  Gift,
  Heart,
  Bell,
  UsersRound,
  MapPin,
  MessageCircle,
  Repeat,
  CreditCard,
  FileText,
  Instagram,
  Megaphone,
  Home,
  Sparkles,
  Navigation,
  Bot,
  Network,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SidebarProps {
  locale: string;
  translations: {
    overview: string;
    services: string;
    professionals: string;
    calendar: string;
    settings: string;
    analytics?: string;
    reviews?: string;
    loyalty?: string;
    giftCards?: string;
    notifications?: string;
    clients?: string;
    locations?: string;
    whatsapp?: string;
    recurring?: string;
    groupClasses?: string;
    payments?: string;
    invoicing?: string;
    instagram?: string;
    marketing?: string;
    homeService?: string;
    scheduleOptimizer?: string;
    barrioDiscovery?: string;
    beautyAssistant?: string;
    community?: string;
  };
}

export function Sidebar({ translations }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const mainLinks = [
    { href: '/dashboard/overview' as const, label: translations.overview, icon: LayoutDashboard },
    { href: '/dashboard/agenda' as const, label: 'Agenda', icon: CalendarDays },
    { href: '/dashboard/services' as const, label: translations.services, icon: Scissors },
    { href: '/dashboard/professionals' as const, label: translations.professionals, icon: Users },
    { href: '/dashboard/assign-services' as const, label: 'Asignar servicios', icon: CheckSquare },
  ];

  const featureLinks = [
    { href: '/dashboard/analytics' as const, label: translations.analytics ?? 'Analytics', icon: BarChart3 },
    { href: '/dashboard/payments' as const, label: translations.payments ?? 'Pagos', icon: CreditCard },
    { href: '/dashboard/invoicing' as const, label: translations.invoicing ?? 'Facturación', icon: FileText },
    { href: '/dashboard/reviews' as const, label: translations.reviews ?? 'Reseñas', icon: Star },
    { href: '/dashboard/loyalty' as const, label: translations.loyalty ?? 'Fidelización', icon: Heart },
    { href: '/dashboard/gift-cards' as const, label: translations.giftCards ?? 'Gift Cards', icon: Gift },
    { href: '/dashboard/clients' as const, label: translations.clients ?? 'Clientes', icon: UsersRound },
    { href: '/dashboard/notifications' as const, label: translations.notifications ?? 'Notificaciones', icon: Bell },
    { href: '/dashboard/recurring' as const, label: translations.recurring ?? 'Recurrentes', icon: Repeat },
    { href: '/dashboard/group-classes' as const, label: translations.groupClasses ?? 'Clases', icon: UsersRound },
    { href: '/dashboard/locations' as const, label: translations.locations ?? 'Sucursales', icon: MapPin },
    { href: '/dashboard/whatsapp' as const, label: translations.whatsapp ?? 'WhatsApp', icon: MessageCircle },
    { href: '/dashboard/marketing' as const, label: translations.marketing ?? 'Marketing', icon: Megaphone },
    { href: '/dashboard/instagram' as const, label: translations.instagram ?? 'Instagram', icon: Instagram },
    { href: '/dashboard/home-service' as const, label: translations.homeService ?? 'Domicilio', icon: Home },
    { href: '/dashboard/schedule-optimizer' as const, label: translations.scheduleOptimizer ?? 'Optimizador', icon: Sparkles },
    { href: '/dashboard/barrio' as const, label: translations.barrioDiscovery ?? 'Mi barrio', icon: Navigation },
    { href: '/dashboard/beauty-assistant' as const, label: translations.beautyAssistant ?? 'Asistente IA', icon: Bot },
    { href: '/dashboard/community' as const, label: translations.community ?? 'Comunidad', icon: Network },
  ];

  const links = [...mainLinks, ...featureLinks, { href: '/dashboard/settings' as const, label: translations.settings, icon: Settings }];

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center px-4 bg-card/80 backdrop-blur-xl border-b border-white/[0.06]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="ml-3 text-lg font-bold text-gradient-primary">Agendalo</span>
      </div>

      {/* Mobile overlay */}
      {!collapsed && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setCollapsed(true)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative z-50 lg:z-auto flex flex-col border-r border-white/[0.06] bg-card/80 backdrop-blur-xl transition-all duration-300',
          collapsed ? 'lg:w-20 -translate-x-full lg:translate-x-0' : 'lg:w-64 translate-x-0 w-64',
          'h-screen top-0 left-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 h-16">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CalendarDays className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient-primary">Agendalo</span>
            </motion.div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </button>
        </div>

        {/* User card */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-3 mb-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-emerald-500/30">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                  alt="Admin"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">Dulciniana</p>
                <p className="text-xs text-muted-foreground truncate">Administrador</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href}>
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <div
                    className={cn(
                      'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive ? 'text-emerald-400' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30',
                      collapsed && 'justify-center px-2'
                    )}
                    title={collapsed ? link.label : undefined}
                  >
                    <link.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-emerald-400')} />
                    {!collapsed && <span>{link.label}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom branding */}
        {!collapsed && (
          <div className="p-4 border-t border-white/[0.04]">
            <p className="text-[10px] text-muted-foreground/50 text-center">
              Agendalo Business v1.0
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
