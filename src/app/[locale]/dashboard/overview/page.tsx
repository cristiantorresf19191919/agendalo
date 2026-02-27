'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Users,
  Scissors,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PageTransition } from '@/ui/components/layout/page-transition';
import { StatCard } from '@/ui/components/dashboard/stat-card';
import { ProgressBar } from '@/ui/components/dashboard/progress-bar';
import { Button } from '@/ui/components/common/button';
import { QuickBookModal } from '@/ui/components/dashboard/quick-book-modal';
import { staggerContainer, staggerItem, cardEntrance } from '@/ui/animations/variants';
import { cn } from '@/lib/utils';
import {
  getProfessionalsByBusinessId,
  getMockAppointments,
} from '@/lib/mock-data';
import { formatCOP } from '@/lib/format';

export default function DashboardOverviewPage() {
  const t = useTranslations('dashboard');
  const [quickBookOpen, setQuickBookOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const professionals = getProfessionalsByBusinessId('biz-1');
  const appointments = getMockAppointments('biz-1', today);

  const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const total = appointments.length;

  const upcoming = appointments
    .filter((a) => a.status === 'confirmed')
    .slice(0, 4);

  return (
    <PageTransition>
      <div className="space-y-8 pt-14 lg:pt-0">
        {/* Welcome header */}
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl sm:text-3xl font-bold"
            >
              <span className="text-gradient-primary">{t('welcomeBack')}</span> 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-sm mt-1"
            >
              {t('hereIsYourDay')}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button variant="cta" className="gap-2" onClick={() => setQuickBookOpen(true)}>
              <Plus className="h-4 w-4" />
              {t('quickBook')}
            </Button>
          </motion.div>
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <ProgressBar
            value={completed}
            max={total}
            label={t('todayProgress')}
          />
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title={t('appointments')}
            value={total}
            icon={CalendarDays}
            trend={{ value: 12, positive: true }}
          />
          <StatCard
            title={t('completed')}
            value={completed}
            icon={TrendingUp}
          />
          <StatCard
            title={t('remaining')}
            value={confirmed}
            icon={Clock}
          />
          <StatCard
            title="Profesionales"
            value={professionals.length}
            icon={Users}
          />
        </motion.div>

        {/* Two columns: Upcoming + Professionals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming appointments */}
          <motion.div
            variants={cardEntrance}
            initial="hidden"
            animate="visible"
            className="rounded-2xl p-5 bg-card/60 backdrop-blur-sm border border-white/[0.04]"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">{t('upcomingAppointments')}</h2>
              <Link href="/dashboard/agenda">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  {t('viewAgenda')}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                {t('noUpcoming')}
              </p>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {upcoming.map((appt) => (
                  <motion.div
                    key={appt.id}
                    variants={staggerItem}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-white/[0.03] hover:bg-muted/30 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{appt.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {appt.serviceName} · {appt.startTime} - {appt.endTime}
                      </p>
                    </div>
                    <span className="text-xs text-emerald-400 font-medium shrink-0">
                      {appt.professionalName.split(' ')[0]}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Team */}
          <motion.div
            variants={cardEntrance}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-5 bg-card/60 backdrop-blur-sm border border-white/[0.04]"
          >
            <h2 className="font-semibold text-lg mb-4">{t('professionals')}</h2>
            <div className="grid grid-cols-2 gap-3">
              {professionals.map((pro) => {
                const proAppts = appointments.filter((a) => a.professionalId === pro.id);
                return (
                  <motion.div
                    key={pro.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-white/[0.03]"
                  >
                    {pro.avatarUrl ? (
                      <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 ring-2 ring-emerald-500/20">
                        <Image src={pro.avatarUrl} alt={pro.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">
                        {pro.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{pro.name.split(' ')[0]}</p>
                      <p className="text-xs text-muted-foreground">{proAppts.length} citas</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <QuickBookModal
        open={quickBookOpen}
        onOpenChange={setQuickBookOpen}
        businessId="biz-1"
      />
    </PageTransition>
  );
}
