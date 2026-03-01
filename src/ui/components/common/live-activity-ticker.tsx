'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';

const NAMES = [
  'Ana', 'Carlos', 'María', 'Sebastián', 'Valentina',
  'Andrés', 'Camila', 'Santiago', 'Laura', 'David',
  'Isabella', 'Mateo', 'Sofía', 'Daniel', 'Gabriela',
];

const BARRIOS = [
  'Chapinero', 'Usaquén', 'Zona Rosa', 'Cedritos',
  'La Candelaria', 'Chicó', 'Rosales', 'Salitre',
  'Teusaquillo', 'Galerías', 'Quinta Camacho', 'Parque 93',
];

const ITEM_KEYS = [
  'activityItem1', 'activityItem2', 'activityItem3',
  'activityItem4', 'activityItem5', 'activityItem6',
] as const;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function LiveActivityTicker() {
  const t = useTranslations('home');
  const [current, setCurrent] = useState(0);

  const generateActivity = useCallback((idx: number) => {
    const key = ITEM_KEYS[idx % ITEM_KEYS.length];
    const name = pick(NAMES);
    const barrio = pick(BARRIOS);
    const minutes = Math.floor(Math.random() * 8) + 1;
    return {
      text: t(key, { name, barrio }),
      timeAgo: t('minutesAgo', { minutes: String(minutes) }),
      barrio,
    };
  }, [t]);

  const [activity, setActivity] = useState(() => generateActivity(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => {
        const next = prev + 1;
        setActivity(generateActivity(next));
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [generateActivity]);

  return (
    <div className="relative overflow-hidden h-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex items-center gap-2 text-sm text-muted-foreground absolute inset-0 justify-center"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>{activity.text}</span>
          <span className="flex items-center gap-0.5 text-muted-foreground/60">
            <MapPin className="h-3 w-3" />
            {activity.timeAgo}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
