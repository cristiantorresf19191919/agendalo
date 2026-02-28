'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  CalendarCheck, Bell, CreditCard, BarChart3, MessageSquare, Building2,
  ArrowRight, CheckCircle2, Sparkles, TrendingUp, Clock, DollarSign,
} from 'lucide-react';
import { Button } from '@/ui/components/common/button';
import { ScrollReveal } from '@/ui/components/common/scroll-reveal';
import { cn } from '@/lib/utils';
import { staggerContainer } from '@/ui/animations/variants';

const features = [
  { key: 'feat1', icon: CalendarCheck, color: 'emerald' },
  { key: 'feat2', icon: Bell, color: 'purple' },
  { key: 'feat3', icon: CreditCard, color: 'amber' },
  { key: 'feat4', icon: BarChart3, color: 'blue' },
  { key: 'feat5', icon: MessageSquare, color: 'pink' },
  { key: 'feat6', icon: Building2, color: 'teal' },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
};

export default function ForBusinessesPage() {
  const t = useTranslations('forBusinesses');
  const tAuth = useTranslations('auth');

  const stats = [
    { value: t('stat1'), label: t('stat1Label'), icon: TrendingUp },
    { value: t('stat2'), label: t('stat2Label'), icon: Bell },
    { value: t('stat3'), label: t('stat3Label'), icon: Clock },
    { value: t('stat4'), label: t('stat4Label'), icon: DollarSign },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden mesh-gradient">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm text-emerald-400 mb-6"
          >
            <Sparkles className="h-4 w-4" />
            {tAuth('registerAsBusiness')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]"
          >
            <span className="text-gradient-primary">{t('title')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mt-5"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            <Link href="/auth/register">
              <Button variant="cta" size="lg" className="gap-2 shadow-lg shadow-emerald-500/20">
                {t('heroCta')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="gap-2 border-zinc-700">
                {t('heroSeePlans')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/60"
            >
              <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/10 p-2.5 mb-3">
                <stat.icon className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gradient-primary">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">{t('featuresTitle')}</h2>
            <p className="text-zinc-500 mt-2">{t('featuresSubtitle')}</p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const colors = colorMap[feat.color];
            return (
              <ScrollReveal key={feat.key} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                  className={cn(
                    'rounded-2xl p-6 bg-zinc-900/60 backdrop-blur-sm border space-y-4',
                    colors.border, 'hover:shadow-xl transition-all duration-300'
                  )}
                >
                  <div className={cn('inline-flex items-center justify-center rounded-xl p-3', colors.bg)}>
                    <feat.icon className={cn('h-6 w-6', colors.text)} />
                  </div>
                  <h3 className="font-bold text-lg">{t(`${feat.key}Title` as 'feat1Title')}</h3>
                  <p className="text-sm text-zinc-400">{t(`${feat.key}Desc` as 'feat1Desc')}</p>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ROI section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold">{t('roiTitle')}</h2>
              <p className="text-zinc-500 mt-2">{t('roiSubtitle')}</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { value: '+15', label: t('roiBookings'), color: 'emerald' },
              { value: '$1.2M', label: t('roiRevenue'), color: 'purple' },
              { value: '8+', label: t('roiTime'), color: 'amber' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                  className={cn(
                    'rounded-2xl p-8 text-center bg-zinc-900/60 backdrop-blur-sm border',
                    colorMap[item.color].border
                  )}
                >
                  <p className={cn('text-4xl font-bold', colorMap[item.color].text)}>{item.value}</p>
                  <p className="text-sm text-zinc-400 mt-2">{item.label}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 pb-20">
        <ScrollReveal>
          <motion.div
            whileHover={{ scale: 1.003 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-zinc-900 to-purple-600/20" />
            <div className="absolute inset-0 border border-emerald-500/15 rounded-3xl" />
            <div className="relative p-8 sm:p-12 lg:p-16 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{t('ctaTitle')}</h2>
              <p className="text-zinc-400 mb-8 text-base sm:text-lg max-w-xl mx-auto">{t('ctaSubtitle')}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
                {[
                  'Tu agenda siempre al día, incluso por WhatsApp',
                  'Cobra con Nequi, Daviplata o tarjeta',
                  'Analítica en tiempo real',
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
              <Link href="/auth/register">
                <Button variant="cta" size="lg" className="gap-2 shadow-lg shadow-emerald-500/20">
                  {t('ctaButton')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </ScrollReveal>
      </section>
    </main>
  );
}
