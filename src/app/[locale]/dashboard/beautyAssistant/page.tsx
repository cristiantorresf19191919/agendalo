'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Bot, Sparkles, MessageCircle, TrendingUp, Calendar, Heart, Star, Palette, Scissors, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { Button } from '@/ui/components/common/button';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const mockSuggestions = [
  { client: 'María García', suggestion: 'Basado en sus últimos 3 cortes, sugiere un balayage primaveral', confidence: 92, service: 'Balayage', potential: 180_000 },
  { client: 'Laura Díaz', suggestion: 'Su facial fue hace 28 días. Sugiere agenda de mantenimiento', confidence: 88, service: 'Facial premium', potential: 120_000 },
  { client: 'Carlos R.', suggestion: 'Ha probado 3 estilos de barba. Sugerir nuevo diseño trending', confidence: 78, service: 'Barba diseño', potential: 45_000 },
];

const trendingStyles = [
  { name: 'Degradado bajo con textura', searches: 340, bookings: 45, emoji: '💈' },
  { name: 'Balayage miel en capas', searches: 280, bookings: 32, emoji: '✨' },
  { name: 'Barba esculpida definida', searches: 210, bookings: 28, emoji: '✂️' },
  { name: 'Uñas chrome effect', searches: 190, bookings: 22, emoji: '💅' },
];

const chatPreview = [
  { from: 'user', text: 'Hola, quiero cambiar de look pero no sé qué me queda', time: '14:30' },
  { from: 'ai', text: 'Basado en tu perfil (cabello liso, rostro ovalado), te recomiendo un degradado medio con textura arriba. ¿Te gustaría agendar con Carlos que es especialista en este estilo?', time: '14:30' },
  { from: 'user', text: 'Sí! Para el sábado a las 10', time: '14:31' },
  { from: 'ai', text: '¡Listo! Reservé tu cita con Carlos M. el sábado 7 de marzo a las 10:00 AM. Corte degradado con textura - $35.000. Te enviaré un recordatorio el viernes. 💈', time: '14:31' },
];

function formatCOP(n: number) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n); }

export default function BeautyAssistantPage() {
  const t = useTranslations('beautyAssistant');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">{t('title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">Recomendaciones inteligentes para tus clientes</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
          <Bot className="h-4 w-4 text-purple-400" />
          <span className="text-sm text-purple-400 font-medium">IA Activa</span>
        </div>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Recomendaciones" value={45} icon={Sparkles} trend={{ value: 30, positive: true }} />
        <StatCard title="Aceptadas" value={28} icon={Calendar} />
        <StatCard title="Ingresos IA" value={formatCOP(1_890_000)} icon={TrendingUp} />
        <StatCard title="Satisfacción" value="96%" icon={Heart} />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Suggestions */}
        <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-semibold">{t('basedOnPreferences')}</h3>
          </div>
          <div className="space-y-3">
            {mockSuggestions.map((s, i) => (
              <motion.div key={i} variants={staggerItem} className="p-4 rounded-xl bg-muted/20 border border-white/[0.03] space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{s.client}</p>
                  <span className="text-xs font-medium text-purple-400">{s.confidence}% match</span>
                </div>
                <p className="text-xs text-zinc-400">{s.suggestion}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">{s.service}</span>
                  <span className="text-xs text-emerald-400 font-medium">{formatCOP(s.potential)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Chat preview */}
        <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
          <h3 className="text-sm font-semibold mb-4">Vista previa de conversación IA</h3>
          <div className="space-y-3 max-h-[360px] overflow-y-auto">
            {chatPreview.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                className={cn('flex', msg.from === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div className={cn('max-w-[80%] rounded-2xl px-4 py-2.5', msg.from === 'user' ? 'bg-emerald-500/20 border border-emerald-500/20' : 'bg-purple-500/10 border border-purple-500/20')}>
                  <p className="text-sm text-zinc-200">{msg.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 text-right">{msg.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trending */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
        <h3 className="text-sm font-semibold mb-4">{t('trendingStyles')}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingStyles.map((style, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
              className="rounded-xl p-4 bg-muted/20 border border-white/[0.03] text-center"
            >
              <div className="text-3xl mb-2">{style.emoji}</div>
              <p className="text-sm font-medium">{style.name}</p>
              <div className="flex items-center justify-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>{style.searches} búsquedas</span>
                <span className="text-emerald-400">{style.bookings} reservas</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageTransition>
  );
}
