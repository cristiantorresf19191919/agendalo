'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { staggerItem, tapScale, hoverGlow } from '@/ui/animations/variants';

interface ServiceCardProps {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  currency: string;
  imageUrl?: string;
  selected?: boolean;
  onSelect: () => void;
}

export function ServiceCard({
  name,
  description,
  durationMinutes,
  price,
  currency,
  imageUrl,
  selected = false,
  onSelect,
}: ServiceCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      whileTap={tapScale}
      whileHover={hoverGlow}
      onClick={onSelect}
      className={cn(
        'relative cursor-pointer rounded-xl border p-4 transition-all duration-200',
        'bg-card/80 backdrop-blur-sm',
        selected
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/5'
          : 'border-border hover:border-border/80'
      )}
    >
      <div className="flex gap-4">
        {imageUrl && (
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
            <Image src={imageUrl} alt={name} fill className="object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {durationMinutes} min
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              {currency}{price}
            </span>
          </div>
        </div>
      </div>
      {selected && (
        <motion.div
          layoutId="service-selected"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center"
        >
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}
