'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  Zap,
  Shield,
  BadgeDollarSign,
  SearchX,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  Star,
  Clock,
  Users,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/ui/components/common/button';
import { SearchBar } from '@/ui/components/common/search-bar';
import { CategoryFilters } from '@/ui/components/common/category-filters';
import { BusinessCard } from '@/ui/components/common/business-card';
import { BusinessCardSkeleton } from '@/ui/components/common/skeleton';
import { ScrollReveal } from '@/ui/components/common/scroll-reveal';
import { FloatingOrbs } from '@/ui/components/common/floating-orbs';
import { SearchFilterModal } from '@/ui/components/common/search-filter-modal';
import { staggerContainer } from '@/ui/animations/variants';
import { getAllBusinesses, searchBusinesses, getBusinessesByCategory } from '@/lib/mock-data';
import type { MockBusiness } from '@/lib/mock-data';

export default function HomePage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

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
    {
      icon: Zap,
      title: t('home.featureInstant'),
      desc: t('home.featureInstantDesc'),
      gradient: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
    },
    {
      icon: Shield,
      title: t('home.featurePros'),
      desc: t('home.featureProsDesc'),
      gradient: 'from-purple-500/20 to-violet-500/20',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/20',
    },
    {
      icon: BadgeDollarSign,
      title: t('home.featurePrices'),
      desc: t('home.featurePricesDesc'),
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/20',
    },
  ];

  const stats = [
    { value: '2,500+', label: 'Citas realizadas', icon: Clock },
    { value: '150+', label: 'Profesionales', icon: Users },
    { value: '4.9', label: 'Calificación promedio', icon: Star },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden mesh-gradient">
        <FloatingOrbs />
        <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm text-emerald-400 mb-6"
          >
            <Sparkles className="h-4 w-4" />
            La plataforma #1 de reservas en Bogotá
          </motion.div>

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
            className="flex gap-3 mt-5"
          >
            <Link href="/discover">
              <Button variant="outline" size="lg" className="gap-2 border-emerald-500/30 hover:border-emerald-500/60">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                {t('discover.title')}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-purple-500/30 hover:border-purple-500/60"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4 text-purple-400" />
              Filtros avanzados
            </Button>
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

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <ScrollReveal>
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-4 sm:p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-white/[0.04]"
              >
                <stat.icon className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-bold text-gradient-primary">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Why Agendalo */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            {t('home.whyAgendalo')}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                className={`relative rounded-2xl p-6 text-center space-y-4 overflow-hidden
                  bg-card/60 backdrop-blur-sm border ${feat.borderColor}
                  hover:shadow-xl hover:shadow-emerald-500/[0.05] transition-shadow duration-300`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} opacity-30`} />
                <div className="relative">
                  <div className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${feat.gradient} p-4 shadow-lg`}>
                    <feat.icon className={`h-7 w-7 ${feat.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-lg mt-4">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{feat.desc}</p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <ScrollReveal>
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="relative rounded-2xl p-8 sm:p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-card to-purple-500/10" />
            <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold">{t('home.registerBusiness')}</h2>
              <p className="text-muted-foreground mt-2 mb-6">{t('home.registerBusinessCta')}</p>
              <Link href="/auth/register">
                <Button variant="cta" size="lg" className="gap-2">
                  {t('auth.registerAsBusiness')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </ScrollReveal>
      </section>

      {/* Advanced Search Filter Modal */}
      <SearchFilterModal open={filterOpen} onOpenChange={setFilterOpen} />
    </main>
  );
}
