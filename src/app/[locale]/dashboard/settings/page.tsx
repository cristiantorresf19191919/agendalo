'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Store, Clock, Users, Shield, Globe, DollarSign,
  ChevronRight, Bell, Palette, Smartphone, Link2, Lock,
} from 'lucide-react';
import { Button } from '@/ui/components/common/button';
import { Input } from '@/ui/components/common/input';
import { Badge } from '@/ui/components/common/badge';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { staggerContainer, staggerItem } from '@/ui/animations/variants';
import { cn } from '@/lib/utils';

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

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="h-4 w-4 text-emerald-400" />
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-display">{title}</h3>
    </div>
  );
}

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');

  const settingSections = [
    { icon: Store, label: 'Perfil del negocio', desc: 'Nombre, logo, descripción y dirección', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Clock, label: 'Disponibilidad del negocio', desc: 'Horarios de apertura y cierre', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Users, label: 'Disponibilidad del profesional', desc: 'Horarios individuales por profesional', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: Bell, label: 'Notificaciones', desc: 'Alertas de citas y recordatorios', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { icon: Globe, label: 'Idioma y región', desc: 'Zona horaria e idioma del negocio', color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { icon: Smartphone, label: 'Integraciones', desc: 'WhatsApp, Instagram, Google Calendar', color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { icon: Link2, label: 'Página de reservas', desc: 'Personaliza tu página pública', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { icon: Lock, label: 'Seguridad', desc: 'Contraseña, autenticación, sesiones', color: 'text-zinc-400', bg: 'bg-zinc-500/10' },
  ];

  return (
    <PageTransition>
      <div className="space-y-6 max-w-2xl pt-14 lg:pt-0">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-display">{t('title')}</h1>
          <p className="text-sm text-zinc-500 mt-1">Configura tu negocio</p>
        </div>

        {/* Quick settings links */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
          {settingSections.map((section, i) => (
            <motion.button
              key={i}
              variants={staggerItem}
              whileHover={{ x: 4 }}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-[hsl(var(--surface-1))] border border-white/[0.04] hover:border-white/[0.08] transition-all text-left"
            >
              <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', section.bg)}>
                <section.icon className={cn('h-5 w-5', section.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{section.label}</p>
                <p className="text-xs text-zinc-500">{section.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-600 shrink-0" />
            </motion.button>
          ))}
        </motion.div>

        {/* Business Info Form */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <DashCard>
            <SectionHeader icon={Store} title={t('businessInfo')} />
            <div className="space-y-4">
              <Input label={t('businessName')} placeholder="Mi Barbería" defaultValue="Barbería Urbana" />
              <Input label={t('slug')} placeholder="mi-barberia" defaultValue="barberia-urbana" />
              <div className="grid grid-cols-2 gap-4">
                <Input label={t('timezone')} placeholder="America/Bogota" defaultValue="America/Bogota" />
                <Input label={t('currency')} placeholder="COP" defaultValue="COP" />
              </div>
            </div>
          </DashCard>
        </motion.div>

        {/* Slot Config */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <DashCard>
            <SectionHeader icon={Clock} title={t('slotConfig')} />
            <div className="grid grid-cols-3 gap-4">
              <Input label={t('stepMinutes')} type="number" placeholder="15" defaultValue="30" />
              <Input label={t('bufferMinutes')} type="number" placeholder="10" defaultValue="0" />
              <Input label={t('leadTimeMinutes')} type="number" placeholder="60" defaultValue="60" />
            </div>
          </DashCard>
        </motion.div>

        {/* Plan */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <DashCard>
            <SectionHeader icon={Shield} title={t('plan')} />
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div>
                <p className="font-semibold font-display">{t('plans.duo')}</p>
                <p className="text-sm text-zinc-500">{t('plans.duoDesc')}</p>
              </div>
              <Badge variant="available">Activo</Badge>
            </div>
            <Button variant="outline" className="w-full mt-4 gap-2">
              <DollarSign className="h-4 w-4" />
              {t('upgradePlan')}
            </Button>
          </DashCard>
        </motion.div>

        <Button className="w-full">{tCommon('save')}</Button>
      </div>
    </PageTransition>
  );
}
