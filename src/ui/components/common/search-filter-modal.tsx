'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { Button } from './button';
import { StarRating } from './star-rating';
import { PriceRange } from './price-range';
import {
  fadeIn,
  scaleIn,
  staggerContainer,
  staggerItem,
  slideUp,
} from '@/ui/animations/variants';
import {
  getAllBusinesses,
  getBusinessesByCategory,
  searchBusinesses,
  getPriceRange,
  CATEGORIES,
  type MockBusiness,
} from '@/lib/mock-data';
import {
  Search,
  X,
  Calendar,
  Filter,
  MapPin,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';

/* ─── Types ─── */

interface SearchFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ─── Component ─── */

export function SearchFilterModal({ open, onOpenChange }: SearchFilterModalProps) {
  const t = useTranslations('searchFilter');

  /* ── State ── */
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  /* ── Derived data ── */
  const allBusinesses = useMemo(() => getAllBusinesses(), []);

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || dateFrom || dateTo;

  /* ── Filtered results (AND logic) ── */
  const filteredBusinesses = useMemo(() => {
    let results: MockBusiness[] = allBusinesses;

    // Filter by search query (business name, description, address)
    if (searchQuery.trim()) {
      results = searchBusinesses(searchQuery);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryBusinessIds = new Set(
        getBusinessesByCategory(selectedCategory).map((b) => b.id)
      );
      results = results.filter((b) => categoryBusinessIds.has(b.id));
    }

    // Filter by date range — find businesses whose services overlap
    // Since we use mock data, we filter by ensuring the business has services
    // that could potentially be booked within the date range.
    // For now we keep all results that passed previous filters when dates are set,
    // since mock data does not have real availability tied to dates.
    // The date inputs still serve as a UX affordance for the user's intent.

    return results;
  }, [allBusinesses, searchQuery, selectedCategory]);

  /* ── Handlers ── */
  const handleClearAll = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setDateFrom('');
    setDateTo('');
  }, []);

  const handleApplyFilters = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? 'all' : categoryId));
  }, []);

  /* ── Category label lookup ── */
  const categoryLabels: Record<string, string> = {
    barberia: 'Barberia',
    spa: 'Spa',
    salon: 'Salon',
    unas: 'Unas',
    clinica: 'Clinica',
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            {/* ── Overlay ── */}
            <DialogPrimitive.Overlay asChild>
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>

            {/* ── Content ── */}
            <DialogPrimitive.Content asChild>
              <motion.div
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                  'fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2',
                  'max-h-[85vh] overflow-y-auto',
                  'rounded-2xl border border-white/10 border-t-emerald-500/20',
                  'bg-card/95 backdrop-blur-2xl',
                  'shadow-2xl shadow-black/30',
                  'scrollbar-none'
                )}
              >
                {/* ── Header ── */}
                <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-2xl border-b border-white/[0.06] px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-emerald-400" />
                      <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
                        {t('title')}
                      </DialogPrimitive.Title>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasActiveFilters && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={handleClearAll}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full border border-white/[0.06] hover:border-white/10"
                        >
                          {t('clearAll')}
                        </motion.button>
                      )}
                      <DialogPrimitive.Close className="rounded-full p-2 hover:bg-muted/50 transition-colors">
                        <X className="h-4 w-4 text-muted-foreground" />
                      </DialogPrimitive.Close>
                    </div>
                  </div>

                  {/* Visually hidden description for accessibility */}
                  <DialogPrimitive.Description className="sr-only">
                    {t('title')}
                  </DialogPrimitive.Description>

                  {/* ── Search input ── */}
                  <div
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3',
                      'bg-muted/30 border border-white/[0.06]',
                      'transition-all duration-300',
                      'focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500/20'
                    )}
                  >
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('businessPlaceholder')}
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="shrink-0 p-1 rounded-full hover:bg-muted/50 transition-colors"
                      >
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Body ── */}
                <div className="px-6 py-4 space-y-6">
                  {/* ── Category filter chips ── */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5" />
                      {t('filterByCategory')}
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {CATEGORIES.map((cat) => {
                        const isActive = selectedCategory === cat.id;
                        return (
                          <motion.button
                            key={cat.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCategorySelect(cat.id)}
                            className={cn(
                              'shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium',
                              'border transition-all duration-200',
                              isActive
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : 'bg-muted/20 text-muted-foreground border-white/[0.06] hover:text-foreground hover:border-white/10'
                            )}
                          >
                            {isActive && (
                              <Sparkles className="h-3 w-3" />
                            )}
                            <span>{categoryLabels[cat.id] ?? cat.id}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Date range ── */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {t('dateRange')}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {/* From date */}
                      <div
                        className={cn(
                          'rounded-xl p-3 border transition-all duration-200',
                          'bg-muted/20 border-white/[0.06]',
                          dateFrom && 'border-emerald-500/30 bg-emerald-500/5'
                        )}
                      >
                        <label className="block text-xs text-muted-foreground mb-1.5">
                          {t('from')}
                        </label>
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className={cn(
                            'w-full bg-transparent text-sm text-foreground outline-none',
                            '[color-scheme:dark]',
                            !dateFrom && 'text-muted-foreground'
                          )}
                        />
                      </div>

                      {/* To date */}
                      <div
                        className={cn(
                          'rounded-xl p-3 border transition-all duration-200',
                          'bg-muted/20 border-white/[0.06]',
                          dateTo && 'border-emerald-500/30 bg-emerald-500/5'
                        )}
                      >
                        <label className="block text-xs text-muted-foreground mb-1.5">
                          {t('to')}
                        </label>
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                          min={dateFrom || undefined}
                          className={cn(
                            'w-full bg-transparent text-sm text-foreground outline-none',
                            '[color-scheme:dark]',
                            !dateTo && 'text-muted-foreground'
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Results ── */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        {t('resultsCount', { count: filteredBusinesses.length })}
                      </h3>
                    </div>

                    <AnimatePresence mode="wait">
                      {filteredBusinesses.length > 0 ? (
                        <motion.div
                          key="results"
                          variants={staggerContainer}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        >
                          {filteredBusinesses.map((business) => (
                            <ResultCard key={business.id} business={business} />
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          variants={slideUp}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="text-center py-10"
                        >
                          <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground">
                            {t('noFiltersApplied')}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* ── Footer CTA ── */}
                <div className="sticky bottom-0 z-10 bg-card/95 backdrop-blur-2xl border-t border-white/[0.06] px-6 py-4">
                  <Button
                    variant="cta"
                    size="lg"
                    className="w-full rounded-xl"
                    onClick={handleApplyFilters}
                  >
                    {t('applyFilters')}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

/* ─── Result card (compact business card) ─── */

function ResultCard({ business }: { business: MockBusiness }) {
  const priceLevel = getPriceRange(business.id);

  return (
    <motion.div variants={staggerItem}>
      <Link
        href={`/book/${business.slug}`}
        className={cn(
          'group block rounded-xl overflow-hidden',
          'bg-muted/20 border border-white/[0.06]',
          'hover:border-emerald-500/20 hover:bg-muted/30',
          'transition-all duration-300'
        )}
      >
        {/* Cover image */}
        <div className="relative h-32 overflow-hidden">
          <Image
            src={business.coverImageUrl ?? ''}
            alt={business.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3">
            <h4 className="text-sm font-semibold text-white drop-shadow-lg truncate">
              {business.name}
            </h4>
          </div>
        </div>

        {/* Details */}
        <div className="p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <StarRating rating={business.rating} reviewCount={business.reviewCount} size="sm" />
            <PriceRange level={priceLevel} />
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
            {business.address}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
