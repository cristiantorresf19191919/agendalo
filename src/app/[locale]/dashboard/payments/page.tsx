'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  DollarSign, CreditCard, Smartphone, Building2, Banknote, TrendingUp,
  TrendingDown, Wallet, Receipt, PieChart, ArrowUpRight, ArrowDownRight,
  ShoppingBag, Zap, Users, Scissors, Home, Droplets, AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { staggerContainer, staggerItem } from '@/ui/animations/variants';

/* ─── Mock data ─── */

const paymentMethods = [
  { name: 'Nequi', icon: Smartphone, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', txns: 145, volume: 5_800_000 },
  { name: 'Daviplata', icon: Smartphone, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', txns: 89, volume: 3_200_000 },
  { name: 'PSE', icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', txns: 32, volume: 2_100_000 },
  { name: 'Tarjeta', icon: CreditCard, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', txns: 56, volume: 4_500_000 },
  { name: 'Efectivo', icon: Banknote, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', txns: 78, volume: 2_340_000 },
];

const recentTxns = [
  { id: '1', customer: 'María García', service: 'Corte clásico', method: 'Nequi', amount: 35_000, status: 'approved' as const, date: '2026-02-28 14:30', tip: 5_000 },
  { id: '2', customer: 'Carlos R.', service: 'Combo corte + barba', method: 'Daviplata', amount: 55_000, status: 'approved' as const, date: '2026-02-28 12:15', tip: 8_000 },
  { id: '3', customer: 'Laura Díaz', service: 'Facial premium', method: 'Tarjeta', amount: 120_000, status: 'approved' as const, date: '2026-02-28 10:00', tip: 15_000 },
  { id: '4', customer: 'Pedro S.', service: 'Masaje capilar', method: 'PSE', amount: 45_000, status: 'pending' as const, date: '2026-02-27 16:45', tip: 0 },
  { id: '5', customer: 'Ana M.', service: 'Barba completa', method: 'Efectivo', amount: 30_000, status: 'approved' as const, date: '2026-02-27 15:20', tip: 5_000 },
  { id: '6', customer: 'Diego V.', service: 'Corte niño', method: 'Nequi', amount: 25_000, status: 'approved' as const, date: '2026-02-27 11:00', tip: 3_000 },
];

const expenses = [
  { category: 'Arriendo', icon: Home, amount: 3_500_000, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { category: 'Productos', icon: Droplets, amount: 1_200_000, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { category: 'Comisiones', icon: Users, amount: 5_376_000, color: 'text-amber-400', bg: 'bg-amber-500/10', note: '30% promedio' },
  { category: 'Servicios públicos', icon: Zap, amount: 650_000, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  { category: 'Suministros', icon: ShoppingBag, amount: 480_000, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { category: 'Equipos', icon: Scissors, amount: 350_000, color: 'text-zinc-400', bg: 'bg-zinc-500/10' },
];

const weeklyRevenue = [
  { week: 'Sem 1', income: 3_800_000, expenses: 2_900_000 },
  { week: 'Sem 2', income: 4_200_000, expenses: 2_700_000 },
  { week: 'Sem 3', income: 4_800_000, expenses: 3_100_000 },
  { week: 'Sem 4', income: 5_140_000, expenses: 2_856_000 },
];

const commissions = [
  { name: 'Carlos Mendoza', services: 178, rate: 30, revenue: 8_450_000, commission: 2_535_000 },
  { name: 'Julián Torres', services: 149, rate: 30, revenue: 6_890_000, commission: 2_067_000 },
];

const totalIncome = 17_940_000;
const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
const netProfit = totalIncome - totalExpenses;
const profitMargin = ((netProfit / totalIncome) * 100).toFixed(1);

const statusColors = { approved: 'text-emerald-400 bg-emerald-500/10', pending: 'text-amber-400 bg-amber-500/10', declined: 'text-rose-400 bg-rose-500/10' };
const statusLabels = { approved: 'Aprobado', pending: 'Pendiente', declined: 'Rechazado' };

function formatCOP(amount: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

/* ─── DashCard helper ─── */

function DashCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={staggerItem}
      className={cn('rounded-xl p-5 bg-[hsl(var(--surface-1))] border border-white/[0.04]', className)}
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

/* ─── P&L Bar Chart ─── */

function PLChart({ data }: { data: typeof weeklyRevenue }) {
  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expenses]));

  return (
    <div className="space-y-3">
      {data.map((week, i) => {
        const profit = week.income - week.expenses;
        const isPositive = profit >= 0;

        return (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">{week.week}</span>
              <span className={cn('text-xs font-bold font-display', isPositive ? 'text-emerald-400' : 'text-rose-400')}>
                {isPositive ? '+' : ''}{formatCOP(profit)}
              </span>
            </div>
            {/* Income bar */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-600 w-14">Ingresos</span>
              <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${(week.income / maxVal) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                />
              </div>
            </div>
            {/* Expense bar */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-600 w-14">Gastos</span>
              <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${(week.expenses / maxVal) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 + 0.05 }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Page ─── */

export default function PaymentsPage() {
  const t = useTranslations('payments');
  const [activeTab, setActiveTab] = useState<'income' | 'expenses' | 'pl'>('income');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">{t('title')}</h1>
          <p className="text-sm text-zinc-500 mt-1">Febrero 2026 · Barbería Urbana</p>
        </div>
        {/* Tab Toggle */}
        <div className="flex gap-1 p-1 rounded-lg bg-[hsl(var(--surface-1))] border border-white/[0.04]">
          {[
            { key: 'income' as const, label: 'Ingresos' },
            { key: 'expenses' as const, label: 'Gastos' },
            { key: 'pl' as const, label: 'P&L' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                activeTab === tab.key
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top KPI Row */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Ingresos brutos', value: formatCOP(totalIncome), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: { value: '+15%', positive: true } },
          { label: 'Gastos totales', value: formatCOP(totalExpenses), icon: Receipt, color: 'text-rose-400', bg: 'bg-rose-500/10', trend: { value: '+3%', positive: false } },
          { label: 'Ganancia neta', value: formatCOP(netProfit), icon: TrendingUp, color: netProfit > 0 ? 'text-emerald-400' : 'text-rose-400', bg: netProfit > 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10', trend: { value: `${profitMargin}% margen`, positive: netProfit > 0 } },
          { label: 'Propinas', value: formatCOP(486_000), icon: Wallet, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: { value: '+12%', positive: true } },
        ].map((kpi, i) => (
          <motion.div key={i} variants={staggerItem} className="rounded-xl p-4 bg-[hsl(var(--surface-1))] border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', kpi.bg)}>
                <kpi.icon className={cn('h-4 w-4', kpi.color)} />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-display">{kpi.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-display">{kpi.value}</span>
              <span className={cn('text-xs font-medium flex items-center gap-0.5', kpi.trend.positive ? 'text-emerald-400' : 'text-rose-400')}>
                {kpi.trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {kpi.trend.value}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'income' && (
          <motion.div key="income" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            {/* Payment methods */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <DashCard>
                <CardHeader icon={CreditCard} title={t('acceptedMethods')} />
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  {paymentMethods.map((method, i) => (
                    <motion.div
                      key={method.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn('rounded-xl p-4 text-center border bg-[hsl(var(--surface-2))]/50', method.border)}
                    >
                      <method.icon className={cn('h-7 w-7 mx-auto mb-2', method.color)} />
                      <p className={cn('font-semibold text-xs', method.color)}>{method.name}</p>
                      <p className="text-lg font-bold font-display mt-1">{method.txns}</p>
                      <p className="text-[10px] text-zinc-600">transacciones</p>
                      <p className="text-xs font-semibold text-emerald-400 mt-1">{formatCOP(method.volume)}</p>
                    </motion.div>
                  ))}
                </div>
              </DashCard>
            </motion.div>

            {/* Recent transactions */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <DashCard>
                <CardHeader icon={Receipt} title="Transacciones recientes" />
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-wider text-zinc-500 border-b border-white/[0.04]">
                        <th className="pb-3 pr-4 font-display">Cliente</th>
                        <th className="pb-3 pr-4 font-display">Servicio</th>
                        <th className="pb-3 pr-4 font-display">Método</th>
                        <th className="pb-3 pr-4 font-display">{t('amount')}</th>
                        <th className="pb-3 pr-4 font-display">{t('tip')}</th>
                        <th className="pb-3 pr-4 font-display">{t('status')}</th>
                        <th className="pb-3 font-display">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTxns.map((txn) => (
                        <tr key={txn.id} className="border-b border-white/[0.03] last:border-0">
                          <td className="py-3 pr-4 font-medium">{txn.customer}</td>
                          <td className="py-3 pr-4 text-zinc-400">{txn.service}</td>
                          <td className="py-3 pr-4"><span className="px-2 py-0.5 rounded-full text-[10px] bg-[hsl(var(--surface-2))] border border-white/[0.04]">{txn.method}</span></td>
                          <td className="py-3 pr-4 font-semibold font-display">{formatCOP(txn.amount)}</td>
                          <td className="py-3 pr-4 text-emerald-400">{txn.tip > 0 ? formatCOP(txn.tip) : '—'}</td>
                          <td className="py-3 pr-4"><span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', statusColors[txn.status])}>{statusLabels[txn.status]}</span></td>
                          <td className="py-3 text-zinc-500 text-xs">{txn.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DashCard>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'expenses' && (
          <motion.div key="expenses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Expense Breakdown */}
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <DashCard>
                  <CardHeader icon={PieChart} title="Desglose de gastos" />
                  <div className="space-y-3">
                    {expenses.sort((a, b) => b.amount - a.amount).map((exp, i) => {
                      const pct = (exp.amount / totalExpenses) * 100;
                      return (
                        <motion.div
                          key={exp.category}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3"
                        >
                          <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', exp.bg)}>
                            <exp.icon className={cn('h-4 w-4', exp.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{exp.category}</span>
                                {exp.note && <span className="text-[10px] text-zinc-600">({exp.note})</span>}
                              </div>
                              <span className="text-sm font-bold font-display">{formatCOP(exp.amount)}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                              <motion.div
                                className={cn('h-full rounded-full opacity-60', exp.bg.replace('/10', '/60'))}
                                style={{ backgroundColor: `var(--expense-${i})` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6, delay: i * 0.05 }}
                              />
                            </div>
                          </div>
                          <span className="text-xs text-zinc-500 w-10 text-right shrink-0">{pct.toFixed(0)}%</span>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Total gastos</span>
                    <span className="text-sm font-bold font-display text-rose-400">{formatCOP(totalExpenses)}</span>
                  </div>
                </DashCard>
              </motion.div>

              {/* Commission Tracking */}
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <DashCard>
                  <CardHeader icon={Users} title="Comisiones del equipo" />
                  <div className="space-y-4">
                    {commissions.map((pro, i) => (
                      <motion.div
                        key={pro.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-lg p-4 bg-[hsl(var(--surface-0))] border border-white/[0.03]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold">{pro.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {pro.rate}% comisión
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Servicios</p>
                            <p className="text-sm font-bold font-display mt-0.5">{pro.services}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Generado</p>
                            <p className="text-sm font-bold font-display mt-0.5 text-emerald-400">{formatCOP(pro.revenue)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Comisión</p>
                            <p className="text-sm font-bold font-display mt-0.5 text-amber-400">{formatCOP(pro.commission)}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Total comisiones</span>
                    <span className="text-sm font-bold font-display text-amber-400">
                      {formatCOP(commissions.reduce((s, c) => s + c.commission, 0))}
                    </span>
                  </div>
                </DashCard>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'pl' && (
          <motion.div key="pl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* P&L Summary */}
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-1">
                <DashCard>
                  <CardHeader icon={TrendingUp} title="Resumen P&L" />
                  <div className="space-y-4">
                    {/* Income */}
                    <div className="rounded-lg p-4 bg-emerald-500/5 border border-emerald-500/10">
                      <div className="flex items-center gap-2 mb-1">
                        <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs text-zinc-400">Ingresos brutos</span>
                      </div>
                      <p className="text-xl font-bold font-display text-emerald-400">{formatCOP(totalIncome)}</p>
                    </div>
                    {/* Expenses */}
                    <div className="rounded-lg p-4 bg-rose-500/5 border border-rose-500/10">
                      <div className="flex items-center gap-2 mb-1">
                        <ArrowDownRight className="h-4 w-4 text-rose-400" />
                        <span className="text-xs text-zinc-400">Gastos totales</span>
                      </div>
                      <p className="text-xl font-bold font-display text-rose-400">-{formatCOP(totalExpenses)}</p>
                    </div>
                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                    {/* Net Profit */}
                    <div className={cn('rounded-lg p-4 border', netProfit > 0 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20')}>
                      <div className="flex items-center gap-2 mb-1">
                        {netProfit > 0 ? <TrendingUp className="h-4 w-4 text-emerald-400" /> : <TrendingDown className="h-4 w-4 text-rose-400" />}
                        <span className="text-xs text-zinc-400">Ganancia neta</span>
                      </div>
                      <p className={cn('text-2xl font-bold font-display', netProfit > 0 ? 'text-emerald-400' : 'text-rose-400')}>
                        {formatCOP(netProfit)}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">Margen: {profitMargin}%</p>
                    </div>
                  </div>
                </DashCard>
              </motion.div>

              {/* Weekly P&L Chart */}
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-2">
                <DashCard>
                  <CardHeader icon={PieChart} title="Flujo semanal" action={
                    <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Ingresos</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Gastos</span>
                    </div>
                  } />
                  <PLChart data={weeklyRevenue} />
                  <div className="mt-4 pt-3 border-t border-white/[0.04]">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-zinc-400">
                          <span className="text-foreground font-medium">Semana 3</span> tuvo los gastos más altos (compra de productos trimestral).
                          La tendencia de ganancias es positiva: +{formatCOP(weeklyRevenue[3].income - weeklyRevenue[3].expenses - (weeklyRevenue[0].income - weeklyRevenue[0].expenses))} vs semana 1.
                        </p>
                      </div>
                    </div>
                  </div>
                </DashCard>
              </motion.div>
            </div>

            {/* Cost per Service */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <DashCard>
                <CardHeader icon={Scissors} title="Costo por servicio" action={
                  <span className="text-[10px] text-zinc-600">Basado en 400 servicios este mes</span>
                } />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Costo promedio', value: formatCOP(Math.round(totalExpenses / 400)), desc: 'por servicio prestado' },
                    { label: 'Ingreso promedio', value: formatCOP(Math.round(totalIncome / 400)), desc: 'por servicio prestado' },
                    { label: 'Ganancia por cita', value: formatCOP(Math.round(netProfit / 400)), desc: 'neto por servicio' },
                    { label: 'Break-even', value: '286 citas', desc: 'punto de equilibrio mensual' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-lg p-4 bg-[hsl(var(--surface-0))] border border-white/[0.03]"
                    >
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-display">{item.label}</p>
                      <p className="text-lg font-bold font-display mt-1">{item.value}</p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </DashCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
