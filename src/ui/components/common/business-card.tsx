'use client';

import { useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { cardEntrance, hoverBounce, tapScale } from '@/ui/animations/variants';
import { StarRating } from './star-rating';
import { PriceRange } from './price-range';
import type { MockBusiness } from '@/lib/mock-data';
import { getPriceRange } from '@/lib/mock-data';

interface BusinessCardProps {
  business: MockBusiness;
  className?: string;
}

export function BusinessCard({ business, className }: BusinessCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const priceLevel = getPriceRange(business.id);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);

  const categoryLabels: Record<string, string> = {
    barberia: 'Barbería',
    spa: 'Spa',
    salon: 'Salón',
    unas: 'Uñas',
    clinica: 'Clínica',
  };

  return (
    <motion.div
      ref={ref}
      variants={cardEntrance}
      whileHover={hoverBounce}
      whileTap={tapScale}
      onMouseMove={handleMouseMove}
      className={cn(
        'group rounded-2xl overflow-hidden cursor-pointer mouse-glow',
        'bg-card/60 backdrop-blur-xl',
        'shadow-lg shadow-black/10',
        'border border-white/[0.04]',
        'hover:shadow-xl hover:shadow-emerald-500/[0.07]',
        'transition-shadow duration-300',
        className
      )}
    >
      <Link href={`/book/${business.slug}`} className="block">
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={business.coverImageUrl ?? ''}
            alt={business.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-xs font-medium text-white/90 border border-white/10">
              {categoryLabels[business.category ?? ''] ?? business.category}
            </span>
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-lg font-bold text-white drop-shadow-lg">{business.name}</h3>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-1">{business.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StarRating rating={business.rating} reviewCount={business.reviewCount} />
            </div>
            <PriceRange level={priceLevel} />
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3 text-emerald-400" />
            {business.address}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
