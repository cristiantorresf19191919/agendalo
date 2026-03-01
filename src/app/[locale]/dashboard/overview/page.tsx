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
  TrendingDown,
  DollarSign,
  Clock,
  ArrowRight,
  Plus,
  Heart,
  AlertTriangle,
  Zap,
  Star,
  Activity,
  Bell,
  ChevronRight,
  MessageCircle,
  Eye,
  Target,
  ArrowUpRight,
  MoreHorizontal,
  Calendar,
  Repeat,
  Sparkles,
  BarChart3,
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

function DashCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl p-5 bg-[hsl(var(--surface-1))] border border-white/[0.04]',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function MiniBar({ value, max, color = 'emerald' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    purple: 'bg-purple-500',
  };
  return (
    <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={cn('h-full rounded-full', colorMap[color])}
      />
    </div>
  );
}

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
    .slice(0, 5);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Buenos días' : now.getHours() < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <PageTransition>
      <div className="space-y-6 pt-14 lg:pt-0">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl sm:text-3xl font-bold font-display"
            >
              {greeting}, <span className="text-gradient-primary">Dulciniana</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-500 text-sm mt-1"
            >
              {t('hereIsYourDay')} · {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <Button variant="outline" size="sm" className="gap-2 rounded-lg text-xs border-white/[0.06]">
              <Bell className="h-3.5 w-3.5" />
              <span className="relative">
                Alerts
                <span className="absolute -top-1 -right-3 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
            </Button>
            <Button variant="cta" className="gap-2 rounded-lg text-sm" onClick={() => setQuickBookOpen(true)}>
              <Plus className="h-4 w-4" />
              {t('quickBook')}
            </Button>
          </motion.div>
        </div>

        {/* Day progress */}
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

        {/* Main grid: Revenue + Health + Peak hours */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue today */}
          <DashCard delay={0.05}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/8 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
                <h2 className="font-semibold text-sm font-display">{t('todayRevenue')}</h2>
              </div>
              <button className="p-1 rounded-md hover:bg-white/[0.04] transition-colors">
                <MoreHorizontal className="h-4 w-4 text-zinc-600" />
              </button>
            </div>
            <p className="text-3xl font-bold text-gradient-primary font-display">{formatCOP(845000)}</p>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <div className="flex items-center gap-0.5 text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span className="font-semibold">+18%</span>
              </div>
              <span className="text-zinc-600">vs ayer</span>
            </div>
            <div className="mt-5 space-y-3">
              {[
                { label: 'Nequi', amount: 380000, pct: 45, color: 'emerald' },
                { label: 'Efectivo', amount: 290000, pct: 34, color: 'amber' },
                { label: 'Daviplata', amount: 175000, pct: 21, color: 'purple' },
              ].map((pm) => (
                <div key={pm.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">{pm.label}</span>
                    <span className="text-zinc-300 font-medium tabular-nums">{formatCOP(pm.amount)}</span>
                  </div>
                  <MiniBar value={pm.pct} max={100} color={pm.color} />
                </div>
              ))}
            </div>
          </DashCard>

          {/* Health score */}
          <DashCard delay={0.1}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/8 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-emerald-400" />
                </div>
                <h2 className="font-semibold text-sm font-display">Salud del negocio</h2>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/8 px-2 py-0.5 rounded-full">Excelente</span>
            </div>
            <div className="flex items-center justify-center py-2">
              <div className="relative h-32 w-32">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/[0.03]" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none" strokeWidth="6" strokeLinecap="round"
                    className="text-emerald-400"
                    strokeDasharray={264}
                    initial={{ strokeDashoffset: 264 }}
                    animate={{ strokeDashoffset: 264 * (1 - 0.87) }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold font-display">87</span>
                  <span className="text-[10px] text-zinc-600">/ 100</span>
                </div>
              </div>
            </div>
            <div className="space-y-2.5 mt-2">
              {[
                { label: 'Ocupación', value: '72%', good: true },
                { label: 'Retención', value: '89%', good: true },
                { label: 'No-shows', value: '4%', good: true },
                { label: 'Calificación', value: '4.8 ★', good: true },
              ].map((metric) => (
                <div key={metric.label} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">{metric.label}</span>
                  <span className={cn('font-medium', metric.good ? 'text-emerald-400' : 'text-amber-400')}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </DashCard>

          {/* Peak hours */}
          <DashCard delay={0.15}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/8 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-amber-400" />
                </div>
                <h2 className="font-semibold text-sm font-display">Horas pico hoy</h2>
              </div>
            </div>
            <div className="flex items-end gap-1 h-28">
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
                      'w-full rounded-sm transition-colors',
                      val >= 80 ? 'bg-emerald-500' : val >= 50 ? 'bg-emerald-500/40' : 'bg-white/[0.06]'
                    )}
                    style={{ height: '100%' }}
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-medium">
                    {val}%
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-zinc-700 mt-2 font-medium">
              <span>8am</span>
              <span>12pm</span>
              <span>4pm</span>
              <span>8pm</span>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-300/80 leading-relaxed">12-2pm tiene baja ocupación. Considera un descuento.</p>
              </div>
            </div>
          </DashCard>
        </div>

        {/* Upcoming + Team row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Upcoming appointments */}
          <DashCard delay={0.2}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/8 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                </div>
                <h2 className="font-semibold text-sm font-display">{t('upcomingAppointments')}</h2>
              </div>
              <Link href="/dashboard/agenda">
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-zinc-500 hover:text-emerald-400">
                  {t('viewAgenda')}
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <p className="text-sm text-zinc-600 py-8 text-center">
                {t('noUpcoming')}
              </p>
            ) : (
              <div className="space-y-2">
                {upcoming.map((appt, i) => (
                  <motion.div
                    key={appt.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] hover:border-white/[0.06] transition-all group cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/8 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{appt.customerName}</p>
                      <p className="text-[11px] text-zinc-500">
                        {appt.serviceName} · {appt.startTime} - {appt.endTime}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-emerald-400 font-medium">
                        {appt.professionalName.split(' ')[0]}
                      </span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0" />
                  </motion.div>
                ))}
              </div>
            )}
          </DashCard>

          {/* Team overview */}
          <DashCard delay={0.25}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-purple-500/8 flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-400" />
                </div>
                <h2 className="font-semibold text-sm font-display">{t('professionals')}</h2>
              </div>
              <Link href="/dashboard/professionals">
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-zinc-500 hover:text-emerald-400">
                  Ver todos
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              {professionals.map((pro, i) => {
                const proAppts = appointments.filter((a) => a.professionalId === pro.id);
                const utilization = Math.min(100, (proAppts.length / 8) * 100);
                return (
                  <motion.div
                    key={pro.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors"
                  >
                    {pro.avatarUrl ? (
                      <div className="relative h-9 w-9 rounded-lg overflow-hidden shrink-0 ring-1 ring-white/[0.06]">
                        <Image src={pro.avatarUrl} alt={pro.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-9 w-9 rounded-lg bg-white/[0.04] flex items-center justify-center text-sm font-bold shrink-0 text-zinc-500">
                        {pro.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{pro.name.split(' ')[0]}</p>
                        <span className="text-[11px] text-zinc-500 tabular-nums">{proAppts.length} citas</span>
                      </div>
                      <div className="mt-1.5">
                        <MiniBar value={utilization} max={100} color={utilization > 75 ? 'emerald' : utilization > 40 ? 'amber' : 'rose'} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </DashCard>
        </div>

        {/* Quick actions + AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Quick actions */}
          <div className="lg:col-span-2">
            <DashCard delay={0.3}>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/8 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-emerald-400" />
                </div>
                <h2 className="font-semibold text-sm font-display">Acciones rápidas</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {[
                  { label: 'Ver reseñas', icon: Star, href: '/dashboard/reviews', color: 'amber', badge: '3 new' },
                  { label: 'Clientes riesgo', icon: AlertTriangle, href: '/dashboard/analytics', color: 'rose' },
                  { label: 'Gift cards', icon: Heart, href: '/dashboard/giftCards', color: 'pink' },
                  { label: 'Optimizar', icon: Sparkles, href: '/dashboard/scheduleOptimizer', color: 'emerald' },
                  { label: 'WhatsApp', icon: MessageCircle, href: '/dashboard/whatsapp', color: 'emerald' },
                  { label: 'Marketing', icon: Target, href: '/dashboard/marketing', color: 'purple' },
                  { label: 'Recurrentes', icon: Repeat, href: '/dashboard/recurring', color: 'amber' },
                  { label: 'Facturación', icon: DollarSign, href: '/dashboard/invoicing', color: 'emerald' },
                ].map((action) => {
                  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
                    emerald: { bg: 'bg-emerald-500/6', text: 'text-emerald-400', border: 'border-emerald-500/10' },
                    amber: { bg: 'bg-amber-500/6', text: 'text-amber-400', border: 'border-amber-500/10' },
                    rose: { bg: 'bg-rose-500/6', text: 'text-rose-400', border: 'border-rose-500/10' },
                    pink: { bg: 'bg-pink-500/6', text: 'text-pink-400', border: 'border-pink-500/10' },
                    purple: { bg: 'bg-purple-500/6', text: 'text-purple-400', border: 'border-purple-500/10' },
                  };
                  const c = colorMap[action.color];
                  return (
                    <Link key={action.label} href={action.href}>
                      <motion.div
                        whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                        className={cn(
                          'flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm',
                          c.border, c.bg
                        )}
                      >
                        <action.icon className={cn('h-5 w-5', c.text)} />
                        <span className="text-[11px] font-medium text-zinc-400 text-center">{action.label}</span>
                        {action.badge && (
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{action.badge}</span>
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </DashCard>
          </div>

          {/* AI Insights */}
          <DashCard delay={0.35}>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-purple-500/8 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-purple-400" />
              </div>
              <h2 className="font-semibold text-sm font-display">AI Insights</h2>
            </div>
            <div className="space-y-3">
              {[
                {
                  title: 'Ocupación baja los miércoles',
                  desc: 'Considera una promo "Miércoles 2x1" para llenar huecos',
                  type: 'suggestion' as const,
                },
                {
                  title: '5 clientes no regresan',
                  desc: 'Envía un WhatsApp con descuento personalizado',
                  type: 'warning' as const,
                },
                {
                  title: 'Corte + barba es trending',
                  desc: '+40% de búsquedas esta semana. ¡Promociónalo!',
                  type: 'trending' as const,
                },
              ].map((insight, i) => {
                const typeStyles = {
                  suggestion: { icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/8' },
                  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/8' },
                  trending: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/8' },
                };
                const style = typeStyles[insight.type];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5', style.bg)}>
                        <style.icon className={cn('h-3.5 w-3.5', style.color)} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-300">{insight.title}</p>
                        <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">{insight.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </DashCard>
        </div>

        {/* Weekly mini-summary */}
        <DashCard delay={0.4}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/8 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
              </div>
              <h2 className="font-semibold text-sm font-display">Resumen semanal</h2>
            </div>
            <Link href="/dashboard/analytics">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-zinc-500 hover:text-emerald-400">
                Ver analítica
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Ingresos semana', value: formatCOP(4200000), change: '+12%', positive: true },
              { label: 'Citas completadas', value: '48', change: '+8%', positive: true },
              { label: 'Clientes nuevos', value: '12', change: '+25%', positive: true },
              { label: 'Tasa de cancelación', value: '3.2%', change: '-15%', positive: true },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <p className="text-[11px] text-zinc-600 font-medium">{item.label}</p>
                <p className="text-xl font-bold font-display mt-1 text-zinc-200">{item.value}</p>
                <div className={cn('flex items-center gap-1 mt-1.5 text-[11px] font-semibold', item.positive ? 'text-emerald-400' : 'text-rose-400')}>
                  {item.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </DashCard>
      </div>

      <QuickBookModal
        open={quickBookOpen}
        onOpenChange={setQuickBookOpen}
        businessId="biz-1"
      />
    </PageTransition>
  );
}
