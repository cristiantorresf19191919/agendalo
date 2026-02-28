'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/ui/components/common/button';
import { ScrollReveal } from '@/ui/components/common/scroll-reveal';
import { cn } from '@/lib/utils';

export default function FaqPage() {
  const t = useTranslations('faq');
  const [openItem, setOpenItem] = useState<string | null>(null);

  const sections = [
    {
      title: t('generalTitle'),
      items: [
        { q: t('q1'), a: t('a1') },
        { q: t('q2'), a: t('a2') },
        { q: t('q3'), a: t('a3') },
        { q: t('q4'), a: t('a4') },
      ],
    },
    {
      title: t('businessTitle'),
      items: [
        { q: t('q5'), a: t('a5') },
        { q: t('q6'), a: t('a6') },
        { q: t('q7'), a: t('a7') },
        { q: t('q8'), a: t('a8') },
      ],
    },
    {
      title: t('paymentsTitle'),
      items: [
        { q: t('q9'), a: t('a9') },
        { q: t('q10'), a: t('a10') },
      ],
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden mesh-gradient">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 p-3 mb-6"
          >
            <HelpCircle className="h-6 w-6 text-emerald-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
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
        </div>
      </section>

      {/* FAQ sections */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-16">
        {sections.map((section, si) => (
          <div key={si} className="mb-10">
            <ScrollReveal>
              <h2 className="text-lg font-bold mb-4 text-emerald-400">{section.title}</h2>
            </ScrollReveal>
            <div className="space-y-3">
              {section.items.map((item, i) => {
                const id = `${si}-${i}`;
                const isOpen = openItem === id;
                return (
                  <ScrollReveal key={id} delay={i * 0.05}>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
                      <button
                        onClick={() => setOpenItem(isOpen ? null : id)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="text-sm font-semibold pr-4">{item.q}</span>
                        {isOpen
                          ? <ChevronUp className="h-4 w-4 text-zinc-500 shrink-0" />
                          : <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />
                        }
                      </button>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="px-5 pb-5"
                        >
                          <p className="text-sm text-zinc-400 leading-relaxed">{item.a}</p>
                        </motion.div>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Contact CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <ScrollReveal>
          <div className="rounded-2xl p-8 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-purple-500/10 p-3 mb-4">
              <MessageCircle className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('contactTitle')}</h3>
            <p className="text-sm text-zinc-400 mb-6">{t('contactDesc')}</p>
            <Button variant="cta" className="gap-2">
              {t('contactButton')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
