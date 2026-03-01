'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { tapScale } from '@/ui/animations/variants';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-emerald-500 text-white font-semibold shadow-[var(--shadow-sm)] hover:bg-emerald-600 hover:shadow-[var(--shadow-md)] active:bg-emerald-700',
        destructive: 'bg-rose-500 text-white shadow-sm hover:bg-rose-600',
        outline: 'border border-border bg-card text-foreground hover:bg-muted/60',
        secondary: 'bg-muted text-foreground hover:bg-muted/80',
        ghost: 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
        link: 'text-emerald-600 dark:text-emerald-400 underline-offset-4 hover:underline',
        available: 'bg-emerald-500/8 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 hover:bg-emerald-500/15',
        cta: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] hover:brightness-105 cta-shine',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot ref={ref} className={cn(buttonVariants({ variant, size, className }))}>
          {children}
        </Slot>
      );
    }

    return (
      <motion.button
        whileTap={tapScale}
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
