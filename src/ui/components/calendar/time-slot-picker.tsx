'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem, tapScale } from '@/ui/animations/variants';

interface TimeSlotPickerProps {
  slots: Array<{ start: string; end: string }>;
  selectedSlot?: string;
  onSelect: (start: string) => void;
}

export function TimeSlotPicker({ slots, selectedSlot, onSelect }: TimeSlotPickerProps) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No hay horarios disponibles
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-3 sm:grid-cols-4 gap-2"
    >
      {slots.map((slot) => {
        const isSelected = selectedSlot === slot.start;
        return (
          <motion.button
            key={slot.start}
            variants={staggerItem}
            whileTap={tapScale}
            onClick={() => onSelect(slot.start)}
            className={cn(
              'rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isSelected
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25'
                : 'border-border bg-card hover:border-emerald-500/50 hover:bg-emerald-500/5 text-foreground'
            )}
          >
            {slot.start}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
