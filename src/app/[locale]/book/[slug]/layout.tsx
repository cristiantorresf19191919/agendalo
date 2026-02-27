'use client';

import { useParams } from 'next/navigation';
import { BookingProvider } from '@/ui/components/booking/booking-context';

export default function BookLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ slug: string }>();

  return (
    <BookingProvider slug={params.slug}>
      {children}
    </BookingProvider>
  );
}
