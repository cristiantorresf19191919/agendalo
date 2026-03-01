'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Repeat, Package, CalendarCheck, DollarSign, Clock, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { Button } from '@/ui/components/common/button';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const mockRecurring = [
  { id: '1', customer: 'María García', service: 'Corte clásico', professional: 'Carlos M.', pattern: 'Quincenal', day: 'Sábado', time: '10:00', nextDate: '2026-03-07', autoBook: true },
  { id: '2', customer: 'Carlos R.', service: 'Combo corte + barba', professional: 'Andrés P.', pattern: 'Mensual', day: 'Viernes', time: '15:00', nextDate: '2026-03-20', autoBook: true },
  { id: '3', customer: 'Laura Díaz', service: 'Facial premium', professional: 'Diana R.', pattern: 'Mensual', day: 'Miércoles', time: '11:00', nextDate: '2026-03-18', autoBook: false },
  { id: '4', customer: 'Pedro S.', service: 'Masaje capilar', professional: 'Carlos M.', pattern: 'Semanal', day: 'Lunes', time: '09:00', nextDate: '2026-03-02', autoBook: true },
];

const mockBundles = [
  { id: '1', name: '5 Cortes Clásicos', sessions: 5, price: 125_000, savings: 25_000, sold: 12, activePurchases: 8 },
  { id: '2', name: '3 Faciales Premium', sessions: 3, price: 330_000, savings: 30_000, sold: 6, activePurchases: 4 },
  { id: '3', name: '10 Sesiones Masaje', sessions: 10, price: 350_000, savings: 50_000, sold: 4, activePurchases: 3 },
];

function formatCOP(n: number) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n); }

export default function RecurringPage() {
  const t = useTranslations('recurringBookings');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div><h1 className="text-2xl font-bold font-display">{t('title')}</h1></div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Citas recurrentes" value={mockRecurring.length} icon={Repeat} />
        <StatCard title="Paquetes activos" value={15} icon={Package} />
        <StatCard title="Ingresos recurrentes" value={formatCOP(2_400_000)} icon={DollarSign} trend={{ value: 18, positive: true }} />
        <StatCard title="Retención" value="92%" icon={TrendingUp} />
      </motion.div>

      {/* Recurring bookings */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
        <h3 className="text-sm font-semibold mb-4">Citas recurrentes activas</h3>
        <div className="space-y-3">
          {mockRecurring.map((r) => (
            <motion.div key={r.id} variants={staggerItem} className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-white/[0.03]">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0"><Repeat className="h-5 w-5 text-emerald-400" /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{r.customer}</p>
                <p className="text-xs text-muted-foreground">{r.service} · {r.professional}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium">{r.pattern}</p>
                <p className="text-xs text-muted-foreground">{r.day} {r.time}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Próxima</p>
                <p className="text-sm font-medium text-emerald-400">{r.nextDate}</p>
              </div>
              <div className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', r.autoBook ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400')}>
                {r.autoBook ? 'Auto' : 'Manual'}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bundles */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">{t('bundles')}</h3>
          <Button variant="outline" size="sm" className="text-xs gap-1">{t('createBundle')}</Button>
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          {mockBundles.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
              className="rounded-xl p-5 bg-muted/20 border border-white/[0.03] space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">{b.name}</p>
                <Package className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div><p className="text-lg font-bold text-emerald-400">{b.sessions}</p><p className="text-xs text-muted-foreground">{t('sessions')}</p></div>
                <div><p className="text-lg font-bold">{formatCOP(b.price)}</p><p className="text-xs text-muted-foreground">Precio</p></div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-medium">{t('savings')}: {formatCOP(b.savings)}</span>
                <span className="text-muted-foreground">{b.activePurchases} activos</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageTransition>
  );
}
