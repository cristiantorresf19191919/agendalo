'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Trophy, Gift, Users, TrendingUp, Star, Crown, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const tiers = [
  { name: 'Bronce', icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/20', minPoints: 0, discount: 5, members: 89 },
  { name: 'Plata', icon: Award, color: 'text-zinc-300', bg: 'bg-zinc-300/10', border: 'border-zinc-300/20', minPoints: 500, discount: 10, members: 42 },
  { name: 'Oro', icon: Crown, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', minPoints: 1500, discount: 15, members: 18 },
  { name: 'Platino', icon: Star, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', minPoints: 5000, discount: 25, members: 6 },
];

const topMembers = [
  { name: 'María García', tier: 'Platino', points: 8420, visits: 67, spent: 4_250_000 },
  { name: 'Carlos Rodríguez', tier: 'Platino', points: 7100, visits: 54, spent: 3_800_000 },
  { name: 'Laura Díaz', tier: 'Oro', points: 3200, visits: 38, spent: 2_100_000 },
  { name: 'Pedro Sánchez', tier: 'Oro', points: 2800, visits: 32, spent: 1_900_000 },
  { name: 'Ana Martínez', tier: 'Plata', points: 1200, visits: 18, spent: 980_000 },
];

const recentActivity = [
  { name: 'María García', action: 'Ganó 150 pts', type: 'earned', time: 'Hace 2h' },
  { name: 'Juan Pérez', action: 'Canjeó descuento 10%', type: 'redeemed', time: 'Hace 5h' },
  { name: 'Laura Díaz', action: 'Subió a Oro', type: 'upgrade', time: 'Ayer' },
  { name: 'Carlos R.', action: 'Ganó 200 pts (referido)', type: 'earned', time: 'Ayer' },
  { name: 'Ana M.', action: 'Ganó 50 pts (reseña)', type: 'earned', time: 'Hace 2 días' },
];

function formatCOP(amount: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

export default function LoyaltyPage() {
  const t = useTranslations('loyalty');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestiona tu programa de puntos y niveles</p>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Miembros activos" value={155} icon={Users} trend={{ value: 12, positive: true }} />
        <StatCard title="Puntos emitidos" value="24,800" icon={Trophy} />
        <StatCard title="Puntos canjeados" value="8,200" icon={Gift} />
        <StatCard title="Retención" value="78%" icon={TrendingUp} trend={{ value: 5, positive: true }} />
      </motion.div>

      {/* Tiers */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5">
        <h3 className="text-sm font-semibold mb-4">{t('tiers')}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
              className={cn('rounded-xl p-5 text-center border', tier.border, tier.bg)}
            >
              <tier.icon className={cn('h-8 w-8 mx-auto mb-2', tier.color)} />
              <p className={cn('font-bold text-lg', tier.color)}>{tier.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{tier.minPoints}+ pts</p>
              <div className="mt-3 space-y-1">
                <p className="text-sm font-semibold">{tier.discount}% dto.</p>
                <p className="text-xs text-muted-foreground">{tier.members} miembros</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top members */}
        <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5">
          <h3 className="text-sm font-semibold mb-4">Top miembros</h3>
          <div className="space-y-3">
            {topMembers.map((member, i) => (
              <motion.div key={member.name} variants={staggerItem} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-400">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.tier} · {member.visits} visitas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-400">{member.points.toLocaleString()} pts</p>
                  <p className="text-xs text-muted-foreground">{formatCOP(member.spent)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5">
          <h3 className="text-sm font-semibold mb-4">Actividad reciente</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <motion.div key={i} variants={staggerItem} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={cn('h-8 w-8 rounded-full flex items-center justify-center',
                    activity.type === 'earned' ? 'bg-emerald-500/10' : activity.type === 'redeemed' ? 'bg-purple-500/10' : 'bg-amber-500/10'
                  )}>
                    {activity.type === 'earned' ? <TrendingUp className="h-4 w-4 text-emerald-400" /> :
                     activity.type === 'redeemed' ? <Gift className="h-4 w-4 text-purple-400" /> :
                     <Crown className="h-4 w-4 text-amber-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
