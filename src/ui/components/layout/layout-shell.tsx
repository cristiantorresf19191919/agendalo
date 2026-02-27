'use client';

import type { ReactNode } from 'react';
import { usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Header } from './header';
import { Footer } from './footer';

interface LayoutShellProps {
  children: ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && <Header />}
      <div className={cn(!isDashboard && 'pt-16')}>
        {children}
      </div>
      {!isDashboard && <Footer />}
    </>
  );
}
