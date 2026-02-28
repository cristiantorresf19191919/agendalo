'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { DollarSign, CreditCard, Smartphone, Building2, Banknote, TrendingUp, ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const paymentMethods = [
  { name: 'Nequi', icon: Smartphone, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', enabled: true, txns: 145, volume: 5_800_000 },
  { name: 'Daviplata', icon: Smartphone, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', enabled: true, txns: 89, volume: 3_200_000 },
  { name: 'PSE', icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', enabled: true, txns: 32, volume: 2_100_000 },
  { name: 'Tarjeta', icon: CreditCard, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', enabled: true, txns: 56, volume: 4_500_000 },
  { name: 'Efectivo', icon: Banknote, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', enabled: true, txns: 78, volume: 2_340_000 },
];

const recentTxns = [
  { id: '1', customer: 'María García', service: 'Corte clásico', method: 'Nequi', amount: 35_000, status: 'approved', date: '2026-02-28 14:30', tip: 5_000 },
  { id: '2', customer: 'Carlos R.', service: 'Combo corte + barba', method: 'Daviplata', amount: 55_000, status: 'approved', date: '2026-02-28 12:15', tip: 8_000 },
  { id: '3', customer: 'Laura Díaz', service: 'Facial premium', method: 'Tarjeta', amount: 120_000, status: 'approved', date: '2026-02-28 10:00', tip: 15_000 },
  { id: '4', customer: 'Pedro S.', service: 'Masaje capilar', method: 'PSE', amount: 45_000, status: 'pending', date: '2026-02-27 16:45', tip: 0 },
  { id: '5', customer: 'Ana M.', service: 'Barba completa', method: 'Efectivo', amount: 30_000, status: 'approved', date: '2026-02-27 15:20', tip: 5_000 },
];

const statusColors = { approved: 'text-emerald-400 bg-emerald-500/10', pending: 'text-amber-400 bg-amber-500/10', declined: 'text-rose-400 bg-rose-500/10' };
const statusLabels = { approved: 'Aprobado', pending: 'Pendiente', declined: 'Rechazado' };

function formatCOP(amount: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

export default function PaymentsPage() {
  const t = useTranslations('payments');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ingresos del mes" value={formatCOP(17_940_000)} icon={DollarSign} trend={{ value: 15, positive: true }} />
        <StatCard title="Transacciones" value={400} icon={Wallet} trend={{ value: 8, positive: true }} />
        <StatCard title="Propinas" value={formatCOP(486_000)} icon={TrendingUp} />
        <StatCard title="Ticket promedio" value={formatCOP(44_850)} icon={CreditCard} />
      </motion.div>

      {/* Payment methods */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5">
        <h3 className="text-sm font-semibold mb-4">{t('acceptedMethods')}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {paymentMethods.map((method, i) => (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
              className={cn('rounded-xl p-4 text-center border', method.border, method.bg)}
            >
              <method.icon className={cn('h-8 w-8 mx-auto mb-2', method.color)} />
              <p className={cn('font-semibold text-sm', method.color)}>{method.name}</p>
              <p className="text-lg font-bold mt-2">{method.txns}</p>
              <p className="text-xs text-muted-foreground">txns</p>
              <p className="text-xs font-semibold text-emerald-400 mt-1">{formatCOP(method.volume)}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent transactions */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5">
        <h3 className="text-sm font-semibold mb-4">Transacciones recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-zinc-800">
                <th className="pb-2 pr-4">Cliente</th>
                <th className="pb-2 pr-4">Servicio</th>
                <th className="pb-2 pr-4">Método</th>
                <th className="pb-2 pr-4">{t('amount')}</th>
                <th className="pb-2 pr-4">{t('tip')}</th>
                <th className="pb-2 pr-4">{t('status')}</th>
                <th className="pb-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentTxns.map((txn) => (
                <tr key={txn.id} className="border-b border-zinc-800/50 last:border-0">
                  <td className="py-3 pr-4 font-medium">{txn.customer}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{txn.service}</td>
                  <td className="py-3 pr-4"><span className="px-2 py-0.5 rounded-full text-xs bg-zinc-800">{txn.method}</span></td>
                  <td className="py-3 pr-4 font-semibold">{formatCOP(txn.amount)}</td>
                  <td className="py-3 pr-4 text-emerald-400">{txn.tip > 0 ? formatCOP(txn.tip) : '-'}</td>
                  <td className="py-3 pr-4"><span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[txn.status as keyof typeof statusColors])}>{statusLabels[txn.status as keyof typeof statusLabels]}</span></td>
                  <td className="py-3 text-muted-foreground text-xs">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </PageTransition>
  );
}
