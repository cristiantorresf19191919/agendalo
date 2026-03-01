'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  DollarSign,
  CalendarCheck,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Star,
  Clock,
  UserX,
  Target,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Zap,
  Award,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { staggerContainer, staggerItem } from '@/ui/animations/variants';

const mockKPIs = {
  totalRevenue: 12_450_000,
  revenueChange: 12.5,
  totalBookings: 347,
  bookingsChange: 8.2,
  newCustomers: 45,
  returningRate: 68,
  occupancyRate: 74,
  avgBookingValue: 35_890,
  noShowRate: 6.2,
  averageRating: 4.7,
};

const revenueGoal = { target: 15_000_000, current: 12_450_000 };

const weeklyRevenue = [
  { day: 'Lun', value: 1_800_000, bookings: 42 },
  { day: 'Mar', value: 2_100_000, bookings: 48 },
  { day: 'Mié', value: 1_200_000, bookings: 28 },
  { day: 'Jue', value: 2_400_000, bookings: 55 },
  { day: 'Vie', value: 2_800_000, bookings: 64 },
  { day: 'Sáb', value: 1_950_000, bookings: 47 },
  { day: 'Dom', value: 200_000, bookings: 5 },
];

const serviceMix = [
  { name: 'Corte clásico', pct: 32, revenue: 2_610_000, color: 'bg-emerald-500' },
  { name: 'Combo corte + barba', pct: 24, revenue: 2_340_000, color: 'bg-teal-500' },
  { name: 'Barba completa', pct: 18, revenue: 1_920_000, color: 'bg-emerald-400' },
  { name: 'Facial premium', pct: 14, revenue: 1_450_000, color: 'bg-emerald-300' },
  { name: 'Masaje capilar', pct: 12, revenue: 1_140_000, color: 'bg-emerald-200' },
];

const mockTopServices = [
  { name: 'Corte clásico', bookings: 87, revenue: 2_610_000, rating: 4.8, trend: 5.2 },
  { name: 'Barba completa', bookings: 64, revenue: 1_920_000, rating: 4.6, trend: -2.1 },
  { name: 'Combo corte + barba', bookings: 52, revenue: 2_340_000, rating: 4.9, trend: 12.3 },
  { name: 'Masaje capilar', bookings: 38, revenue: 1_140_000, rating: 4.5, trend: 3.7 },
  { name: 'Tratamiento facial', bookings: 29, revenue: 1_450_000, rating: 4.7, trend: 8.1 },
];

const mockTopProfessionals = [
  { name: 'Carlos M.', bookings: 98, utilization: 82, rating: 4.9, revenue: 3_920_000, noShows: 2 },
  { name: 'Diana R.', bookings: 85, utilization: 76, rating: 4.8, revenue: 3_400_000, noShows: 4 },
  { name: 'Andrés P.', bookings: 72, utilization: 71, rating: 4.7, revenue: 2_880_000, noShows: 1 },
];

const mockAtRiskClients = [
  { name: 'Juan Pérez', daysSince: 45, avg: 14, lifetime: 890_000, risk: 'high' as const, lastService: 'Corte clásico' },
  { name: 'María López', daysSince: 32, avg: 21, lifetime: 1_240_000, risk: 'medium' as const, lastService: 'Facial premium' },
  { name: 'Laura García', daysSince: 28, avg: 18, lifetime: 560_000, risk: 'medium' as const, lastService: 'Manicure' },
  { name: 'Pedro Sánchez', daysSince: 60, avg: 30, lifetime: 2_100_000, risk: 'high' as const, lastService: 'Combo corte + barba' },
];

const hourlyData = [20, 35, 55, 78, 92, 85, 45, 30, 65, 88, 95, 70, 40];

const riskColors = {
  low: 'text-emerald-400 bg-emerald-500/8',
  medium: 'text-amber-400 bg-amber-500/8',
  high: 'text-rose-400 bg-rose-500/8',
};

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

function DashCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn('rounded-2xl p-5 bg-[hsl(var(--surface-1))] border border-white/[0.04]', className)}
    >
      {children}
    </motion.div>
  );
}

