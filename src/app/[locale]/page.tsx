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
  Search,
  CalendarCheck,
  HandMetal,
  PartyPopper,
  Quote,
  CheckCircle2,
  MapPin,
  Scissors,
  Palette,
  Heart,
  Gem,
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
import { LiveActivityTicker } from '@/ui/components/common/live-activity-ticker';
import { BarrioQuickSelect } from '@/ui/components/common/barrio-quick-select';
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
      iconBg: 'bg-emerald-500/10',
    },
    {
      icon: Shield,
      title: t('home.featurePros'),
      desc: t('home.featureProsDesc'),
      gradient: 'from-purple-500/20 to-violet-500/20',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      iconBg: 'bg-purple-500/10',
    },
    {
      icon: BadgeDollarSign,
      title: t('home.featurePrices'),
      desc: t('home.featurePricesDesc'),
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      iconBg: 'bg-amber-500/10',
    },
  ];

  const stats = [
    { value: '2,500+', label: t('home.statBookings'), icon: Clock },
    { value: '150+', label: t('home.statProfessionals'), icon: Users },
    { value: '4.9', label: t('home.statRating'), icon: Star },
    { value: '3', label: t('home.statCities'), icon: MapPin },
  ];

  const steps = [
    { icon: Search, title: t('home.step1Title'), desc: t('home.step1Desc'), color: 'emerald' },
    { icon: CalendarCheck, title: t('home.step2Title'), desc: t('home.step2Desc'), color: 'purple' },
    { icon: HandMetal, title: t('home.step3Title'), desc: t('home.step3Desc'), color: 'amber' },
    { icon: PartyPopper, title: t('home.step4Title'), desc: t('home.step4Desc'), color: 'pink' },
  ];

  const popularServices = [
    { icon: Scissors, name: t('search.serviceHaircut'), price: '$25.000', color: 'emerald' },
    { icon: Palette, name: t('search.serviceManicure'), price: '$35.000', color: 'pink' },
    { icon: Heart, name: t('search.serviceMassage'), price: '$80.000', color: 'purple' },
    { icon: Gem, name: t('search.serviceFacial'), price: '$120.000', color: 'amber' },
  ];

  const testimonials = [
    {
      text: t('home.testimonial1'),
      author: t('home.testimonial1Author'),
      role: t('home.testimonial1Role'),
      rating: 5,
      avatar: 'M',
    },
    {
      text: t('home.testimonial2'),
      author: t('home.testimonial2Author'),
      role: t('home.testimonial2Role'),
      rating: 5,
      avatar: 'C',
    },
    {
      text: t('home.testimonial3'),
      author: t('home.testimonial3Author'),
      role: t('home.testimonial3Role'),
      rating: 5,
      avatar: 'A',
    },
  ];

  const stepColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', glow: 'shadow-purple-500/10' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'shadow-amber-500/10' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', glow: 'shadow-pink-500/10' },
  };

  return (
    <main className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden mesh-gradient">
        <FloatingOrbs />
        <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm text-emerald-400 mb-6"
          >
            <Sparkles className="h-4 w-4" />
            {t('home.heroBadge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1]"
          >
            <span className="text-gradient-primary">{t('home.heroTitle')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg text-zinc-400 max-w-lg mx-auto mt-5"
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
            className="flex flex-wrap justify-center gap-3 mt-5"
          >
            <Link href="/discover">
              <Button variant="cta" size="lg" className="gap-2 shadow-lg shadow-emerald-500/20">
                <Sparkles className="h-4 w-4" />
                {t('discover.title')}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-zinc-700 hover:border-zinc-600 bg-zinc-900/50"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
              {t('search.advancedFilters')}
            </Button>
          </motion.div>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center gap-3 text-sm text-zinc-500"
          >
            <div className="flex -space-x-2">
              {['M', 'C', 'A', 'L'].map((letter, i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-zinc-950 flex items-center justify-center text-[10px] font-bold text-white"
                >
                  {letter}
                </div>
              ))}
            </div>
            <span>{t('home.trustedBy')}</span>
          </motion.div>

          {/* Live activity ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 w-full max-w-lg"
          >
            <LiveActivityTicker />
          </motion.div>
        </div>
      </section>

      {/* ── Popular Services ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{t('home.popularServices')}</h2>
              <p className="text-sm text-zinc-500 mt-1">{t('home.popularServicesDesc')}</p>
            </div>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularServices.map((service, i) => {
            const colors = stepColors[service.color];
            return (
              <ScrollReveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                  className={`relative rounded-2xl p-5 cursor-pointer overflow-hidden
                    bg-zinc-900/60 backdrop-blur-sm border ${colors.border}
                    hover:shadow-lg ${colors.glow} transition-all duration-300 group`}
                >
                  <div className={`inline-flex items-center justify-center rounded-xl ${colors.bg} p-3 mb-3`}>
                    <service.icon className={`h-5 w-5 ${colors.text}`} />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">{service.name}</h3>
                  <p className={`text-sm font-medium ${colors.text} mt-1`}>{service.price}</p>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-4 w-4 text-zinc-500" />
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ── Barrio Quick Select ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold">{t('home.barrioSectionTitle')}</h2>
            <p className="text-sm text-zinc-500 mt-1">{t('home.barrioSectionDesc')}</p>
          </div>
        </ScrollReveal>
        <BarrioQuickSelect />
      </section>

      {/* ── Category filters + Business Grid ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <ScrollReveal>
          <h2 className="text-xl sm:text-2xl font-bold mb-6">{t('home.featuredBusinesses')}</h2>
        </ScrollReveal>
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

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BusinessCardSkeleton key={i} />
            ))}
          </div>
        ) : (
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
        )}
      </section>

      {/* ── Stats ── */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60"
                >
                  <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/10 p-2.5 mb-3">
                    <stat.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gradient-primary">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">{t('home.howItWorks')}</h2>
            <p className="text-zinc-500 mt-2">{t('home.howItWorksDesc')}</p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const colors = stepColors[step.color];
            return (
              <ScrollReveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                  className={`relative rounded-2xl p-6 text-center overflow-hidden
                    bg-zinc-900/60 backdrop-blur-sm border ${colors.border}
                    hover:shadow-xl ${colors.glow} transition-all duration-300`}
                >
                  {/* Step number */}
                  <div className="absolute top-4 right-4 text-5xl font-black text-white/[0.03]">
                    {i + 1}
                  </div>
                  <div className="relative">
                    <div className={`inline-flex items-center justify-center rounded-2xl ${colors.bg} p-4 shadow-lg ${colors.glow}`}>
                      <step.icon className={`h-7 w-7 ${colors.text}`} />
                    </div>
                    <div className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${colors.bg} ${colors.text} text-xs font-bold mt-3 mb-1`}>
                      {i + 1}
                    </div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-sm text-zinc-500 mt-2">{step.desc}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ── Why Agendalo ── */}
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
                  bg-zinc-900/60 backdrop-blur-sm border ${feat.borderColor}
                  hover:shadow-xl hover:shadow-emerald-500/[0.05] transition-all duration-300`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} opacity-20`} />
                <div className="relative">
                  <div className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${feat.gradient} p-4 shadow-lg`}>
                    <feat.icon className={`h-7 w-7 ${feat.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-lg mt-4">{feat.title}</h3>
                  <p className="text-sm text-zinc-500 mt-2">{feat.desc}</p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold">{t('home.testimonials')}</h2>
              <p className="text-zinc-500 mt-2">{t('home.testimonialsDesc')}</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                  className="rounded-2xl p-6 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60 hover:border-zinc-700 transition-all duration-300"
                >
                  <Quote className="h-8 w-8 text-emerald-500/20 mb-4" />
                  <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                    &ldquo;{item.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    {Array.from({ length: item.rating }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.author}</p>
                      <p className="text-xs text-zinc-500">{item.role}</p>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 pb-20">
        <ScrollReveal>
          <motion.div
            whileHover={{ scale: 1.003 }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-zinc-900 to-purple-600/20" />
            <div className="absolute inset-0 border border-emerald-500/15 rounded-3xl" />

            <div className="relative p-8 sm:p-12 lg:p-16">
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm text-emerald-400 mb-6">
                  <Sparkles className="h-4 w-4" />
                  {t('home.registerBusiness')}
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                  {t('home.registerBusiness')}
                </h2>
                <p className="text-zinc-400 mb-8 text-base sm:text-lg">
                  {t('home.registerBusinessCta')}
                </p>

                {/* Benefits */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
                  {[
                    t('home.registerBusinessBenefit1'),
                    t('home.registerBusinessBenefit2'),
                    t('home.registerBusinessBenefit3'),
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      {benefit}
                    </div>
                  ))}
                </div>

                <Link href="/auth/register">
                  <Button variant="cta" size="lg" className="gap-2 shadow-lg shadow-emerald-500/20">
                    {t('auth.registerAsBusiness')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </section>

      {/* Advanced Search Filter Modal */}
      <SearchFilterModal open={filterOpen} onOpenChange={setFilterOpen} />
    </main>
  );
}
