'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown, Sun, Moon } from 'lucide-react';
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
    const onScroll = () => setScrolled(window.scrollY > 20);
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

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5 dark:shadow-black/10'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <span className="text-xl font-bold text-gradient-primary font-display">Agendalo</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('header.explore')}
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('header.pricing')}
            </Link>
            <Link
              href="/for-businesses"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('header.forBusinesses')}
            </Link>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Language dropdown */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl transition-all duration-200',
                  'text-muted-foreground hover:text-foreground',
                  'hover:bg-muted/50 border border-transparent',
                  langOpen && 'bg-muted/50 border-border text-foreground'
                )}
              >
                <span className="text-base leading-none">{currentLocale.flag}</span>
                <span>{currentLocale.code.toUpperCase()}</span>
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', langOpen && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl shadow-black/20 dark:shadow-black/40 overflow-hidden"
                  >
                    {LOCALES.map((loc) => (
                      <button
                        key={loc.code}
                        onClick={() => switchLocale(loc.code)}
                        className={cn(
                          'flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors',
                          loc.code === locale
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        <span className="text-lg leading-none">{loc.flag}</span>
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

            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                {t('auth.login')}
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="cta" size="sm">
                {t('auth.register')}
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
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
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
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
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-card/95 backdrop-blur-xl border-l border-border p-6 md:hidden"
            >
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-4">
                <Link href="/" onClick={() => setMobileOpen(false)} className="block text-lg font-medium text-foreground hover:text-emerald-500 transition-colors">
                  {t('header.explore')}
                </Link>
                <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block text-lg font-medium text-foreground hover:text-emerald-500 transition-colors">
                  {t('header.pricing')}
                </Link>
                <Link href="/for-businesses" onClick={() => setMobileOpen(false)} className="block text-lg font-medium text-foreground hover:text-emerald-500 transition-colors">
                  {t('header.forBusinesses')}
                </Link>
                <div className="section-divider my-4" />
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="block text-lg font-medium text-foreground hover:text-emerald-500 transition-colors">
                  {t('auth.login')}
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="block text-lg font-medium text-foreground hover:text-emerald-500 transition-colors">
                  {t('auth.register')}
                </Link>
                <div className="section-divider my-4" />
                {/* Mobile language switcher */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <Globe className="h-3.5 w-3.5 inline mr-1.5" />
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
                          'flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                          loc.code === locale
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-muted/50 text-muted-foreground border border-border hover:bg-muted'
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
