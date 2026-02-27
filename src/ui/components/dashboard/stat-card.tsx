'use client';

import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { stretchyCard, hoverBounce } from '@/ui/animations/variants';
import { AnimatedCounter } from '@/ui/components/common/animated-counter';
import { useMouseGlow } from '@/ui/hooks/use-mouse-glow';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  const { ref, handleMouseMove } = useMouseGlow();

  return (
    <motion.div
      ref={ref}
      variants={stretchyCard}
      whileHover={hoverBounce}
      onMouseMove={handleMouseMove}
      className={cn(
        'rounded-xl border border-border bg-card/80 backdrop-blur-sm p-5 mouse-glow',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-foreground">
          {typeof value === 'number' ? (
            <AnimatedCounter value={value} />
          ) : (
            value
          )}
        </span>
        {trend && (
          <span className={cn('text-xs font-medium', trend.positive ? 'text-emerald-500' : 'text-rose-500')}>
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
