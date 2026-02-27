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
    <div className="flex h-screen">
      <Sidebar
        locale={locale}
        translations={{
          overview: t('overview'),
          services: t('services'),
          professionals: t('professionals'),
          calendar: 'Calendar',
          settings: t('settings'),
        }}
      />
      <main className="flex-1 overflow-auto p-6 lg:p-8 mesh-gradient">{children}</main>
    </div>
  );
}
