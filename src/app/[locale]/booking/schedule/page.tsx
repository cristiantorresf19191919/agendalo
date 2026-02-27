'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/ui/components/common/button';
import { TimeSlotPicker } from '@/ui/components/calendar/time-slot-picker';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { Link } from '@/i18n/navigation';

function getNext7Days(): Array<{ date: string; dayName: string; dayNum: number }> {
  const days: Array<{ date: string; dayName: string; dayNum: number }> = [];
  const shortDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      dayName: shortDays[d.getDay()],
      dayNum: d.getDate(),
    });
  }
  return days;
}

export default function BookingSchedulePage() {
  const t = useTranslations('booking');
  const days = getNext7Days();
  const [selectedDate, setSelectedDate] = useState(days[0].date);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  // Placeholder slots — will come from GetAvailableSlots use case
  const slots = [
    { start: '09:00', end: '09:30' },
    { start: '09:30', end: '10:00' },
    { start: '10:15', end: '10:45' },
    { start: '11:00', end: '11:30' },
    { start: '11:30', end: '12:00' },
    { start: '14:00', end: '14:30' },
    { start: '14:30', end: '15:00' },
    { start: '15:15', end: '15:45' },
    { start: '16:00', end: '16:30' },
  ];

  return (
    <PageTransition>
      <main className="min-h-screen p-6 max-w-lg mx-auto">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">{t('selectDate')}</h1>

          {/* Date picker strip */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((day) => (
              <button
                key={day.date}
                onClick={() => { setSelectedDate(day.date); setSelectedTime(undefined); }}
                className={`flex flex-col items-center rounded-xl px-4 py-3 min-w-[4rem] transition-all ${
                  selectedDate === day.date
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-card border border-border hover:border-emerald-500/50'
                }`}
              >
                <span className="text-xs font-medium">{day.dayName}</span>
                <span className="text-lg font-bold">{day.dayNum}</span>
              </button>
            ))}
          </div>

          {/* Time slots */}
          <div>
            <h2 className="text-lg font-semibold mb-3">{t('selectTime')}</h2>
            <TimeSlotPicker
              slots={slots}
              selectedSlot={selectedTime}
              onSelect={setSelectedTime}
            />
          </div>

          {selectedTime && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/booking/confirm">
                <Button variant="cta" className="w-full" size="lg">
                  {t('confirmBooking')}
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
