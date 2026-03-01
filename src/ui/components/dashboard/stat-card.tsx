'use client';

import { motion } from 'framer-motion';
import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { staggerItem } from '@/ui/animations/variants';
import { AnimatedCounter } from '@/ui/components/common/animated-counter';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
      className={cn(
        'rounded-2xl border border-border bg-[hsl(var(--surface-1))] p-5 transition-colors hover:border-border',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
        <div className="h-8 w-8 rounded-lg bg-emerald-500/8 flex items-center justify-center">
          <Icon className="h-4 w-4 text-emerald-400" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-foreground font-display">
          {typeof value === 'number' ? (
            <AnimatedCounter value={value} />
          ) : (
            value
          )}
        </span>
        {trend && (
          <span className={cn('flex items-center gap-0.5 text-xs font-semibold', trend.positive ? 'text-emerald-400' : 'text-rose-400')}>
            {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
