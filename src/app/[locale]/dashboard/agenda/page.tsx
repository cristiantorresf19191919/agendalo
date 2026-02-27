'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';
import {
  getProfessionalsByBusinessId,
  getMockAppointments,
  type MockAppointment,
} from '@/lib/mock-data';
import { ChevronLeft, ChevronRight, Calendar, Plus, Clock } from 'lucide-react';
import { Button } from '@/ui/components/common/button';

/* ─── Constants ─── */

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8..20
const HOUR_HEIGHT = 80; // px per hour row
const BUSINESS_ID = 'biz-1';

/* ─── Helpers ─── */

function getNext14Days() {
  const days: Array<{
    date: string;
    dayName: string;
    dayNum: number;
    monthShort: string;
    isToday: boolean;
  }> = [];
  const shortDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
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

function formatHour(h: number): string {
  if (h === 0 || h === 12) return `12:00 ${h === 0 ? 'AM' : 'PM'}`;
  if (h < 12) return `${h}:00 AM`;
  return `${h - 12}:00 PM`;
}

function parseHour(time: string): number {
  return parseInt(time.split(':')[0], 10);
}

function parseMinute(time: string): number {
  return parseInt(time.split(':')[1], 10);
}

function timeToOffset(time: string): number {
  const h = parseHour(time);
  const m = parseMinute(time);
  return (h - 8) * HOUR_HEIGHT + (m / 60) * HOUR_HEIGHT;
}

function timeDurationPx(start: string, end: string): number {
  const startMin = parseHour(start) * 60 + parseMinute(start);
  const endMin = parseHour(end) * 60 + parseMinute(end);
  return ((endMin - startMin) / 60) * HOUR_HEIGHT;
}

const statusStyles: Record<
  string,
  { bg: string; border: string; text: string; dot: string }
> = {
  confirmed: {
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
  },
  completed: {
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/40',
    text: 'text-blue-300',
    dot: 'bg-blue-400',
  },
  blocked: {
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    text: 'text-amber-300',
    dot: 'bg-amber-400',
  },
  cancelled: {
    bg: 'bg-red-500/15',
    border: 'border-red-500/40',
    text: 'text-red-300',
    dot: 'bg-red-400',
  },
};

/* ─── Appointment Block Component ─── */

function AppointmentBlock({
  appointment,
  index,
}: {
  appointment: MockAppointment;
  index: number;
}) {
  const style = statusStyles[appointment.status] ?? statusStyles.confirmed;
  const top = timeToOffset(appointment.startTime);
  const height = Math.max(timeDurationPx(appointment.startTime, appointment.endTime), 36);

  return (
    <motion.div
      variants={cardEntrance}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 }}
      className={cn(
        'absolute left-1 right-1 rounded-lg border px-2.5 py-1.5 overflow-hidden cursor-pointer',
        'transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:z-20',
        style.bg,
        style.border
      )}
      style={{ top, height }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-1.5 h-full">
        <div
          className={cn('w-1 rounded-full shrink-0 mt-0.5', style.dot)}
          style={{ height: Math.min(height - 12, 32) }}
        />
        <div className="min-w-0 flex-1">
          <p className={cn('text-xs font-semibold truncate', style.text)}>
            {appointment.customerName}
          </p>
          {height > 48 && (
            <p className="text-[10px] text-white/50 truncate mt-0.5">
              {appointment.serviceName}
            </p>
          )}
          {height > 64 && (
            <p className="text-[10px] text-white/40 mt-0.5">
              {appointment.startTime} - {appointment.endTime}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Mobile Appointment Card ─── */

function MobileAppointmentCard({
  appointment,
}: {
  appointment: MockAppointment;
  index: number;
}) {
  const style = statusStyles[appointment.status] ?? statusStyles.confirmed;

  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        'rounded-xl border p-4',
        'bg-card/60 backdrop-blur-sm border-white/[0.06]',
        'transition-all duration-200 hover:border-white/[0.12]'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn('w-1 rounded-full self-stretch shrink-0', style.dot)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={cn('text-sm font-semibold truncate', style.text)}>
              {appointment.customerName}
            </p>
            <span
              className={cn(
                'text-[10px] px-2 py-0.5 rounded-full border shrink-0',
                style.bg,
                style.border,
                style.text
              )}
            >
              {appointment.status}
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">{appointment.serviceName}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {appointment.startTime} - {appointment.endTime}
            </span>
            <span className="truncate">{appointment.professionalName}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */

export default function AgendaPage() {
  const t = useTranslations('dashboard');
  const tCal = useTranslations('calendar');

  const days = useMemo(() => getNext14Days(), []);
  const [selectedDate, setSelectedDate] = useState(days[0].date);
  const dateStripRef = useRef<HTMLDivElement>(null);

  const professionals = useMemo(
    () => getProfessionalsByBusinessId(BUSINESS_ID),
    []
  );
  const appointments = useMemo(
    () => getMockAppointments(BUSINESS_ID, selectedDate),
    [selectedDate]
  );

  const selectedDay = days.find((d) => d.date === selectedDate) ?? days[0];

  const scrollDateStrip = useCallback((direction: 'left' | 'right') => {
    if (!dateStripRef.current) return;
    const amount = direction === 'left' ? -200 : 200;
    dateStripRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  }, []);

  const appointmentsByProfessional = useMemo(() => {
    const map = new Map<string, MockAppointment[]>();
    for (const pro of professionals) {
      map.set(pro.id, []);
    }
    for (const appt of appointments) {
      const list = map.get(appt.professionalId);
      if (list) list.push(appt);
    }
    return map;
  }, [appointments, professionals]);

  const totalAppointments = appointments.length;
  const confirmedCount = appointments.filter(
    (a) => a.status === 'confirmed'
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === 'completed'
  ).length;

  return (
    <PageTransition>
      <div className="space-y-6 pb-24">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-gradient-primary flex items-center gap-2">
              <Calendar className="w-6 h-6 text-emerald-400" />
              {t('agenda')}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {selectedDay.dayName} {selectedDay.dayNum} {selectedDay.monthShort}{' '}
              &middot; {totalAppointments} {t('appointments').toLowerCase()}
            </p>
          </div>

          {/* Summary pills */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-300 font-medium">
                {confirmedCount} confirmadas
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs text-blue-300 font-medium">
                {completedCount} completadas
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Date Navigation Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative"
        >
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollDateStrip('left')}
              className="shrink-0 hidden sm:flex"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div
              ref={dateStripRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth flex-1 py-1"
            >
              {days.map((day, i) => {
                const isSelected = day.date === selectedDate;
                return (
                  <motion.button
                    key={day.date}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    onClick={() => setSelectedDate(day.date)}
                    className={cn(
                      'flex flex-col items-center justify-center min-w-[4rem] h-20 rounded-xl border transition-all duration-300 shrink-0',
                      isSelected
                        ? 'bg-gradient-to-b from-emerald-500/30 to-emerald-600/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                        : 'bg-card/40 border-white/[0.04] hover:border-white/[0.12] hover:bg-card/60'
                    )}
                  >
                    <span
                      className={cn(
                        'text-[10px] uppercase tracking-wider font-medium',
                        isSelected ? 'text-emerald-300' : 'text-white/40'
                      )}
                    >
                      {day.dayName}
                    </span>
                    <span
                      className={cn(
                        'text-xl font-bold mt-0.5',
                        isSelected ? 'text-white' : 'text-white/70'
                      )}
                    >
                      {day.dayNum}
                    </span>
                    <span
                      className={cn(
                        'text-[10px]',
                        isSelected ? 'text-emerald-400' : 'text-white/30'
                      )}
                    >
                      {day.monthShort}
                    </span>
                    {day.isToday && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollDateStrip('right')}
              className="shrink-0 hidden sm:flex"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* ── Desktop Grid View ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:block"
        >
          <div className="rounded-2xl border border-white/[0.04] bg-card/60 backdrop-blur-sm overflow-hidden">
            {/* Professional column headers */}
            <div
              className="grid border-b border-white/[0.06]"
              style={{
                gridTemplateColumns: `4.5rem repeat(${professionals.length}, 1fr)`,
              }}
            >
              {/* Time label header */}
              <div className="p-3 border-r border-white/[0.04] flex items-center justify-center">
                <Clock className="w-4 h-4 text-white/30" />
              </div>

              {/* Professional headers */}
              {professionals.map((pro, i) => (
                <motion.div
                  key={pro.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={cn(
                    'p-4 flex flex-col items-center gap-2',
                    i < professionals.length - 1 && 'border-r border-white/[0.04]'
                  )}
                >
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-emerald-500/30 ring-offset-2 ring-offset-card">
                      <Image
                        src={pro.avatarUrl ?? '/placeholder-avatar.png'}
                        alt={pro.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-card" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/90 truncate max-w-[120px]">
                      {pro.name}
                    </p>
                    <p className="text-[10px] text-white/40 truncate max-w-[120px]">
                      {pro.specialties?.join(', ')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Time grid body */}
            <div className="overflow-y-auto max-h-[calc(100vh-22rem)]">
              <div
                className="grid relative"
                style={{
                  gridTemplateColumns: `4.5rem repeat(${professionals.length}, 1fr)`,
                }}
              >
                {/* Time labels column */}
                <div className="border-r border-white/[0.04]">
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="border-b border-white/[0.03] flex items-start justify-end pr-2 pt-1"
                      style={{ height: HOUR_HEIGHT }}
                    >
                      <span className="text-[11px] text-white/30 font-mono tabular-nums">
                        {formatHour(hour)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Professional columns with appointments */}
                {professionals.map((pro, colIdx) => {
                  const proAppointments =
                    appointmentsByProfessional.get(pro.id) ?? [];

                  return (
                    <div
                      key={pro.id}
                      className={cn(
                        'relative',
                        colIdx < professionals.length - 1 &&
                          'border-r border-white/[0.04]'
                      )}
                    >
                      {/* Hour gridlines */}
                      {HOURS.map((hour) => (
                        <div
                          key={hour}
                          className="border-b border-white/[0.03]"
                          style={{ height: HOUR_HEIGHT }}
                        />
                      ))}

                      {/* Appointment blocks (absolute positioned) */}
                      <div
                        className="absolute inset-0"
                        style={{ top: 0 }}
                      >
                        <AnimatePresence mode="popLayout">
                          {proAppointments.map((appt, idx) => (
                            <AppointmentBlock
                              key={appt.id}
                              appointment={appt}
                              index={idx}
                            />
                          ))}
                        </AnimatePresence>
                      </div>

                      {/* Current time indicator */}
                      <CurrentTimeIndicator />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Mobile List View ── */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-3"
            >
              {appointments.length === 0 ? (
                <motion.div
                  variants={staggerItem}
                  className="text-center py-16 rounded-2xl border border-white/[0.04] bg-card/40"
                >
                  <Calendar className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">
                    {tCal('noAppointments')}
                  </p>
                </motion.div>
              ) : (
                appointments.map((appt, i) => (
                  <MobileAppointmentCard
                    key={appt.id}
                    appointment={appt}
                    index={i}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── FAB: Book Appointment ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.5,
          }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            variant="cta"
            size="lg"
            className="rounded-full h-14 px-6 shadow-2xl shadow-emerald-500/30 gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{t('quickBook')}</span>
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  );
}

/* ─── Current Time Indicator ─── */

function CurrentTimeIndicator() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Only show if within the visible range (8-20)
  if (currentHour < 8 || currentHour >= 20) return null;

  const top = (currentHour - 8) * HOUR_HEIGHT + (currentMinute / 60) * HOUR_HEIGHT;

  return (
    <div className="absolute left-0 right-0 z-30 pointer-events-none" style={{ top }}>
      <div className="flex items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 -ml-[5px] shadow-lg shadow-rose-500/50" />
        <div className="flex-1 h-[2px] bg-gradient-to-r from-rose-500 to-rose-500/0" />
      </div>
    </div>
  );
}
