'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, User, Scissors, Check, LogIn } from 'lucide-react';
import { z } from 'zod';
import { useBooking } from '@/ui/components/booking/booking-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/common/card';
import { Button } from '@/ui/components/common/button';
import { Input } from '@/ui/components/common/input';
import { Spinner } from '@/ui/components/common/spinner';
import { SlideToConfirm } from '@/ui/components/booking/slide-to-confirm';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { scaleIn } from '@/ui/animations/variants';
import { Link } from '@/i18n/navigation';
import type { AuthUser } from '@/ports/auth-port';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function BookConfirmPage() {
  const t = useTranslations();
  const {
    business,
    selectedService,
    selectedProfessional,
    selectedDate,
    selectedTime,
  } = useBooking();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Auth form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authErrors, setAuthErrors] = useState<Record<string, string>>({});
  const [authLoading, setAuthLoading] = useState(false);

  // Check current auth state
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function checkAuth() {
      const { getAuthAdapter } = await import('@/infra/providers/repositories');
      const auth = getAuthAdapter();
      unsubscribe = auth.onAuthStateChanged((u) => {
        setUser(u);
        setAuthChecked(true);
      });
    }

    checkAuth();
    return () => unsubscribe?.();
  }, []);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field === 'email') fieldErrors.email = t('validation.emailInvalid');
        if (field === 'password') fieldErrors.password = t('validation.passwordMin');
      });
      setAuthErrors(fieldErrors);
      return;
    }

    setAuthLoading(true);
    try {
      const { getAuthAdapter } = await import('@/infra/providers/repositories');
      const authed = await getAuthAdapter().signInWithEmail(email, password);
      setUser(authed);
    } catch {
      setAuthErrors({ email: t('common.error') });
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setAuthLoading(true);
    try {
      const { getAuthAdapter } = await import('@/infra/providers/repositories');
      const authed = await getAuthAdapter().signInWithGoogle();
      setUser(authed);
    } catch {
      setAuthErrors({ email: t('common.error') });
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleConfirm() {
    if (!user || !business || !selectedService || !selectedDate || !selectedTime) return;

    setConfirming(true);
    try {
      const {
        getBookingRepository,
        getProfessionalRepository,
        getServiceRepository,
        getBlockedRangeRepository,
      } = await import('@/infra/providers/repositories');
      const { BookAppointment } = await import('@/application/use-cases/book-appointment');

      const profRepo = getProfessionalRepository();

      // Resolve professional (pick first available if "best available")
      let professionalId = selectedProfessional?.id;
      if (!professionalId) {
        const pros = await profRepo.getByBusinessId(business.id);
        const active = pros.filter((p) => p.isActive);
        if (active.length > 0) professionalId = active[0].id;
      }

      if (!professionalId) return;

      const useCase = new BookAppointment(
        getBookingRepository(),
        profRepo,
        getServiceRepository(),
        getBlockedRangeRepository(),
      );

      await useCase.execute({
        businessId: business.id,
        professionalId,
        customerId: user.uid,
        serviceId: selectedService.id,
        date: selectedDate,
        startTime: selectedTime,
      });

      setConfirmed(true);
    } catch {
      // Could show error, for now just stop confirming
    } finally {
      setConfirming(false);
    }
  }

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const summary = {
    service: selectedService?.name ?? '—',
    professional: selectedProfessional?.name ?? t('booking.bestProfessional'),
    date: selectedDate ?? '—',
    time: selectedTime ?? '—',
    duration: selectedService?.durationMinutes ?? 0,
    price: selectedService?.price ?? 0,
    currency: selectedService?.currency === 'USD' ? '$' : (selectedService?.currency ?? '$'),
  };

  return (
    <PageTransition>
      <main className="min-h-screen p-6 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {confirmed ? (
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
              <h2 className="text-2xl font-bold">{t('booking.bookingConfirmed')}</h2>
              <p className="text-muted-foreground">{t('booking.bookingConfirmedDesc')}</p>
              <Link href="/">
                <Button variant="outline" className="mt-4">{t('booking.backToHome')}</Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div key="confirm" className="space-y-6">
              <h1 className="text-2xl font-bold">{t('booking.confirmBooking')}</h1>

              {/* Booking summary */}
              <Card glass glow>
                <CardContent className="space-y-4 py-6">
                  <div className="flex items-center gap-3">
                    <Scissors className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('booking.selectService')}</p>
                      <p className="font-semibold">{summary.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('booking.selectProfessional')}</p>
                      <p className="font-semibold">{summary.professional}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('booking.selectDate')}</p>
                      <p className="font-semibold">{summary.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('booking.selectTime')}</p>
                      <p className="font-semibold">{summary.time} — {summary.duration} min</p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total</span>
                      <span className="text-xl font-bold text-emerald-500">
                        {summary.currency}{summary.price}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Auth gate: show login form if not authenticated */}
              {!user ? (
                <Card glass>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <LogIn className="h-5 w-5 text-emerald-500" />
                      {t('booking.loginToBook')}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t('booking.loginToBookDesc')}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <Input
                        label={t('auth.email')}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={authErrors.email}
                        placeholder="tu@email.com"
                      />
                      <Input
                        label={t('auth.password')}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={authErrors.password}
                      />
                      <Button type="submit" className="w-full" disabled={authLoading}>
                        {authLoading ? <Spinner size="sm" /> : t('auth.login')}
                      </Button>
                    </form>
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">o</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleLogin}
                      disabled={authLoading}
                    >
                      {t('auth.loginWithGoogle')}
                    </Button>
                    <p className="mt-3 text-center text-sm text-muted-foreground">
                      {t('auth.noAccount')}{' '}
                      <Link href="/auth/register" className="text-emerald-500 hover:underline">
                        {t('auth.register')}
                      </Link>
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground text-center">
                    {t('booking.loggedInAs', { name: user.displayName || user.email })}
                  </p>
                  {confirming ? (
                    <div className="flex justify-center py-4">
                      <Spinner size="lg" />
                    </div>
                  ) : (
                    <SlideToConfirm
                      label={t('booking.confirmBooking')}
                      onConfirm={handleConfirm}
                    />
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
}
