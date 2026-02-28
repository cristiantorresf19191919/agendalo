'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Users,
  Scissors,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowRight,
  Plus,
  Heart,
  AlertTriangle,
  Zap,
  Star,
  Activity,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { ProgressBar } from '@/ui/components/dashboard/progress-bar';
import { Button } from '@/ui/components/common/button';
import { QuickBookModal } from '@/ui/components/dashboard/quick-book-modal';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';
import { cn } from '@/lib/utils';
import {
  getProfessionalsByBusinessId,
  getMockAppointments,
} from '@/lib/mock-data';
import { formatCOP } from '@/lib/format';

export default function DashboardOverviewPage() {
  const t = useTranslations('dashboard');
  const [quickBookOpen, setQuickBookOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const professionals = getProfessionalsByBusinessId('biz-1');
  const appointments = getMockAppointments('biz-1', today);

  const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const total = appointments.length;

  const upcoming = appointments
    .filter((a) => a.status === 'confirmed')
    .slice(0, 4);

  return (
    <PageTransition>
      <div className="space-y-8 pt-14 lg:pt-0">
        {/* Welcome header */}
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl sm:text-3xl font-bold"
            >
              <span className="text-gradient-primary">{t('welcomeBack')}</span> 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-sm mt-1"
            >
              {t('hereIsYourDay')}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button variant="cta" className="gap-2" onClick={() => setQuickBookOpen(true)}>
              <Plus className="h-4 w-4" />
              {t('quickBook')}
            </Button>
          </motion.div>
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <ProgressBar
            value={completed}
            max={total}
            label={t('todayProgress')}
          />
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title={t('appointments')}
            value={total}
            icon={CalendarDays}
            trend={{ value: 12, positive: true }}
          />
          <StatCard
            title={t('completed')}
            value={completed}
            icon={TrendingUp}
          />
          <StatCard
            title={t('remaining')}
            value={confirmed}
            icon={Clock}
          />
          <StatCard
            title="Profesionales"
            value={professionals.length}
            icon={Users}
          />
        </motion.div>

        {/* Revenue + Health Score Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue today */}
          <motion.div
            variants={cardEntrance}
            initial="hidden"
            animate="visible"
            className="rounded-2xl p-5 bg-card/60 backdrop-blur-sm border border-white/[0.04]"
          >
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <h2 className="font-semibold">{t('todayRevenue')}</h2>
            </div>
            <p className="text-3xl font-bold text-gradient-primary">{formatCOP(845000)}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>+18% vs ayer</span>
            </div>
            <div className="mt-4 space-y-2">
              {[
                { label: 'Nequi', amount: 380000, pct: 45 },
                { label: 'Efectivo', amount: 290000, pct: 34 },
                { label: 'Daviplata', amount: 175000, pct: 21 },
              ].map((pm) => (
                <div key={pm.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">{pm.label}</span>
                    <span className="text-zinc-300 font-medium">{formatCOP(pm.amount)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pm.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full bg-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Health score */}
          <motion.div
            variants={cardEntrance}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.05 }}
            className="rounded-2xl p-5 bg-card/60 backdrop-blur-sm border border-white/[0.04]"
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h2 className="font-semibold">Salud del negocio</h2>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="relative h-28 w-28">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-zinc-800" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeLinecap="round"
                    className="text-emerald-400"
                    strokeDasharray={264}
                    initial={{ strokeDashoffset: 264 }}
                    animate={{ strokeDashoffset: 264 * (1 - 0.87) }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">87</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-2">
              {[
                { label: 'Ocupación', value: '72%', status: 'good' },
                { label: 'Retención', value: '89%', status: 'good' },
                { label: 'No-shows', value: '4%', status: 'good' },
                { label: 'Calificación', value: '4.8', status: 'good' },
              ].map((metric) => (
                <div key={metric.label} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">{metric.label}</span>
                  <span className="text-emerald-400 font-medium">{metric.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Peak hours mini chart */}
          <motion.div
            variants={cardEntrance}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-5 bg-card/60 backdrop-blur-sm border border-white/[0.04]"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-amber-400" />
              <h2 className="font-semibold">Horas pico hoy</h2>
            </div>
            <div className="flex items-end gap-1.5 h-28">
              {[30, 65, 85, 90, 45, 35, 70, 80, 95, 88, 60, 25].map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.04 }}
                  className="flex-1 relative group cursor-pointer"
                >
                  <div
                    className={cn(
                      'w-full rounded-t-sm transition-colors',
                      val >= 80 ? 'bg-emerald-500' : val >= 50 ? 'bg-emerald-500/50' : 'bg-zinc-700'
                    )}
                    style={{ height: '100%' }}
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {val}%
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-zinc-600 mt-1.5">
              <span>8am</span>
              <span>12pm</span>
              <span>4pm</span>
              <span>8pm</span>
            </div>
            <div className="mt-3 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <p className="text-[11px] text-amber-400">12-2pm tiene baja ocupación. Considera un descuento.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Two columns: Upcoming + Professionals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming appointments */}
          <motion.div
            variants={cardEntrance}
            initial="hidden"
            animate="visible"
            className="rounded-2xl p-5 bg-card/60 backdrop-blur-sm border border-white/[0.04]"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">{t('upcomingAppointments')}</h2>
              <Link href="/dashboard/agenda">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  {t('viewAgenda')}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                {t('noUpcoming')}
              </p>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {upcoming.map((appt) => (
                  <motion.div
                    key={appt.id}
                    variants={staggerItem}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-white/[0.03] hover:bg-muted/30 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{appt.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {appt.serviceName} · {appt.startTime} - {appt.endTime}
                      </p>
                    </div>
                    <span className="text-xs text-emerald-400 font-medium shrink-0">
                      {appt.professionalName.split(' ')[0]}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Team */}
          <motion.div
            variants={cardEntrance}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-5 bg-card/60 backdrop-blur-sm border border-white/[0.04]"
          >
            <h2 className="font-semibold text-lg mb-4">{t('professionals')}</h2>
            <div className="grid grid-cols-2 gap-3">
              {professionals.map((pro) => {
                const proAppts = appointments.filter((a) => a.professionalId === pro.id);
                return (
                  <motion.div
                    key={pro.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-white/[0.03]"
                  >
                    {pro.avatarUrl ? (
                      <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 ring-2 ring-emerald-500/20">
                        <Image src={pro.avatarUrl} alt={pro.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">
                        {pro.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{pro.name.split(' ')[0]}</p>
                      <p className="text-xs text-muted-foreground">{proAppts.length} citas</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {[
            { label: 'Ver reseñas nuevas', icon: Star, href: '/dashboard/reviews', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
            { label: 'Clientes en riesgo', icon: AlertTriangle, href: '/dashboard/analytics', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
            { label: 'Gift cards activas', icon: Heart, href: '/dashboard/giftCards', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
            { label: 'Optimizar horario', icon: Zap, href: '/dashboard/scheduleOptimizer', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <motion.div
                whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                className={cn('flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors', action.border, action.bg)}
              >
                <action.icon className={cn('h-4 w-4 shrink-0', action.color)} />
                <span className="text-xs font-medium">{action.label}</span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>

      <QuickBookModal
        open={quickBookOpen}
        onOpenChange={setQuickBookOpen}
        businessId="biz-1"
      />
    </PageTransition>
  );
}
