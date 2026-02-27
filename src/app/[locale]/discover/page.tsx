'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  MapPin,
  Clock,
  Search,
  Sparkles,
  X,
  ArrowRight,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/ui/components/common/button';
import { Input } from '@/ui/components/common/input';
import { Card } from '@/ui/components/common/card';
import { Badge } from '@/ui/components/common/badge';
import { Spinner } from '@/ui/components/common/spinner';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { FloatingOrbs } from '@/ui/components/common/floating-orbs';
import {
  slideUp,
  staggerContainer,
  staggerItem,
  cardEntrance,
  tapScale,
  skeletonPulse,
} from '@/ui/animations/variants';
import { cn } from '@/lib/utils';
import type { DiscoveredBusiness } from '@/domain/services/discovery-engine';

/* ─── helpers ──────────────────────────────────────────── */

function getNext14Days(): Array<{ date: string; dayName: string; dayNum: number; monthShort: string }> {
  const days: Array<{ date: string; dayName: string; dayNum: number; monthShort: string }> = [];
  const shortDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      dayName: shortDays[d.getDay()],
      dayNum: d.getDate(),
      monthShort: shortMonths[d.getMonth()],
    });
  }
  return days;
}

const TIME_OPTIONS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00',
];

/* ─── skeleton card ────────────────────────────────────── */

function SkeletonCard() {
  return (
    <motion.div
      variants={skeletonPulse}
      initial="initial"
      animate="animate"
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="h-40 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-2/3 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-8 w-16 rounded-lg bg-muted" />
          <div className="h-8 w-16 rounded-lg bg-muted" />
          <div className="h-8 w-16 rounded-lg bg-muted" />
        </div>
        <div className="h-10 w-full rounded-lg bg-muted" />
      </div>
    </motion.div>
  );
}

/* ─── main page ────────────────────────────────────────── */

