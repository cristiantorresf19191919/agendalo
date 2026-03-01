import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { LayoutShell } from '@/ui/components/layout/layout-shell';
import { ThemeProvider } from '@/ui/components/common/theme-provider';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Agendalo — Reserva inteligente',
  description: 'La plataforma de reservas premium para barberías, spas y clínicas en Bogotá',
};

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'es' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('agendalo-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <LayoutShell>
              {children}
            </LayoutShell>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
