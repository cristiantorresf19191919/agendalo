'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-white/[0.04] bg-card/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="text-xl font-bold text-gradient-primary">
              Agendalo
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">{t('footer.explore')}</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">
                {t('search.barbershop')}
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">
                {t('search.spa')}
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">
                {t('search.beautySalon')}
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">
                {t('search.nailSalon')}
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">
                {t('search.aestheticClinic')}
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">{t('footer.legal')}</h4>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer">
                {t('footer.terms')}
              </span>
              <span className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer">
                {t('footer.privacy')}
              </span>
              <span className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer">
                {t('footer.contact')}
              </span>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="section-divider mt-8 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>&copy; 2026 Agendalo. {t('footer.rights')}</p>
          <p className="flex items-center gap-1">
            {t('footer.madeWith')} <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
