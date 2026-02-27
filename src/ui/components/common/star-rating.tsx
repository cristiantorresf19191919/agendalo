'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function StarRating({ rating, reviewCount, size = 'sm', className }: StarRatingProps) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Star className={cn(starSize, 'fill-amber-400 text-amber-400')} />
      <span className={cn(textSize, 'font-medium text-foreground')}>{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className={cn(textSize, 'text-muted-foreground')}>({reviewCount})</span>
      )}
    </div>
  );
}
