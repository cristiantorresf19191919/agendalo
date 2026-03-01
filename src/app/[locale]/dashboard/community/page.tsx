'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Users, MessageSquare, Heart, Bookmark, Share2, UserCheck, Package, GraduationCap, Scissors, Plus, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { Button } from '@/ui/components/common/button';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const mockPosts = [
  { id: '1', author: 'Carlos M.', avatar: 'C', category: 'technique_share', title: 'Técnica de degradado con máquina sin guarda', content: 'Les comparto mi técnica para lograr un degradado perfecto. El truco está en el ángulo...', likes: 34, comments: 12, bookmarks: 8, time: 'Hace 3h' },
  { id: '2', author: 'Diana R.', avatar: 'D', category: 'before_after', title: 'Antes y después: Tratamiento rejuvenecedor', content: 'Resultado de 4 sesiones de facial premium con ácido hialurónico. La clienta quedó feliz.', likes: 56, comments: 18, bookmarks: 15, time: 'Hace 6h' },
  { id: '3', author: 'Andrés P.', avatar: 'A', category: 'supply_deal', title: 'Proveedor de ceras con 30% descuento', content: 'Hice alianza con @CerasCol y me dieron precio especial para profesionales de Agendalo.', likes: 42, comments: 23, bookmarks: 20, time: 'Ayer' },
  { id: '4', author: 'Sofía G.', avatar: 'S', category: 'education', title: 'Curso gratuito: Colorimetría avanzada', content: 'Acabo de terminar este curso online y está increíble. Se los recomiendo a todos los estilistas.', likes: 28, comments: 9, bookmarks: 12, time: 'Ayer' },
];

const mockSubstitutes = [
  { id: '1', author: 'Carlos M.', date: '2026-03-05', hours: '9am - 2pm', compensation: '60%', specialties: ['Corte', 'Barba'], status: 'open' },
  { id: '2', author: 'Diana R.', date: '2026-03-10', hours: '10am - 6pm', compensation: '$120.000', specialties: ['Facial', 'Masaje'], status: 'open' },
];

const categoryConfig: Record<string, { label: string; color: string; icon: typeof Scissors }> = {
  technique_share: { label: 'Técnica', color: 'bg-blue-500/10 text-blue-400', icon: Scissors },
  before_after: { label: 'Antes/Después', color: 'bg-pink-500/10 text-pink-400', icon: Heart },
  supply_deal: { label: 'Proveedor', color: 'bg-amber-500/10 text-amber-400', icon: Package },
  education: { label: 'Educación', color: 'bg-purple-500/10 text-purple-400', icon: GraduationCap },
};

export default function CommunityPage() {
  const t = useTranslations('community');
  const [tab, setTab] = useState<'feed' | 'substitutes'>('feed');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-display">{t('title')}</h1></div>
        <Button variant="cta" className="gap-2"><Plus className="h-4 w-4" />{t('createPost')}</Button>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Profesionales" value={87} icon={Users} />
        <StatCard title="Publicaciones" value={234} icon={MessageSquare} />
        <StatCard title="Técnicas compartidas" value={45} icon={Scissors} />
        <StatCard title="Reemplazos exitosos" value={12} icon={UserCheck} />
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{ key: 'feed', label: t('feed') }, { key: 'substitutes', label: t('substituteRequests') }].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key as 'feed' | 'substitutes')}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              tab === key ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-muted-foreground hover:bg-[hsl(var(--surface-2))] border border-transparent'
            )}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'feed' ? (
        <div className="space-y-4">
          {mockPosts.map((post, i) => {
            const cat = categoryConfig[post.category];
            return (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white">{post.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{post.author}</p>
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', cat.color)}>{cat.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{post.time}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-zinc-400 mt-1">{post.content}</p>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2 border-t border-white/[0.03]">
                  <button className="flex items-center gap-1 hover:text-rose-400 transition-colors"><Heart className="h-4 w-4" />{post.likes}</button>
                  <button className="flex items-center gap-1 hover:text-blue-400 transition-colors"><MessageSquare className="h-4 w-4" />{post.comments}</button>
                  <button className="flex items-center gap-1 hover:text-amber-400 transition-colors"><Bookmark className="h-4 w-4" />{post.bookmarks}</button>
                  <button className="flex items-center gap-1 hover:text-emerald-400 transition-colors ml-auto"><Share2 className="h-4 w-4" /></button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {mockSubstitutes.map((sub, i) => (
            <motion.div key={sub.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-sm font-bold text-amber-400">{sub.author.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-semibold">{sub.author} busca reemplazo</p>
                    <p className="text-xs text-muted-foreground">{sub.specialties.join(', ')}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs text-emerald-400 border-emerald-500/30">{t('accept')}</Button>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{sub.date} · {sub.hours}</span>
                <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{sub.compensation}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
