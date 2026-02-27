'use client';

import { cn } from '@/lib/utils';
import { useAnimatedCounter } from '@/ui/hooks/use-animated-counter';

interface AnimatedCounterProps {
  value: number;
  className?: string;
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const { ref, display } = useAnimatedCounter(value);

  return (
    <span ref={ref} className={cn(className)}>
      {display}
    </span>
  );
}
