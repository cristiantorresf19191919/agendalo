'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles, User } from 'lucide-react';
import { useBooking } from '@/ui/components/booking/booking-context';
import { Card, CardContent } from '@/ui/components/common/card';
import { Button } from '@/ui/components/common/button';
import { Badge } from '@/ui/components/common/badge';
import { Spinner } from '@/ui/components/common/spinner';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { staggerContainer, staggerItem, tapScale } from '@/ui/animations/variants';
import { Link } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import type { Professional } from '@/domain/entities/professional';

export default function BookProfessionalPage() {
  const t = useTranslations('booking');
  const params = useParams<{ slug: string }>();
  const { professionals, selectedProfessional, selectProfessional, selectedService, loading } = useBooking();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const isSelected = (id: string) =>
    id === 'best'
      ? selectedProfessional === null
      : selectedProfessional?.id === id;

  const handleSelect = (prof: Professional | null) => {
    selectProfessional(prof);
  };

  // "best" is initially selected (null = best available)
  const hasMadeSelection = selectedProfessional !== undefined;

  return (
    <PageTransition>
      <main className="min-h-screen p-6 max-w-lg mx-auto">
        <div className="space-y-6">
          {selectedService && (
            <p className="text-sm text-muted-foreground">
              {selectedService.name} — {selectedService.durationMinutes} min — ${selectedService.price}
            </p>
          )}

          <h1 className="text-2xl font-bold">{t('selectProfessional')}</h1>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {/* Best available option */}
            <motion.div variants={staggerItem}>
              <Card
                interactive
                className={
                  isSelected('best')
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
                    : ''
                }
                onClick={() => handleSelect(null)}
                whileTap={tapScale}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{t('bestProfessional')}</h3>
                    <p className="text-sm text-muted-foreground">{t('bestProfessionalDesc')}</p>
                  </div>
                  <Badge variant="available">Auto</Badge>
                </CardContent>
              </Card>
            </motion.div>

            {/* Individual professionals */}
            {professionals.map((prof) => (
              <motion.div key={prof.id} variants={staggerItem}>
                <Card
                  interactive
                  className={
                    isSelected(prof.id)
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
                      : ''
                  }
                  onClick={() => handleSelect(prof)}
                  whileTap={tapScale}
                >
                  <CardContent className="flex items-center gap-4 py-4">
                    {prof.avatarUrl ? (
                      <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={prof.avatarUrl}
                          alt={prof.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{prof.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {prof.specialties.join(', ')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Link href={`/book/${params.slug}/schedule`}>
              <Button variant="cta" className="w-full" size="lg">
                {t('selectDate')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
}
