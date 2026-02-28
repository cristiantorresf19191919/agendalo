'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Scissors, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/ui/components/common/button';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative inline-flex items-center justify-center mb-8"
        >
          <div className="h-32 w-32 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Scissors className="h-16 w-16 text-emerald-400/50" />
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center"
          >
            <span className="text-lg">?</span>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-bold text-gradient-primary mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold mb-2"
        >
          {t('title')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-zinc-500 mb-8"
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/">
            <Button variant="cta" className="gap-2">
              <ArrowRight className="h-4 w-4 rotate-180" />
              {t('backHome')}
            </Button>
          </Link>
          <Link href="/discover">
            <Button variant="outline" className="gap-2 border-zinc-700">
              <Search className="h-4 w-4" />
              {t('explore')}
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
