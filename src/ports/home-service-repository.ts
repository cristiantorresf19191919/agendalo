import type { HomeServiceConfig, HomeServiceBooking } from '@/domain/entities/home-service';

export interface HomeServiceConfigRepository {
  getByProfessional(professionalId: string): Promise<HomeServiceConfig | null>;
  listByBusiness(businessId: string): Promise<HomeServiceConfig[]>;
  listAvailableInZone(city: string, barrio: string): Promise<HomeServiceConfig[]>;
  create(data: Omit<HomeServiceConfig, 'id' | 'updatedAt'>): Promise<HomeServiceConfig>;
  update(id: string, data: Partial<HomeServiceConfig>): Promise<void>;
}

export interface HomeServiceBookingRepository {
  getById(id: string): Promise<HomeServiceBooking | null>;
  getByBookingId(bookingId: string): Promise<HomeServiceBooking | null>;
  listByProfessional(professionalId: string, date?: string): Promise<HomeServiceBooking[]>;
  create(data: Omit<HomeServiceBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<HomeServiceBooking>;
  update(id: string, data: Partial<HomeServiceBooking>): Promise<void>;
}

export interface GeocodingPort {
  /** Geocode an address to coordinates. */
  geocodeAddress(address: string, city: string): Promise<{ latitude: number; longitude: number; formattedAddress: string }>;
  /** Calculate distance and travel time between two points. */
  calculateDistance(from: { lat: number; lng: number }, to: { lat: number; lng: number }): Promise<{ distanceKm: number; durationMinutes: number }>;
  /** Generate a Google Maps navigation URL. */
  generateNavigationUrl(latitude: number, longitude: number): string;
}
