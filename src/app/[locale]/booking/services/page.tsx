'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ServiceCard } from '@/ui/components/booking/service-card';
import { Button } from '@/ui/components/common/button';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { staggerContainer } from '@/ui/animations/variants';
import { Link } from '@/i18n/navigation';

export default function BookingServicesPage() {
  const t = useTranslations('booking');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Placeholder — will be fetched from Firebase
  const services = [
    { id: '1', name: 'Corte clásico', description: 'Corte de cabello profesional', duration: 30, price: 25, currency: '$' },
    { id: '2', name: 'Barba completa', description: 'Afeitado y perfilado de barba', duration: 20, price: 15, currency: '$' },
    { id: '3', name: 'Corte + Barba', description: 'Paquete completo de corte y barba', duration: 45, price: 35, currency: '$' },
  ];

  return (
    <PageTransition>
      <main className="min-h-screen p-6 max-w-lg mx-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{t('selectService')}</h1>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                name={service.name}
                description={service.description}
                durationMinutes={service.duration}
                price={service.price}
                currency={service.currency}
                selected={selectedService === service.id}
                onSelect={() => setSelectedService(service.id)}
              />
            ))}
          </motion.div>

          {selectedService && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/booking/professional">
                <Button variant="cta" className="w-full" size="lg">
                  {t('selectProfessional')}
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
