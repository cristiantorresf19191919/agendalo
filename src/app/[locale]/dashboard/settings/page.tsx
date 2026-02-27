'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/ui/components/common/button';
import { Input } from '@/ui/components/common/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/components/common/card';
import { PageTransition } from '@/ui/components/layout/page-transition';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');

  return (
    <PageTransition>
      <div className="space-y-8 max-w-2xl">
        <h1 className="text-2xl font-bold">{t('title')}</h1>

        <Card glass>
          <CardHeader>
            <CardTitle>{t('businessInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label={t('businessName')} placeholder="Mi Barbería" />
            <Input label={t('slug')} placeholder="mi-barberia" />
            <Input label={t('timezone')} placeholder="America/Mexico_City" />
            <Input label={t('currency')} placeholder="MXN" />
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader>
            <CardTitle>{t('slotConfig')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label={t('stepMinutes')} type="number" placeholder="15" />
            <Input label={t('bufferMinutes')} type="number" placeholder="10" />
            <Input label={t('leadTimeMinutes')} type="number" placeholder="60" />
          </CardContent>
        </Card>

        <Button>{tCommon('save')}</Button>
      </div>
    </PageTransition>
  );
}
