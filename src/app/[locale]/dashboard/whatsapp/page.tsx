'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { MessageCircle, Phone, Link2, MousePointerClick, ArrowRight, Send, Bot, Clock, CheckCheck, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { Button } from '@/ui/components/common/button';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const mockLinks = [
  { id: '1', name: 'Corte clásico', url: 'agendalo.co/r/abc123', clicks: 87, conversions: 34, rate: 39 },
  { id: '2', name: 'Combo corte + barba', url: 'agendalo.co/r/def456', clicks: 52, conversions: 21, rate: 40 },
  { id: '3', name: 'General', url: 'agendalo.co/r/ghi789', clicks: 124, conversions: 45, rate: 36 },
];

const quickReplies = [
  { id: '1', trigger: 'Horario', response: 'Nuestro horario es Lun-Sáb 9am-7pm. ¿Te gustaría agendar?' },
  { id: '2', trigger: 'Precios', response: 'Corte desde $30.000, Barba $25.000, Combo $50.000. Reserva aquí: {link}' },
  { id: '3', trigger: 'Ubicación', response: 'Estamos en Cra 7 #45-12, Chapinero. ¡Te esperamos!' },
];

const recentMessages = [
  { name: 'María G.', message: 'Hola, quiero reservar para el sábado', time: '14:32', status: 'read' },
  { name: 'Carlos R.', message: '¿Tienen disponibilidad mañana a las 3pm?', time: '13:15', status: 'delivered' },
  { name: 'Laura D.', message: 'Gracias por el recordatorio!', time: '11:45', status: 'read' },
  { name: 'Pedro S.', message: '¿Puedo cambiar mi cita del jueves?', time: '10:20', status: 'read' },
];

export default function WhatsAppPage() {
  const t = useTranslations('whatsappPage');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">{t('title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestiona tu comunicación por WhatsApp</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
          <span className="text-sm text-emerald-400 font-medium">Conectado</span>
        </div>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Mensajes enviados" value={342} icon={Send} trend={{ value: 18, positive: true }} />
        <StatCard title="Tasa de lectura" value="94%" icon={Eye} />
        <StatCard title="Clics en links" value={263} icon={MousePointerClick} />
        <StatCard title="Reservas por WA" value={100} icon={MessageCircle} trend={{ value: 25, positive: true }} />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Config */}
        <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5 space-y-4">
          <h3 className="text-sm font-semibold">Configuración</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-white/[0.03]">
              <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-emerald-400" /><div><p className="text-sm font-medium">{t('phoneNumber')}</p><p className="text-xs text-muted-foreground">+57 310 555 1234</p></div></div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-white/[0.03]">
              <div className="flex items-center gap-3"><MessageCircle className="h-4 w-4 text-emerald-400" /><div><p className="text-sm font-medium">{t('greetingMessage')}</p><p className="text-xs text-muted-foreground">¡Hola! Bienvenido a Barbería Urbana...</p></div></div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-white/[0.03]">
              <div className="flex items-center gap-3"><Bot className="h-4 w-4 text-purple-400" /><div><p className="text-sm font-medium">Agente IA</p><p className="text-xs text-muted-foreground">Reservas automáticas por voz y texto</p></div></div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400">Activo</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-white/[0.03]">
              <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-amber-400" /><div><p className="text-sm font-medium">{t('reminders')}</p><p className="text-xs text-muted-foreground">24h y 1h antes de la cita</p></div></div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400">Activo</span>
            </div>
          </div>
        </motion.div>

        {/* Recent messages */}
        <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
          <h3 className="text-sm font-semibold mb-4">Mensajes recientes</h3>
          <div className="space-y-3">
            {recentMessages.map((msg, i) => (
              <motion.div key={i} variants={staggerItem} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-white/[0.03]">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0"><MessageCircle className="h-5 w-5 text-emerald-400" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{msg.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">{msg.time}</p>
                  <CheckCheck className={cn('h-3.5 w-3.5 ml-auto', msg.status === 'read' ? 'text-blue-400' : 'text-zinc-500')} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Shareable links */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">{t('shareableLinks')}</h3>
          <Button variant="outline" size="sm" className="text-xs gap-1"><Link2 className="h-3 w-3" />{t('createLink')}</Button>
        </div>
        <div className="space-y-3">
          {mockLinks.map((link) => (
            <div key={link.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Link2 className="h-4 w-4 text-emerald-400" /></div>
                <div><p className="text-sm font-medium">{link.name}</p><p className="text-xs text-muted-foreground font-mono">{link.url}</p></div>
              </div>
              <div className="flex items-center gap-6 text-center">
                <div><p className="text-sm font-semibold">{link.clicks}</p><p className="text-[10px] text-muted-foreground">{t('clicks')}</p></div>
                <div><p className="text-sm font-semibold text-emerald-400">{link.conversions}</p><p className="text-[10px] text-muted-foreground">{t('conversions')}</p></div>
                <div><p className="text-sm font-semibold">{link.rate}%</p><p className="text-[10px] text-muted-foreground">CVR</p></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick replies */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
        <h3 className="text-sm font-semibold mb-4">{t('quickReplies')}</h3>
        <div className="space-y-3">
          {quickReplies.map((qr) => (
            <div key={qr.id} className="p-3 rounded-xl bg-muted/20 border border-white/[0.03]">
              <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">{qr.trigger}</span></div>
              <p className="text-sm text-zinc-300">{qr.response}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </PageTransition>
  );
}
