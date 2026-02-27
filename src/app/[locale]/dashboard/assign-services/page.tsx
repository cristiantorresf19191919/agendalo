'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Check, User, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { Button } from '@/ui/components/common/button';
import { staggerContainer, staggerItem } from '@/ui/animations/variants';
import {
  getProfessionalsByBusinessId,
  getServicesByBusinessId,
  getMockServiceAssignments,
} from '@/lib/mock-data';
import { formatCOP } from '@/lib/format';

const BUSINESS_ID = 'biz-1';

export default function AssignServicesPage() {
  const t = useTranslations('services');

  const professionals = useMemo(() => getProfessionalsByBusinessId(BUSINESS_ID), []);
  const services = useMemo(() => getServicesByBusinessId(BUSINESS_ID), []);
  const initialAssignments = useMemo(() => getMockServiceAssignments(BUSINESS_ID), []);

  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>(
    professionals[0]?.id ?? ''
  );

  const [assignments, setAssignments] = useState<Record<string, Set<string>>>(() => {
    const map: Record<string, Set<string>> = {};
    for (const a of initialAssignments) {
      map[a.professionalId] = new Set(a.serviceIds);
    }
    return map;
  });

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    const categories = new Set(services.map((s) => s.category).filter(Boolean) as string[]);
    return categories;
  });

  const groupedServices = useMemo(() => {
    const groups: Record<string, typeof services> = {};
    for (const svc of services) {
      const cat = svc.category ?? 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(svc);
    }
    return groups;
  }, [services]);

  const categoryOrder = useMemo(() => Object.keys(groupedServices), [groupedServices]);

  function toggleCategory(category: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  function toggleService(serviceId: string) {
    setAssignments((prev) => {
      const currentSet = new Set(prev[selectedProfessionalId] ?? []);
      if (currentSet.has(serviceId)) {
        currentSet.delete(serviceId);
      } else {
        currentSet.add(serviceId);
      }
      return { ...prev, [selectedProfessionalId]: currentSet };
    });
  }

  function isServiceAssigned(serviceId: string): boolean {
    return assignments[selectedProfessionalId]?.has(serviceId) ?? false;
  }

  const assignedCount = assignments[selectedProfessionalId]?.size ?? 0;

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">{t('assignToProf')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('assignDesc')}</p>
        </div>

        {/* Professional avatars row */}
        <div className="bg-card/60 backdrop-blur-sm border border-white/[0.04] rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-3">{t('selectProfessional')}</p>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex gap-4 overflow-x-auto pb-2"
          >
            {professionals.map((pro) => {
              const isSelected = pro.id === selectedProfessionalId;
              return (
                <motion.button
                  key={pro.id}
                  variants={staggerItem}
                  onClick={() => setSelectedProfessionalId(pro.id)}
                  className="flex flex-col items-center gap-2 min-w-fit focus:outline-none"
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={cn(
                      'relative h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden transition-all duration-200',
                      isSelected
                        ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-background'
                        : 'ring-1 ring-white/10 hover:ring-white/20'
                    )}
                  >
                    {pro.avatarUrl ? (
                      <Image
                        src={pro.avatarUrl}
                        alt={pro.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 64px, 80px"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium text-center max-w-[80px] truncate transition-colors',
                      isSelected ? 'text-emerald-500' : 'text-muted-foreground'
                    )}
                  >
                    {pro.name.split(' ')[0]}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* Assigned services count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{t('assignedServices')}:</span>
          <span className="font-semibold text-emerald-500">{assignedCount}</span>
          <span>/ {services.length}</span>
        </div>

        {/* Service categories accordion */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {categoryOrder.map((category) => {
            const categoryServices = groupedServices[category];
            const isExpanded = expandedCategories.has(category);
            const assignedInCategory = categoryServices.filter((s) =>
              isServiceAssigned(s.id)
            ).length;

            return (
              <motion.div
                key={category}
                variants={staggerItem}
                className="bg-card/60 backdrop-blur-sm border border-white/[0.04] rounded-xl overflow-hidden"
              >
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base font-semibold capitalize">{category}</span>
                    <span className="text-xs text-muted-foreground">
                      ({assignedInCategory}/{categoryServices.length})
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {/* Service list */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/[0.04] px-4 pb-2">
                        {categoryServices.map((svc) => {
                          const checked = isServiceAssigned(svc.id);
                          return (
                            <motion.label
                              key={svc.id}
                              className="flex items-center justify-between py-3 cursor-pointer hover:bg-white/[0.02] -mx-4 px-4 transition-colors"
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Custom checkbox */}
                                <motion.div
                                  className={cn(
                                    'w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0',
                                    checked
                                      ? 'bg-emerald-500 border-emerald-500'
                                      : 'border-border'
                                  )}
                                  animate={checked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <AnimatePresence>
                                    {checked && (
                                      <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                      >
                                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>

                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleService(svc.id)}
                                  className="sr-only"
                                />

                                <div className="min-w-0">
                                  <span
                                    className={cn(
                                      'text-sm font-medium block truncate transition-colors',
                                      checked ? 'text-foreground' : 'text-muted-foreground'
                                    )}
                                  >
                                    {svc.name}
                                  </span>
                                </div>
                              </div>

                              <span className="text-sm text-muted-foreground ml-3 flex-shrink-0">
                                {formatCOP(svc.price)}
                              </span>
                            </motion.label>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Save button */}
        <div className="pt-2 pb-4">
          <Button className="w-full" size="lg">
            <Save className="h-4 w-4" />
            {t('saveAssignments')}
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
