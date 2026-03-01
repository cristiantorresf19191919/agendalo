'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { skeletonPulse } from '@/ui/animations/variants';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      variants={skeletonPulse}
      initial="initial"
      animate="animate"
      className={cn('rounded-lg bg-muted/50', className)}
    />
  );
}

export function BusinessCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-card border border-border shadow-lg shadow-black/5 dark:shadow-black/30">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
