'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Gift, CreditCard, DollarSign, TrendingUp, Plus, Send, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { Button } from '@/ui/components/common/button';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const mockGiftCards = [
  { id: '1', code: 'GIFT-A7B2C', amount: 100_000, balance: 100_000, recipient: 'Para: Ana Martínez', sender: 'María García', status: 'active', expiresAt: '2026-08-28', design: '🎁' },
  { id: '2', code: 'GIFT-D4E5F', amount: 200_000, balance: 120_000, recipient: 'Para: Laura Díaz', sender: 'Carlos R.', status: 'active', expiresAt: '2026-06-15', design: '💝' },
  { id: '3', code: 'GIFT-G8H9I', amount: 50_000, balance: 0, recipient: 'Para: Pedro S.', sender: 'Juan Pérez', status: 'redeemed', expiresAt: '2026-04-20', design: '🌟' },
  { id: '4', code: 'GIFT-J1K2L', amount: 150_000, balance: 150_000, recipient: 'Para: Camila T.', sender: 'Promoción', status: 'active', expiresAt: '2026-12-31', design: '✨' },
];

const presetAmounts = [50_000, 100_000, 150_000, 200_000, 300_000, 500_000];

const statusColors = { active: 'text-emerald-400 bg-emerald-500/10', redeemed: 'text-blue-400 bg-blue-500/10', expired: 'text-rose-400 bg-rose-500/10' };
const statusLabels = { active: 'Activa', redeemed: 'Canjeada', expired: 'Expirada' };

function formatCOP(amount: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

export default function GiftCardsPage() {
  const t = useTranslations('giftCards');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-display">{t('title')}</h1></div>
        <Button variant="cta" className="gap-2"><Plus className="h-4 w-4" />{t('create')}</Button>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('active')} value={3} icon={Gift} />
        <StatCard title="Ingresos por GC" value={formatCOP(500_000)} icon={DollarSign} />
        <StatCard title={t('redeemed')} value={1} icon={CheckCircle} />
        <StatCard title="Valor circulante" value={formatCOP(370_000)} icon={CreditCard} />
      </motion.div>

      {/* Preset amounts */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
        <h3 className="text-sm font-semibold mb-4">{t('presetAmounts')}</h3>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {presetAmounts.map((amount, i) => (
            <motion.div key={amount} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
              className="rounded-xl p-4 text-center cursor-pointer bg-muted/20 border border-white/[0.03] hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors"
            >
              <p className="text-lg font-bold text-emerald-400">{formatCOP(amount)}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Gift cards list */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
        <h3 className="text-sm font-semibold mb-4">Gift Cards emitidas</h3>
        <div className="space-y-3">
          {mockGiftCards.map((gc) => (
            <motion.div key={gc.id} variants={staggerItem} className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-white/[0.03]">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-purple-500/20 flex items-center justify-center text-2xl">{gc.design}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold font-mono">{gc.code}</p>
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', statusColors[gc.status as keyof typeof statusColors])}>{statusLabels[gc.status as keyof typeof statusLabels]}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{gc.recipient} · de {gc.sender}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Expira: {gc.expiresAt}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-400">{formatCOP(gc.balance)}</p>
                <p className="text-xs text-muted-foreground">de {formatCOP(gc.amount)}</p>
                {gc.balance > 0 && gc.balance < gc.amount && (
                  <div className="mt-1 h-1.5 w-20 rounded-full bg-[hsl(var(--surface-2))] overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(gc.balance / gc.amount) * 100}%` }} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageTransition>
  );
}
