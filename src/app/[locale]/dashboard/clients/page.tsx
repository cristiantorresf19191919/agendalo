'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  Users, Search, Star, Calendar, AlertTriangle, Heart, Tag, Clock,
  Phone, Mail, Gift, TrendingUp, MessageCircle, Cake, ChevronRight,
  ArrowUpRight, Shield, Sparkles, Send, MoreHorizontal, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { Button } from '@/ui/components/common/button';
import { staggerContainer } from '@/ui/animations/variants';

const mockClients = [
  { id: '1', name: 'María García', email: 'maria@email.com', phone: '+57 310 555 1234', avatar: 'M', visits: 67, lastVisit: '2026-02-25', spent: 4_250_000, tier: 'Platino', risk: 'low' as const, tags: ['VIP', 'Regular'], preferences: 'Corte capas, no le gusta el secador', allergies: 'Ninguna', birthday: '1992-05-14', nextAppt: '2026-03-05', favPro: 'Diana R.', favService: 'Corte capas', avgSpend: 63_400, referrals: 3, points: 1_240 },
  { id: '2', name: 'Carlos Rodríguez', email: 'carlos@email.com', phone: '+57 315 555 5678', avatar: 'C', visits: 54, lastVisit: '2026-02-22', spent: 3_800_000, tier: 'Platino', risk: 'low' as const, tags: ['VIP'], preferences: 'Barba con navaja, aceite de argán', allergies: 'Ninguna', birthday: '1988-11-22', nextAppt: '2026-03-08', favPro: 'Carlos M.', favService: 'Combo corte + barba', avgSpend: 70_370, referrals: 5, points: 980 },
  { id: '3', name: 'Laura Díaz', email: 'laura@email.com', phone: '+57 320 555 9012', avatar: 'L', visits: 38, lastVisit: '2026-02-10', spent: 2_100_000, tier: 'Oro', risk: 'medium' as const, tags: ['Regular'], preferences: 'Facial hidratante, piel sensible', allergies: 'Parabenos', birthday: '1995-03-08', nextAppt: null, favPro: 'Diana R.', favService: 'Facial premium', avgSpend: 55_260, referrals: 1, points: 520 },
  { id: '4', name: 'Pedro Sánchez', email: 'pedro@email.com', phone: '+57 300 555 3456', avatar: 'P', visits: 32, lastVisit: '2026-01-28', spent: 1_900_000, tier: 'Oro', risk: 'high' as const, tags: ['En riesgo'], preferences: 'Corte degradado, sin producto', allergies: 'Ninguna', birthday: '1990-07-19', nextAppt: null, favPro: 'Andrés P.', favService: 'Corte clásico', avgSpend: 59_375, referrals: 0, points: 340 },
  { id: '5', name: 'Ana Martínez', email: 'ana@email.com', phone: '+57 311 555 7890', avatar: 'A', visits: 18, lastVisit: '2026-02-20', spent: 980_000, tier: 'Plata', risk: 'low' as const, tags: ['Nueva'], preferences: 'Manicure gel, colores pastel', allergies: 'Acetona', birthday: '1997-12-03', nextAppt: '2026-03-12', favPro: 'Diana R.', favService: 'Manicure gel', avgSpend: 54_444, referrals: 2, points: 210 },
  { id: '6', name: 'Sebastián López', email: 'seba@email.com', phone: '+57 316 555 2345', avatar: 'S', visits: 12, lastVisit: '2026-02-18', spent: 540_000, tier: 'Bronce', risk: 'low' as const, tags: ['Regular'], preferences: 'Masaje deportivo, presión fuerte', allergies: 'Ninguna', birthday: '1993-09-27', nextAppt: null, favPro: 'Carlos M.', favService: 'Masaje capilar', avgSpend: 45_000, referrals: 0, points: 130 },
];

const upcomingBirthdays = [
  { name: 'Laura Díaz', birthday: 'Mar 8', daysAway: 7, tier: 'Oro', spent: 2_100_000 },
  { name: 'Ana Martínez', birthday: 'Dic 3', daysAway: 277, tier: 'Plata', spent: 980_000 },
];

const visitTimeline = [
  { date: '2026-02-25', client: 'María García', service: 'Corte capas', professional: 'Diana R.', amount: 65_000, rating: 5 },
  { date: '2026-02-22', client: 'Carlos Rodríguez', service: 'Combo corte + barba', professional: 'Carlos M.', amount: 55_000, rating: 5 },
  { date: '2026-02-20', client: 'Ana Martínez', service: 'Manicure gel', professional: 'Diana R.', amount: 35_000, rating: 4 },
  { date: '2026-02-18', client: 'Sebastián López', service: 'Masaje capilar', professional: 'Carlos M.', amount: 45_000, rating: 5 },
  { date: '2026-02-10', client: 'Laura Díaz', service: 'Facial premium', professional: 'Diana R.', amount: 120_000, rating: 5 },
];

