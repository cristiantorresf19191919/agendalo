'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const t = useTranslations('search');
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl px-5 py-3.5',
        'bg-card/90 backdrop-blur-xl',
        'shadow-lg shadow-black/5 dark:shadow-black/30',
        'border border-border',
        'transition-all duration-300',
        'focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500/40 focus-within:shadow-emerald-500/10 focus-within:shadow-2xl',
        className
      )}
    >
      <Search className="h-5 w-5 text-muted-foreground shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('placeholder')}
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="shrink-0 p-1 rounded-full hover:bg-muted/50 transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
      <div className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground border-l border-border pl-3">
        <MapPin className="h-3.5 w-3.5 text-emerald-500" />
        <span>Bogotá</span>
      </div>
    </div>
  );
}
