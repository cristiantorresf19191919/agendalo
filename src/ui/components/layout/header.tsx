'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown, Sun, Moon, CalendarDays } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/components/common/button';
import { useTheme } from '@/ui/components/common/theme-provider';

const LOCALES = [
  { code: 'es' as const, label: 'Español', flag: '🇨🇴' },
  { code: 'en' as const, label: 'English', flag: '🇺🇸' },
];

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = (next: 'es' | 'en') => {
    router.replace(pathname, { locale: next });
    setLangOpen(false);
  };

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const navLinks = [
    { href: '/', label: t('header.explore') },
    { href: '/pricing', label: t('header.pricing') },
    { href: '/for-businesses', label: t('header.forBusinesses') },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-background/85 backdrop-blur-2xl border-b border-border/40 shadow-[var(--shadow-md)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-5 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[var(--shadow-emerald)] transition-shadow group-hover:shadow-emerald-500/30">
              <CalendarDays className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gradient-primary font-display tracking-tight">Agendalo</span>
          </Link>

          {/* Desktop nav — centered with subtle active indicators */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-emerald-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions — refined spacing */}
          <div className="hidden md:flex items-center gap-1.5">
            {/* Theme toggle — minimal */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Language dropdown — compact */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200',
                  'text-muted-foreground hover:text-foreground hover:bg-muted/60',
                  langOpen && 'bg-muted/60 text-foreground'
                )}
              >
                <span className="text-base leading-none">{currentLocale.flag}</span>
                <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', langOpen && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 top-full mt-2 w-40 rounded-xl bg-card backdrop-blur-2xl border border-border shadow-[var(--shadow-xl)] overflow-hidden"
                  >
                    {LOCALES.map((loc) => (
                      <button
                        key={loc.code}
                        onClick={() => switchLocale(loc.code)}
                        className={cn(
                          'flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors',
                          loc.code === locale
                            ? 'bg-emerald-500/8 text-emerald-600 dark:text-emerald-400 font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                        )}
                      >
                        <span className="text-base leading-none">{loc.flag}</span>
                        <span>{loc.label}</span>
                        {loc.code === locale && (
                          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-5 bg-border/60 mx-1" />

            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-sm">
                {t('auth.login')}
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="text-sm rounded-lg shadow-[var(--shadow-emerald)]">
                {t('auth.register')}
              </Button>
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted/60 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-muted/60 transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile slide panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-card backdrop-blur-2xl border-l border-border p-6 md:hidden"
            >
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted/60 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-3 text-base font-medium text-foreground hover:text-emerald-500 rounded-lg hover:bg-muted/40 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="section-divider my-4" />
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-base font-medium text-foreground hover:text-emerald-500 rounded-lg hover:bg-muted/40 transition-colors">
                  {t('auth.login')}
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-base font-medium text-foreground hover:text-emerald-500 rounded-lg hover:bg-muted/40 transition-colors">
                  {t('auth.register')}
                </Link>
                <div className="section-divider my-4" />
                {/* Mobile language switcher */}
                <div className="space-y-3 px-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" />
                    Idioma / Language
                  </p>
                  <div className="flex gap-2">
                    {LOCALES.map((loc) => (
                      <button
                        key={loc.code}
                        onClick={() => {
                          switchLocale(loc.code);
                          setMobileOpen(false);
                        }}
                        className={cn(
                          'flex items-center gap-2 flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                          loc.code === locale
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                            : 'bg-muted/40 text-muted-foreground border border-border hover:bg-muted/60'
                        )}
                      >
                        <span className="text-base">{loc.flag}</span>
                        {loc.code.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
