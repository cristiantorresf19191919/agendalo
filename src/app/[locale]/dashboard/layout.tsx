import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { Sidebar } from '@/ui/components/layout/sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { locale } = await params;
  const t = await getTranslations('dashboard');

  return (
    <div className="flex min-h-screen bg-[hsl(var(--surface-0))]">
      <Sidebar
        locale={locale}
        translations={{
          overview: t('overview'),
          services: t('services'),
          professionals: t('professionals'),
          calendar: t('agenda'),
          settings: t('settings'),
          analytics: t('analytics'),
          reviews: t('reviews'),
          loyalty: t('loyalty'),
          giftCards: t('giftCards'),
          notifications: t('notifications'),
          clients: t('clients'),
          locations: t('locations'),
          whatsapp: t('whatsapp'),
          recurring: t('recurring'),
          groupClasses: t('groupClasses'),
          payments: t('payments'),
          invoicing: t('invoicing'),
          instagram: t('instagram'),
          marketing: t('marketing'),
          homeService: t('homeService'),
          scheduleOptimizer: t('scheduleOptimizer'),
          barrioDiscovery: t('barrioDiscovery'),
          beautyAssistant: t('beautyAssistant'),
          community: t('community'),
        }}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-4 lg:p-8 max-w-[1400px]">
          {children}
        </div>
      </main>
    </div>
  );
}
