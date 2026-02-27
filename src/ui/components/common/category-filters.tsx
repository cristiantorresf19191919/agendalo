'use client';

import { motion } from 'framer-motion';
import { Scissors, Sparkles, LayoutGrid, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { CATEGORIES } from '@/lib/mock-data';

const iconMap: Record<string, React.ElementType> = {
  LayoutGrid,
  Scissors,
  Sparkles,
  Brush: Scissors,
  Hand: Sparkles,
  Stethoscope,
};

interface CategoryFiltersProps {
  selected: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function CategoryFilters({ selected, onSelect, className }: CategoryFiltersProps) {
  const t = useTranslations();

  return (
    <div className={cn('flex gap-2 overflow-x-auto pb-2 scrollbar-none', className)}>
      {CATEGORIES.map((cat) => {
        const Icon = iconMap[cat.icon] ?? LayoutGrid;
        const isActive = selected === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              'relative shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
              isActive
                ? 'text-emerald-400'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/60'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="category-active"
                className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/20"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="h-4 w-4 relative z-10" />
            <span className="relative z-10 whitespace-nowrap">{t(cat.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
