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
    <div className="flex flex-wrap justify-center gap-3">
      {BARRIOS.map((barrio, i) => (
        <motion.div
          key={barrio.name}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Link href={`/discover?location=${encodeURIComponent(barrio.name)}`}>
            <motion.div
              whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full
                bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60
                hover:border-emerald-500/30 hover:bg-emerald-500/5
                transition-colors duration-200 cursor-pointer group"
            >
              <MapPin className="h-3.5 w-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                {barrio.name}
              </span>
              <span className="text-xs text-zinc-600">
                {t('barrioBusinessCount', { count: String(barrio.count) })}
              </span>
              {barrio.trending && (
                <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
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
