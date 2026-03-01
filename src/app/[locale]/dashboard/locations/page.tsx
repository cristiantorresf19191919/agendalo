'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { MapPin, Users, Scissors, QrCode, Star, Clock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { Button } from '@/ui/components/common/button';
import { staggerContainer, cardEntrance } from '@/ui/animations/variants';

const mockLocations = [
  { id: '1', name: 'Sede Chapinero', address: 'Cra 7 #45-12, Chapinero', city: 'Bogotá', primary: true, professionals: 3, services: 12, rating: 4.8, bookingsToday: 8, hours: 'Lun-Sáb 9:00-19:00', qrEnabled: true },
  { id: '2', name: 'Sede Usaquén', address: 'Calle 120 #5-18, Usaquén', city: 'Bogotá', primary: false, professionals: 2, services: 10, rating: 4.6, bookingsToday: 5, hours: 'Lun-Sáb 10:00-20:00', qrEnabled: true },
  { id: '3', name: 'Sede Zona Rosa', address: 'Cra 14 #83-56, Zona Rosa', city: 'Bogotá', primary: false, professionals: 2, services: 8, rating: 4.7, bookingsToday: 6, hours: 'Mar-Dom 11:00-21:00', qrEnabled: false },
];

export default function LocationsPage() {
  const t = useTranslations('locationsPage');

  return (
    <PageTransition className="space-y-6 pt-14 lg:pt-0">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-display">{t('title')}</h1></div>
        <Button variant="cta" className="gap-2"><Plus className="h-4 w-4" />{t('addLocation')}</Button>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Sucursales" value={3} icon={MapPin} />
        <StatCard title="Profesionales total" value={7} icon={Users} />
        <StatCard title="Servicios total" value={30} icon={Scissors} />
        <StatCard title="Citas hoy" value={19} icon={Clock} />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {mockLocations.map((loc, i) => (
          <motion.div key={loc.id} variants={cardEntrance} initial="hidden" animate="visible" transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
            className="rounded-xl border border-white/[0.04] bg-[hsl(var(--surface-1))] overflow-hidden"
          >
            {/* Map placeholder */}
            <div className="h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center relative">
              <MapPin className="h-12 w-12 text-emerald-400/30" />
              {loc.primary && <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">{t('primary')}</span>}
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-bold">{loc.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{loc.address}</p>
                <p className="text-xs text-muted-foreground">{loc.hours}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 rounded-lg bg-muted/20">
                  <p className="text-sm font-bold text-emerald-400">{loc.professionals}</p>
                  <p className="text-[10px] text-muted-foreground">Profesionales</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/20">
                  <p className="text-sm font-bold">{loc.services}</p>
                  <p className="text-[10px] text-muted-foreground">Servicios</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/20">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <p className="text-sm font-bold">{loc.rating}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Rating</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{loc.bookingsToday} citas hoy</span>
                {loc.qrEnabled ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400"><QrCode className="h-3.5 w-3.5" />QR activo</span>
                ) : (
                  <Button variant="ghost" size="sm" className="text-xs gap-1"><QrCode className="h-3 w-3" />{t('generateQR')}</Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageTransition>
  );
}
