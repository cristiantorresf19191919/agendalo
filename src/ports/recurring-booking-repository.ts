import type { RecurringBooking, ServiceBundle, BundlePurchase } from '@/domain/entities/recurring-booking';

export interface CreateRecurringBookingInput {
  businessId: string;
  customerId: string;
  professionalId: string;
  serviceId: string;
  pattern: RecurringBooking['pattern'];
  customIntervalDays?: number;
  preferredDayOfWeek: number;
  preferredTime: string;
  maxOccurrences: number;
  autoBook: boolean;
  advanceNoticeDays: number;
}

export interface RecurringBookingRepository {
  getById(id: string): Promise<RecurringBooking | null>;
  listByCustomer(customerId: string, businessId: string): Promise<RecurringBooking[]>;
  listByBusiness(businessId: string): Promise<RecurringBooking[]>;
  listDueForScheduling(date: string): Promise<RecurringBooking[]>;
  create(input: CreateRecurringBookingInput): Promise<RecurringBooking>;
  update(id: string, data: Partial<RecurringBooking>): Promise<void>;
}

export interface CreateServiceBundleInput {
  businessId: string;
  name: string;
  description: string;
  items: ServiceBundle['items'];
  originalPrice: number;
  bundlePrice: number;
  savingsAmount: number;
  savingsPercent: number;
  currency: string;
  imageUrl?: string;
  maxPerCustomer: number;
  validFrom?: string;
  validUntil?: string;
}

export interface ServiceBundleRepository {
  getById(id: string): Promise<ServiceBundle | null>;
  listByBusiness(businessId: string): Promise<ServiceBundle[]>;
  create(input: CreateServiceBundleInput): Promise<ServiceBundle>;
  update(id: string, data: Partial<ServiceBundle>): Promise<void>;
}

export interface BundlePurchaseRepository {
  getById(id: string): Promise<BundlePurchase | null>;
  listByCustomer(customerId: string, businessId: string): Promise<BundlePurchase[]>;
  create(data: Omit<BundlePurchase, 'id' | 'createdAt' | 'updatedAt'>): Promise<BundlePurchase>;
  update(id: string, data: Partial<BundlePurchase>): Promise<void>;
}
