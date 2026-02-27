'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, User, Scissors, Check } from 'lucide-react';
import { Card, CardContent } from '@/ui/components/common/card';
import { SlideToConfirm } from '@/ui/components/booking/slide-to-confirm';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { scaleIn } from '@/ui/animations/variants';

export default function BookingConfirmPage() {
  const t = useTranslations('booking');
  const [confirmed, setConfirmed] = useState(false);

  // Placeholder summary — will come from booking state
  const summary = {
    service: 'Corte clásico',
    professional: 'Carlos Mendez',
    date: '2025-01-15',
    time: '10:00',
    duration: 30,
    price: 25,
  };

  return (
    <PageTransition>
      <main className="min-h-screen p-6 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {!confirmed ? (
            <motion.div key="confirm" className="space-y-6">
              <h1 className="text-2xl font-bold">{t('confirmBooking')}</h1>

              <Card glass glow>
                <CardContent className="space-y-4 py-6">
                  <div className="flex items-center gap-3">
                    <Scissors className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('selectService')}</p>
                      <p className="font-semibold">{summary.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('selectProfessional')}</p>
                      <p className="font-semibold">{summary.professional}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('selectDate')}</p>
                      <p className="font-semibold">{summary.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('selectTime')}</p>
                      <p className="font-semibold">{summary.time} — {summary.duration} min</p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total</span>
                      <span className="text-xl font-bold text-emerald-500">${summary.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <SlideToConfirm
                label={t('confirmBooking')}
                onConfirm={() => setConfirmed(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="success"
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
              >
                <Check className="h-10 w-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold">{t('bookingConfirmed')}</h2>
              <p className="text-muted-foreground">{t('bookingConfirmedDesc')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
}
