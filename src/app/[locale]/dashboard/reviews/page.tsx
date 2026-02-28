'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  Star,
  Camera,
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { Button } from '@/ui/components/common/button';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

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

export default function ReviewsPage() {
  const t = useTranslations('reviewsPage');
  const [filter, setFilter] = useState<'all' | 'photo' | 'unresponded'>('all');

  const filtered = mockReviews.filter((r) => {
    if (filter === 'photo') return r.photos > 0;
    if (filter === 'unresponded') return !r.responded;
    return true;
  });

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('averageRating')} value="4.7" icon={Star} trend={{ value: 3.2, positive: true }} />
        <StatCard title={t('totalReviews')} value={215} icon={MessageSquare} trend={{ value: 15, positive: true }} />
        <StatCard title={t('photoReviews')} value={48} icon={Camera} />
        <StatCard title={t('helpful')} value={186} icon={ThumbsUp} />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Distribution */}
        <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5">
          <h3 className="text-sm font-semibold mb-4">{t('ratingDistribution')}</h3>
          <div className="space-y-3">
            {distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{d.stars}</span>
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.pct}%` }}
                    transition={{ duration: 0.8, delay: (5 - d.stars) * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">{d.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-4xl font-bold text-gradient-primary">4.7</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn('h-4 w-4', i < 4 ? 'text-amber-400 fill-amber-400' : 'text-amber-400/50 fill-amber-400/50')} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">215 {t('totalReviews').toLowerCase()}</p>
          </div>
        </motion.div>

        {/* Reviews list */}
        <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Reseñas recientes</h3>
            <div className="flex gap-2">
              {(['all', 'photo', 'unresponded'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                    filter === f ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-muted-foreground hover:bg-zinc-800 border border-transparent'
                  )}
                >
                  {f === 'all' ? 'Todas' : f === 'photo' ? 'Con fotos' : 'Sin responder'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((review) => (
              <motion.div key={review.id} variants={staggerItem} className="p-4 rounded-xl bg-muted/20 border border-white/[0.03] space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white">{review.avatar}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{review.author}</p>
                        {review.verified && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{review.service} · {review.professional} · {review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{review.text}</p>
                {review.photos > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Camera className="h-3 w-3" />
                    {review.photos} fotos
                  </div>
                )}
                {review.responded && (
                  <div className="ml-4 pl-4 border-l-2 border-emerald-500/20">
                    <p className="text-xs text-emerald-400 font-medium mb-1">Tu respuesta</p>
                    <p className="text-sm text-zinc-400">{review.response}</p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ThumbsUp className="h-3 w-3" />
                    {review.helpful} útil
                  </div>
                  {!review.responded && (
                    <Button variant="ghost" size="sm" className="text-xs text-emerald-400">
                      {t('respond')}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
