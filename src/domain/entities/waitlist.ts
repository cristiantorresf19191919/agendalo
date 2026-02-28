/**
 * Smart Waitlist entry.
 * When a day/time is fully booked, customers can join the waitlist.
 * If an appointment is cancelled, the system auto-notifies the first
 * person on the waitlist for that time window.
 */

export type WaitlistStatus = 'waiting' | 'notified' | 'booked' | 'expired';

export interface WaitlistEntry {
  id: string;
  businessId: string;
  customerId: string;
  serviceId: string;
  /** Preferred professional, or null for "any". */
  preferredProfessionalId: string | null;
  date: string;               // "YYYY-MM-DD"
  /** Preferred time window start — "HH:mm" */
  preferredTimeStart: string;
  /** Preferred time window end — "HH:mm" */
  preferredTimeEnd: string;
  status: WaitlistStatus;
  /** Position in the queue (1 = first). */
  position: number;
  notifiedAt?: Date;
  /** Deadline for the customer to confirm after notification. */
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
