'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Business } from '@/domain/entities/business';
import type { Service } from '@/domain/entities/service';
import type { Professional } from '@/domain/entities/professional';

interface BookingState {
  business: Business | null;
  services: Service[];
  professionals: Professional[];
  selectedService: Service | null;
  selectedProfessional: Professional | null;
  selectedDate: string | null;
  selectedTime: string | null;
  loading: boolean;
  error: string | null;
}

interface BookingContextValue extends BookingState {
  selectService: (service: Service) => void;
  selectProfessional: (professional: Professional | null) => void;
  selectDate: (date: string) => void;
  selectTime: (time: string | null) => void;
  reset: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}

interface BookingProviderProps {
  slug: string;
  children: ReactNode;
}

export function BookingProvider({ slug, children }: BookingProviderProps) {
  const [state, setState] = useState<BookingState>({
    business: null,
    services: [],
    professionals: [],
    selectedService: null,
    selectedProfessional: null,
    selectedDate: null,
    selectedTime: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        // Try mock data first (demo / development mode)
        const { getBusinessBySlug, getServicesByBusinessId, getProfessionalsByBusinessId } =
          await import('@/lib/mock-data');

        const mockBusiness = getBusinessBySlug(slug);
        if (mockBusiness) {
          if (cancelled) return;
          const mockServices = getServicesByBusinessId(mockBusiness.id);
          const mockProfessionals = getProfessionalsByBusinessId(mockBusiness.id);
          setState((s) => ({
            ...s,
            business: mockBusiness,
            services: mockServices.filter((svc) => svc.isActive),
            professionals: mockProfessionals.filter((p) => p.isActive),
            loading: false,
          }));
          return;
        }

        // Fallback to Firebase
        const { getBusinessRepository, getServiceRepository, getProfessionalRepository } =
          await import('@/infra/providers/repositories');

        const businessRepo = getBusinessRepository();
        const business = await businessRepo.getBySlug(slug);

        if (cancelled) return;

        if (!business) {
          setState((s) => ({ ...s, loading: false, error: 'not_found' }));
          return;
        }

        const serviceRepo = getServiceRepository();
        const profRepo = getProfessionalRepository();

        const [services, professionals] = await Promise.all([
          serviceRepo.getByBusinessId(business.id),
          profRepo.getByBusinessId(business.id),
        ]);

        if (cancelled) return;

        setState((s) => ({
          ...s,
          business,
          services: services.filter((svc) => svc.isActive),
          professionals: professionals.filter((p) => p.isActive),
          loading: false,
        }));
      } catch (err) {
        if (cancelled) return;
        setState((s) => ({ ...s, loading: false, error: 'load_error' }));
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [slug]);

  const selectService = useCallback((service: Service) => {
    setState((s) => ({ ...s, selectedService: service }));
  }, []);

  const selectProfessional = useCallback((professional: Professional | null) => {
    setState((s) => ({ ...s, selectedProfessional: professional }));
  }, []);

  const selectDate = useCallback((date: string) => {
    setState((s) => ({ ...s, selectedDate: date, selectedTime: null }));
  }, []);

  const selectTime = useCallback((time: string | null) => {
    setState((s) => ({ ...s, selectedTime: time }));
  }, []);

  const reset = useCallback(() => {
    setState((s) => ({
      ...s,
      selectedService: null,
      selectedProfessional: null,
      selectedDate: null,
      selectedTime: null,
    }));
  }, []);

  return (
    <BookingContext.Provider
      value={{
        ...state,
        selectService,
        selectProfessional,
        selectDate,
        selectTime,
        reset,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}
