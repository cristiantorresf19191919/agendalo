'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { MapPin, TrendingUp, Users, Star, Eye, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const mockBarrios = [
  { name: 'Chapinero', views: 1250, bookings: 87, neighbors: 42, trending: true, rank: 1, growth: 23 },
  { name: 'Usaquén', views: 980, bookings: 65, neighbors: 38, trending: true, rank: 3, growth: 15 },
  { name: 'Zona Rosa', views: 870, bookings: 52, neighbors: 28, trending: false, rank: 5, growth: 8 },
  { name: 'Chicó', views: 650, bookings: 34, neighbors: 22, trending: false, rank: 8, growth: -3 },
];

const socialProof = [
  { text: '47 vecinos de Chapinero reservaron aquí esta semana', icon: Users, color: 'text-emerald-400' },
  { text: 'Top 3 barberías en Usaquén por calificación', icon: Star, color: 'text-amber-400' },
  { text: '12 min caminando desde Parque 93', icon: MapPin, color: 'text-blue-400' },
  { text: '+23% más reservas que el mes pasado en Chapinero', icon: TrendingUp, color: 'text-emerald-400' },
];

export default function BarrioDiscoveryPage() {
  const t = useTranslations('barrioDiscovery');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div><h1 className="text-2xl font-bold font-display">{t('title')}</h1><p className="text-sm text-muted-foreground mt-1">Cómo te descubren tus vecinos</p></div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Vistas desde barrios" value="3,750" icon={Eye} trend={{ value: 18, positive: true }} />
        <StatCard title="Reservas por barrio" value={238} icon={MapPin} />
        <StatCard title="Vecinos que reservan" value={130} icon={Users} />
        <StatCard title="Ranking Chapinero" value="#1" icon={TrendingUp} />
      </motion.div>

      {/* Barrio performance */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
        <h3 className="text-sm font-semibold mb-4">Rendimiento por barrio</h3>
        <div className="space-y-4">
          {mockBarrios.map((b, i) => (
            <motion.div key={b.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-white/[0.03]"
            >
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <MapPin className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold">{b.name}</p>
                  {b.trending && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 flex items-center gap-0.5"><TrendingUp className="h-2.5 w-2.5" />{t('trending')}</span>}
                  <span className="text-xs text-muted-foreground">Rank #{b.rank}</span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span>{b.views} vistas</span>
                  <span>{b.bookings} reservas</span>
                  <span>{b.neighbors} vecinos</span>
                </div>
              </div>
              <div className={cn('flex items-center gap-1 text-sm font-semibold', b.growth >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                <ArrowUpRight className={cn('h-4 w-4', b.growth < 0 && 'rotate-180')} />
                {Math.abs(b.growth)}%
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Social proof signals */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
        <h3 className="text-sm font-semibold mb-4">Señales de prueba social activas</h3>
        <div className="grid lg:grid-cols-2 gap-3">
          {socialProof.map((sp, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-white/[0.03]"
            >
              <sp.icon className={cn('h-5 w-5 shrink-0', sp.color)} />
              <p className="text-sm text-zinc-300">{sp.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageTransition>
  );
}
