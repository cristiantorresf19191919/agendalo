'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { MapPin, Heart, Eye, Cpu, Users, Star, Calendar, Building2 } from 'lucide-react';
import { ScrollReveal } from '@/ui/components/common/scroll-reveal';
import { cn } from '@/lib/utils';

const values = [
  { key: 'value1', icon: MapPin, color: 'emerald' },
  { key: 'value2', icon: Eye, color: 'purple' },
  { key: 'value3', icon: Heart, color: 'amber' },
  { key: 'value4', icon: Cpu, color: 'pink' },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
};

const team = [
  { name: 'Santiago R.', role: 'CEO & Co-founder', avatar: 'S', color: 'from-emerald-400 to-emerald-600' },
  { name: 'Valentina M.', role: 'CTO & Co-founder', avatar: 'V', color: 'from-purple-400 to-purple-600' },
  { name: 'Andrés G.', role: 'Head of Design', avatar: 'A', color: 'from-amber-400 to-amber-600' },
  { name: 'Camila P.', role: 'Head of Growth', avatar: 'C', color: 'from-pink-400 to-pink-600' },
];

export default function AboutPage() {
  const t = useTranslations('about');

  const numbers = [
    { value: t('num1'), label: t('num1Label'), icon: Calendar },
    { value: t('num2'), label: t('num2Label'), icon: Users },
    { value: t('num3'), label: t('num3Label'), icon: Building2 },
    { value: t('num4'), label: t('num4Label'), icon: Star },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden mesh-gradient">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            <span className="text-gradient-primary">{t('title')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mt-5"
          >
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <ScrollReveal>
          <div className="rounded-2xl p-8 bg-zinc-900/60 backdrop-blur-sm border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <Heart className="h-5 w-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold">{t('missionTitle')}</h2>
            </div>
            <p className="text-zinc-300 leading-relaxed">{t('missionDesc')}</p>
          </div>
        </ScrollReveal>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">{t('storyTitle')}</h2>
        </ScrollReveal>
        <div className="space-y-6">
          {(['storyP1', 'storyP2', 'storyP3'] as const).map((key, i) => (
            <ScrollReveal key={key} delay={i * 0.1}>
              <p className="text-zinc-400 leading-relaxed text-base">{t(key)}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">{t('valuesTitle')}</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, i) => {
            const colors = colorMap[val.color];
            return (
              <ScrollReveal key={val.key} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                  className={cn(
                    'rounded-2xl p-6 bg-zinc-900/60 backdrop-blur-sm border text-center space-y-3',
                    colors.border, 'hover:shadow-xl transition-all duration-300'
                  )}
                >
                  <div className={cn('inline-flex items-center justify-center rounded-xl p-3', colors.bg)}>
                    <val.icon className={cn('h-6 w-6', colors.text)} />
                  </div>
                  <h3 className="font-bold">{t(`${val.key}Title` as 'value1Title')}</h3>
                  <p className="text-sm text-zinc-400">{t(`${val.key}Desc` as 'value1Desc')}</p>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">{t('teamTitle')}</h2>
            <p className="text-zinc-500 mt-2">{t('teamSubtitle')}</p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                className="rounded-2xl p-6 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60 text-center"
              >
                <div className={cn('h-16 w-16 rounded-full bg-gradient-to-br mx-auto flex items-center justify-center text-xl font-bold text-white mb-4', member.color)}>
                  {member.avatar}
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{member.role}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Numbers */}
      <section className="relative overflow-hidden py-16 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">{t('numbersTitle')}</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {numbers.map((num, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                  className="text-center p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60"
                >
                  <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/10 p-2.5 mb-3">
                    <num.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gradient-primary">{num.value}</p>
                  <p className="text-xs text-zinc-500 mt-1">{num.label}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
