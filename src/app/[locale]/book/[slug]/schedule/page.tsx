'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/ui/components/booking/booking-context';
import { Button } from '@/ui/components/common/button';
import { Skeleton } from '@/ui/components/common/skeleton';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { staggerContainer, staggerItem } from '@/ui/animations/variants';
import { Link } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { formatCOP } from '@/lib/format';
import { getMockAvailableSlots, type MockAvailableSlot } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

function getNext14Days(): Array<{ date: string; dayName: string; dayNum: number; monthName: string; isToday: boolean }> {
  const days: Array<{ date: string; dayName: string; dayNum: number; monthName: string; isToday: boolean }> = [];
  const shortDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      dayName: shortDays[d.getDay()],
      dayNum: d.getDate(),
      monthName: shortMonths[d.getMonth()],
      isToday: i === 0,
    });
  }
  return days;
}

export default function BookSchedulePage() {
  const t = useTranslations();
  const params = useParams<{ slug: string }>();
  const {
    business,
    selectedService,
    selectedProfessional,
    professionals,
    selectedDate,
    selectedTime,
    selectDate,
    selectTime,
  } = useBooking();

  const days = getNext14Days();
  const [slots, setSlots] = useState<MockAvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!selectedDate) {
      selectDate(days[0].date);
    }
  }, []);

  const currentDate = selectedDate || days[0].date;

  // Load mock slots
  useEffect(() => {
    if (!business || !selectedService) return;
    setLoadingSlots(true);
    selectTime(null);

    const timer = setTimeout(() => {
      const targetProId = selectedProfessional?.id ?? professionals[0]?.id ?? '';
      const mockSlots = getMockAvailableSlots(business.id, targetProId, currentDate);
      setSlots(mockSlots);
      setLoadingSlots(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [currentDate, business, selectedService, selectedProfessional, professionals]);

  // Group slots by AM/PM
  const { morningSlots, afternoonSlots } = useMemo(() => {
    const morning: MockAvailableSlot[] = [];
    const afternoon: MockAvailableSlot[] = [];
    for (const slot of slots) {
      const hour = parseInt(slot.start.split(':')[0], 10);
      if (hour < 12) morning.push(slot);
      else afternoon.push(slot);
    }
    return { morningSlots: morning, afternoonSlots: afternoon };
  }, [slots]);

  return (
    <PageTransition>
      <main className="min-h-screen max-w-2xl mx-auto pb-28">
        <div className="px-4 sm:px-6 space-y-6 pt-2">
          {/* Service info */}
          {selectedService && (
            <div className="rounded-xl p-4 bg-card/60 backdrop-blur-sm border border-white/[0.04] flex items-center justify-between">
              <div>
                <p className="font-semibold">{selectedService.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedService.durationMinutes} min
                  {selectedProfessional && ` · ${selectedProfessional.name}`}
                </p>
              </div>
              <span className="text-sm font-semibold text-emerald-400">{formatCOP(selectedService.price)}</span>
            </div>
          )}

          <h1 className="text-2xl font-bold">{t('booking.selectDate')}</h1>

          {/* 14-day calendar strip */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
            {days.map((day) => {
              const isSelected = currentDate === day.date;
              return (
                <button
                  key={day.date}
                  onClick={() => selectDate(day.date)}
                  className={cn(
                    'relative flex flex-col items-center rounded-xl px-3 py-3 min-w-[3.5rem] transition-all duration-200 shrink-0',
                    isSelected
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-card/60 backdrop-blur-sm border border-white/[0.04] hover:border-emerald-500/20 text-foreground'
                  )}
                >
                  <span className={cn('text-[10px] font-medium', isSelected ? 'text-white/80' : 'text-muted-foreground')}>
                    {day.dayName}
                  </span>
                  <span className="text-lg font-bold leading-tight">{day.dayNum}</span>
                  <span className={cn('text-[10px]', isSelected ? 'text-white/70' : 'text-muted-foreground/60')}>
                    {day.monthName}
                  </span>
                  {day.isToday && (
                    <div className={cn(
                      'absolute -bottom-0.5 w-1 h-1 rounded-full',
                      isSelected ? 'bg-white' : 'bg-emerald-400'
                    )} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Time slots */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">{t('booking.selectTime')}</h2>

            {loadingSlots ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-11 rounded-lg" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {t('booking.noSlotsAvailable')}
              </p>
            ) : (
              <div className="space-y-6">
                {/* Morning */}
                {morningSlots.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('booking.morning')}</p>
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-3 sm:grid-cols-4 gap-2"
                    >
                      {morningSlots.map((slot) => {
                        const isSelected = selectedTime === slot.start;
                        return (
                          <motion.button
                            key={slot.start}
                            variants={staggerItem}
                            onClick={() => selectTime(isSelected ? null : slot.start)}
                            className={cn(
                              'rounded-lg py-2.5 text-sm font-medium transition-all duration-200',
                              isSelected
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
                                : 'bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 border border-white/[0.04]'
                            )}
                          >
                            {slot.start}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </div>
                )}

                {/* Afternoon */}
                {afternoonSlots.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('booking.afternoon')}</p>
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-3 sm:grid-cols-4 gap-2"
                    >
                      {afternoonSlots.map((slot) => {
                        const isSelected = selectedTime === slot.start;
                        return (
                          <motion.button
                            key={slot.start}
                            variants={staggerItem}
                            onClick={() => selectTime(isSelected ? null : slot.start)}
                            className={cn(
                              'rounded-lg py-2.5 text-sm font-medium transition-all duration-200',
                              isSelected
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
                                : 'bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 border border-white/[0.04]'
                            )}
                          >
                            {slot.start}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sticky bottom bar */}
        <AnimatePresence>
          {selectedTime && selectedService && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-card/80 backdrop-blur-xl border-t border-white/[0.06]"
            >
              <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{selectedService.name} · {selectedTime}</p>
                  <p className="text-sm text-emerald-400 font-medium">{formatCOP(selectedService.price)}</p>
                </div>
                <Link href={`/book/${params.slug}/confirm`}>
                  <Button variant="cta" size="lg">
                    {t('booking.confirmBooking')}
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
