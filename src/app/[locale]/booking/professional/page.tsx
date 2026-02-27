'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles, User } from 'lucide-react';
import { Card, CardContent } from '@/ui/components/common/card';
import { Button } from '@/ui/components/common/button';
import { Badge } from '@/ui/components/common/badge';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { staggerContainer, staggerItem, tapScale } from '@/ui/animations/variants';
import { Link } from '@/i18n/navigation';

export default function BookingProfessionalPage() {
  const t = useTranslations('booking');
  const [selected, setSelected] = useState<string | null>(null);

  const professionals = [
    { id: 'best', name: t('bestProfessional'), description: t('bestProfessionalDesc'), isBest: true },
    { id: '1', name: 'Carlos Mendez', description: 'Corte, Barba', isBest: false },
    { id: '2', name: 'Ana Torres', description: 'Color, Tratamientos', isBest: false },
  ];

  return (
    <PageTransition>
      <main className="min-h-screen p-6 max-w-lg mx-auto">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">{t('selectProfessional')}</h1>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {professionals.map((prof) => (
              <motion.div key={prof.id} variants={staggerItem}>
                <Card
                  interactive
                  className={
                    selected === prof.id
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
                      : ''
                  }
                  onClick={() => setSelected(prof.id)}
                  whileTap={tapScale}
                >
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      {prof.isBest ? (
                        <Sparkles className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{prof.name}</h3>
                      <p className="text-sm text-muted-foreground">{prof.description}</p>
                    </div>
                    {prof.isBest && <Badge variant="available" className="ml-auto">Auto</Badge>}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {selected && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/booking/schedule">
                <Button variant="cta" className="w-full" size="lg">
                  {t('selectDate')}
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
