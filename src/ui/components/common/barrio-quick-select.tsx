'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { MapPin, TrendingUp } from 'lucide-react';
import { Link } from '@/i18n/navigation';

const BARRIOS = [
  { name: 'Chapinero', count: 24, trending: true },
  { name: 'Usaquén', count: 18, trending: true },
  { name: 'Zona Rosa', count: 15, trending: false },
  { name: 'Chicó', count: 12, trending: false },
  { name: 'Cedritos', count: 11, trending: true },
  { name: 'Teusaquillo', count: 9, trending: false },
  { name: 'La Candelaria', count: 8, trending: false },
  { name: 'Parque 93', count: 7, trending: false },
];

export function BarrioQuickSelect() {
  const t = useTranslations('home');

  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {BARRIOS.map((barrio, i) => (
        <motion.div
          key={barrio.name}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 22 }}
        >
          <Link href={`/discover?location=${encodeURIComponent(barrio.name)}`}>
            <motion.div
              whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 18 } }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full
                bg-card border border-border/50
                hover:border-emerald-500/25 hover:shadow-[var(--shadow-sm)]
                transition-all duration-200 cursor-pointer group"
            >
              <MapPin className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-emerald-500 transition-colors" />
              <span className="text-sm font-medium text-foreground">
                {barrio.name}
              </span>
              <span className="text-xs text-muted-foreground/70">
                {t('barrioBusinessCount', { count: String(barrio.count) })}
              </span>
              {barrio.trending && (
                <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/8 px-1.5 py-0.5 rounded-full">
                  <TrendingUp className="h-2.5 w-2.5" />
                  {t('barrioTrending')}
                </span>
              )}
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
