'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Check, Sparkles, Shield, ChevronDown, ChevronUp, ArrowRight, Building2, Crown, Zap } from 'lucide-react';
import { Button } from '@/ui/components/common/button';
import { ScrollReveal } from '@/ui/components/common/scroll-reveal';
import { cn } from '@/lib/utils';

const plans = [
  {
    key: 'individual',
    icon: Zap,
    color: 'emerald',
    features: ['feat1Prof', 'featUnlimitedBookings', 'featWhatsappReminders', 'featOnlineBooking', 'featBasicAnalytics'],
    cta: 'getStarted',
    popular: false,
  },
  {
    key: 'duo',
    icon: Sparkles,
    color: 'purple',
    features: ['feat2Prof', 'featUnlimitedBookings', 'featWhatsappReminders', 'featOnlineBooking', 'featAdvancedAnalytics', 'featPayments', 'featLoyalty'],
    cta: 'upgrade',
    popular: true,
  },
  {
    key: 'unlimited',
    icon: Crown,
    color: 'amber',
    features: ['featUnlimitedProf', 'featUnlimitedBookings', 'featWhatsappReminders', 'featOnlineBooking', 'featAdvancedAnalytics', 'featPayments', 'featLoyalty', 'featMarketing', 'featMultiLocation', 'featInvoicing', 'featPrioritySupport'],
    cta: 'upgrade',
    popular: false,
  },
  {
    key: 'enterprise',
    icon: Building2,
    color: 'blue',
    features: ['featCustomProf', 'featUnlimitedBookings', 'featWhatsappReminders', 'featOnlineBooking', 'featAdvancedAnalytics', 'featPayments', 'featLoyalty', 'featMarketing', 'featMultiLocation', 'featInvoicing', 'featPrioritySupport', 'featDedicatedManager', 'featCustomIntegrations', 'featApiAccess'],
    cta: 'contactSales',
    popular: false,
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string; badge: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', glow: 'shadow-purple-500/10', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'shadow-amber-500/10', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', glow: 'shadow-blue-500/10', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
};

export default function PricingPage() {
  const t = useTranslations('pricing');
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden mesh-gradient">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm text-emerald-400 mb-6"
          >
            <Shield className="h-4 w-4" />
            {t('moneyBack')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            <span className="text-gradient-primary">{t('title')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-400 max-w-lg mx-auto mt-5"
          >
            {t('subtitle')}
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 mt-8 p-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800"
          >
            <button
              onClick={() => setBilling('monthly')}
              className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all',
                billing === 'monthly' ? 'bg-emerald-500/15 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              {t('monthly')}
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                billing === 'yearly' ? 'bg-emerald-500/15 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              {t('yearly')}
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">{t('savePercent')}</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Plans grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => {
            const colors = colorMap[plan.color];
            const priceKey = `${plan.key}Price` as 'individualPrice' | 'duoPrice' | 'unlimitedPrice' | 'enterprisePrice';
            const price = t(priceKey);
            const isEnterprise = plan.key === 'enterprise';
            const isFree = plan.key === 'individual';
            const displayPrice = billing === 'yearly' && !isFree && !isEnterprise
              ? `$${Math.round(parseFloat(price.replace(/\./g, '').replace(/,/g, '')) * 0.8).toLocaleString('es-CO')}`
              : isFree ? t('free') : isEnterprise ? price : `$${price}`;

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                className={cn(
                  'relative rounded-2xl p-6 bg-zinc-900/80 backdrop-blur-sm border overflow-hidden flex flex-col',
                  plan.popular ? 'border-purple-500/40 shadow-xl shadow-purple-500/10' : `${colors.border}`
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold bg-purple-500/20 text-purple-400 border-b border-l border-purple-500/30">
                    {t('popular')}
                  </div>
                )}

                <div className={cn('inline-flex items-center justify-center rounded-xl p-3 mb-4 w-fit', colors.bg)}>
                  <plan.icon className={cn('h-6 w-6', colors.text)} />
                </div>

                <h3 className="text-lg font-bold">{t(plan.key as 'individual' | 'duo' | 'unlimited' | 'enterprise')}</h3>
                <p className="text-xs text-zinc-500 mt-1 mb-4">{t(`${plan.key}Desc` as 'individualDesc' | 'duoDesc' | 'unlimitedDesc' | 'enterpriseDesc')}</p>

                <div className="mb-6">
                  <span className="text-3xl font-bold">{displayPrice}</span>
                  {!isFree && !isEnterprise && <span className="text-sm text-zinc-500">{t('perMonth')}</span>}
                </div>

                <div className="space-y-2.5 flex-1">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2">
                      <Check className={cn('h-4 w-4 mt-0.5 shrink-0', colors.text)} />
                      <span className="text-sm text-zinc-300">{t(feat as 'feat1Prof')}</span>
                    </div>
                  ))}
                </div>

                <Link href="/auth/register" className="mt-6">
                  <Button
                    variant={plan.popular ? 'cta' : 'outline'}
                    className="w-full gap-2"
                  >
                    {t(plan.cta as 'getStarted' | 'upgrade' | 'contactSales')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-zinc-500 mt-8"
        >
          {t('trustedByBiz')}
        </motion.p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-center mb-8">{t('faqTitle')}</h2>
        </ScrollReveal>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <motion.div
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden"
                layout
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-semibold pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-zinc-500 shrink-0" /> : <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-5 pb-5"
                  >
                    <p className="text-sm text-zinc-400">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  );
}
