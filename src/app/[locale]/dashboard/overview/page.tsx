'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CalendarDays, Users, Scissors, TrendingUp } from 'lucide-react';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { ProgressBar } from '@/ui/components/dashboard/progress-bar';
import { staggerContainer } from '@/ui/animations/variants';

export default function DashboardOverviewPage() {
  const t = useTranslations('dashboard');

  // Placeholder data — will be wired to real data via use cases
  const stats = {
    todayBookings: 8,
    completed: 3,
    totalProfessionals: 2,
    totalServices: 5,
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">{t('todayView')}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t('totalToday', { count: stats.todayBookings })}
          </p>
        </div>

        <ProgressBar
          value={stats.completed}
          max={stats.todayBookings}
          label={t('todayProgress')}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title={t('appointments')}
            value={stats.todayBookings}
            icon={CalendarDays}
            trend={{ value: 12, positive: true }}
          />
          <StatCard title={t('completed')} value={stats.completed} icon={TrendingUp} />
          <StatCard
            title={t('remaining')}
            value={stats.todayBookings - stats.completed}
            icon={CalendarDays}
          />
          <StatCard title={t('professionals')} value={stats.totalProfessionals} icon={Users} />
        </motion.div>
      </div>
    </PageTransition>
  );
}
