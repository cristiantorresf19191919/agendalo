'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Zap, Shield, BadgeDollarSign, SearchX, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/ui/components/common/button';
import { SearchBar } from '@/ui/components/common/search-bar';
import { CategoryFilters } from '@/ui/components/common/category-filters';
import { BusinessCard } from '@/ui/components/common/business-card';
import { BusinessCardSkeleton } from '@/ui/components/common/skeleton';
import { ScrollReveal } from '@/ui/components/common/scroll-reveal';
import { FloatingOrbs } from '@/ui/components/common/floating-orbs';
import { staggerContainer } from '@/ui/animations/variants';
import { getAllBusinesses, searchBusinesses, getBusinessesByCategory } from '@/lib/mock-data';
import type { MockBusiness } from '@/lib/mock-data';

export default function HomePage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filteredBusinesses = useMemo<MockBusiness[]>(() => {
    if (searchQuery.trim()) {
      const results = searchBusinesses(searchQuery);
      if (selectedCategory !== 'all') {
        return results.filter((b) => b.category === selectedCategory);
      }
      return results;
    }
    return getBusinessesByCategory(selectedCategory);
  }, [searchQuery, selectedCategory]);

  const features = [
    { icon: Zap, title: t('home.featureInstant'), desc: t('home.featureInstantDesc') },
    { icon: Shield, title: t('home.featurePros'), desc: t('home.featureProsDesc') },
    { icon: BadgeDollarSign, title: t('home.featurePrices'), desc: t('home.featurePricesDesc') },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden mesh-gradient">
        <FloatingOrbs />
        <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 pt-16 pb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl"
          >
            <span className="text-gradient-primary">{t('home.heroTitle')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto mt-4"
          >
            {t('home.heroSubtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl mt-8"
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4"
          >
            <Link href="/discover">
              <Button variant="outline" size="lg" className="gap-2 border-emerald-500/30 hover:border-emerald-500/60">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                {t('discover.title')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Category filters + Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <CategoryFilters
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            className="mb-8"
          />
        </motion.div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BusinessCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Business grid */}
            <AnimatePresence mode="wait">
              {filteredBusinesses.length > 0 ? (
                <motion.div
                  key={`${selectedCategory}-${searchQuery}`}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredBusinesses.map((biz) => (
                    <BusinessCard key={biz.id} business={biz} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="rounded-full bg-muted/30 p-4 mb-4">
                    <SearchX className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">{t('home.noResults')}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t('home.tryDifferent')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </section>

      {/* Why Agendalo */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            {t('home.whyAgendalo')}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="rounded-2xl p-6 card-surface text-center space-y-3">
                <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/10 p-3">
                  <feat.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-lg">{feat.title}</h3>
                <p className="text-sm text-muted-foreground">{feat.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <ScrollReveal>
          <div className="rounded-2xl p-8 sm:p-12 text-center card-surface gradient-border">
            <h2 className="text-2xl sm:text-3xl font-bold">{t('home.registerBusiness')}</h2>
            <p className="text-muted-foreground mt-2 mb-6">{t('home.registerBusinessCta')}</p>
            <Link href="/auth/register">
              <Button variant="cta" size="lg">
                {t('auth.registerAsBusiness')}
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
