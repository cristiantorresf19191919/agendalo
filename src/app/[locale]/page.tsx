'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  ChevronRight,
  Play,
  TrendingUp,
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
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.97]);

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
      accent: 'emerald',
    },
    {
      icon: Shield,
      title: t('home.featurePros'),
      desc: t('home.featureProsDesc'),
      accent: 'emerald',
    },
    {
      icon: BadgeDollarSign,
      title: t('home.featurePrices'),
      desc: t('home.featurePricesDesc'),
      accent: 'emerald',
    },
  ];

  const stats = [
    { value: '2,500+', label: t('home.statBookings'), icon: Clock },
    { value: '150+', label: t('home.statProfessionals'), icon: Users },
    { value: '4.9', label: t('home.statRating'), icon: Star },
    { value: '3', label: t('home.statCities'), icon: MapPin },
  ];

  const steps = [
    { icon: Search, title: t('home.step1Title'), desc: t('home.step1Desc'), num: '01' },
    { icon: CalendarCheck, title: t('home.step2Title'), desc: t('home.step2Desc'), num: '02' },
    { icon: HandMetal, title: t('home.step3Title'), desc: t('home.step3Desc'), num: '03' },
    { icon: PartyPopper, title: t('home.step4Title'), desc: t('home.step4Desc'), num: '04' },
  ];

  const popularServices = [
    { icon: Scissors, name: t('search.serviceHaircut'), price: '$25.000', bookings: '1,200+' },
    { icon: Palette, name: t('search.serviceManicure'), price: '$35.000', bookings: '890+' },
    { icon: Heart, name: t('search.serviceMassage'), price: '$80.000', bookings: '650+' },
    { icon: Gem, name: t('search.serviceFacial'), price: '$120.000', bookings: '430+' },
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

  return (
    <main className="min-h-screen overflow-hidden">
      {/* ── Hero ── */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[92vh] flex flex-col items-center justify-center hero-gradient noise-overlay"
      >
        <FloatingOrbs />

        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none grid-overlay" />

        <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-16 text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-full bg-emerald-500/8 border border-emerald-500/15 px-5 py-2 text-sm text-emerald-400 mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            {t('home.heroBadge')}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold tracking-tight leading-[1.05] font-display"
          >
            <span className="text-gradient-hero">{t('home.heroTitle')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mt-6 leading-relaxed"
          >
            {t('home.heroSubtitle')}
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl mt-10"
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap justify-center gap-3 mt-6"
          >
            <Link href="/discover">
              <Button variant="cta" size="lg" className="gap-2 rounded-xl shadow-lg shadow-emerald-500/20 px-8">
                <Sparkles className="h-4 w-4" />
                {t('discover.title')}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 rounded-xl border-border hover:border-muted-foreground/30 bg-card/30 backdrop-blur-sm"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              {t('search.advancedFilters')}
            </Button>
          </motion.div>

          {/* Social proof strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-8"
          >
            {/* Avatars */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {['M', 'C', 'A', 'L', 'S'].map((letter, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ zIndex: 5 - i }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{t('home.trustedBy')}</span>
            </div>

            {/* Rating badge */}
            <div className="flex items-center gap-1.5 text-sm">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-foreground font-medium">4.9</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="text-muted-foreground">5.0</span>
            </div>
          </motion.div>

          {/* Live ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 w-full max-w-lg"
          >
            <LiveActivityTicker />
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(var(--background))] to-transparent pointer-events-none z-20" />
      </motion.section>

      {/* ── Popular Services ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-emerald-400 text-sm font-semibold tracking-wide uppercase mb-2">{t('home.trendingLabel')}</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-display">{t('home.popularServices')}</h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">{t('home.popularServicesDesc')}</p>
            </div>
            <Link href="/discover" className="hidden sm:flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
              {t('business.seeAll')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularServices.map((service, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                className="group relative rounded-2xl p-6 cursor-pointer overflow-hidden
                  bg-[hsl(var(--surface-1))] border border-border/50
                  hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/[0.06] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/8 p-3.5">
                    <service.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="font-semibold text-[15px] text-foreground font-display">{service.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-lg font-bold text-emerald-400">{service.price}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{service.bookings} {t('home.bookingsLabel')}</p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Barrio Quick Select ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-emerald-400 text-sm font-semibold tracking-wide uppercase mb-2">{t('home.barrioTrending')}</p>
            <h2 className="text-2xl sm:text-3xl font-bold font-display">{t('home.barrioSectionTitle')}</h2>
            <p className="text-sm text-muted-foreground mt-2">{t('home.barrioSectionDesc')}</p>
          </div>
        </ScrollReveal>
        <BarrioQuickSelect />
      </section>

      {/* ── Category filters + Business Grid ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-emerald-400 text-sm font-semibold tracking-wide uppercase mb-2">{t('search.inBogota')}</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-display">{t('home.featuredBusinesses')}</h2>
            </div>
          </div>
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
                <div className="rounded-2xl bg-muted/60 p-5 mb-4 border border-border/50">
                  <SearchX className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold font-display">{t('home.noResults')}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t('home.tryDifferent')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>

      {/* ── Stats ── */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative text-center p-6 md:p-8 rounded-2xl bg-[hsl(var(--surface-1))] border border-border/50 group hover:border-emerald-500/15 transition-colors duration-300"
                >
                  <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/8 p-3 mb-4">
                    <stat.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-gradient-primary font-display">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-sm font-semibold tracking-wide uppercase mb-2">{t('home.simpleLabel')}</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display">{t('home.howItWorks')}</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">{t('home.howItWorksDesc')}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                className="relative rounded-2xl p-6 overflow-hidden
                  bg-[hsl(var(--surface-1))] border border-border/50
                  hover:border-emerald-500/15 transition-all duration-300 group"
              >
                {/* Step number watermark */}
                <span className="absolute top-4 right-5 text-6xl font-black text-white/[0.02] font-display select-none">
                  {step.num}
                </span>

                <div className="relative">
                  {/* Step indicator */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/8 p-3">
                      <step.icon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="text-xs font-bold text-emerald-400/60 tracking-widest uppercase">{step.num}</span>
                  </div>
                  <h3 className="font-bold text-lg font-display">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.desc}</p>
                </div>

                {/* Connector line on desktop */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t border-dashed border-border" />
                )}
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Why Agendalo ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display">
              {t('home.whyAgendalo')}
            </h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                className="relative rounded-2xl p-7 space-y-5 overflow-hidden
                  bg-[hsl(var(--surface-1))] border border-border/50
                  hover:border-emerald-500/15 transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center rounded-2xl bg-emerald-500/8 p-4">
                  <feat.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-display">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.015] to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-emerald-400 text-sm font-semibold tracking-wide uppercase mb-2">{t('business.reviews')}</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display">{t('home.testimonials')}</h2>
              <p className="text-muted-foreground mt-3 max-w-md mx-auto">{t('home.testimonialsDesc')}</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                  className="rounded-2xl p-7 bg-[hsl(var(--surface-1))] border border-border/50 hover:border-emerald-500/10 transition-all duration-300 flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-5">
                    {Array.from({ length: item.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-[15px] text-foreground/80 leading-relaxed flex-1">
                    &ldquo;{item.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border/50">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-sm font-bold text-white">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.author}</p>
                      <p className="text-xs text-muted-foreground">{item.role}</p>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 pb-24">
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/15 via-[hsl(var(--surface-1))] to-[hsl(var(--surface-1))]" />
            <div className="absolute inset-0 border border-emerald-500/10 rounded-3xl" />
            {/* Decorative glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

            <div className="relative p-8 sm:p-12 lg:p-16">
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/8 border border-emerald-500/15 px-4 py-1.5 text-sm text-emerald-400 mb-6">
                  <Sparkles className="h-4 w-4" />
                  {t('home.registerBusiness')}
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display mb-4">
                  {t('home.registerBusiness')}
                </h2>
                <p className="text-muted-foreground mb-10 text-base sm:text-lg leading-relaxed">
                  {t('home.registerBusinessCta')}
                </p>

                {/* Benefits */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10">
                  {[
                    t('home.registerBusinessBenefit1'),
                    t('home.registerBusinessBenefit2'),
                    t('home.registerBusinessBenefit3'),
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      {benefit}
                    </div>
                  ))}
                </div>

                <Link href="/auth/register">
                  <Button variant="cta" size="lg" className="gap-2 rounded-xl shadow-lg shadow-emerald-500/20 px-8">
                    {t('auth.registerAsBusiness')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Advanced Search Filter Modal */}
      <SearchFilterModal open={filterOpen} onOpenChange={setFilterOpen} />
    </main>
  );
}
