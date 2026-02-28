/**
 * Multi-location Support & QR Check-in.
 *
 * Businesses with multiple branches can manage all locations
 * from a single dashboard. Each location has its own staff,
 * services, and schedule. QR codes enable contactless check-in.
 *
 * DIFFERENTIATOR: Multi-location management is typically an
 * enterprise feature ($100+/month). Including it at lower tiers
 * attracts growing businesses. QR check-in modernizes the
 * arrival experience.
 */

export interface BusinessLocation {
  id: string;
  businessId: string;
  name: string;                  // e.g., "Sede Norte", "Sucursal Centro"
  slug: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  /** GPS coordinates for map integration. */
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  /** Location-specific opening hours override. */
  openingHours?: Record<number, { open: string; close: string }>;
  /** Staff assigned to this location. */
  professionalIds: string[];
  /** Services available at this location. */
  serviceIds: string[];
  /** Cover image for this location. */
  coverImageUrl?: string;
  /** Whether this is the primary/headquarters location. */
  isPrimary: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CheckInStatus = 'checked_in' | 'completed' | 'no_show';

export interface QRCheckin {
  id: string;
  bookingId: string;
  businessId: string;
  locationId?: string;
  customerId: string;
  /** Unique QR code value. */
  qrCode: string;
  /** QR code image URL (pre-generated). */
  qrImageUrl?: string;
  status: CheckInStatus;
  checkedInAt?: Date;
  /** Device/method used for check-in. */
  checkinMethod: 'qr_scan' | 'manual' | 'auto_arrival';
  createdAt: Date;
}
