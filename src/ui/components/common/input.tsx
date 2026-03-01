'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground">{label}</label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground',
            'placeholder:text-muted-foreground/60',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/40',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200',
            'shadow-[var(--shadow-sm)]',
            error && 'border-rose-500 focus-visible:ring-rose-500/30',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-rose-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
