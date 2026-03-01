'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Home, MapPin, DollarSign, Clock, Navigation, CheckCircle, Truck, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';

const mockHomeBookings = [
  { id: '1', customer: 'María García', service: 'Corte a domicilio', professional: 'Carlos M.', address: 'Cra 15 #85-40, Chicó', barrio: 'Chicó', date: '2026-02-28', time: '10:00', status: 'en_route', surcharge: 15_000, distance: '3.2 km', eta: '12 min' },
  { id: '2', customer: 'Laura Díaz', service: 'Facial premium', professional: 'Diana R.', address: 'Calle 72 #10-34, Rosales', barrio: 'Rosales', date: '2026-02-28', time: '14:00', status: 'confirmed', surcharge: 20_000, distance: '5.1 km', eta: '18 min' },
  { id: '3', customer: 'Ana Martínez', service: 'Manicure gel', professional: 'Diana R.', address: 'Av 19 #120-15, Usaquén', barrio: 'Usaquén', date: '2026-03-01', time: '11:00', status: 'confirmed', surcharge: 10_000, distance: '2.8 km', eta: '10 min' },
];

const zones = [
  { name: 'Chapinero', active: true, bookings: 24 },
  { name: 'Usaquén', active: true, bookings: 18 },
  { name: 'Chicó', active: true, bookings: 15 },
  { name: 'Rosales', active: true, bookings: 12 },
  { name: 'Zona Rosa', active: true, bookings: 9 },
  { name: 'Cedritos', active: false, bookings: 0 },
];

const statusConfig = {
  confirmed: { label: 'Confirmada', color: 'text-blue-400 bg-blue-500/10', icon: CheckCircle },
  en_route: { label: 'En camino', color: 'text-amber-400 bg-amber-500/10', icon: Navigation },
  arrived: { label: 'Llegó', color: 'text-emerald-400 bg-emerald-500/10', icon: MapPin },
  in_progress: { label: 'En servicio', color: 'text-purple-400 bg-purple-500/10', icon: Settings },
  completed: { label: 'Completada', color: 'text-emerald-400 bg-emerald-500/10', icon: CheckCircle },
};

function formatCOP(n: number) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n); }

export default function HomeServicePage() {
  const t = useTranslations('homeService');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div><h1 className="text-2xl font-bold font-display">{t('title')}</h1><p className="text-sm text-muted-foreground mt-1">Gestiona servicios a domicilio</p></div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Domicilios este mes" value={45} icon={Home} trend={{ value: 22, positive: true }} />
        <StatCard title="Ingreso extra" value={formatCOP(675_000)} icon={DollarSign} />
        <StatCard title="Radio cobertura" value="8 km" icon={MapPin} />
        <StatCard title="Profesionales activos" value={2} icon={Users} />
      </motion.div>

      {/* Config */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
        <h3 className="text-sm font-semibold mb-4">Configuración de domicilio</h3>
        <div className="grid lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-muted/20 border border-white/[0.03] text-center">
            <MapPin className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-lg font-bold">8 km</p>
            <p className="text-xs text-muted-foreground">{t('travelRadius')}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/20 border border-white/[0.03] text-center">
            <DollarSign className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-lg font-bold">{formatCOP(10_000)}</p>
            <p className="text-xs text-muted-foreground">{t('surcharge')}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/20 border border-white/[0.03] text-center">
            <Truck className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-lg font-bold">{formatCOP(2_000)}</p>
            <p className="text-xs text-muted-foreground">{t('perKm')}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/20 border border-white/[0.03] text-center">
            <DollarSign className="h-6 w-6 text-amber-400 mx-auto mb-2" />
            <p className="text-lg font-bold">{formatCOP(50_000)}</p>
            <p className="text-xs text-muted-foreground">{t('minimumOrder')}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Zones */}
        <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
          <h3 className="text-sm font-semibold mb-4">{t('serviceZones')}</h3>
          <div className="space-y-2">
            {zones.map((z) => (
              <div key={z.name} className={cn('flex items-center justify-between p-3 rounded-lg', z.active ? 'bg-muted/20' : 'bg-[hsl(var(--surface-1))]/40 opacity-50')}>
                <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-emerald-400" /><span className="text-sm">{z.name}</span></div>
                <div className="flex items-center gap-2">
                  {z.active && <span className="text-xs text-muted-foreground">{z.bookings} reservas</span>}
                  <div className={cn('w-8 h-4 rounded-full transition-colors relative', z.active ? 'bg-emerald-500' : 'bg-zinc-700')}>
                    <div className={cn('absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform', z.active ? 'translate-x-4' : 'translate-x-0.5')} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Active bookings */}
        <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="lg:col-span-2 rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] p-5">
          <h3 className="text-sm font-semibold mb-4">Domicilios activos</h3>
          <div className="space-y-3">
            {mockHomeBookings.map((b) => {
              const sc = statusConfig[b.status as keyof typeof statusConfig];
              return (
                <motion.div key={b.id} variants={staggerItem} className="p-4 rounded-xl bg-muted/20 border border-white/[0.03] space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold">{b.customer}</p>
                      <p className="text-xs text-muted-foreground">{b.service} · {b.professional}</p>
                    </div>
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1', sc.color)}>
                      <sc.icon className="h-3 w-3" />{sc.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{b.address}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span>{b.date} {b.time}</span>
                      <span className="text-muted-foreground">{b.distance}</span>
                      <span className="text-muted-foreground">ETA: {b.eta}</span>
                    </div>
                    <span className="font-medium text-emerald-400">+{formatCOP(b.surcharge)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
