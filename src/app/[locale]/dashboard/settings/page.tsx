'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Store,
  Clock,
  Users,
  Shield,
  Globe,
  DollarSign,
  ChevronRight,
  Bell,
  Palette,
} from 'lucide-react';
import { Button } from '@/ui/components/common/button';
import { Input } from '@/ui/components/common/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/components/common/card';
import { Badge } from '@/ui/components/common/badge';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { staggerContainer, staggerItem } from '@/ui/animations/variants';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');

  const settingSections = [
    {
      icon: Store,
      label: 'Perfil del negocio',
      desc: 'Nombre, logo, descripción y dirección',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: Clock,
      label: 'Disponibilidad del negocio',
      desc: 'Horarios de apertura y cierre',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Users,
      label: 'Disponibilidad del profesional',
      desc: 'Horarios individuales por profesional',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      icon: Bell,
      label: 'Notificaciones',
      desc: 'Alertas de citas y recordatorios',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      icon: Globe,
      label: 'Idioma y región',
      desc: 'Zona horaria e idioma del negocio',
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-8 max-w-2xl pt-14 lg:pt-0">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configura tu negocio
          </p>
        </div>

        {/* Quick settings links */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {settingSections.map((section, i) => (
            <motion.button
              key={i}
              variants={staggerItem}
              whileHover={{ x: 4 }}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-white/[0.04] hover:bg-muted/20 transition-colors text-left"
            >
              <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', section.bg)}>
                <section.icon className={cn('h-5 w-5', section.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{section.label}</p>
                <p className="text-xs text-muted-foreground">{section.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </motion.button>
          ))}
        </motion.div>

        {/* Business Info Form */}
        <Card glass>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-emerald-400" />
              {t('businessInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label={t('businessName')} placeholder="Mi Barbería" defaultValue="Barbería Urbana" />
            <Input label={t('slug')} placeholder="mi-barberia" defaultValue="barberia-urbana" />
            <div className="grid grid-cols-2 gap-4">
              <Input label={t('timezone')} placeholder="America/Bogota" defaultValue="America/Bogota" />
              <Input label={t('currency')} placeholder="COP" defaultValue="COP" />
            </div>
          </CardContent>
        </Card>

        {/* Slot Config */}
        <Card glass>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-400" />
              {t('slotConfig')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Input label={t('stepMinutes')} type="number" placeholder="15" defaultValue="30" />
              <Input label={t('bufferMinutes')} type="number" placeholder="10" defaultValue="0" />
              <Input label={t('leadTimeMinutes')} type="number" placeholder="60" defaultValue="60" />
            </div>
          </CardContent>
        </Card>

        {/* Plan */}
        <Card glass>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              {t('plan')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div>
                <p className="font-semibold">{t('plans.duo')}</p>
                <p className="text-sm text-muted-foreground">{t('plans.duoDesc')}</p>
              </div>
              <Badge variant="available">Activo</Badge>
            </div>
            <Button variant="outline" className="w-full mt-4 gap-2">
              <DollarSign className="h-4 w-4" />
              {t('upgradePlan')}
            </Button>
          </CardContent>
        </Card>

        <Button className="w-full">{tCommon('save')}</Button>
      </div>
    </PageTransition>
  );
}
