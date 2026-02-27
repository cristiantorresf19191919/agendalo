import { cn } from '@/lib/utils';

interface PriceRangeProps {
  level: 1 | 2 | 3;
  className?: string;
}

export function PriceRange({ level, className }: PriceRangeProps) {
  return (
    <span className={cn('text-xs font-medium', className)}>
      {Array.from({ length: 3 }, (_, i) => (
        <span
          key={i}
          className={i < level ? 'text-emerald-400' : 'text-muted-foreground/30'}
        >
          $
        </span>
      ))}
    </span>
  );
}
