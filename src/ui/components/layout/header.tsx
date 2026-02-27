'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/components/common/button';

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLocale = () => {
    const next = locale === 'es' ? 'en' : 'es';
    router.replace(pathname, { locale: next });
  };

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-card/70 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/5'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gradient-primary">
            Agendalo
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('header.explore')}
            </Link>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted/50"
            >
              <Globe className="h-4 w-4" />
              {locale.toUpperCase()}
            </button>
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
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
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
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-card/95 backdrop-blur-xl border-l border-white/[0.06] p-6 md:hidden"
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
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="block text-lg font-medium text-foreground hover:text-emerald-400 transition-colors"
                >
                  {t('header.explore')}
                </Link>
                <div className="section-divider my-4" />
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-lg font-medium text-foreground hover:text-emerald-400 transition-colors"
                >
                  {t('auth.login')}
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="block text-lg font-medium text-foreground hover:text-emerald-400 transition-colors"
                >
                  {t('auth.register')}
                </Link>
                <div className="section-divider my-4" />
                <button
                  onClick={() => {
                    toggleLocale();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe className="h-5 w-5" />
                  {locale === 'es' ? 'English' : 'Español'}
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
