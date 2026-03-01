'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, TrendingUp, Star, Clock, AlertTriangle, Award,
  ChevronDown, ChevronUp, Zap, Target, BarChart3, CalendarCheck,
  DollarSign, UserCheck, Plus, Mail, Briefcase,
} from 'lucide-react';
import { Button } from '@/ui/components/common/button';
import { Modal } from '@/ui/components/common/modal';
import { Input } from '@/ui/components/common/input';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { staggerContainer, staggerItem } from '@/ui/animations/variants';
import { getProfessionalsByBusinessId, getServicesByBusinessId, getMockServiceAssignments } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

/* ─── Mock performance data ─── */

interface ProfessionalPerformance {
  id: string;
  revenue: number;
  revenueTarget: number;
  bookings: number;
  completedBookings: number;
  noShows: number;
  avgRating: number;
  reviewCount: number;
  avgServiceTime: number; // minutes
  utilization: number; // percentage
  returnRate: number; // percentage of returning clients
  topService: string;
  weeklyBookings: number[];
  hourlyDemand: number[]; // 8am to 8pm
  tips: number;
  trend: number; // percentage change from last month
}

const performanceData: Record<string, ProfessionalPerformance> = {
  'pro-1-1': {
    id: 'pro-1-1', revenue: 8_450_000, revenueTarget: 9_000_000, bookings: 187, completedBookings: 178,
    noShows: 4, avgRating: 4.9, reviewCount: 89, avgServiceTime: 33, utilization: 87,
    returnRate: 72, topService: 'Corte clásico', weeklyBookings: [28, 32, 25, 30, 34, 22, 16],
    hourlyDemand: [3, 5, 7, 8, 6, 4, 7, 9, 8, 5, 3, 2, 1], tips: 486_000, trend: 12,
  },
  'pro-1-2': {
    id: 'pro-1-2', revenue: 6_890_000, revenueTarget: 8_000_000, bookings: 156, completedBookings: 149,
    noShows: 3, avgRating: 4.7, reviewCount: 62, avgServiceTime: 38, utilization: 74,
    returnRate: 65, topService: 'Corte + Barba', weeklyBookings: [22, 26, 20, 24, 28, 18, 12],
    hourlyDemand: [2, 4, 6, 7, 5, 3, 6, 8, 7, 4, 2, 1, 0], tips: 342_000, trend: 8,
  },
};

const leaderboardMetrics = [
  { key: 'revenue', label: 'Ingresos', icon: DollarSign, format: (v: number) => formatCOP(v) },
  { key: 'bookings', label: 'Citas', icon: CalendarCheck, format: (v: number) => String(v) },
  { key: 'avgRating', label: 'Calificación', icon: Star, format: (v: number) => v.toFixed(1) },
  { key: 'utilization', label: 'Utilización', icon: Target, format: (v: number) => `${v}%` },
] as const;

