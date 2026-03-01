'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Zap, TrendingUp, Clock, DollarSign, BarChart3, ArrowRight, CheckCircle, AlertTriangle, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { Button } from '@/ui/components/common/button';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const hourlyData = [
  { hour: '8am', utilization: 30, revenue: 90_000 },
  { hour: '9am', utilization: 65, revenue: 195_000 },
  { hour: '10am', utilization: 85, revenue: 255_000 },
  { hour: '11am', utilization: 90, revenue: 270_000 },
  { hour: '12pm', utilization: 45, revenue: 135_000 },
  { hour: '1pm', utilization: 35, revenue: 105_000 },
  { hour: '2pm', utilization: 70, revenue: 210_000 },
  { hour: '3pm', utilization: 80, revenue: 240_000 },
  { hour: '4pm', utilization: 95, revenue: 285_000 },
  { hour: '5pm', utilization: 88, revenue: 264_000 },
  { hour: '6pm', utilization: 60, revenue: 180_000 },
  { hour: '7pm', utilization: 25, revenue: 75_000 },
];

const recommendations = [
  { id: '1', type: 'discount', title: 'Descuento 20% en horas valle (12-2pm)', desc: 'Las horas de almuerzo tienen baja utilización. Un descuento podría llenar esos cupos.', impact: '+$380.000/mes', effort: 'Bajo', priority: 'high' },
  { id: '2', type: 'extend', title: 'Extender horario pico (4-5pm)', desc: 'Alta demanda a las 4pm. Agregar un profesional en esa franja generaría más ingresos.', impact: '+$570.000/mes', effort: 'Medio', priority: 'high' },
  { id: '3', type: 'remove', title: 'Cerrar a las 7pm en lugar de 8pm', desc: 'Las últimas horas tienen 25% de utilización. Ahorra costos operativos.', impact: '-$75.000 costo', effort: 'Bajo', priority: 'medium' },
  { id: '4', type: 'compress', title: 'Reducir buffer entre citas a 5 min', desc: 'El buffer actual de 10 min puede reducirse sin afectar la experiencia.', impact: '+2 citas/día', effort: 'Bajo', priority: 'medium' },
];

const priorityColors = { high: 'border-emerald-500/30 bg-emerald-500/5', medium: 'border-amber-500/30 bg-amber-500/5', low: 'border-zinc-500/30 bg-zinc-500/5' };

function formatCOP(n: number) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n); }

export default function ScheduleOptimizerPage() {
  const t = useTranslations('scheduleOptimizer');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-display">{t('title')}</h1><p className="text-sm text-muted-foreground mt-1">Optimiza tu agenda con inteligencia artificial</p></div>
        <Button variant="cta" className="gap-2"><Zap className="h-4 w-4" />{t('analyze')}</Button>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('currentUtilization')} value="68%" icon={BarChart3} />
        <StatCard title={t('projectedUtilization')} value="82%" icon={TrendingUp} trend={{ value: 14, positive: true }} />
        <StatCard title={t('currentRevenue')} value={formatCOP(2_304_000)} icon={DollarSign} />
        <StatCard title={t('projectedRevenue')} value={formatCOP(3_254_000)} icon={DollarSign} trend={{ value: 41, positive: true }} />
      </motion.div>

      {/* Hourly utilization chart */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Utilización por hora</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Sun className="h-3 w-3 text-amber-400" />{t('peakHours')}</span>
            <span className="flex items-center gap-1"><Moon className="h-3 w-3 text-zinc-500" />{t('deadHours')}</span>
          </div>
        </div>
        <div className="flex items-end gap-2 h-40">
          {hourlyData.map((h, i) => (
            <motion.div key={h.hour} initial={{ height: 0 }} animate={{ height: `${h.utilization}%` }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="flex-1 relative group cursor-pointer"
            >
              <div className={cn('w-full rounded-t-md transition-colors', h.utilization >= 80 ? 'bg-emerald-500' : h.utilization >= 50 ? 'bg-emerald-500/60' : 'bg-zinc-700')}
                style={{ height: '100%' }}
              />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[hsl(var(--surface-2))] text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {h.utilization}% · {formatCOP(h.revenue)}
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-1">{h.hour}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold">{t('recommendations')}</h3>
        </div>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <motion.div key={rec.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className={cn('p-4 rounded-xl border', priorityColors[rec.priority as keyof typeof priorityColors])}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold">{rec.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rec.desc}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-emerald-400 gap-1 shrink-0">
                  {t('applyRecommendation')} <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs">
                <span className="text-emerald-400 font-medium">{t('revenueImpact')}: {rec.impact}</span>
                <span className="text-muted-foreground">Esfuerzo: {rec.effort}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageTransition>
  );
}
