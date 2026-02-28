'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  DollarSign,
  CalendarCheck,
  Users,
  TrendingUp,
  AlertTriangle,
  Star,
  Clock,
  UserX,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

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

const mockTopServices = [
  { name: 'Corte clásico', bookings: 87, revenue: 2_610_000, rating: 4.8 },
  { name: 'Barba completa', bookings: 64, revenue: 1_920_000, rating: 4.6 },
  { name: 'Combo corte + barba', bookings: 52, revenue: 2_340_000, rating: 4.9 },
  { name: 'Masaje capilar', bookings: 38, revenue: 1_140_000, rating: 4.5 },
  { name: 'Tratamiento facial', bookings: 29, revenue: 1_450_000, rating: 4.7 },
];

const mockTopProfessionals = [
  { name: 'Carlos M.', bookings: 98, utilization: 82, rating: 4.9, revenue: 3_920_000 },
  { name: 'Diana R.', bookings: 85, utilization: 76, rating: 4.8, revenue: 3_400_000 },
  { name: 'Andrés P.', bookings: 72, utilization: 71, rating: 4.7, revenue: 2_880_000 },
];

const mockAtRiskClients = [
  { name: 'Juan Pérez', daysSince: 45, avg: 14, lifetime: 890_000, risk: 'high' as const },
  { name: 'María López', daysSince: 32, avg: 21, lifetime: 1_240_000, risk: 'medium' as const },
  { name: 'Laura García', daysSince: 28, avg: 18, lifetime: 560_000, risk: 'medium' as const },
  { name: 'Pedro Sánchez', daysSince: 60, avg: 30, lifetime: 2_100_000, risk: 'high' as const },
];

const riskColors = {
  low: 'text-emerald-400 bg-emerald-500/10',
  medium: 'text-amber-400 bg-amber-500/10',
  high: 'text-rose-400 bg-rose-500/10',
};

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

export default function AnalyticsPage() {
  const t = useTranslations('analytics');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('thisMonth')}</p>
        </div>
        <div className="flex gap-2">
          {(['today', 'thisWeek', 'thisMonth'] as const).map((period) => (
            <button
              key={period}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                period === 'thisMonth'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-muted-foreground hover:bg-zinc-800 border border-transparent'
              )}
            >
              {t(period)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <StatCard
          title={t('totalRevenue')}
          value={formatCOP(mockKPIs.totalRevenue)}
          icon={DollarSign}
          trend={{ value: mockKPIs.revenueChange, positive: true }}
        />
        <StatCard
          title={t('bookings')}
          value={mockKPIs.totalBookings}
          icon={CalendarCheck}
          trend={{ value: mockKPIs.bookingsChange, positive: true }}
        />
        <StatCard
          title={t('newCustomers')}
          value={mockKPIs.newCustomers}
          icon={Users}
        />
        <StatCard
          title={t('occupancyRate')}
          value={`${mockKPIs.occupancyRate}%`}
          icon={Clock}
        />
        <StatCard
          title={t('rating')}
          value={mockKPIs.averageRating.toFixed(1)}
          icon={Star}
        />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <motion.div
          variants={cardEntrance}
          initial="hidden"
          animate="visible"
          className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5"
        >
          <h3 className="text-sm font-semibold mb-4">{t('topServices')}</h3>
          <div className="space-y-3">
            {mockTopServices.map((service, i) => (
              <motion.div
                key={service.name}
                variants={staggerItem}
                className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.bookings} {t('bookings').toLowerCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-400">{formatCOP(service.revenue)}</p>
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-muted-foreground">{service.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Professionals */}
        <motion.div
          variants={cardEntrance}
          initial="hidden"
          animate="visible"
          className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5"
        >
          <h3 className="text-sm font-semibold mb-4">{t('topProfessionals')}</h3>
          <div className="space-y-3">
            {mockTopProfessionals.map((prof, i) => (
              <motion.div
                key={prof.name}
                variants={staggerItem}
                className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-400">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{prof.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {prof.bookings} {t('bookings').toLowerCase()} &middot; {t('utilizationRate')} {prof.utilization}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-400">{formatCOP(prof.revenue)}</p>
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-muted-foreground">{prof.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Clients at Risk */}
      <motion.div
        variants={cardEntrance}
        initial="hidden"
        animate="visible"
        className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold">{t('clientsAtRisk')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-zinc-800">
                <th className="pb-2 pr-4">{t('customers')}</th>
                <th className="pb-2 pr-4">{t('daysSinceLastVisit')}</th>
                <th className="pb-2 pr-4">{t('lifetimeValue')}</th>
                <th className="pb-2 pr-4">{t('churnRisk')}</th>
                <th className="pb-2">{t('recommendedAction')}</th>
              </tr>
            </thead>
            <tbody>
              {mockAtRiskClients.map((client) => (
                <tr key={client.name} className="border-b border-zinc-800/50 last:border-0">
                  <td className="py-3 pr-4 font-medium">{client.name}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1">
                      <UserX className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{client.daysSince}d</span>
                      <span className="text-xs text-muted-foreground">(avg {client.avg}d)</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">{formatCOP(client.lifetime)}</td>
                  <td className="py-3 pr-4">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', riskColors[client.risk])}>
                      {t(client.risk === 'high' ? 'highRisk' : client.risk === 'medium' ? 'mediumRisk' : 'lowRisk')}
                    </span>
                  </td>
                  <td className="py-3">
                    <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                      {t('sendOffer')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Revenue + Booking Stats Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div
          variants={cardEntrance}
          initial="hidden"
          animate="visible"
          className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5"
        >
          <h4 className="text-sm font-semibold mb-3">{t('avgBookingValue')}</h4>
          <p className="text-2xl font-bold text-emerald-400">{formatCOP(mockKPIs.avgBookingValue)}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('revenueChange')}</p>
        </motion.div>

        <motion.div
          variants={cardEntrance}
          initial="hidden"
          animate="visible"
          className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5"
        >
          <h4 className="text-sm font-semibold mb-3">{t('returningRate')}</h4>
          <p className="text-2xl font-bold text-emerald-400">{mockKPIs.returningRate}%</p>
          <div className="mt-2 h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
              style={{ width: `${mockKPIs.returningRate}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          variants={cardEntrance}
          initial="hidden"
          animate="visible"
          className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5"
        >
          <h4 className="text-sm font-semibold mb-3">{t('noShowRate')}</h4>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-amber-400">{mockKPIs.noShowRate}%</p>
            <TrendingUp className="h-4 w-4 text-emerald-400 rotate-180" />
          </div>
          <div className="mt-2 h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
              style={{ width: `${mockKPIs.noShowRate}%` }}
            />
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
