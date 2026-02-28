/**
 * Recurring Appointments & Service Packages/Bundles.
 *
 * Customers can set up auto-repeating bookings (weekly haircut,
 * monthly facial). Businesses can create discounted bundles
 * (e.g., "5 sessions for the price of 4").
 *
 * DIFFERENTIATOR: Recurring bookings with automatic scheduling
 * reduce friction and increase customer lifetime value. Bundles
 * create upfront revenue and lock in customers.
 */

export type RecurrencePattern = 'weekly' | 'biweekly' | 'monthly' | 'custom';
export type RecurringBookingStatus = 'active' | 'paused' | 'cancelled' | 'expired';

export interface RecurringBooking {
  id: string;
  businessId: string;
  customerId: string;
  professionalId: string;
  serviceId: string;
  pattern: RecurrencePattern;
  /** Custom interval in days when pattern is 'custom'. */
  customIntervalDays?: number;
  /** Preferred day of week (0-6). */
  preferredDayOfWeek: number;
  /** Preferred time — "HH:mm". */
  preferredTime: string;
  /** Maximum occurrences (0 = indefinite). */
  maxOccurrences: number;
  /** Completed occurrences so far. */
  completedOccurrences: number;
  /** Next scheduled date — "YYYY-MM-DD". */
  nextDate: string;
  status: RecurringBookingStatus;
  /** Auto-book or send reminder for confirmation? */
  autoBook: boolean;
  /** Days before the appointment to send reminder/auto-book. */
  advanceNoticeDays: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceBundle {
  id: string;
  businessId: string;
  name: string;
  description: string;
  /** Services included in the bundle. */
  items: BundleItem[];
  /** Original total price (sum of individual prices). */
  originalPrice: number;
  /** Discounted bundle price. */
  bundlePrice: number;
  /** Savings amount. */
  savingsAmount: number;
  /** Savings percentage. */
  savingsPercent: number;
  currency: string;
  imageUrl?: string;
  /** Maximum purchases per customer (0 = unlimited). */
  maxPerCustomer: number;
  /** Total sold count. */
  totalSold: number;
  validFrom?: string;           // "YYYY-MM-DD"
  validUntil?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BundleItem {
  serviceId: string;
  serviceName: string;
  /** Number of sessions of this service in the bundle. */
  quantity: number;
  /** Individual price per session. */
  unitPrice: number;
}

export interface BundlePurchase {
  id: string;
  bundleId: string;
  businessId: string;
  customerId: string;
  /** Remaining sessions per service. */
  remainingSessions: Record<string, number>;  // serviceId → count
  totalSessionsUsed: number;
  totalSessions: number;
  amountPaid: number;
  currency: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
