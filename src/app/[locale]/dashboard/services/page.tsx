'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Plus, Clock, DollarSign, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/ui/components/common/button';
import { Card, CardContent } from '@/ui/components/common/card';
import { Badge } from '@/ui/components/common/badge';
import { Modal } from '@/ui/components/common/modal';
import { Input } from '@/ui/components/common/input';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { staggerContainer, staggerItem } from '@/ui/animations/variants';
import { getServicesByBusinessId, type MockService } from '@/lib/mock-data';
import { formatCOP } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function ServicesPage() {
  const t = useTranslations('services');
  const tCommon = useTranslations('common');
  const [showCreate, setShowCreate] = useState(false);

  const allServices = getServicesByBusinessId('biz-1') as MockService[];

  // Group by category
  const grouped = allServices.reduce<Record<string, MockService[]>>((acc, svc) => {
    const cat = svc.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(svc);
    return acc;
  }, {});

  const categories = Object.keys(grouped);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(categories));

  const toggleCategory = (cat: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const categoryLabels: Record<string, string> = {
    corte: 'Cortes',
    combo: 'Combos',
    barba: 'Barba',
    masaje: 'Masajes',
    facial: 'Faciales',
    color: 'Coloración',
    peinado: 'Peinados',
    tratamiento: 'Tratamientos',
    manicure: 'Manicure',
    pedicure: 'Pedicure',
    'nail-art': 'Nail Art',
    bienestar: 'Bienestar',
    inyectable: 'Inyectables',
    other: 'Otros',
  };

  return (
    <PageTransition>
      <div className="space-y-6 pt-14 lg:pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {allServices.length} servicios en {categories.length} categorías
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('addService')}
          </Button>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {categories.map((cat) => {
            const services = grouped[cat];
            const isExpanded = expandedCats.has(cat);

            return (
              <motion.div
                key={cat}
                variants={staggerItem}
                className="rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm border border-white/[0.04]"
              >
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(cat)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span className="font-semibold text-lg">
                      {categoryLabels[cat] || cat}
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted/30 rounded-full px-2 py-0.5">
                      {services.length}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                {/* Services list */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 space-y-2">
                        {services.map((service) => (
                          <motion.div
                            key={service.id}
                            whileHover={{ x: 4 }}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 transition-colors group"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {service.imageUrl ? (
                                <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0">
                                  <Image src={service.imageUrl} alt={service.name} fill className="object-cover" />
                                </div>
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-emerald-500/5 flex items-center justify-center shrink-0">
                                  <DollarSign className="h-5 w-5 text-emerald-400/60" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-sm truncate">{service.name}</h3>
                                  {service.popular && (
                                    <Badge variant="available" className="text-[10px] shrink-0">Popular</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {service.durationMinutes} min
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-emerald-400">
                                {formatCOP(service.price)}
                              </span>
                              <Badge variant="available" className="text-[10px]">
                                {t('active')}
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
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
              <Input label={t('price')} type="number" placeholder="25000" />
            </div>
            <Input label={t('category')} placeholder="corte, combo, barba..." />
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
