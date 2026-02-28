'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Clock, Star, Instagram } from 'lucide-react';
import { useBooking } from '@/ui/components/booking/booking-context';
import { Button } from '@/ui/components/common/button';
import { Spinner } from '@/ui/components/common/spinner';
import { Badge } from '@/ui/components/common/badge';
import { StarRating } from '@/ui/components/common/star-rating';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';
import { Link } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { formatCOP } from '@/lib/format';
import { getMockReviews, getBusinessBySlug, type MockBusiness, type MockService } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

type Tab = 'services' | 'professionals' | 'reviews';

export default function BookBusinessPage() {
  const t = useTranslations();
  const params = useParams<{ slug: string }>();
  const { business, services, professionals, selectedService, selectService, loading, error } = useBooking();
  const [activeTab, setActiveTab] = useState<Tab>('services');

  const mockBiz = getBusinessBySlug(params.slug) as MockBusiness | undefined;
  const reviews = getMockReviews(business?.id ?? '');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold">{t('booking.businessNotFound')}</h1>
        <p className="text-muted-foreground">{t('booking.businessNotFoundDesc')}</p>
        <Link href="/">
          <Button variant="outline">{t('booking.backToHome')}</Button>
        </Link>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    barberia: 'Barbería',
    spa: 'Spa',
    salon: 'Salón',
    unas: 'Uñas',
    clinica: 'Clínica',
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'services', label: t('business.services'), count: services.length },
    { id: 'professionals', label: t('business.professionals'), count: professionals.length },
    { id: 'reviews', label: t('business.reviews'), count: reviews.length },
  ];

  return (
    <PageTransition>
      <main className="min-h-screen max-w-2xl mx-auto pb-28">
        {/* Cover image */}
        {business.coverImageUrl && (
          <div className="relative h-56 sm:h-72 w-full overflow-hidden">
            <Image
              src={business.coverImageUrl}
              alt={business.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>
        )}

        <div className="px-4 sm:px-6 space-y-6">
          {/* Business info card — premium glassmorphism */}
          <div className={cn(
            'relative z-10 rounded-2xl p-5 space-y-3',
            'bg-zinc-900/80 backdrop-blur-md',
            'border border-white/[0.15]',
            'shadow-xl shadow-black/50',
            business.coverImageUrl && '-mt-16'
          )}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{business.name}</h1>
                {business.category && (
                  <Badge variant="available" className="mt-2">
                    {categoryLabels[business.category] ?? business.category}
                  </Badge>
                )}
              </div>
              {mockBiz && (
                <StarRating rating={mockBiz.rating} reviewCount={mockBiz.reviewCount} size="md" />
              )}
            </div>
            {business.description && (
              <p className="text-sm text-muted-foreground">{business.description}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {business.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  {business.address}
                </span>
              )}
              {business.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  {business.phone}
                </span>
              )}
              {mockBiz?.openingHours && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  {mockBiz.openingHours}
                </span>
              )}
              {mockBiz?.instagram && (
                <span className="flex items-center gap-1.5">
                  <Instagram className="h-4 w-4 text-emerald-400" />
                  {mockBiz.instagram}
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-muted/30">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex-1 text-sm font-medium py-2.5 rounded-lg transition-colors',
                  activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-active"
                    className="absolute inset-0 rounded-lg bg-card shadow-sm border border-white/[0.06]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {tab.label} <span className="text-xs text-muted-foreground">({tab.count})</span>
                </span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === 'services' && (
              <motion.div
                key="services"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {services.map((service) => {
                  const svc = service as MockService;
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <motion.div
                      key={service.id}
                      variants={staggerItem}
                      onClick={() => selectService(service)}
                      className={cn(
                        'relative cursor-pointer rounded-xl p-4 transition-all duration-200',
                        'bg-card/60 backdrop-blur-sm border border-white/[0.04]',
                        'hover:shadow-lg hover:shadow-emerald-500/[0.05]',
                        isSelected && 'ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/5 border-emerald-500/20'
                      )}
                    >
                      <div className="flex gap-4">
                        {service.imageUrl && (
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                            <Image src={service.imageUrl} alt={service.name} fill className="object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-foreground">{service.name}</h3>
                            {svc.popular && (
                              <Badge variant="available" className="text-[10px] shrink-0">
                                {t('business.popular')}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{service.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {service.durationMinutes} min
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-emerald-400">
                              {formatCOP(service.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <motion.div
                          layoutId="service-check"
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center"
                        >
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {activeTab === 'professionals' && (
              <motion.div
                key="professionals"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {professionals.map((pro) => (
                  <motion.div
                    key={pro.id}
                    variants={staggerItem}
                    className="flex items-center gap-4 rounded-xl p-4 bg-card/60 backdrop-blur-sm border border-white/[0.04]"
                  >
                    {pro.avatarUrl ? (
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                        <Image src={pro.avatarUrl} alt={pro.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-14 w-14 shrink-0 rounded-full bg-muted flex items-center justify-center text-lg font-bold">
                        {pro.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{pro.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {pro.specialties.map((spec) => (
                          <span key={spec} className="text-xs text-muted-foreground bg-muted/40 rounded-full px-2 py-0.5">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    variants={staggerItem}
                    className="rounded-xl p-4 bg-card/60 backdrop-blur-sm border border-white/[0.04] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{review.authorName}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                    <p className="text-xs text-muted-foreground/60">{review.date}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sticky bottom bar */}
        <AnimatePresence>
          {selectedService && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-card/80 backdrop-blur-xl border-t border-white/[0.06]"
            >
              <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{selectedService.name}</p>
                  <p className="text-sm text-emerald-400 font-medium">{formatCOP(selectedService.price)}</p>
                </div>
                <Link href={`/book/${params.slug}/professional`}>
                  <Button variant="cta" size="lg">
                    {t('business.continue')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
}
