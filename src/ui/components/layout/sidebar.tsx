'use client';

import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  LayoutDashboard,
  Scissors,
  Users,
  Settings,
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  ChevronDown,
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
  Search,
  LogOut,
  HelpCircle,
  X,
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

interface NavGroup {
  title: string;
  items: { href: string; label: string; icon: typeof LayoutDashboard; badge?: string | number }[];
}

export function Sidebar({ translations }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    main: true,
    business: true,
    engagement: false,
    channels: false,
    latam: false,
  });

  const navGroups: NavGroup[] = [
    {
      title: 'main',
      items: [
        { href: '/dashboard/overview', label: translations.overview, icon: LayoutDashboard },
        { href: '/dashboard/agenda', label: 'Agenda', icon: CalendarDays, badge: 8 },
        { href: '/dashboard/services', label: translations.services, icon: Scissors },
        { href: '/dashboard/professionals', label: translations.professionals, icon: Users },
        { href: '/dashboard/assign-services', label: 'Asignar', icon: CheckSquare },
      ],
    },
    {
      title: 'business',
      items: [
        { href: '/dashboard/analytics', label: translations.analytics ?? 'Analytics', icon: BarChart3 },
        { href: '/dashboard/payments', label: translations.payments ?? 'Pagos', icon: CreditCard, badge: '$' },
        { href: '/dashboard/invoicing', label: translations.invoicing ?? 'Facturación', icon: FileText },
        { href: '/dashboard/clients', label: translations.clients ?? 'Clientes', icon: UsersRound },
        { href: '/dashboard/locations', label: translations.locations ?? 'Sucursales', icon: MapPin },
      ],
    },
    {
      title: 'engagement',
      items: [
        { href: '/dashboard/reviews', label: translations.reviews ?? 'Reseñas', icon: Star, badge: 3 },
        { href: '/dashboard/loyalty', label: translations.loyalty ?? 'Fidelización', icon: Heart },
        { href: '/dashboard/giftCards', label: translations.giftCards ?? 'Gift Cards', icon: Gift },
        { href: '/dashboard/notifications', label: translations.notifications ?? 'Notificaciones', icon: Bell, badge: 5 },
        { href: '/dashboard/recurring', label: translations.recurring ?? 'Recurrentes', icon: Repeat },
        { href: '/dashboard/groupClasses', label: translations.groupClasses ?? 'Clases', icon: UsersRound },
      ],
    },
    {
      title: 'channels',
      items: [
        { href: '/dashboard/whatsapp', label: translations.whatsapp ?? 'WhatsApp', icon: MessageCircle },
        { href: '/dashboard/marketing', label: translations.marketing ?? 'Marketing', icon: Megaphone },
        { href: '/dashboard/instagram', label: translations.instagram ?? 'Instagram', icon: Instagram },
      ],
    },
    {
      title: 'latam',
      items: [
        { href: '/dashboard/homeService', label: translations.homeService ?? 'Domicilio', icon: Home },
        { href: '/dashboard/scheduleOptimizer', label: translations.scheduleOptimizer ?? 'Optimizador', icon: Sparkles },
        { href: '/dashboard/barrioDiscovery', label: translations.barrioDiscovery ?? 'Mi barrio', icon: Navigation },
        { href: '/dashboard/beautyAssistant', label: translations.beautyAssistant ?? 'Asistente IA', icon: Bot },
        { href: '/dashboard/community', label: translations.community ?? 'Comunidad', icon: Network },
      ],
    },
  ];

  const groupLabels: Record<string, string> = {
    main: 'General',
    business: 'Negocio',
    engagement: 'Engagement',
    channels: 'Canales',
    latam: 'LATAM Features',
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const allItems = navGroups.flatMap((g) => g.items);
  const filteredItems = searchQuery.trim()
    ? allItems.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  const settingsLink = { href: '/dashboard/settings', label: translations.settings, icon: Settings };

  const renderNavItem = (link: typeof settingsLink & { badge?: string | number }, showBadge = true) => {
    const isActive = pathname.startsWith(link.href);
    return (
      <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
        <div className="relative">
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-0 rounded-lg bg-emerald-500/8 border border-emerald-500/15"
              transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
            />
          )}
          <div
            className={cn(
              'relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
              isActive ? 'text-emerald-400' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? link.label : undefined}
          >
            <link.icon className={cn('h-[18px] w-[18px] shrink-0', isActive && 'text-emerald-400')} />
            {!collapsed && (
              <>
                <span className="truncate">{link.label}</span>
                {showBadge && link.badge && (
                  <span className={cn(
                    'ml-auto text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full',
                    typeof link.badge === 'number'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-amber-500/15 text-amber-400'
                  )}>
                    {link.badge}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 h-16 shrink-0">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CalendarDays className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gradient-primary font-display">Agendalo</span>
          </motion.div>
        )}
        {collapsed && (
          <div className="mx-auto h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CalendarDays className="h-4 w-4 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-muted-foreground"
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Search (desktop expanded only) */}
      {!collapsed && (
        <div className="px-3 mb-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border text-muted-foreground focus-within:border-emerald-500/20 focus-within:text-muted-foreground transition-colors">
            <Search className="h-3.5 w-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>
      )}

      {/* User card */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-full overflow-hidden ring-2 ring-emerald-500/20">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                alt="Admin"
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate font-display">Dulciniana</p>
              <p className="text-[11px] text-muted-foreground truncate">Admin · Barbería Urbana</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {filteredItems ? (
          <div className="space-y-0.5">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => renderNavItem(item))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">No results</p>
            )}
          </div>
        ) : (
          navGroups.map((group) => (
            <div key={group.title} className="mb-1">
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="flex items-center justify-between w-full px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground/60 transition-colors"
                >
                  <span>{groupLabels[group.title]}</span>
                  <ChevronDown className={cn('h-3 w-3 transition-transform', !expandedGroups[group.title] && '-rotate-90')} />
                </button>
              )}
              <AnimatePresence initial={false}>
                {(collapsed || expandedGroups[group.title]) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden space-y-0.5"
                  >
                    {group.items.map((item) => renderNavItem(item))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}

        {/* Settings always visible */}
        <div className="pt-2 border-t border-border/50 mt-2">
          {renderNavItem(settingsLink, false)}
        </div>
      </nav>

      {/* Bottom area */}
      {!collapsed && (
        <div className="p-3 border-t border-border/50 space-y-1 shrink-0">
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-muted-foreground hover:bg-muted/30 transition-colors">
            <HelpCircle className="h-[18px] w-[18px]" />
            <span>Help & Support</span>
          </button>
          <Link href="/">
            <div className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-rose-400 hover:bg-rose-500/5 transition-colors">
              <LogOut className="h-[18px] w-[18px]" />
              <span>Exit Dashboard</span>
            </div>
          </Link>
          <p className="text-[10px] text-muted-foreground/50 text-center pt-2">
            Agendalo Business v1.0
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center px-4 bg-[hsl(var(--surface-1))]/95 backdrop-blur-xl border-b border-border">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
        <span className="ml-3 text-lg font-bold text-gradient-primary font-display">Agendalo</span>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative z-50 lg:z-auto flex flex-col border-r border-border bg-[hsl(var(--surface-0))] transition-all duration-300',
          collapsed ? 'lg:w-[72px]' : 'lg:w-64',
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 w-72',
          'h-screen top-0 left-0'
        )}
      >
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {sidebarContent}
      </aside>
    </>
  );
}
