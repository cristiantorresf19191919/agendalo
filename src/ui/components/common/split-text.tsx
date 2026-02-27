'use client';

import { motion } from 'framer-motion';
import { wordRevealContainer, wordRevealItem } from '@/ui/animations/variants';
import { cn } from '@/lib/utils';

interface SplitTextProps {
  text: string;
  className?: string;
}

export function SplitText({ text, className }: SplitTextProps) {
  const words = text.split(' ');

  return (
    <motion.span
      variants={wordRevealContainer}
      initial="hidden"
      animate="visible"
      className={cn('inline-flex flex-wrap gap-x-[0.3em]', className)}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span variants={wordRevealItem} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
