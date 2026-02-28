import type { BusinessLocation, QRCheckin } from '@/domain/entities/business-location';

export interface CreateBusinessLocationInput {
  businessId: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  openingHours?: BusinessLocation['openingHours'];
  professionalIds?: string[];
  serviceIds?: string[];
  coverImageUrl?: string;
  isPrimary?: boolean;
}

export interface BusinessLocationRepository {
  getById(id: string): Promise<BusinessLocation | null>;
  getBySlug(businessId: string, slug: string): Promise<BusinessLocation | null>;
  listByBusiness(businessId: string): Promise<BusinessLocation[]>;
  create(input: CreateBusinessLocationInput): Promise<BusinessLocation>;
  update(id: string, data: Partial<BusinessLocation>): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface QRCheckinRepository {
  getById(id: string): Promise<QRCheckin | null>;
  getByBookingId(bookingId: string): Promise<QRCheckin | null>;
  getByQRCode(qrCode: string): Promise<QRCheckin | null>;
  create(data: Omit<QRCheckin, 'id' | 'createdAt'>): Promise<QRCheckin>;
  update(id: string, data: Partial<QRCheckin>): Promise<void>;
}
