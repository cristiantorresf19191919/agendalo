'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Instagram, Image, MousePointerClick, CalendarCheck, TrendingUp, ExternalLink, Heart, MessageCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { Button } from '@/ui/components/common/button';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const mockPosts = [
  { id: '1', caption: 'Degradado perfecto para empezar la semana', likes: 234, comments: 18, bookClicks: 12, conversions: 5, image: '🔥', service: 'Corte degradado', professional: 'Carlos M.' },
  { id: '2', caption: 'Barba esculpida con navaja — arte puro', likes: 189, comments: 12, bookClicks: 8, conversions: 3, image: '✂️', service: 'Barba completa', professional: 'Andrés P.' },
  { id: '3', caption: 'Tratamiento facial rejuvenecedor', likes: 312, comments: 24, bookClicks: 18, conversions: 8, image: '✨', service: 'Facial premium', professional: 'Diana R.' },
  { id: '4', caption: 'Combo corte + barba: el clásico que nunca falla', likes: 156, comments: 9, bookClicks: 6, conversions: 2, image: '💈', service: 'Combo corte + barba', professional: 'Carlos M.' },
  { id: '5', caption: 'Masaje capilar con aceites esenciales', likes: 198, comments: 15, bookClicks: 10, conversions: 4, image: '🧴', service: 'Masaje capilar', professional: 'Diana R.' },
  { id: '6', caption: 'Nuevo look para un nuevo mes', likes: 267, comments: 21, bookClicks: 14, conversions: 6, image: '💇', service: 'Corte clásico', professional: 'Carlos M.' },
];

export default function InstagramPage() {
  const t = useTranslations('instagram');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-display">{t('title')}</h1><p className="text-sm text-muted-foreground mt-1">{t('connectedAs', { username: 'barberia_urbana' })}</p></div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <Instagram className="h-4 w-4 text-pink-400" />
          <span className="text-sm font-medium text-pink-400">Sincronizado</span>
        </div>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('totalSynced')} value={mockPosts.length} icon={Image} />
        <StatCard title="Book This Look clics" value={68} icon={MousePointerClick} trend={{ value: 22, positive: true }} />
        <StatCard title="Reservas desde IG" value={28} icon={CalendarCheck} trend={{ value: 35, positive: true }} />
        <StatCard title="Engagement" value="4.2%" icon={TrendingUp} />
      </motion.div>

      {/* Posts grid */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Posts sincronizados</h3>
          <Button variant="outline" size="sm" className="text-xs gap-1"><Instagram className="h-3 w-3" />{t('autoSync')}</Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {mockPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
              className="rounded-xl border border-white/[0.04] bg-muted/20 overflow-hidden group"
            >
              {/* Image placeholder */}
              <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-5xl relative">
                {post.image}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-4 text-white">
                    <div className="flex items-center gap-1"><Heart className="h-5 w-5 fill-white" />{post.likes}</div>
                    <div className="flex items-center gap-1"><MessageCircle className="h-5 w-5 fill-white" />{post.comments}</div>
                  </div>
                </div>
              </div>
              <div className="p-3 space-y-2">
                <p className="text-xs text-zinc-400 line-clamp-2">{post.caption}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{post.service}</span>
                  <span className="text-[10px] text-muted-foreground">{post.professional}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-white/[0.04] pt-2">
                  <div className="flex items-center gap-1 text-muted-foreground"><Eye className="h-3 w-3" />{post.bookClicks} clics</div>
                  <div className="flex items-center gap-1 text-emerald-400 font-medium"><CalendarCheck className="h-3 w-3" />{post.conversions} reservas</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageTransition>
  );
}
