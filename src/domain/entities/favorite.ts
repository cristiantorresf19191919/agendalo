/**
 * Rebook Last & Favorites.
 * Logged-in customers can save favorite businesses/professionals
 * and instantly rebook their previous service in 2 clicks.
 */

export interface Favorite {
  id: string;
  customerId: string;
  businessId: string;
  professionalId?: string;
  createdAt: Date;
}

/**
 * Snapshot of a completed booking for quick re-booking.
 */
export interface RebookSnapshot {
  id: string;
  customerId: string;
  businessId: string;
  businessName: string;
  professionalId: string;
  professionalName: string;
  professionalAvatarUrl?: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDurationMinutes: number;
  currency: string;
  lastBookedDate: string;     // "YYYY-MM-DD"
  lastBookedTime: string;     // "HH:mm"
  /** How many times this exact combo has been booked. */
  timesBooked: number;
  updatedAt: Date;
}
