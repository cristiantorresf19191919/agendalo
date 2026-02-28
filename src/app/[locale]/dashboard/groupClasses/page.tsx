'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Users, CalendarCheck, DollarSign, Clock, Plus, MapPin, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { Button } from '@/ui/components/common/button';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const mockEvents = [
  { id: '1', name: 'Masterclass Barbería', instructor: 'Carlos M.', date: '2026-03-05', time: '14:00-16:00', capacity: 12, confirmed: 8, waitlisted: 3, price: 80_000, location: 'Sede Chapinero', recurring: 'Semanal', color: 'emerald' },
  { id: '2', name: 'Taller Cuidado Facial', instructor: 'Diana R.', date: '2026-03-08', time: '10:00-12:00', capacity: 8, confirmed: 8, waitlisted: 5, price: 120_000, location: 'Sede Usaquén', recurring: 'Mensual', color: 'purple' },
  { id: '3', name: 'Yoga & Spa Day', instructor: 'Diana R.', date: '2026-03-12', time: '09:00-13:00', capacity: 15, confirmed: 6, waitlisted: 0, price: 150_000, location: 'Sede Chapinero', recurring: null, color: 'pink' },
  { id: '4', name: 'Workshop Colorimetría', instructor: 'Andrés P.', date: '2026-03-15', time: '15:00-18:00', capacity: 10, confirmed: 4, waitlisted: 0, price: 95_000, location: 'Sede Chapinero', recurring: null, color: 'amber' },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
};

function formatCOP(n: number) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n); }

export default function GroupClassesPage() {
  const t = useTranslations('groupBookings');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">{t('title')}</h1></div>
        <Button variant="cta" className="gap-2"><Plus className="h-4 w-4" />{t('createEvent')}</Button>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Eventos activos" value={4} icon={CalendarCheck} />
        <StatCard title="Participantes" value={26} icon={Users} trend={{ value: 15, positive: true }} />
        <StatCard title="Lista de espera" value={8} icon={Clock} />
        <StatCard title="Ingresos" value={formatCOP(1_820_000)} icon={DollarSign} />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {mockEvents.map((event, i) => {
          const colors = colorMap[event.color];
          const pct = Math.round((event.confirmed / event.capacity) * 100);
          return (
            <motion.div key={event.id} variants={cardEntrance} initial="hidden" animate="visible" transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
              className={cn('rounded-xl border bg-zinc-900/80 backdrop-blur-sm p-5 space-y-4', colors.border)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{event.name}</h3>
                    {event.recurring && <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', colors.bg, colors.text)}>{event.recurring}</span>}
                    {pct === 100 && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400">Lleno</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{event.instructor}</p>
                </div>
                <p className="text-lg font-bold text-emerald-400">{formatCOP(event.price)}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1"><CalendarCheck className="h-4 w-4" />{event.date}</div>
                <div className="flex items-center gap-1"><Clock className="h-4 w-4" />{event.time}</div>
                <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{event.location}</div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>{t('confirmed')}: <strong>{event.confirmed}/{event.capacity}</strong></span>
                  {event.waitlisted > 0 && <span className="text-amber-400 text-xs">{event.waitlisted} en espera</span>}
                </div>
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                    className={cn('h-full rounded-full', pct === 100 ? 'bg-gradient-to-r from-rose-500 to-pink-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400')}
                  />
                </div>
              </div>

              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(event.confirmed, 6) }).map((_, j) => (
                  <div key={j} className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white">
                    {String.fromCharCode(65 + j)}
                  </div>
                ))}
                {event.confirmed > 6 && <div className="h-8 w-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-400">+{event.confirmed - 6}</div>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </PageTransition>
  );
}
