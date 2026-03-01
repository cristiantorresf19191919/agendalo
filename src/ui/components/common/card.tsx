'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { hoverScale, tapScale } from '@/ui/animations/variants';
import { useMouseGlow } from '@/ui/hooks/use-mouse-glow';

interface CardProps extends HTMLMotionProps<'div'> {
  interactive?: boolean;
  glass?: boolean;
  glow?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, glass = false, glow = false, children, onMouseMove, ...props }, ref) => {
    const mouseGlow = useMouseGlow();

    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (glow) mouseGlow.handleMouseMove(e);
        if (onMouseMove) onMouseMove(e as React.MouseEvent<HTMLDivElement, MouseEvent>);
      },
      [glow, mouseGlow, onMouseMove]
    );

    return (
      <motion.div
        ref={glow ? mouseGlow.ref : ref}
        whileHover={interactive ? hoverScale : undefined}
        whileTap={interactive ? tapScale : undefined}
        onMouseMove={glow ? handleMouseMove : onMouseMove}
        className={cn(
          'rounded-xl border border-border/60 bg-card p-6 text-card-foreground shadow-[var(--shadow-sm)]',
          glass && 'bg-card/80 backdrop-blur-xl border-border/40 shadow-[var(--shadow-lg)]',
          glow && 'mouse-glow',
          interactive && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
