'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Users, Search, Star, Calendar, AlertTriangle, Heart, Tag, Clock, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const mockClients = [
  { id: '1', name: 'María García', email: 'maria@email.com', phone: '+57 310 555 1234', avatar: 'M', visits: 67, lastVisit: '2026-02-25', spent: 4_250_000, tier: 'Platino', risk: 'low' as const, tags: ['VIP', 'Regular'], preferences: 'Corte capas, no le gusta el secador', allergies: 'Ninguna', birthday: '1992-05-14' },
  { id: '2', name: 'Carlos Rodríguez', email: 'carlos@email.com', phone: '+57 315 555 5678', avatar: 'C', visits: 54, lastVisit: '2026-02-22', spent: 3_800_000, tier: 'Platino', risk: 'low' as const, tags: ['VIP'], preferences: 'Barba con navaja, aceite de argán', allergies: 'Ninguna', birthday: '1988-11-22' },
  { id: '3', name: 'Laura Díaz', email: 'laura@email.com', phone: '+57 320 555 9012', avatar: 'L', visits: 38, lastVisit: '2026-02-10', spent: 2_100_000, tier: 'Oro', risk: 'medium' as const, tags: ['Regular'], preferences: 'Facial hidratante, piel sensible', allergies: 'Parabenos', birthday: '1995-03-08' },
  { id: '4', name: 'Pedro Sánchez', email: 'pedro@email.com', phone: '+57 300 555 3456', avatar: 'P', visits: 32, lastVisit: '2026-01-28', spent: 1_900_000, tier: 'Oro', risk: 'high' as const, tags: ['En riesgo'], preferences: 'Corte degradado, sin producto', allergies: 'Ninguna', birthday: '1990-07-19' },
  { id: '5', name: 'Ana Martínez', email: 'ana@email.com', phone: '+57 311 555 7890', avatar: 'A', visits: 18, lastVisit: '2026-02-20', spent: 980_000, tier: 'Plata', risk: 'low' as const, tags: ['Nueva'], preferences: 'Manicure gel, colores pastel', allergies: 'Acetona', birthday: '1997-12-03' },
  { id: '6', name: 'Sebastián López', email: 'seba@email.com', phone: '+57 316 555 2345', avatar: 'S', visits: 12, lastVisit: '2026-02-18', spent: 540_000, tier: 'Bronce', risk: 'low' as const, tags: ['Regular'], preferences: 'Masaje deportivo, presión fuerte', allergies: 'Ninguna', birthday: '1993-09-27' },
];

const riskColors = { low: 'text-emerald-400 bg-emerald-500/10', medium: 'text-amber-400 bg-amber-500/10', high: 'text-rose-400 bg-rose-500/10' };
const riskLabels = { low: 'Bajo', medium: 'Medio', high: 'Alto' };

function formatCOP(amount: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

export default function ClientsPage() {
  const t = useTranslations('clientsPage');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = mockClients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );
  const detail = mockClients.find((c) => c.id === selected);

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total clientes" value={mockClients.length} icon={Users} />
        <StatCard title="VIP" value={2} icon={Star} />
        <StatCard title="En riesgo" value={1} icon={AlertTriangle} />
        <StatCard title="Visitas este mes" value={42} icon={Calendar} />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Client list */}
        <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50"
            />
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filtered.map((client) => (
              <motion.div
                key={client.id}
                variants={staggerItem}
                onClick={() => setSelected(client.id)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all',
                  selected === client.id ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-muted/20 border border-white/[0.03] hover:bg-muted/30'
                )}
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white shrink-0">{client.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{client.name}</p>
                    {client.tags.map((tag) => (
                      <span key={tag} className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                        tag === 'VIP' ? 'bg-amber-500/10 text-amber-400' : tag === 'En riesgo' ? 'bg-rose-500/10 text-rose-400' : 'bg-zinc-700 text-zinc-400'
                      )}>{tag}</span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{client.visits} visitas · {client.tier} · {formatCOP(client.spent)}</p>
                </div>
                <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', riskColors[client.risk])}>{riskLabels[client.risk]}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Client detail */}
        <AnimatePresence mode="wait">
          {detail ? (
            <motion.div
              key={detail.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5 space-y-5"
            >
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xl font-bold text-white mx-auto">{detail.avatar}</div>
                <h3 className="font-bold mt-3">{detail.name}</h3>
                <p className="text-xs text-muted-foreground">{detail.tier}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-zinc-400"><Mail className="h-4 w-4" />{detail.email}</div>
                <div className="flex items-center gap-2 text-zinc-400"><Phone className="h-4 w-4" />{detail.phone}</div>
                <div className="flex items-center gap-2 text-zinc-400"><Calendar className="h-4 w-4" />{detail.birthday}</div>
                <div className="flex items-center gap-2 text-zinc-400"><Clock className="h-4 w-4" />Última: {detail.lastVisit}</div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">{t('preferences')}</p>
                <p className="text-sm text-zinc-300">{detail.preferences}</p>
              </div>

              {detail.allergies !== 'Ninguna' && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <p className="text-xs font-semibold text-rose-400 mb-1">{t('allergies')}</p>
                  <p className="text-sm text-rose-300">{detail.allergies}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-lg bg-muted/20">
                  <p className="text-lg font-bold text-emerald-400">{detail.visits}</p>
                  <p className="text-xs text-muted-foreground">Visitas</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20">
                  <p className="text-lg font-bold text-emerald-400">{formatCOP(detail.spent)}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5 flex items-center justify-center text-sm text-muted-foreground min-h-[400px]">
              Selecciona un cliente
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
