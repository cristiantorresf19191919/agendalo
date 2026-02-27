'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/ui/components/common/button';
import { Card, CardContent } from '@/ui/components/common/card';
import { Badge } from '@/ui/components/common/badge';
import { Modal } from '@/ui/components/common/modal';
import { Input } from '@/ui/components/common/input';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { staggerContainer, staggerItem } from '@/ui/animations/variants';

export default function ProfessionalsPage() {
  const t = useTranslations('professionals');
  const tCommon = useTranslations('common');
  const [showCreate, setShowCreate] = useState(false);

  const professionals = [
    { id: '1', name: 'Carlos Mendez', email: 'carlos@mail.com', active: true, specialties: ['Corte', 'Barba'] },
    { id: '2', name: 'Ana Torres', email: 'ana@mail.com', active: true, specialties: ['Color', 'Tratamientos'] },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            {t('addProfessional')}
          </Button>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2"
        >
          {professionals.map((prof) => (
            <motion.div key={prof.id} variants={staggerItem}>
              <Card interactive className="space-y-3">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{prof.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Mail className="h-3 w-3" />
                        {prof.email}
                      </p>
                    </div>
                    <Badge variant={prof.active ? 'available' : 'blocked'}>
                      {prof.active ? t('active') : t('inactive')}
                    </Badge>
                  </div>
                  <div className="flex gap-1.5 mt-3">
                    {prof.specialties.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <Modal open={showCreate} onOpenChange={setShowCreate} title={t('addProfessional')}>
          <form className="space-y-4">
            <Input label={t('name')} />
            <Input label={t('email')} type="email" />
            <Input label={t('specialties')} placeholder="Corte, Barba, Color..." />
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowCreate(false)} type="button">
                {tCommon('cancel')}
              </Button>
              <Button type="submit">{tCommon('create')}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageTransition>
  );
}
