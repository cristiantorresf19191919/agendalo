'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, max, label, className }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className={cn('rounded-xl p-4 bg-[hsl(var(--surface-1))] border border-white/[0.04]', className)}>
      {label && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-zinc-400">{label}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-foreground font-display">{value}</span>
            <span className="text-xs text-zinc-600">/ {max}</span>
          </div>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.04]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
