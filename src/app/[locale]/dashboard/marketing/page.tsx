'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Megaphone, Send, Eye, MousePointerClick, DollarSign, Users, Target, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { Button } from '@/ui/components/common/button';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const mockCampaigns = [
  { id: '1', name: 'Reactivación: Clientes inactivos 30d', segment: 'Inactivos 30+ días', status: 'active', sent: 45, delivered: 43, read: 38, clicks: 12, conversions: 5, revenue: 250_000, createdAt: '2026-02-20' },
  { id: '2', name: 'Cumpleaños de la semana', segment: 'Cumpleaños esta semana', status: 'active', sent: 8, delivered: 8, read: 7, clicks: 4, conversions: 3, revenue: 180_000, createdAt: '2026-02-25' },
  { id: '3', name: 'Promo Lunes: 20% combo', segment: 'Todos los clientes', status: 'completed', sent: 155, delivered: 148, read: 126, clicks: 42, conversions: 18, revenue: 990_000, createdAt: '2026-02-10' },
  { id: '4', name: 'Recordatorio VIP', segment: 'Clientes VIP', status: 'draft', sent: 0, delivered: 0, read: 0, clicks: 0, conversions: 0, revenue: 0, createdAt: '2026-02-28' },
];

const segments = [
  { name: 'Todos los clientes', count: 155, icon: Users },
  { name: 'En riesgo de abandono', count: 12, icon: Target },
  { name: 'Inactivos 30+ días', count: 23, icon: Clock },
  { name: 'Cumpleaños esta semana', count: 4, icon: Zap },
  { name: 'Clientes VIP', count: 8, icon: DollarSign },
  { name: 'Nuevos clientes', count: 15, icon: Users },
];

const statusColors = { active: 'text-emerald-400 bg-emerald-500/10', completed: 'text-blue-400 bg-blue-500/10', draft: 'text-zinc-400 bg-zinc-500/10' };
const statusLabels = { active: 'Activa', completed: 'Completada', draft: 'Borrador' };

function formatCOP(amount: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

export default function MarketingPage() {
  const t = useTranslations('marketing');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">{t('title')}</h1><p className="text-sm text-muted-foreground mt-1">Campañas inteligentes por WhatsApp</p></div>
        <Button variant="cta" className="gap-2"><Megaphone className="h-4 w-4" />{t('createCampaign')}</Button>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('sent')} value={208} icon={Send} trend={{ value: 32, positive: true }} />
        <StatCard title={t('openRate')} value="85%" icon={Eye} />
        <StatCard title={t('conversions')} value={26} icon={MousePointerClick} trend={{ value: 18, positive: true }} />
        <StatCard title={t('attributedRevenue')} value={formatCOP(1_420_000)} icon={DollarSign} />
      </motion.div>

      {/* Segments */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5">
        <h3 className="text-sm font-semibold mb-4">{t('audienceSegment')}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {segments.map((seg, i) => (
            <motion.div key={seg.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-white/[0.03] cursor-pointer hover:border-emerald-500/20 transition-colors">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><seg.icon className="h-4 w-4 text-emerald-400" /></div>
              <div className="flex-1"><p className="text-sm font-medium">{seg.name}</p><p className="text-xs text-muted-foreground">{seg.count} clientes</p></div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Campaigns */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5">
        <h3 className="text-sm font-semibold mb-4">{t('campaigns')}</h3>
        <div className="space-y-4">
          {mockCampaigns.map((campaign) => (
            <motion.div key={campaign.id} variants={staggerItem} className="p-4 rounded-xl bg-muted/20 border border-white/[0.03]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2"><p className="text-sm font-semibold">{campaign.name}</p><span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', statusColors[campaign.status as keyof typeof statusColors])}>{statusLabels[campaign.status as keyof typeof statusLabels]}</span></div>
                  <p className="text-xs text-muted-foreground mt-0.5">{campaign.segment} · {campaign.createdAt}</p>
                </div>
                {campaign.revenue > 0 && <p className="text-sm font-bold text-emerald-400">{formatCOP(campaign.revenue)}</p>}
              </div>
              {campaign.sent > 0 && (
                <div className="grid grid-cols-5 gap-4 text-center">
                  <div><p className="text-sm font-semibold">{campaign.sent}</p><p className="text-[10px] text-muted-foreground">{t('sent')}</p></div>
                  <div><p className="text-sm font-semibold">{campaign.delivered}</p><p className="text-[10px] text-muted-foreground">{t('delivered')}</p></div>
                  <div><p className="text-sm font-semibold">{campaign.read}</p><p className="text-[10px] text-muted-foreground">{t('read')}</p></div>
                  <div><p className="text-sm font-semibold">{campaign.clicks}</p><p className="text-[10px] text-muted-foreground">{t('clicked')}</p></div>
                  <div><p className="text-sm font-semibold text-emerald-400">{campaign.conversions}</p><p className="text-[10px] text-muted-foreground">{t('conversions')}</p></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageTransition>
  );
}
