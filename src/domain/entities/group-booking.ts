/**
 * Group Bookings / Classes with Capacity Management.
 *
 * Businesses can create group events (workshops, classes, group
 * sessions) with capacity limits, waitlists, and group pricing.
 * Supports both recurring classes and one-time events.
 *
 * DIFFERENTIATOR: Most LATAM booking apps only support 1:1
 * appointments. Group booking support opens up fitness studios,
 * yoga classes, makeup workshops, and group spa packages.
 */

export type GroupEventStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type GroupEventRecurrence = 'none' | 'weekly' | 'biweekly' | 'monthly';

export interface GroupEvent {
  id: string;
  businessId: string;
  /** Professional(s) leading the event. */
  professionalIds: string[];
  name: string;
  description: string;
  category?: string;
  imageUrl?: string;
  /** Event date — "YYYY-MM-DD". */
  date: string;
  /** Start time — "HH:mm". */
  startTime: string;
  /** End time — "HH:mm". */
  endTime: string;
  /** Duration in minutes. */
  durationMinutes: number;
  /** Maximum participants. */
  maxCapacity: number;
  /** Minimum participants to run the event. */
  minCapacity: number;
  /** Current confirmed participants. */
  confirmedCount: number;
  /** Waitlist count. */
  waitlistCount: number;
  /** Price per participant. */
  pricePerPerson: number;
  /** Group discount: price when N+ people book together. */
  groupDiscountMinSize?: number;
  groupDiscountPercent?: number;
  currency: string;
  /** Location (room name, address, or "online"). */
  location?: string;
  /** Online meeting URL (for virtual events). */
  meetingUrl?: string;
  /** Recurrence pattern. */
  recurrence: GroupEventRecurrence;
  status: GroupEventStatus;
  /** Items to bring / requirements. */
  requirements?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type GroupBookingStatus = 'confirmed' | 'waitlisted' | 'cancelled' | 'attended' | 'no_show';

export interface GroupBooking {
  id: string;
  groupEventId: string;
  businessId: string;
  customerId: string;
  /** Number of spots booked (1 person can book for multiple). */
  partySize: number;
  status: GroupBookingStatus;
  amountPaid: number;
  currency: string;
  /** Position on waitlist (null if confirmed). */
  waitlistPosition?: number;
  notes?: string;
  checkedInAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