function formatCOP(amount: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

/* ─── DashCard helper ─── */

function DashCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={cn(
        'rounded-xl p-5 bg-[hsl(var(--surface-1))] border border-white/[0.04]',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function CardHeader({ icon: Icon, title, action }: { icon: React.ElementType; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-emerald-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-display">{title}</h3>
      </div>
      {action}
    </div>
  );
}

/* ─── Performance Ring ─── */

function PerformanceRing({ value, max, size = 64, label }: { value: number; max: number; size?: number; label: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const color = pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-rose-400';
  const strokeColor = pct >= 80 ? '#34d399' : pct >= 60 ? '#fbbf24' : '#f87171';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(220 10% 14%)" strokeWidth={4} fill="none" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            stroke={strokeColor} strokeWidth={4} fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('text-sm font-bold font-display', color)}>{Math.round(pct)}%</span>
        </div>
      </div>
      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

/* ─── Weekly Spark Chart ─── */

function WeeklySparkChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const days = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];

  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <motion.div
            className="w-full rounded-sm bg-emerald-500/60"
            initial={{ height: 0 }}
            animate={{ height: max > 0 ? `${(v / max) * 36}px` : '2px' }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          <span className="text-[9px] text-zinc-600">{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Hourly Demand Heatmap Row ─── */

function HourlyDemandRow({ data, name }: { data: number[]; name: string }) {
  const max = Math.max(...data, 1);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500 w-20 truncate">{name}</span>
      <div className="flex gap-0.5 flex-1">
        {data.map((v, i) => {
          const intensity = v / max;
          return (
            <motion.div
              key={i}
              className="flex-1 h-6 rounded-sm"
              title={`${8 + i}:00 — ${v} citas`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                backgroundColor: intensity > 0.7
                  ? 'rgba(52, 211, 153, 0.5)'
                  : intensity > 0.4
                    ? 'rgba(52, 211, 153, 0.25)'
                    : intensity > 0
                      ? 'rgba(52, 211, 153, 0.1)'
                      : 'rgba(255, 255, 255, 0.02)',
              }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */

export default function ProfessionalsPage() {
  const t = useTranslations('professionals');
  const tCommon = useTranslations('common');
  const [showCreate, setShowCreate] = useState(false);
  const [expandedPro, setExpandedPro] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<typeof leaderboardMetrics[number]['key']>('revenue');

  const professionals = getProfessionalsByBusinessId('biz-1');
  const services = getServicesByBusinessId('biz-1');
  const assignments = getMockServiceAssignments('biz-1');

  // Aggregate stats
  const totalRevenue = Object.values(performanceData).reduce((s, p) => s + p.revenue, 0);
  const totalBookings = Object.values(performanceData).reduce((s, p) => s + p.bookings, 0);
  const avgRating = Object.values(performanceData).reduce((s, p) => s + p.avgRating, 0) / Object.values(performanceData).length;
  const totalNoShows = Object.values(performanceData).reduce((s, p) => s + p.noShows, 0);

  // Sort professionals by active metric
  const sortedProfessionals = [...professionals].sort((a, b) => {
    const pa = performanceData[a.id];
    const pb = performanceData[b.id];
    if (!pa || !pb) return 0;
    return (pb[activeMetric] as number) - (pa[activeMetric] as number);
  });

  return (
    <PageTransition>
      <div className="space-y-6 pt-14 lg:pt-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">Equipo & Rendimiento</h1>
            <p className="text-sm text-zinc-500 mt-1">
              {professionals.length} profesionales activos · Febrero 2026
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('addProfessional')}
          </Button>
        </div>

        {/* Team Summary KPIs */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Ingresos equipo', value: formatCOP(totalRevenue), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+15%' },
            { label: 'Citas totales', value: String(totalBookings), icon: CalendarCheck, color: 'text-blue-400', bg: 'bg-blue-500/10', trend: '+8%' },
            { label: 'Rating promedio', value: avgRating.toFixed(1), icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: '+0.2' },
            { label: 'No-shows', value: String(totalNoShows), icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10', trend: '-2' },
          ].map((kpi, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="rounded-xl p-4 bg-[hsl(var(--surface-1))] border border-white/[0.04]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', kpi.bg)}>
                  <kpi.icon className={cn('h-4 w-4', kpi.color)} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-display">{kpi.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-display">{kpi.value}</span>
                <span className={cn('text-xs font-medium', kpi.trend.startsWith('+') || kpi.trend.startsWith('-') && kpi.label === 'No-shows' ? 'text-emerald-400' : 'text-zinc-500')}>
                  {kpi.trend}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <DashCard>
              <CardHeader icon={Award} title="Ranking del equipo" action={
                <div className="flex gap-1">
                  {leaderboardMetrics.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setActiveMetric(m.key)}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wider transition-colors',
                        activeMetric === m.key
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              } />

              <div className="space-y-2">
                {sortedProfessionals.map((pro, rank) => {
                  const perf = performanceData[pro.id];
                  if (!perf) return null;
                  const assignment = assignments.find((a) => a.professionalId === pro.id);
                  const assignedCount = assignment?.serviceIds.length ?? 0;
                  const isExpanded = expandedPro === pro.id;
                  const metric = leaderboardMetrics.find((m) => m.key === activeMetric)!;
                  const maxVal = Math.max(...sortedProfessionals.map((p) => {
                    const d = performanceData[p.id];
                    return d ? (d[activeMetric] as number) : 0;
                  }));
                  const barPct = maxVal > 0 ? ((perf[activeMetric] as number) / maxVal) * 100 : 0;

                  return (
                    <motion.div
                      key={pro.id}
                      layout
                      variants={staggerItem}
                      className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-2))]/50 overflow-hidden"
                    >
                      {/* Main row */}
                      <button
                        onClick={() => setExpandedPro(isExpanded ? null : pro.id)}
                        className="w-full p-4 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Rank badge */}
                        <div className={cn(
                          'h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold font-display shrink-0',
                          rank === 0 ? 'bg-amber-500/15 text-amber-400' : 'bg-white/[0.04] text-zinc-500'
                        )}>
                          {rank === 0 ? <Award className="h-4 w-4" /> : `#${rank + 1}`}
                        </div>

                        {/* Avatar */}
                        {pro.avatarUrl ? (
                          <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-emerald-500/20 shrink-0">
                            <Image src={pro.avatarUrl} alt={pro.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-sm font-bold shrink-0">
                            {pro.name.charAt(0)}
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm truncate">{pro.name}</p>
                            <div className="flex gap-1">
                              {pro.specialties.slice(0, 2).map((s) => (
                                <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400/70 border border-emerald-500/10">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                          {/* Performance bar */}
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                              <motion.div
                                className={cn(
                                  'h-full rounded-full',
                                  rank === 0 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                )}
                                initial={{ width: 0 }}
                                animate={{ width: `${barPct}%` }}
                                transition={{ duration: 0.8, delay: rank * 0.1, ease: [0.22, 1, 0.36, 1] }}
                              />
                            </div>
                            <span className="text-xs font-bold font-display text-zinc-300 w-24 text-right shrink-0">
                              {metric.format(perf[activeMetric] as number)}
                            </span>
                          </div>
                        </div>

                        {/* Expand */}
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-zinc-500 shrink-0" /> : <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />}
                      </button>

                      {/* Expanded detail */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-2 border-t border-white/[0.04]">
                              {/* KPI Grid */}
                              <div className="grid grid-cols-4 gap-3 mb-4">
                                {[
                                  { label: 'Ingresos', value: formatCOP(perf.revenue), sub: `Meta: ${formatCOP(perf.revenueTarget)}` },
                                  { label: 'Propinas', value: formatCOP(perf.tips), sub: `${((perf.tips / perf.revenue) * 100).toFixed(1)}% del ingreso` },
                                  { label: 'Retención', value: `${perf.returnRate}%`, sub: 'Clientes que vuelven' },
                                  { label: 'Tiempo prom.', value: `${perf.avgServiceTime}min`, sub: `${assignedCount} servicios` },
                                ].map((kpi, i) => (
                                  <div key={i} className="rounded-lg p-3 bg-[hsl(var(--surface-0))] border border-white/[0.03]">
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{kpi.label}</p>
                                    <p className="text-sm font-bold font-display mt-1">{kpi.value}</p>
                                    <p className="text-[10px] text-zinc-600 mt-0.5">{kpi.sub}</p>
                                  </div>
                                ))}
                              </div>

                              {/* Rings + Chart Row */}
                              <div className="flex items-start gap-6">
                                <div className="flex gap-4">
                                  <PerformanceRing value={perf.revenue} max={perf.revenueTarget} label="Meta" />
                                  <PerformanceRing value={perf.utilization} max={100} label="Ocupación" />
                                  <PerformanceRing value={perf.completedBookings} max={perf.bookings} label="Completadas" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Citas por día</p>
                                  <WeeklySparkChart data={perf.weeklyBookings} />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </DashCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Utilization Comparison */}
            <DashCard>
              <CardHeader icon={Target} title="Utilización" />
              <div className="space-y-4">
                {professionals.map((pro) => {
                  const perf = performanceData[pro.id];
                  if (!perf) return null;
                  const utilColor = perf.utilization >= 80 ? 'from-emerald-500 to-teal-400' : perf.utilization >= 60 ? 'from-amber-500 to-amber-400' : 'from-rose-500 to-rose-400';

                  return (
                    <div key={pro.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-zinc-400">{pro.name.split(' ')[0]}</span>
                        <span className="text-xs font-bold font-display">{perf.utilization}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                        <motion.div
                          className={cn('h-full rounded-full bg-gradient-to-r', utilColor)}
                          initial={{ width: 0 }}
                          animate={{ width: `${perf.utilization}%` }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04]">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Zap className="h-3 w-3 text-amber-400" />
                  <span>Objetivo del equipo: 85% utilización</span>
                </div>
              </div>
            </DashCard>

            {/* Rating Comparison */}
            <DashCard>
              <CardHeader icon={Star} title="Satisfacción" />
              <div className="space-y-4">
                {professionals.map((pro) => {
                  const perf = performanceData[pro.id];
                  if (!perf) return null;

                  return (
                    <div key={pro.id} className="flex items-center gap-3">
                      {pro.avatarUrl ? (
                        <div className="h-8 w-8 rounded-full overflow-hidden shrink-0">
                          <Image src={pro.avatarUrl} alt={pro.name} width={32} height={32} className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-xs font-bold shrink-0">
                          {pro.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{pro.name.split(' ')[0]}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'h-3 w-3',
                                i < Math.floor(perf.avgRating) ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold font-display">{perf.avgRating}</p>
                        <p className="text-[10px] text-zinc-600">{perf.reviewCount} reseñas</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DashCard>

            {/* No-Shows Alert */}
            <DashCard className="border-rose-500/10">
              <CardHeader icon={AlertTriangle} title="No-shows este mes" />
              <div className="space-y-3">
                {professionals.map((pro) => {
                  const perf = performanceData[pro.id];
                  if (!perf) return null;
                  const rate = perf.bookings > 0 ? ((perf.noShows / perf.bookings) * 100).toFixed(1) : '0';

                  return (
                    <div key={pro.id} className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">{pro.name.split(' ')[0]}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold font-display text-rose-400">{perf.noShows}</span>
                        <span className="text-[10px] text-zinc-600">({rate}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.04]">
                <p className="text-[10px] text-zinc-600">
                  Promedio del sector: 5.2% · Tu equipo: {((totalNoShows / totalBookings) * 100).toFixed(1)}%
                </p>
              </div>
            </DashCard>
          </div>
        </div>

        {/* Hourly Demand Heatmap */}
        <DashCard>
          <CardHeader icon={BarChart3} title="Demanda por hora" action={
            <div className="flex items-center gap-3 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500/10" /> Baja</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500/25" /> Media</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500/50" /> Alta</span>
            </div>
          } />
          {/* Hour labels */}
          <div className="flex items-center gap-2 mb-2">
            <span className="w-20" />
            <div className="flex gap-0.5 flex-1">
              {Array.from({ length: 13 }).map((_, i) => (
                <span key={i} className="flex-1 text-center text-[9px] text-zinc-600">{8 + i}h</span>
              ))}
            </div>
          </div>
          {/* Rows */}
          <div className="space-y-1">
            {professionals.map((pro) => {
              const perf = performanceData[pro.id];
              if (!perf) return null;
              return <HourlyDemandRow key={pro.id} data={perf.hourlyDemand} name={pro.name.split(' ')[0]} />;
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <p className="text-xs text-zinc-500">Hora pico del equipo: <span className="text-foreground font-medium">3:00 PM</span> — considera abrir otro turno</p>
          </div>
        </DashCard>

        {/* Create Modal */}
        <Modal open={showCreate} onOpenChange={setShowCreate} title={t('addProfessional')}>
          <form className="space-y-4">
            <Input label={t('name')} />
            <Input label={t('email')} type="email" />
            <Input label={t('specialties')} placeholder="Corte, Barba, Color..." />
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowCreate(false)} type="button">
                {tCommon('cancel')}
              </Button>
              <Button type="submit">{tCommon('create')}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageTransition>
  );
}