function CardHeader({ icon: Icon, title, iconBg = 'bg-emerald-500/8', iconColor = 'text-emerald-400', action }: { icon: typeof DollarSign; title: string; iconBg?: string; iconColor?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', iconBg)}>
          <Icon className={cn('h-4 w-4', iconColor)} />
        </div>
        <h2 className="font-semibold text-sm font-display">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export default function AnalyticsPage() {
  const t = useTranslations('analytics');
  const [period, setPeriod] = useState<'today' | 'thisWeek' | 'thisMonth'>('thisMonth');

  const goalPct = Math.min((revenueGoal.current / revenueGoal.target) * 100, 100);
  const maxWeeklyRevenue = Math.max(...weeklyRevenue.map((w) => w.value));

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">{t('title')}</h1>
          <p className="text-sm text-zinc-500 mt-1">{t('thisMonth')} · Febrero 2026</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          {(['today', 'thisWeek', 'thisMonth'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-xs font-medium transition-all',
                period === p
                  ? 'bg-emerald-500/10 text-emerald-400 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              {t(p)}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Goal Tracker */}
      <DashCard delay={0.05}>
        <CardHeader icon={Target} title="Meta de ingresos mensual" iconBg="bg-emerald-500/8" />
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
          <div>
            <p className="text-3xl font-bold text-gradient-primary font-display">{formatCOP(revenueGoal.current)}</p>
            <p className="text-xs text-zinc-500 mt-1">de {formatCOP(revenueGoal.target)} · <span className="text-emerald-400 font-semibold">{goalPct.toFixed(0)}% alcanzado</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">Faltan</p>
            <p className="text-lg font-bold text-zinc-300 font-display">{formatCOP(revenueGoal.target - revenueGoal.current)}</p>
            <p className="text-[11px] text-zinc-600">~{Math.ceil((revenueGoal.target - revenueGoal.current) / mockKPIs.avgBookingValue)} citas más</p>
          </div>
        </div>
        <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goalPct}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
          />
        </div>
        <div className="flex justify-between text-[10px] text-zinc-600 mt-1.5 font-medium">
          <span>$0</span>
          <span>{formatCOP(revenueGoal.target / 2)}</span>
          <span>{formatCOP(revenueGoal.target)}</span>
        </div>
      </DashCard>

      {/* KPI Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <StatCard title={t('totalRevenue')} value={formatCOP(mockKPIs.totalRevenue)} icon={DollarSign} trend={{ value: mockKPIs.revenueChange, positive: true }} />
        <StatCard title={t('bookings')} value={mockKPIs.totalBookings} icon={CalendarCheck} trend={{ value: mockKPIs.bookingsChange, positive: true }} />
        <StatCard title={t('newCustomers')} value={mockKPIs.newCustomers} icon={Users} />
        <StatCard title={t('occupancyRate')} value={`${mockKPIs.occupancyRate}%`} icon={Clock} />
        <StatCard title={t('rating')} value={mockKPIs.averageRating.toFixed(1)} icon={Star} />
      </motion.div>

      {/* Weekly Revenue Chart + Service Mix */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Weekly revenue chart */}
        <DashCard delay={0.1} className="lg:col-span-2">
          <CardHeader icon={BarChart3} title="Ingresos por día" action={
            <span className="text-[10px] text-zinc-500 font-medium">Esta semana</span>
          } />
          <div className="flex items-end gap-2 h-40">
            {weeklyRevenue.map((day, i) => {
              const height = (day.value / maxWeeklyRevenue) * 100;
              const isHighest = day.value === maxWeeklyRevenue;
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="text-[10px] font-semibold text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {formatCOP(day.value)}
                  </div>
                  <div className="w-full relative" style={{ height: '120px' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.05 }}
                      className={cn(
                        'absolute bottom-0 left-0 right-0 rounded-t-md transition-colors',
                        isHighest ? 'bg-emerald-500' : 'bg-emerald-500/30 group-hover:bg-emerald-500/50'
                      )}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-600 font-medium">{day.day}</span>
                </div>
              );
            })}
          </div>
        </DashCard>

        {/* Service mix */}
        <DashCard delay={0.15}>
          <CardHeader icon={PieChart} title="Mix de servicios" />
          <div className="space-y-3">
            {serviceMix.map((service, i) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={cn('h-2.5 w-2.5 rounded-full', service.color)} />
                    <span className="text-zinc-400 font-medium">{service.name}</span>
                  </div>
                  <span className="text-zinc-300 font-semibold tabular-nums">{service.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${service.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.06 }}
                    className={cn('h-full rounded-full', service.color)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </DashCard>
      </div>

      {/* Top Services + Top Professionals */}
      <div className="grid lg:grid-cols-2 gap-4">
        <DashCard delay={0.2}>
          <CardHeader icon={Award} title={t('topServices')} />
          <div className="space-y-2">
            {mockTopServices.map((service, i) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.04 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-xs font-bold text-zinc-600 w-5 tabular-nums">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{service.name}</p>
                  <p className="text-[11px] text-zinc-500">{service.bookings} reservas · <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400 inline" /> {service.rating}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-400 tabular-nums">{formatCOP(service.revenue)}</p>
                  <p className={cn('text-[10px] font-semibold flex items-center gap-0.5 justify-end', service.trend >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                    {service.trend >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {service.trend >= 0 ? '+' : ''}{service.trend}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </DashCard>

        <DashCard delay={0.25}>
          <CardHeader icon={Users} title={t('topProfessionals')} iconBg="bg-purple-500/8" iconColor="text-purple-400" />
          <div className="space-y-2">
            {mockTopProfessionals.map((prof, i) => (
              <motion.div
                key={prof.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.04 }}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/8 flex items-center justify-center text-xs font-bold text-emerald-400">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{prof.name}</p>
                    <p className="text-[11px] text-zinc-500">{prof.bookings} reservas · {prof.noShows} no-shows</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-400 tabular-nums">{formatCOP(prof.revenue)}</p>
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] text-zinc-500">{prof.rating}</span>
                    </div>
                  </div>
                </div>
                {/* Utilization bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-600 w-16">Utilización</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${prof.utilization}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.05 }}
                      className={cn('h-full rounded-full', prof.utilization >= 75 ? 'bg-emerald-500' : prof.utilization >= 50 ? 'bg-amber-500' : 'bg-rose-500')}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-semibold tabular-nums w-8 text-right">{prof.utilization}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </DashCard>
      </div>

      {/* Hourly Heatmap + At Risk Clients */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Hourly demand heatmap */}
        <DashCard delay={0.3}>
          <CardHeader icon={Zap} title="Demanda por hora" iconBg="bg-amber-500/8" iconColor="text-amber-400" />
          <div className="space-y-1.5">
            {hourlyData.map((val, i) => {
              const hour = i + 8;
              return (
                <div key={hour} className="flex items-center gap-2 group">
                  <span className="text-[10px] text-zinc-600 w-10 tabular-nums">{hour}:00</span>
                  <div className="flex-1 h-4 rounded bg-white/[0.02] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.03 }}
                      className={cn(
                        'h-full rounded',
                        val >= 85 ? 'bg-emerald-500' : val >= 60 ? 'bg-emerald-500/50' : val >= 30 ? 'bg-emerald-500/25' : 'bg-white/[0.04]'
                      )}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-600 tabular-nums w-8 text-right opacity-0 group-hover:opacity-100 transition-opacity">{val}%</span>
                </div>
              );
            })}
          </div>
        </DashCard>

        {/* Clients at risk */}
        <DashCard delay={0.35} className="lg:col-span-2">
          <CardHeader icon={AlertTriangle} title={t('clientsAtRisk')} iconBg="bg-rose-500/8" iconColor="text-rose-400" />
          <div className="space-y-2">
            {mockAtRiskClients.map((client, i) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.04 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-white/[0.04] flex items-center justify-center text-sm font-bold text-zinc-500">
                  {client.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{client.name}</p>
                  <p className="text-[11px] text-zinc-500">{client.lastService} · Último: hace {client.daysSince}d (promedio: {client.avg}d)</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400 font-medium tabular-nums hidden sm:block">{formatCOP(client.lifetime)}</span>
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', riskColors[client.risk])}>
                    {client.risk === 'high' ? 'Alto' : 'Medio'}
                  </span>
                  <button className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition-colors whitespace-nowrap">
                    Enviar oferta
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </DashCard>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashCard delay={0.4}>
          <CardHeader icon={DollarSign} title={t('avgBookingValue')} />
          <p className="text-2xl font-bold text-emerald-400 font-display">{formatCOP(mockKPIs.avgBookingValue)}</p>
          <p className="text-[11px] text-zinc-500 mt-1">{t('revenueChange')}</p>
        </DashCard>
        <DashCard delay={0.45}>
          <CardHeader icon={Users} title={t('returningRate')} />
          <p className="text-2xl font-bold text-emerald-400 font-display">{mockKPIs.returningRate}%</p>
          <div className="mt-2 h-2 rounded-full bg-white/[0.04] overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${mockKPIs.returningRate}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
          </div>
        </DashCard>
        <DashCard delay={0.5}>
          <CardHeader icon={UserX} title={t('noShowRate')} iconBg="bg-amber-500/8" iconColor="text-amber-400" />
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-amber-400 font-display">{mockKPIs.noShowRate}%</p>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingDown className="h-2.5 w-2.5" /> -2.1%
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/[0.04] overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${mockKPIs.noShowRate}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500" />
          </div>
        </DashCard>
      </div>
    </PageTransition>
  );
}
