'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Bell, MessageCircle, Mail, Smartphone, Clock, CalendarCheck, Star, Gift, Send, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const channels = [
  { name: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', enabled: true, sent: 342, rate: '94%' },
  { name: 'Email', icon: Mail, color: 'text-blue-400', bg: 'bg-blue-500/10', enabled: true, sent: 156, rate: '45%' },
  { name: 'SMS', icon: Smartphone, color: 'text-purple-400', bg: 'bg-purple-500/10', enabled: false, sent: 0, rate: '-' },
  { name: 'Push', icon: Bell, color: 'text-amber-400', bg: 'bg-amber-500/10', enabled: true, sent: 89, rate: '62%' },
];

const reminders = [
  { name: '24 horas antes', icon: Clock, enabled: true, channel: 'WhatsApp' },
  { name: '1 hora antes', icon: Clock, enabled: true, channel: 'WhatsApp' },
  { name: 'Solicitar reseña (post-cita)', icon: Star, enabled: true, channel: 'WhatsApp' },
  { name: 'Slot disponible (lista espera)', icon: CalendarCheck, enabled: true, channel: 'WhatsApp' },
  { name: 'Cumpleaños', icon: Gift, enabled: true, channel: 'Email' },
];

const recentNotifs = [
  { type: 'reminder', recipient: 'María García', message: 'Recordatorio: Corte clásico mañana a las 10am', channel: 'WhatsApp', time: 'Hace 1h', status: 'delivered' },
  { type: 'confirmation', recipient: 'Carlos R.', message: 'Tu cita fue confirmada: Barba completa, Sáb 3pm', channel: 'WhatsApp', time: 'Hace 2h', status: 'read' },
  { type: 'review', recipient: 'Laura Díaz', message: '¿Cómo fue tu experiencia? Déjanos tu reseña', channel: 'WhatsApp', time: 'Hace 5h', status: 'read' },
  { type: 'loyalty', recipient: 'Pedro S.', message: '¡Subiste a nivel Oro! Disfruta 15% de descuento', channel: 'Email', time: 'Ayer', status: 'delivered' },
  { type: 'waitlist', recipient: 'Ana M.', message: '¡Hay un cupo disponible! Reserva ahora', channel: 'WhatsApp', time: 'Ayer', status: 'read' },
];

const typeColors = { reminder: 'bg-blue-500/10 text-blue-400', confirmation: 'bg-emerald-500/10 text-emerald-400', review: 'bg-amber-500/10 text-amber-400', loyalty: 'bg-purple-500/10 text-purple-400', waitlist: 'bg-pink-500/10 text-pink-400' };

export default function NotificationsPage() {
  const t = useTranslations('notificationsPage');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div><h1 className="text-2xl font-bold font-display">{t('title')}</h1></div>

      {/* Channels */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
        <h3 className="text-sm font-semibold mb-4">{t('channels')}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {channels.map((ch, i) => (
            <motion.div key={ch.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={cn('rounded-xl p-4 text-center border', ch.enabled ? 'border-zinc-700 bg-muted/20' : 'border-white/[0.03] bg-[hsl(var(--surface-1))]/40 opacity-60')}
            >
              <ch.icon className={cn('h-8 w-8 mx-auto mb-2', ch.color)} />
              <p className="font-semibold text-sm">{ch.name}</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <span className={cn('h-2 w-2 rounded-full', ch.enabled ? 'bg-emerald-500' : 'bg-zinc-600')} />
                <span className="text-xs text-muted-foreground">{ch.enabled ? 'Activo' : 'Inactivo'}</span>
              </div>
              {ch.enabled && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div><p className="font-semibold">{ch.sent}</p><p className="text-muted-foreground">Enviados</p></div>
                  <div><p className="font-semibold">{ch.rate}</p><p className="text-muted-foreground">Apertura</p></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Reminder config */}
        <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
          <h3 className="text-sm font-semibold mb-4">{t('reminderSettings')}</h3>
          <div className="space-y-3">
            {reminders.map((r, i) => (
              <motion.div key={i} variants={staggerItem} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><r.icon className="h-4 w-4 text-emerald-400" /></div>
                  <div><p className="text-sm font-medium">{r.name}</p><p className="text-xs text-muted-foreground">via {r.channel}</p></div>
                </div>
                <div className={cn('w-10 h-5 rounded-full transition-colors relative cursor-pointer', r.enabled ? 'bg-emerald-500' : 'bg-zinc-700')}>
                  <div className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform', r.enabled ? 'translate-x-5' : 'translate-x-0.5')} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent notifications */}
        <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
          <h3 className="text-sm font-semibold mb-4">Notificaciones enviadas</h3>
          <div className="space-y-3">
            {recentNotifs.map((n, i) => (
              <motion.div key={i} variants={staggerItem} className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-white/[0.03]">
                <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', typeColors[n.type as keyof typeof typeColors])}>
                  <Send className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{n.recipient}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground">{n.channel}</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
