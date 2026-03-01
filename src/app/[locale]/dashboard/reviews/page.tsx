'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  Star, Camera, MessageSquare, ThumbsUp, CheckCircle2,
  TrendingUp, AlertCircle, Zap, BarChart3, ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { Button } from '@/ui/components/common/button';
import { staggerContainer, staggerItem } from '@/ui/animations/variants';

/* ─── Mock Data ─── */

const mockReviews = [
  { id: '1', author: 'María García', avatar: 'M', rating: 5, text: 'Excelente servicio, Carlos es el mejor barbero. Siempre salgo contento con mi corte.', service: 'Corte clásico', professional: 'Carlos M.', date: '2026-02-25', photos: 2, helpful: 12, verified: true, responded: true, response: '¡Gracias María! Nos encanta que sigas confiando en nosotros.' },
  { id: '2', author: 'Juan Pérez', avatar: 'J', rating: 4, text: 'Muy buen corte, aunque tuve que esperar un poco más de lo esperado. El resultado final valió la pena.', service: 'Combo corte + barba', professional: 'Andrés P.', date: '2026-02-23', photos: 0, helpful: 5, verified: true, responded: false, response: '' },
  { id: '3', author: 'Laura Rodríguez', avatar: 'L', rating: 5, text: 'Diana es increíble con los tratamientos faciales. Mi piel se ve radiante después de cada sesión.', service: 'Facial premium', professional: 'Diana R.', date: '2026-02-20', photos: 3, helpful: 18, verified: true, responded: true, response: '¡Gracias Laura! Diana estará feliz de leer esto.' },
  { id: '4', author: 'Andrés Martínez', avatar: 'A', rating: 3, text: 'El servicio es bueno pero el precio subió desde mi última visita. Sería bueno avisar antes.', service: 'Masaje capilar', professional: 'Carlos M.', date: '2026-02-18', photos: 0, helpful: 3, verified: true, responded: false, response: '' },
  { id: '5', author: 'Camila Torres', avatar: 'C', rating: 5, text: 'Reservé por primera vez con Agendalo y fue súper fácil. El lugar es hermoso y el servicio de primera.', service: 'Barba completa', professional: 'Andrés P.', date: '2026-02-15', photos: 1, helpful: 8, verified: true, responded: true, response: '¡Bienvenida Camila! Esperamos verte pronto.' },
];

const distribution = [
  { stars: 5, count: 156, pct: 72 },
  { stars: 4, count: 38, pct: 18 },
  { stars: 3, count: 12, pct: 6 },
  { stars: 2, count: 5, pct: 2 },
  { stars: 1, count: 4, pct: 2 },
];

const sentimentKeywords = [
  { word: 'Excelente', count: 42, positive: true },
  { word: 'Profesional', count: 38, positive: true },
  { word: 'Rápido', count: 25, positive: true },
  { word: 'Espera larga', count: 8, positive: false },
  { word: 'Precio', count: 6, positive: false },
];

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

/* ─── Main Page ─── */

export default function ReviewsPage() {
  const t = useTranslations('reviewsPage');
  const [filter, setFilter] = useState<'all' | 'photo' | 'unresponded'>('all');

  const filtered = mockReviews.filter((r) => {
    if (filter === 'photo') return r.photos > 0;
    if (filter === 'unresponded') return !r.responded;
    return true;
  });

  const unrespondedCount = mockReviews.filter((r) => !r.responded).length;

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">{t('title')}</h1>
          <p className="text-sm text-zinc-500 mt-1">215 reseñas totales · 4.7 promedio</p>
        </div>
        {unrespondedCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-amber-400 font-medium">{unrespondedCount} sin responder</span>
          </div>
        )}
      </div>

      {/* KPI Row */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title={t('averageRating')} value="4.7" icon={Star} trend={{ value: 3.2, positive: true }} />
        <StatCard title={t('totalReviews')} value={215} icon={MessageSquare} trend={{ value: 15, positive: true }} />
        <StatCard title={t('photoReviews')} value={48} icon={Camera} />
        <StatCard title={t('helpful')} value={186} icon={ThumbsUp} />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Distribution + Sentiment */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
          {/* Rating Distribution */}
          <DashCard>
            <CardHeader icon={BarChart3} title={t('ratingDistribution')} />
            <div className="space-y-3">
              {distribution.map((d) => (
                <div key={d.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium font-display">{d.stars}</span>
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.pct}%` }}
                      transition={{ duration: 0.8, delay: (5 - d.stars) * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                    />
                  </div>
                  <span className="text-xs text-zinc-500 w-10 text-right font-display">{d.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-4xl font-bold text-gradient-primary font-display">4.7</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn('h-4 w-4', i < 4 ? 'text-amber-400 fill-amber-400' : 'text-amber-400/50 fill-amber-400/50')} />
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-1">215 {t('totalReviews').toLowerCase()}</p>
            </div>
          </DashCard>

          {/* Sentiment Keywords */}
          <DashCard>
            <CardHeader icon={Zap} title="Palabras clave" />
            <div className="flex flex-wrap gap-2">
              {sentimentKeywords.map((kw) => (
                <div
                  key={kw.word}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border',
                    kw.positive
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  )}
                >
                  {kw.word} <span className="text-zinc-500 ml-1">({kw.count})</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <p className="text-xs text-zinc-500">
                Sentimiento positivo: <span className="text-emerald-400 font-medium">89%</span>
              </p>
            </div>
          </DashCard>
        </motion.div>

        {/* Reviews list */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-2">
          <DashCard>
            <div className="flex items-center justify-between mb-4">
              <CardHeader icon={MessageSquare} title="Reseñas recientes" />
              <div className="flex gap-1">
                {(['all', 'photo', 'unresponded'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wider transition-colors',
                      filter === f ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                    )}
                  >
                    {f === 'all' ? 'Todas' : f === 'photo' ? 'Con fotos' : 'Sin responder'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {filtered.map((review) => (
                <motion.div key={review.id} variants={staggerItem} className="p-4 rounded-xl bg-[hsl(var(--surface-2))]/50 border border-white/[0.03] space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white">{review.avatar}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{review.author}</p>
                          {review.verified && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                        </div>
                        <p className="text-[10px] text-zinc-500">{review.service} · {review.professional} · {review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{review.text}</p>
                  {review.photos > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                      <Camera className="h-3 w-3" />
                      {review.photos} fotos
                    </div>
                  )}
                  {review.responded && (
                    <div className="ml-4 pl-4 border-l-2 border-emerald-500/20">
                      <p className="text-[10px] text-emerald-400 font-medium mb-1">Tu respuesta</p>
                      <p className="text-sm text-zinc-400">{review.response}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                      <ThumbsUp className="h-3 w-3" />
                      {review.helpful} útil
                    </div>
                    {!review.responded && (
                      <Button variant="ghost" size="sm" className="text-xs text-emerald-400 gap-1">
                        <ArrowUpRight className="h-3 w-3" />
                        {t('respond')}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </DashCard>
        </motion.div>
      </div>
    </PageTransition>
  );
}
