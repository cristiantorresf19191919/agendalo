'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/components/common/button';
import { Input } from '@/ui/components/common/input';
import {
  fadeIn,
  scaleIn,
  slideUp,
  staggerContainer,
  staggerItem,
} from '@/ui/animations/variants';
import {
  getServicesByBusinessId,
  getProfessionalsByBusinessId,
  getMockAvailableSlots,
  type MockService,
} from '@/lib/mock-data';
import { formatCOP } from '@/lib/format';
import {
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  Check,
  ArrowLeft,
  Calendar,
  User,
} from 'lucide-react';

/* ─── Helpers ─── */

function getNext14Days() {
  const days: Array<{
    date: string;
    dayName: string;
    dayNum: number;
    monthShort: string;
    isToday: boolean;
  }> = [];
  const shortDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const shortMonths = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      dayName: shortDays[d.getDay()],
      dayNum: d.getDate(),
      monthShort: shortMonths[d.getMonth()],
      isToday: i === 0,
    });
  }
  return days;
}

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  exit: { opacity: 0, x: -60, transition: { duration: 0.2 } },
};

/* ─── Types ─── */

interface QuickBookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId?: string;
}

/* ─── Component ─── */

export function QuickBookModal({
  open,
  onOpenChange,
  businessId = 'biz-1',
}: QuickBookModalProps) {
  const t = useTranslations('dashboard');
  const tBooking = useTranslations('booking');

  /* state */
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<MockService | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  /* data */
  const services = useMemo(() => getServicesByBusinessId(businessId), [businessId]);
  const professionals = useMemo(
    () => getProfessionalsByBusinessId(businessId),
    [businessId]
  );
  const next14Days = useMemo(() => getNext14Days(), []);

  const availableSlots = useMemo(() => {
    if (!selectedProfessional || !selectedDate) return [];
    return getMockAvailableSlots(businessId, selectedProfessional, selectedDate);
  }, [businessId, selectedProfessional, selectedDate]);

  const servicesByCategory = useMemo(() => {
    const map = new Map<string, MockService[]>();
    for (const svc of services) {
      const cat = svc.category ?? 'otros';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(svc);
    }
    return map;
  }, [services]);

  /* derived */
  const morningSlots = availableSlots.filter((s) => {
    const hour = parseInt(s.start.split(':')[0], 10);
    return hour < 12;
  });
  const afternoonSlots = availableSlots.filter((s) => {
    const hour = parseInt(s.start.split(':')[0], 10);
    return hour >= 12;
  });

  const selectedProfessionalData = professionals.find(
    (p) => p.id === selectedProfessional
  );

  /* actions */
  function toggleCategory(cat: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function handleSelectService(svc: MockService) {
    setSelectedService(svc);
    setStep(2);
  }

  function handleSelectProfessional(proId: string) {
    setSelectedProfessional(proId);
    setStep(3);
  }

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep(4);
  }

  function handleConfirm() {
    setConfirmed(true);
  }

  function handleBack() {
    if (step === 2) {
      setSelectedService(null);
      setStep(1);
    } else if (step === 3) {
      setSelectedProfessional(null);
      setStep(2);
    } else if (step === 4) {
      setSelectedDate(null);
      setSelectedTime(null);
      setStep(3);
    }
  }

  function handleClose() {
    onOpenChange(false);
    // reset state after animation
    setTimeout(() => {
      setStep(1);
      setSelectedService(null);
      setSelectedProfessional(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setCustomerName('');
      setConfirmed(false);
      setExpandedCategories(new Set());
    }, 300);
  }

  /* step labels */
  const stepLabels = ['Servicio', 'Profesional', 'Día', 'Hora'];

  /* ─── Render ─── */

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay asChild>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
        </DialogPrimitive.Overlay>

        <DialogPrimitive.Content asChild>
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'fixed inset-0 z-50 m-auto flex h-fit max-h-[90vh] w-full max-w-lg flex-col',
              'rounded-2xl border border-border bg-card/95 backdrop-blur-2xl shadow-2xl',
              'overflow-hidden'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
                {confirmed ? 'Reserva confirmada' : 'Nueva reserva'}
              </DialogPrimitive.Title>
              <DialogPrimitive.Close asChild>
                <button
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </DialogPrimitive.Close>
            </div>

            {/* Step indicator */}
            {!confirmed && (
              <div className="flex items-center justify-center gap-0 px-6 py-4">
                {stepLabels.map((label, i) => {
                  const stepNum = i + 1;
                  const isActive = step === stepNum;
                  const isCompleted = step > stepNum;

                  return (
                    <div key={label} className="flex items-center">
                      {/* connector line (before circles 2, 3, 4) */}
                      {i > 0 && (
                        <div
                          className={cn(
                            'h-0.5 w-8 transition-colors duration-300',
                            isCompleted || isActive
                              ? 'bg-emerald-500'
                              : 'bg-border'
                          )}
                        />
                      )}
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300',
                            isActive &&
                              'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
                            isCompleted &&
                              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
                            !isActive &&
                              !isCompleted &&
                              'bg-muted text-muted-foreground border border-border'
                          )}
                        >
                          {isCompleted ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            stepNum
                          )}
                        </div>
                        <span
                          className={cn(
                            'text-[10px] font-medium transition-colors',
                            isActive
                              ? 'text-emerald-400'
                              : 'text-muted-foreground'
                          )}
                        >
                          {label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <AnimatePresence mode="wait">
                {confirmed ? (
                  /* ─── Success State ─── */
                  <motion.div
                    key="success"
                    variants={slideUp}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col items-center gap-4 py-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 12,
                        delay: 0.1,
                      }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20"
                    >
                      <Check className="h-8 w-8 text-emerald-500" />
                    </motion.div>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-foreground">
                        Reserva creada
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedService?.name} con{' '}
                        {selectedProfessionalData?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedDate} a las {selectedTime}
                      </p>
                      {customerName && (
                        <p className="text-sm text-muted-foreground">
                          Cliente: {customerName}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={handleClose}
                    >
                      Cerrar
                    </Button>
                  </motion.div>
                ) : step === 1 ? (
                  /* ─── Step 1: Service Selection ─── */
                  <motion.div
                    key="step-1"
                    variants={slideInRight}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-2"
                  >
                    {Array.from(servicesByCategory.entries()).map(
                      ([category, catServices]) => {
                        const isOpen = expandedCategories.has(category);
                        return (
                          <div
                            key={category}
                            className="rounded-xl border border-border overflow-hidden"
                          >
                            {/* Category header */}
                            <button
                              onClick={() => toggleCategory(category)}
                              className={cn(
                                'flex w-full items-center justify-between px-4 py-3',
                                'text-sm font-semibold capitalize text-foreground',
                                'hover:bg-muted/50 transition-colors'
                              )}
                            >
                              <span>{category}</span>
                              {isOpen ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>

                            {/* Services list */}
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                    className="divide-y divide-border"
                                  >
                                    {catServices.map((svc) => (
                                      <motion.div
                                        key={svc.id}
                                        variants={staggerItem}
                                        className="flex items-center justify-between gap-3 px-4 py-3"
                                      >
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-foreground truncate">
                                            {svc.name}
                                          </p>
                                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                              <Clock className="h-3 w-3" />
                                              {svc.durationMinutes} min
                                            </span>
                                            <span className="text-emerald-400 font-medium">
                                              {formatCOP(svc.price)}
                                            </span>
                                          </div>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="available"
                                          onClick={() =>
                                            handleSelectService(svc)
                                          }
                                        >
                                          Agendar
                                        </Button>
                                      </motion.div>
                                    ))}
                                  </motion.div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }
                    )}
                  </motion.div>
                ) : step === 2 ? (
                  /* ─── Step 2: Professional Selection ─── */
                  <motion.div
                    key="step-2"
                    variants={slideInRight}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    {/* Back button */}
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Volver</span>
                    </button>

                    {/* Selected service summary */}
                    {selectedService && (
                      <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5">
                        <p className="text-sm font-medium text-emerald-400">
                          {selectedService.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedService.durationMinutes} min &middot;{' '}
                          {formatCOP(selectedService.price)}
                        </p>
                      </div>
                    )}

                    {/* Professional avatars */}
                    <p className="text-sm font-medium text-foreground">
                      Elige un profesional
                    </p>
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="flex gap-4 overflow-x-auto pb-2"
                    >
                      {professionals.map((pro) => (
                        <motion.button
                          key={pro.id}
                          variants={staggerItem}
                          onClick={() => handleSelectProfessional(pro.id)}
                          className={cn(
                            'flex flex-col items-center gap-2 min-w-[80px] rounded-xl p-3 transition-all',
                            'hover:bg-muted/50',
                            selectedProfessional === pro.id &&
                              'bg-emerald-500/10'
                          )}
                        >
                          <div
                            className={cn(
                              'relative h-14 w-14 overflow-hidden rounded-full border-2 transition-all',
                              selectedProfessional === pro.id
                                ? 'ring-2 ring-emerald-500 border-emerald-500'
                                : 'border-border'
                            )}
                          >
                            {pro.avatarUrl ? (
                              <Image
                                src={pro.avatarUrl}
                                alt={pro.name}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <User className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-medium text-foreground text-center leading-tight">
                            {pro.name.split(' ')[0]}
                          </span>
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>
                ) : step === 3 ? (
                  /* ─── Step 3: Date Selection ─── */
                  <motion.div
                    key="step-3"
                    variants={slideInRight}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    {/* Back button */}
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Volver</span>
                    </button>

                    {/* Summary */}
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5">
                      <p className="text-sm font-medium text-emerald-400">
                        {selectedService?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        con {selectedProfessionalData?.name}
                      </p>
                    </div>

                    {/* Date strip */}
                    <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-emerald-500" />
                      Selecciona el día
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                      {next14Days.map((day) => (
                        <button
                          key={day.date}
                          onClick={() => handleSelectDate(day.date)}
                          className={cn(
                            'flex flex-col items-center gap-0.5 rounded-xl border px-3 py-2.5 min-w-[60px] transition-all',
                            selectedDate === day.date
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                              : 'border-border hover:border-emerald-500/40 hover:bg-muted/50',
                            day.isToday &&
                              selectedDate !== day.date &&
                              'border-emerald-500/30'
                          )}
                        >
                          <span
                            className={cn(
                              'text-[10px] font-medium uppercase',
                              selectedDate === day.date
                                ? 'text-white/80'
                                : 'text-muted-foreground'
                            )}
                          >
                            {day.dayName}
                          </span>
                          <span
                            className={cn(
                              'text-lg font-bold',
                              selectedDate === day.date
                                ? 'text-white'
                                : 'text-foreground'
                            )}
                          >
                            {day.dayNum}
                          </span>
                          <span
                            className={cn(
                              'text-[10px]',
                              selectedDate === day.date
                                ? 'text-white/70'
                                : 'text-muted-foreground'
                            )}
                          >
                            {day.monthShort}
                          </span>
                          {day.isToday && (
                            <span
                              className={cn(
                                'text-[9px] font-semibold',
                                selectedDate === day.date
                                  ? 'text-white'
                                  : 'text-emerald-400'
                              )}
                            >
                              Hoy
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  /* ─── Step 4: Time Selection + Customer ─── */
                  <motion.div
                    key="step-4"
                    variants={slideInRight}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    {/* Back button */}
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Volver</span>
                    </button>

                    {/* Summary */}
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5">
                      <p className="text-sm font-medium text-emerald-400">
                        {selectedService?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        con {selectedProfessionalData?.name} &middot;{' '}
                        {selectedDate}
                      </p>
                    </div>

                    {/* Time slots - Morning */}
                    {morningSlots.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Mañana
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {morningSlots.map((slot) => (
                            <button
                              key={slot.start}
                              onClick={() => setSelectedTime(slot.start)}
                              className={cn(
                                'rounded-lg border px-2 py-2 text-sm font-medium transition-all',
                                selectedTime === slot.start
                                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                  : 'border-border text-foreground hover:border-emerald-500/40 hover:bg-muted/50'
                              )}
                            >
                              {slot.start}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Time slots - Afternoon */}
                    {afternoonSlots.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Tarde
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {afternoonSlots.map((slot) => (
                            <button
                              key={slot.start}
                              onClick={() => setSelectedTime(slot.start)}
                              className={cn(
                                'rounded-lg border px-2 py-2 text-sm font-medium transition-all',
                                selectedTime === slot.start
                                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                  : 'border-border text-foreground hover:border-emerald-500/40 hover:bg-muted/50'
                              )}
                            >
                              {slot.start}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {availableSlots.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No hay horarios disponibles para este día.
                      </p>
                    )}

                    {/* Customer name */}
                    <div className="pt-2">
                      <Input
                        label="Nombre del cliente"
                        placeholder="Ej. María López"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>

                    {/* Confirm button */}
                    <Button
                      variant="cta"
                      size="lg"
                      className="w-full"
                      disabled={!selectedTime || !customerName.trim()}
                      onClick={handleConfirm}
                    >
                      <Check className="h-4 w-4" />
                      Confirmar reserva
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
