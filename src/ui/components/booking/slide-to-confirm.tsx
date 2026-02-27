'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlideToConfirmProps {
  label: string;
  onConfirm: () => void;
  disabled?: boolean;
  className?: string;
}

export function SlideToConfirm({ label, onConfirm, disabled = false, className }: SlideToConfirmProps) {
  const [confirmed, setConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const background = useTransform(
    x,
    [0, 200],
    ['hsl(0 0% 15%)', 'hsl(160 84% 39%)']
  );

  const iconOpacity = useTransform(x, [0, 150], [1, 0]);
  const checkOpacity = useTransform(x, [150, 200], [0, 1]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const containerWidth = containerRef.current?.offsetWidth ?? 300;
    const threshold = containerWidth - 80;
    if (info.offset.x >= threshold) {
      setConfirmed(true);
      onConfirm();
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative h-14 rounded-full overflow-hidden',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <motion.div className="absolute inset-0 rounded-full" style={{ backgroundColor: background }} />
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white/60">
        {label}
      </div>
      {!confirmed && (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: (containerRef.current?.offsetWidth ?? 300) - 56 }}
          dragElastic={0}
          onDragEnd={handleDragEnd}
          style={{ x }}
          className="absolute left-1 top-1 h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
        >
          <motion.div style={{ opacity: iconOpacity }}>
            <ChevronRight className="h-5 w-5 text-slate-900" />
          </motion.div>
          <motion.div className="absolute" style={{ opacity: checkOpacity }}>
            <Check className="h-5 w-5 text-emerald-500" />
          </motion.div>
        </motion.div>
      )}
      {confirmed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Check className="h-6 w-6 text-white" />
        </motion.div>
      )}
    </div>
  );
}
