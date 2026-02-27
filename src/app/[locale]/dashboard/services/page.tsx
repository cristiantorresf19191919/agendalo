'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/ui/components/common/button';
import { Card, CardContent } from '@/ui/components/common/card';
import { Badge } from '@/ui/components/common/badge';
import { Modal } from '@/ui/components/common/modal';
import { Input } from '@/ui/components/common/input';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { staggerContainer, staggerItem } from '@/ui/animations/variants';

export default function ServicesPage() {
  const t = useTranslations('services');
  const tCommon = useTranslations('common');
  const [showCreate, setShowCreate] = useState(false);

  // Placeholder services — will be wired to Firebase
  const services = [
    { id: '1', name: 'Corte clásico', duration: 30, price: 25, active: true },
    { id: '2', name: 'Barba completa', duration: 20, price: 15, active: true },
    { id: '3', name: 'Corte + Barba', duration: 45, price: 35, active: false },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            {t('addService')}
          </Button>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4"
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={staggerItem}>
              <Card className="flex items-center justify-between">
                <CardContent className="flex items-center gap-4 py-4">
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {service.duration} min · ${service.price}
                    </p>
                  </div>
                </CardContent>
                <div className="pr-6">
                  <Badge variant={service.active ? 'available' : 'blocked'}>
                    {service.active ? t('active') : t('inactive')}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <Modal
          open={showCreate}
          onOpenChange={setShowCreate}
          title={t('addService')}
        >
          <form className="space-y-4">
            <Input label={t('serviceName')} placeholder="Corte clásico" />
            <Input label={t('description')} placeholder="Descripción del servicio" />
            <div className="grid grid-cols-2 gap-4">
              <Input label={t('duration')} type="number" placeholder="30" />
              <Input label={t('price')} type="number" placeholder="25" />
            </div>
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
