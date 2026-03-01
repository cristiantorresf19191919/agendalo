'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Heart, CalendarDays } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.47a8.27 8.27 0 0 0 4.85 1.56V6.58a4.84 4.84 0 0 1-1.09.11z" />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations();

  const socialLinks = [
    { icon: InstagramIcon, label: 'Instagram', href: '#' },
    { icon: TwitterIcon, label: 'X (Twitter)', href: '#' },
    { icon: TikTokIcon, label: 'TikTok', href: '#' },
  ];

  return (
    <footer className="border-t border-border/40 bg-[hsl(var(--surface-1))]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[var(--shadow-emerald)]">
                <CalendarDays className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient-primary font-display tracking-tight">Agendalo</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-muted/50 text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/8 transition-all duration-200"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground font-display">{t('footer.explore')}</h4>
            <nav className="flex flex-col gap-2.5">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('search.barbershop')}
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('search.spa')}
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('search.beautySalon')}
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('search.nailSalon')}
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('search.aestheticClinic')}
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground font-display">{t('footer.company')}</h4>
            <nav className="flex flex-col gap-2.5">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.aboutUs')}
              </Link>
              <Link href="/for-businesses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('header.forBusinesses')}
              </Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('header.pricing')}
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.contact')}
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground font-display">{t('footer.legal')}</h4>
            <nav className="flex flex-col gap-2.5">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.terms')}
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.privacy')}
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-border/40 mt-12 mb-6" />
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
