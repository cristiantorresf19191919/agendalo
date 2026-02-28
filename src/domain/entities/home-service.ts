/**
 * On-Demand Home Service ("A Domicilio") Booking.
 *
 * Professionals can mark services as available for home visits
 * with configurable travel radius and surcharge. Customers filter
 * for "a domicilio" services in discovery. Bookings include address
 * validation, travel time estimation, and adjusted pricing.
 *
 * DIFFERENTIATOR: Home-visit beauty services ("servicios a domicilio")
 * are extremely common in Colombia — manicurists, massage therapists,
 * and hairstylists regularly visit customers at home. No international
 * booking platform supports this workflow natively.
 *
 * Inspired by Rappi's on-demand model but for beauty/wellness.
 */

export type HomeServiceStatus =
  | 'requested'
  | 'accepted'
  | 'professional_en_route'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface HomeServiceConfig {
  id: string;
  businessId: string;
  professionalId: string;
  /** Whether this professional offers home services. */
  isAvailable: boolean;
  /** Maximum travel radius in kilometers. */
  maxRadiusKm: number;
  /** Surcharge for home visits (fixed amount). */
  surchargeFixed: number;
  /** Surcharge per kilometer beyond a base distance. */
  surchargePerKm: number;
  /** Base distance included in the fixed surcharge (km). */
  baseDistanceKm: number;
  /** Minimum booking value for home visits. */
  minBookingValue: number;
  currency: string;
  /** Services available for home visits (subset of their services). */
  availableServiceIds: string[];
  /** Barrios/zones where they offer service. */
  serviceZones: string[];
  /** Working hours for home visits (may differ from salon hours). */
  homeVisitHours?: Record<number, { open: string; close: string }>;
  updatedAt: Date;
}

export interface HomeServiceBooking {
  id: string;
  bookingId: string;
  businessId: string;
  professionalId: string;
  customerId: string;
  /** Customer's address. */
  address: string;
  /** Neighborhood/barrio. */
  barrio: string;
  city: string;
  /** GPS coordinates. */
  latitude: number;
  longitude: number;
  /** Additional address instructions (apt, building, etc.). */
  addressNotes?: string;
  /** Estimated travel distance in km. */
  estimatedDistanceKm: number;
  /** Estimated travel time in minutes. */
  estimatedTravelMinutes: number;
  /** Surcharge applied. */
  surchargeAmount: number;
  /** Total including surcharge. */
  totalWithSurcharge: number;
  currency: string;
  /** Current status of the home visit. */
  status: HomeServiceStatus;
  /** Real-time professional location (when en route). */
  professionalLatitude?: number;
  professionalLongitude?: number;
  /** Google Maps navigation URL for the professional. */
  navigationUrl?: string;
  /** Actual arrival time. */
  arrivedAt?: Date;
  /** Service start time. */
  startedAt?: Date;
  /** Completion time. */
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
