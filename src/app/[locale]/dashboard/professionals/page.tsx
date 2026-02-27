'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Plus, Mail, Clock, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/ui/components/common/button';
import { Card, CardContent } from '@/ui/components/common/card';
import { Badge } from '@/ui/components/common/badge';
import { Modal } from '@/ui/components/common/modal';
import { Input } from '@/ui/components/common/input';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { staggerContainer, staggerItem } from '@/ui/animations/variants';
import { getProfessionalsByBusinessId, getServicesByBusinessId, getMockServiceAssignments } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function ProfessionalsPage() {
  const t = useTranslations('professionals');
  const tCommon = useTranslations('common');
  const [showCreate, setShowCreate] = useState(false);

  const professionals = getProfessionalsByBusinessId('biz-1');
  const services = getServicesByBusinessId('biz-1');
  const assignments = getMockServiceAssignments('biz-1');

  return (
    <PageTransition>
      <div className="space-y-6 pt-14 lg:pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {professionals.length} profesionales activos
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
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
          {professionals.map((prof) => {
            const assignment = assignments.find((a) => a.professionalId === prof.id);
            const assignedCount = assignment?.serviceIds.length ?? 0;

            return (
              <motion.div key={prof.id} variants={staggerItem}>
                <motion.div
                  whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                  className="rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm border border-white/[0.04] hover:shadow-lg hover:shadow-emerald-500/[0.05] transition-shadow"
                >
                  {/* Header with avatar */}
                  <div className="relative p-5 pb-3">
                    <div className="flex items-start gap-4">
                      {prof.avatarUrl ? (
                        <div className="relative h-16 w-16 rounded-full overflow-hidden ring-2 ring-emerald-500/20 shrink-0">
                          <Image src={prof.avatarUrl} alt={prof.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-xl font-bold shrink-0">
                          {prof.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{prof.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3" />
                              {prof.email}
                            </p>
                          </div>
                          <Badge variant="available" className="shrink-0">
                            {t('active')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="px-5 pb-4 space-y-3">
                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1.5">
                      {prof.specialties.map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-emerald-500/10 text-emerald-400 rounded-full px-2.5 py-1 border border-emerald-500/20"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 pt-2 border-t border-white/[0.04] text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-emerald-400" />
                        {assignedCount} servicios
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-emerald-400" />
                        Lun-Sáb
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
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
