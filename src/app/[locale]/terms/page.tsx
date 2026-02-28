'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FileText } from 'lucide-react';
import { ScrollReveal } from '@/ui/components/common/scroll-reveal';

export default function TermsPage() {
  const t = useTranslations('legal');

  const sections = [
    { title: t('section1Title'), content: t('section1Content') },
    { title: t('section2Title'), content: t('section2Content') },
    { title: t('section3Title'), content: t('section3Content') },
    { title: t('section4Title'), content: t('section4Content') },
    { title: t('section5Title'), content: t('section5Content') },
    { title: t('section6Title'), content: t('section6Content') },
  ];

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden mesh-gradient">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 p-3 mb-6"
          >
            <FileText className="h-6 w-6 text-emerald-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold"
          >
            {t('termsTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-zinc-500 mt-3"
          >
            {t('termsLastUpdated')}
          </motion.p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-20">
        <div className="space-y-8">
          {sections.map((section, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-emerald-400">{i + 1}. {section.title}</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">{section.content}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  );
}