const riskColors = { low: 'text-emerald-400 bg-emerald-500/8', medium: 'text-amber-400 bg-amber-500/8', high: 'text-rose-400 bg-rose-500/8' };
const riskLabels = { low: 'Bajo', medium: 'Medio', high: 'Alto' };
const tierColors: Record<string, string> = { Platino: 'text-purple-400 bg-purple-500/8', Oro: 'text-amber-400 bg-amber-500/8', Plata: 'text-zinc-400 bg-zinc-500/8', Bronce: 'text-orange-400 bg-orange-500/8' };

function formatCOP(amount: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

function DashCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn('rounded-2xl p-5 bg-[hsl(var(--surface-1))] border border-white/[0.04]', className)}
    >
      {children}
    </motion.div>
  );
}

export default function ClientsPage() {
  const t = useTranslations('clientsPage');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<'info' | 'timeline' | 'automation'>('info');

  const filtered = mockClients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );
  const detail = mockClients.find((c) => c.id === selected);

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">{t('title')}</h1>
          <p className="text-sm text-zinc-500 mt-1">{mockClients.length} clientes registrados</p>
        </div>
        <Button variant="cta" size="sm" className="gap-2 rounded-lg">
          <Users className="h-4 w-4" /> Importar clientes
        </Button>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total clientes" value={mockClients.length} icon={Users} />
        <StatCard title="VIP (Platino)" value={2} icon={Star} trend={{ value: 8, positive: true }} />
        <StatCard title="En riesgo" value={1} icon={AlertTriangle} />
        <StatCard title="Visitas este mes" value={42} icon={Calendar} trend={{ value: 12, positive: true }} />
      </motion.div>

      {/* Birthday alerts */}
      {upcomingBirthdays.filter(b => b.daysAway <= 30).length > 0 && (
        <DashCard delay={0.1}>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-pink-500/8 flex items-center justify-center">
              <Cake className="h-4 w-4 text-pink-400" />
            </div>
            <h2 className="font-semibold text-sm font-display">Cumpleaños próximos</h2>
            <span className="text-[10px] font-bold text-pink-400 bg-pink-500/8 px-2 py-0.5 rounded-full">
              {upcomingBirthdays.filter(b => b.daysAway <= 30).length} esta semana
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {upcomingBirthdays.filter(b => b.daysAway <= 30).map((b) => (
              <div key={b.name} className="flex items-center gap-3 p-3 rounded-xl bg-pink-500/5 border border-pink-500/10 min-w-[280px]">
                <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-lg">🎂</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{b.name}</p>
                  <p className="text-[11px] text-zinc-500">{b.birthday} · en {b.daysAway} días · {b.tier}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-pink-400 hover:text-pink-300 gap-1 shrink-0">
                  <Gift className="h-3 w-3" /> Enviar
                </Button>
              </div>
            ))}
          </div>
        </DashCard>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Client list */}
        <DashCard delay={0.15} className="lg:col-span-2">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/20 text-zinc-300 placeholder:text-zinc-600 transition-all"
            />
          </div>
          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {filtered.map((client, i) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.03 }}
                onClick={() => { setSelected(client.id); setTab('info'); }}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all',
                  selected === client.id
                    ? 'bg-emerald-500/8 border border-emerald-500/15'
                    : 'bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04]'
                )}
              >
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-sm font-bold text-white shrink-0">{client.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{client.name}</p>
                    {client.tags.map((tag) => (
                      <span key={tag} className={cn('text-[9px] px-1.5 py-0.5 rounded-full font-bold',
                        tag === 'VIP' ? 'bg-amber-500/8 text-amber-400' : tag === 'En riesgo' ? 'bg-rose-500/8 text-rose-400' : tag === 'Nueva' ? 'bg-emerald-500/8 text-emerald-400' : 'bg-white/[0.04] text-zinc-500'
                      )}>{tag}</span>
                    ))}
                  </div>
                  <p className="text-[11px] text-zinc-500">{client.visits} visitas · {client.tier} · {formatCOP(client.spent)}</p>
                </div>
                <span className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0', riskColors[client.risk])}>{riskLabels[client.risk]}</span>
              </motion.div>
            ))}
          </div>
        </DashCard>

        {/* Client detail panel */}
        <AnimatePresence mode="wait">
          {detail ? (
            <motion.div
              key={detail.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl bg-[hsl(var(--surface-1))] border border-white/[0.04] overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/[0.04]">
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xl font-bold text-white">{detail.avatar}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg font-display">{detail.name}</h3>
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold inline-block mt-1', tierColors[detail.tier] || 'bg-zinc-500/8 text-zinc-400')}>{detail.tier}</span>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-white/[0.04] transition-colors text-zinc-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/[0.04]">
                {(['info', 'timeline', 'automation'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      'flex-1 py-2.5 text-xs font-medium transition-colors',
                      tab === t ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-600 hover:text-zinc-400'
                    )}
                  >
                    {t === 'info' ? 'Perfil' : t === 'timeline' ? 'Historial' : 'Automación'}
                  </button>
                ))}
              </div>

              <div className="p-5 max-h-[400px] overflow-y-auto">
                {tab === 'info' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] text-center">
                        <p className="text-lg font-bold text-emerald-400 font-display">{detail.visits}</p>
                        <p className="text-[10px] text-zinc-600 font-medium">Visitas</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] text-center">
                        <p className="text-lg font-bold text-emerald-400 font-display">{formatCOP(detail.avgSpend)}</p>
                        <p className="text-[10px] text-zinc-600 font-medium">Ticket promedio</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] text-center">
                        <p className="text-lg font-bold text-purple-400 font-display">{detail.points}</p>
                        <p className="text-[10px] text-zinc-600 font-medium">Puntos</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] text-center">
                        <p className="text-lg font-bold text-amber-400 font-display">{detail.referrals}</p>
                        <p className="text-[10px] text-zinc-600 font-medium">Referidos</p>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center gap-2 text-zinc-500"><Mail className="h-3.5 w-3.5 text-zinc-600" /><span className="text-zinc-400">{detail.email}</span></div>
                      <div className="flex items-center gap-2 text-zinc-500"><Phone className="h-3.5 w-3.5 text-zinc-600" /><span className="text-zinc-400">{detail.phone}</span></div>
                      <div className="flex items-center gap-2 text-zinc-500"><Cake className="h-3.5 w-3.5 text-zinc-600" /><span className="text-zinc-400">{detail.birthday}</span></div>
                      <div className="flex items-center gap-2 text-zinc-500"><Star className="h-3.5 w-3.5 text-zinc-600" /><span className="text-zinc-400">Favorito: {detail.favPro}</span></div>
                      <div className="flex items-center gap-2 text-zinc-500"><Heart className="h-3.5 w-3.5 text-zinc-600" /><span className="text-zinc-400">{detail.favService}</span></div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Preferencias</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">{detail.preferences}</p>
                    </div>

                    {detail.allergies !== 'Ninguna' && (
                      <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">Alergias</p>
                        <p className="text-xs text-rose-300">{detail.allergies}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="cta" size="sm" className="flex-1 gap-1 rounded-lg text-xs">
                        <MessageCircle className="h-3 w-3" /> WhatsApp
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1 rounded-lg text-xs border-white/[0.06]">
                        <Calendar className="h-3 w-3" /> Agendar
                      </Button>
                    </div>
                  </div>
                )}

                {tab === 'timeline' && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Últimas visitas</p>
                    {visitTimeline.filter(v => v.client === detail.name).map((visit, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/8 flex items-center justify-center shrink-0 mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium">{visit.service}</p>
                          <p className="text-[11px] text-zinc-500">{visit.professional} · {visit.date}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-emerald-400 font-semibold">{formatCOP(visit.amount)}</span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: visit.rating }).map((_, j) => (
                                <Star key={j} className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {visitTimeline.filter(v => v.client === detail.name).length === 0 && (
                      <p className="text-xs text-zinc-600 text-center py-8">Sin historial disponible</p>
                    )}
                  </div>
                )}

                {tab === 'automation' && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Automaciones activas</p>
                    {[
                      { label: 'Recordatorio 24h antes', enabled: true, icon: Clock, desc: 'WhatsApp automático' },
                      { label: 'Felicitación de cumpleaños', enabled: true, icon: Cake, desc: 'Con descuento 15%' },
                      { label: 'Re-engagement (30 días)', enabled: detail.risk !== 'low', icon: Heart, desc: 'Oferta personalizada' },
                      { label: 'Encuesta post-visita', enabled: true, icon: Star, desc: 'Pedir reseña en Google' },
                    ].map((auto, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', auto.enabled ? 'bg-emerald-500/8' : 'bg-white/[0.04]')}>
                          <auto.icon className={cn('h-3.5 w-3.5', auto.enabled ? 'text-emerald-400' : 'text-zinc-600')} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium">{auto.label}</p>
                          <p className="text-[10px] text-zinc-600">{auto.desc}</p>
                        </div>
                        <div className={cn('h-5 w-9 rounded-full p-0.5 transition-colors cursor-pointer', auto.enabled ? 'bg-emerald-500' : 'bg-zinc-700')}>
                          <div className={cn('h-4 w-4 rounded-full bg-white transition-transform', auto.enabled ? 'translate-x-4' : 'translate-x-0')} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-[hsl(var(--surface-1))] border border-white/[0.04] p-5 flex flex-col items-center justify-center text-center min-h-[400px] space-y-3">
              <div className="h-12 w-12 rounded-xl bg-white/[0.02] flex items-center justify-center">
                <Users className="h-6 w-6 text-zinc-700" />
              </div>
              <p className="text-sm text-zinc-600">Selecciona un cliente</p>
              <p className="text-[11px] text-zinc-700">para ver su perfil completo</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