export default function DiscoverPage() {
  const t = useTranslations('discover');
  const days = useMemo(() => getNext14Days(), []);

  // Filter state
  const [scheduleActive, setScheduleActive] = useState(false);
  const [locationActive, setLocationActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [locationQuery, setLocationQuery] = useState('');

  // Results state
  const [results, setResults] = useState<DiscoveredBusiness[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const canSearch = scheduleActive || locationActive;

  async function handleSearch() {
    if (!canSearch) return;
    setLoading(true);
    setHasSearched(true);

    try {
      const {
        getBusinessRepository,
        getProfessionalRepository,
        getServiceRepository,
        getBookingRepository,
        getBlockedRangeRepository,
      } = await import('@/infra/providers/repositories');
      const { DiscoverBusinesses } = await import(
        '@/application/use-cases/discover-businesses'
      );

      const useCase = new DiscoverBusinesses(
        getBusinessRepository(),
        getProfessionalRepository(),
        getServiceRepository(),
        getBookingRepository(),
        getBlockedRangeRepository(),
      );

      const discovered = await useCase.execute({
        date: scheduleActive && selectedDate ? selectedDate : undefined,
        time: scheduleActive && selectedTime ? selectedTime : undefined,
        address: locationActive && locationQuery.trim() ? locationQuery.trim() : undefined,
      });

      setResults(discovered);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleClearFilters() {
    setScheduleActive(false);
    setLocationActive(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setLocationQuery('');
    setResults(null);
    setHasSearched(false);
  }

  return (
    <PageTransition>
      <main className="min-h-screen relative">
        <FloatingOrbs />

        <div className="relative max-w-2xl mx-auto px-4 py-8 sm:py-12">
          {/* ── Header ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm text-emerald-400 mb-4">
              <Sparkles className="h-4 w-4" />
              Smart Discovery
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t('title')}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* ── Filter Chips ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex gap-3 justify-center mb-6"
          >
            <motion.button
              whileTap={tapScale}
              onClick={() => setScheduleActive((v) => !v)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 border',
                scheduleActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                  : 'bg-card border-border text-muted-foreground hover:border-emerald-500/40 hover:text-foreground',
              )}
            >
              <CalendarDays className="h-4 w-4" />
              {t('scheduleFilter')}
            </motion.button>

            <motion.button
              whileTap={tapScale}
              onClick={() => setLocationActive((v) => !v)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 border',
                locationActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                  : 'bg-card border-border text-muted-foreground hover:border-emerald-500/40 hover:text-foreground',
              )}
            >
              <MapPin className="h-4 w-4" />
              {t('locationFilter')}
            </motion.button>
          </motion.div>

          {/* ── Filter Panel ───────────────────────── */}
          <AnimatePresence mode="wait">
            {(scheduleActive || locationActive) && (
              <motion.div
                key="filter-panel"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-8"
              >
                <Card glass className="p-5 space-y-5">
                  {/* Schedule filter */}
                  <AnimatePresence>
                    {scheduleActive && (
                      <motion.div
                        key="schedule-section"
                        variants={slideUp}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-4"
                      >
                        {/* Date strip */}
                        <div>
                          <label className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-3">
                            <CalendarDays className="h-4 w-4 text-emerald-400" />
                            {t('date')}
                          </label>
                          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {days.map((day) => (
                              <button
                                key={day.date}
                                onClick={() => setSelectedDate(day.date)}
                                className={cn(
                                  'flex flex-col items-center rounded-xl px-3 py-2.5 min-w-[3.5rem] transition-all duration-200 shrink-0',
                                  selectedDate === day.date
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                                    : 'bg-muted/50 border border-border hover:border-emerald-500/50',
                                )}
                              >
                                <span className="text-[10px] font-medium uppercase opacity-70">{day.dayName}</span>
                                <span className="text-lg font-bold leading-tight">{day.dayNum}</span>
                                <span className="text-[10px] opacity-60">{day.monthShort}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Time grid */}
                        <div>
                          <label className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-3">
                            <Clock className="h-4 w-4 text-emerald-400" />
                            {t('time')}
                          </label>
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                            <button
                              onClick={() => setSelectedTime(null)}
                              className={cn(
                                'rounded-lg border px-2 py-2 text-sm font-medium transition-all duration-200',
                                !selectedTime
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : 'border-border bg-muted/30 hover:border-emerald-500/40 text-muted-foreground',
                              )}
                            >
                              {t('anyTime')}
                            </button>
                            {TIME_OPTIONS.map((time) => (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={cn(
                                  'rounded-lg border px-2 py-2 text-sm font-medium transition-all duration-200',
                                  selectedTime === time
                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25'
                                    : 'border-border bg-muted/30 hover:border-emerald-500/40 text-foreground',
                                )}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Divider when both active */}
                  {scheduleActive && locationActive && (
                    <div className="border-t border-border" />
                  )}

                  {/* Location filter */}
                  <AnimatePresence>
                    {locationActive && (
                      <motion.div
                        key="location-section"
                        variants={slideUp}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <label className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-3">
                          <MapPin className="h-4 w-4 text-emerald-400" />
                          {t('location')}
                        </label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                            placeholder={t('locationPlaceholder')}
                            className="pl-9"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSearch();
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-1">
                    <Button
                      variant="cta"
                      size="lg"
                      className="flex-1"
                      onClick={handleSearch}
                      disabled={loading || (scheduleActive && !selectedDate)}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" />
                          {t('searching')}
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4" />
                          {t('search')}
                        </>
                      )}
                    </Button>
                    {hasSearched && (
                      <Button variant="ghost" size="lg" onClick={handleClearFilters}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Results ─────────────────────────────── */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </motion.div>
            )}

            {!loading && hasSearched && results && results.length > 0 && (
              <motion.div key="results" initial="hidden" animate="visible" exit="hidden">
                <motion.p
                  variants={staggerItem}
                  className="text-sm text-muted-foreground mb-4"
                >
                  {results.length === 1
                    ? t('oneResult')
                    : t('resultsFound', { count: results.length })}
                </motion.p>

                <motion.div variants={staggerContainer} className="space-y-4">
                  {results.map((item) => (
                    <BusinessResultCard key={item.business.id} item={item} />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {!loading && hasSearched && results && results.length === 0 && (
              <motion.div
                key="empty"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center py-16"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Search className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{t('noResults')}</h3>
                <p className="text-sm text-muted-foreground">{t('noResultsHint')}</p>
                <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
                  {t('clearFilters')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </PageTransition>
  );
}

/* ─── Business Result Card ─────────────────────────────── */

function BusinessResultCard({ item }: { item: DiscoveredBusiness }) {
  const t = useTranslations('discover');

  // Merge all unique slots across professionals and show the first 8
  const allSlots = useMemo(() => {
    const seen = new Set<string>();
    const merged: Array<{ start: string; end: string }> = [];
    for (const match of item.matchingSlots) {
      for (const slot of match.slots) {
        if (!seen.has(slot.start)) {
          seen.add(slot.start);
          merged.push(slot);
        }
      }
    }
    merged.sort((a, b) => a.start.localeCompare(b.start));
    return merged;
  }, [item.matchingSlots]);

  const displaySlots = allSlots.slice(0, 8);
  const extraCount = allSlots.length - displaySlots.length;
  const hasSlots = allSlots.length > 0;

  return (
    <motion.div variants={cardEntrance}>
      <Card glass glow className="overflow-hidden p-0">
        {/* Cover image */}
        {item.business.coverImageUrl && (
          <div className="relative h-40 overflow-hidden">
            <Image
              src={item.business.coverImageUrl}
              alt={item.business.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {item.business.category && (
              <div className="absolute bottom-3 left-3">
                <Badge variant="default" className="bg-emerald-500/90 text-white border-0 backdrop-blur-sm">
                  {item.business.category}
                </Badge>
              </div>
            )}
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* Business info */}
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {item.business.logoUrl && (
                  <Image
                    src={item.business.logoUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{item.business.name}</h3>
                  {item.business.address && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {item.business.address}
                    </p>
                  )}
                </div>
              </div>
              {hasSlots && (
                <Badge variant="available" className="shrink-0">
                  {t('availableSlots', { count: allSlots.length })}
                </Badge>
              )}
            </div>
          </div>

          {/* Available time slots */}
          {hasSlots && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {t('slotsAt')}
              </p>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-1.5"
              >
                {displaySlots.map((slot) => (
                  <motion.span
                    key={slot.start}
                    variants={staggerItem}
                    className="inline-flex items-center rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400"
                  >
                    {slot.start}
                  </motion.span>
                ))}
                {extraCount > 0 && (
                  <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    +{extraCount}
                  </span>
                )}
              </motion.div>
            </div>
          )}

          {/* Services preview */}
          {item.services.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.services.slice(0, 3).map((service) => (
                <span
                  key={service.id}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 rounded-full px-2.5 py-1"
                >
                  {service.name}
                  <span className="text-emerald-400 font-medium">
                    ${service.price.toLocaleString()}
                  </span>
                </span>
              ))}
              {item.services.length > 3 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{item.services.length - 3}
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <Link href={`/book/${item.business.slug}`}>
            <Button variant="cta" className="w-full" size="lg">
              {t('bookNow')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
