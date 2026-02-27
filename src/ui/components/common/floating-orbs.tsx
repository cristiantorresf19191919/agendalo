'use client';

import { cn } from '@/lib/utils';

const orbs = [
  { size: 300, color: 'hsla(160, 84%, 39%, 0.08)', left: '10%', top: '20%', delay: '0s', duration: '14s' },
  { size: 250, color: 'hsla(271, 75%, 50%, 0.06)', left: '70%', top: '60%', delay: '2s', duration: '18s' },
  { size: 200, color: 'hsla(330, 70%, 60%, 0.05)', left: '40%', top: '75%', delay: '4s', duration: '16s' },
];

interface FloatingOrbsProps {
  className?: string;
}

export function FloatingOrbs({ className }: FloatingOrbsProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)} aria-hidden="true">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            left: orb.left,
            top: orb.top,
            filter: 'blur(40px)',
            animation: `float ${orb.duration} ease-in-out ${orb.delay} infinite`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}
