'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { tapScale } from '@/ui/animations/variants';

export type CellStatus = 'available' | 'booked' | 'blocked' | 'past' | 'selected';

interface CalendarCellProps {
  time: string;
  status: CellStatus;
  label?: string;
  onClick?: () => void;
  onHover?: () => void;
}

const statusStyles: Record<CellStatus, string> = {
  available: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer',
  booked: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  blocked: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  past: 'bg-muted/50 text-muted-foreground/50 border-transparent',
  selected: 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/25',
};

export function CalendarCell({ time, status, label, onClick, onHover }: CalendarCellProps) {
  const isInteractive = status === 'available' || status === 'selected';

  return (
    <motion.div
      whileTap={isInteractive ? tapScale : undefined}
      onHoverStart={onHover}
      onClick={isInteractive ? onClick : undefined}
      className={cn(
        'relative rounded-lg border px-3 py-2 text-sm transition-all duration-200',
        statusStyles[status]
      )}
    >
      <span className="font-mono text-xs">{time}</span>
      {label && <span className="ml-2 text-xs truncate">{label}</span>}
    </motion.div>
  );
}
