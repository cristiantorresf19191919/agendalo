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
  CheckCircle2,
  MapPin,
  Scissors,
  Palette,
  Heart,
  Gem,
  ChevronRight,
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
import { searchBusinesses, getBusinessesByCategory } from '@/lib/mock-data';
import type { MockBusiness } from '@/lib/mock-data';

export default function HomePage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.98]);

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
      {/* ═══════════════════════════════════════
          HERO
         ═══════════════════════════════════════ */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[90vh] flex flex-col items-center justify-center hero-gradient noise-overlay"
      >
        <FloatingOrbs />
        <div className="absolute inset-0 pointer-events-none grid-overlay" />

        <div className="relative z-10 flex flex-col items-center justify-center px-5 sm:px-8 pt-24 pb-20 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 rounded-full bg-emerald-500/8 border border-emerald-500/12 px-4 py-1.5 text-[13px] font-medium text-emerald-600 dark:text-emerald-400 mb-8"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            {t('home.heroBadge')}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold tracking-tighter leading-[1.05] font-display"
          >
            <span className="text-gradient-hero">{t('home.heroTitle')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto mt-5 leading-relaxed"
          >
            {t('home.heroSubtitle')}
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl mt-10"
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap justify-center gap-3 mt-5"
          >
            <Link href="/discover">
              <Button variant="cta" size="lg" className="gap-2 rounded-xl shadow-[var(--shadow-emerald)] px-7">
                <Sparkles className="h-4 w-4" />
                {t('discover.title')}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 rounded-xl"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t('search.advancedFilters')}
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-14 flex flex-col sm:flex-row items-center gap-5 sm:gap-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['M', 'C', 'A', 'L', 'S'].map((letter, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-background flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
                    style={{ zIndex: 5 - i }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{t('home.trustedBy')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-foreground">4.9</span>
              <span className="text-muted-foreground">/5</span>
            </div>
          </motion.div>

          {/* Live ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 w-full max-w-md"
          >
            <LiveActivityTicker />
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[hsl(var(--background))] to-transparent pointer-events-none z-20" />
      </motion.section>

      {/* ═══════════════════════════════════════
          POPULAR SERVICES — Bento Grid (1 hero + 3 standard)
         ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-3">{t('home.trendingLabel')}</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">{t('home.popularServices')}</h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">{t('home.popularServicesDesc')}</p>
            </div>
            <Link href="/discover" className="hidden sm:flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium group">
              {t('business.seeAll')}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Bento: hero tile (2x2) + 3 standard tiles stacked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Hero tile — first service, larger */}
          <ScrollReveal delay={0}>
            <motion.div
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
              className="group rounded-2xl p-8 cursor-pointer bg-card border border-border/50
                hover:border-emerald-500/20 hover:shadow-[var(--shadow-lg)] transition-all duration-300
                sm:row-span-2 flex flex-col justify-between min-h-[280px] sm:min-h-0"
            >
              <div>
                <div className="inline-flex items-center justify-center rounded-2xl bg-emerald-500/8 p-4 mb-6">
                  <Scissors className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight">{popularServices[0].name}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-sm">
                  {t('home.popularServicesDesc')}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-border/30 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-extrabold text-gradient-primary font-display">{popularServices[0].price}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    {popularServices[0].bookings} {t('home.bookingsLabel')}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Remaining 3 standard tiles */}
          {popularServices.slice(1).map((service, i) => (
            <ScrollReveal key={i} delay={(i + 1) * 0.06}>
              <motion.div
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                className="group rounded-2xl p-6 cursor-pointer bg-card border border-border/50
                  hover:border-emerald-500/20 hover:shadow-[var(--shadow-md)] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/8 p-3">
                    <service.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
                <h3 className="font-semibold text-[15px] text-foreground font-display tracking-tight">{service.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-display">{service.price}</p>
                  <p className="text-[11px] text-muted-foreground">{service.bookings} {t('home.bookingsLabel')}</p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BARRIO QUICK SELECT
         ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-20">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-3">{t('home.barrioTrending')}</p>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">{t('home.barrioSectionTitle')}</h2>
            <p className="text-sm text-muted-foreground mt-2">{t('home.barrioSectionDesc')}</p>
          </div>
        </ScrollReveal>
        <BarrioQuickSelect />
      </section>

      {/* ═══════════════════════════════════════
          BUSINESS GRID
         ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-20">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-3">{t('search.inBogota')}</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">{t('home.featuredBusinesses')}</h2>
            </div>
          </div>
        </ScrollReveal>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <CategoryFilters selected={selectedCategory} onSelect={setSelectedCategory} className="mb-8" />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filteredBusinesses.map((biz) => (
                  <BusinessCard key={biz.id} business={biz} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="rounded-2xl bg-muted/50 p-5 mb-4 border border-border/40">
                  <SearchX className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold font-display">{t('home.noResults')}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t('home.tryDifferent')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>

      {/* ═══════════════════════════════════════
          STATS — Bento Grid (asymmetric: 1 wide + 2 small + 1 medium)
         ═══════════════════════════════════════ */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-[hsl(var(--surface-1))]" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
          <ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* First stat — wide tile */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 }}
                className="col-span-2 p-8 rounded-2xl bg-card border border-border/50 flex flex-col sm:flex-row items-center sm:items-start gap-6"
              >
                <div className="inline-flex items-center justify-center rounded-2xl bg-emerald-500/8 p-4 shrink-0">
                  <Clock className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-4xl sm:text-5xl font-extrabold text-gradient-primary font-display tracking-tight">{stats[0].value}</p>
                  <p className="text-sm text-muted-foreground mt-2">{stats[0].label}</p>
                </div>
              </motion.div>

              {/* Remaining 3 stats — standard tiles */}
              {stats.slice(1).map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i + 1) * 0.08 }}
                  className="text-center p-6 rounded-2xl bg-card border border-border/50"
                >
                  <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/8 p-2.5 mb-4">
                    <stat.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-gradient-primary font-display tracking-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS — Bento Grid (1 intro tile wide + 4 step tiles)
         ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Intro tile — spans 1 full row on lg, acts as header */}
          <ScrollReveal>
            <div className="rounded-2xl p-8 bg-card border border-border/50 sm:col-span-2 lg:col-span-1 lg:row-span-2 flex flex-col justify-center">
              <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-3">{t('home.simpleLabel')}</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">{t('home.howItWorks')}</h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{t('home.howItWorksDesc')}</p>
              <div className="mt-8">
                <Link href="/discover">
                  <Button variant="cta" className="gap-2 rounded-xl shadow-[var(--shadow-emerald)]">
                    {t('discover.title')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Step tiles */}
          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 0.06}>
              <div className="rounded-2xl p-6 bg-card border border-border/50 hover:border-emerald-500/15 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/8 p-3">
                    <step.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600/40 dark:text-emerald-400/30 tracking-widest uppercase font-display">{step.num}</span>
                </div>
                <h3 className="font-bold text-base font-display tracking-tight">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHY AGENDALO — Bento Grid (1 wide + 2 standard)
         ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight">
              {t('home.whyAgendalo')}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First feature — wide tile spanning full width */}
          {(() => {
            const HeroIcon = features[0].icon;
            return (
              <ScrollReveal delay={0}>
                <div className="rounded-2xl p-8 bg-card border border-border/50 hover:border-emerald-500/15 transition-all duration-300 md:col-span-2 flex flex-col sm:flex-row items-start gap-6">
                  <div className="inline-flex items-center justify-center rounded-2xl bg-emerald-500/8 p-4 shrink-0">
                    <HeroIcon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-display tracking-tight">{features[0].title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-lg">{features[0].desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })()}

          {/* Remaining features — 2 standard tiles */}
          {features.slice(1).map((feat, i) => (
            <ScrollReveal key={i} delay={(i + 1) * 0.08}>
              <div className="rounded-2xl p-7 bg-card border border-border/50 hover:border-emerald-500/15 transition-all duration-300">
                <div className="inline-flex items-center justify-center rounded-2xl bg-emerald-500/8 p-4 mb-5">
                  <feat.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-bold text-lg font-display tracking-tight">{feat.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{feat.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS — Bento Grid
         ═══════════════════════════════════════ */}
      <section className="relative py-20 md:py-28">
        <div className="absolute inset-0 bg-[hsl(var(--surface-1))]" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-3">{t('business.reviews')}</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight">{t('home.testimonials')}</h2>
              <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm sm:text-base">{t('home.testimonialsDesc')}</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className={`rounded-2xl p-7 bg-card border border-border/50 hover:border-emerald-500/10 transition-all duration-300 flex flex-col h-full ${i === 0 ? 'md:row-span-1' : ''}`}>
                  <div className="flex items-center gap-0.5 mb-5">
                    {Array.from({ length: item.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[15px] text-foreground/80 leading-relaxed flex-1">
                    &ldquo;{item.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border/30">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.author}</p>
                      <p className="text-xs text-muted-foreground">{item.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA — Bento-style full-width tile
         ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 pb-28">
        <ScrollReveal>
          <div className="rounded-3xl p-8 sm:p-12 lg:p-20 bg-card border border-border/50 relative overflow-hidden">
            {/* Subtle accent glow */}
            <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-emerald-500/6 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-emerald-500/4 blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto text-center relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/8 border border-emerald-500/12 px-4 py-1.5 text-[13px] font-medium text-emerald-600 dark:text-emerald-400 mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                {t('home.registerBusiness')}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight mb-4">
                {t('home.registerBusiness')}
              </h2>
              <p className="text-muted-foreground mb-10 text-base sm:text-lg leading-relaxed">
                {t('home.registerBusinessCta')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10">
                {[
                  t('home.registerBusinessBenefit1'),
                  t('home.registerBusinessBenefit2'),
                  t('home.registerBusinessBenefit3'),
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>

              <Link href="/auth/register">
                <Button variant="cta" size="lg" className="gap-2 rounded-xl shadow-[var(--shadow-emerald)] px-8">
                  {t('auth.registerAsBusiness')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <SearchFilterModal open={filterOpen} onOpenChange={setFilterOpen} />
    </main>
  );
}
