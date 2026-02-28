/**
 * Links a specific service to a specific professional (staff member).
 * Enables assigning individual services to qualified staff,
 * tracking commission, and managing per-assignment working hours/breaks.
 */

export interface StaffAssignment {
  id: string;
  businessId: string;
  professionalId: string;
  serviceId: string;
  /** Commission percentage the professional earns for this service (0-100). */
  commissionPercent: number;
  /** Optional override duration (minutes) if this pro takes longer/shorter. */
  customDurationMinutes?: number;
  /** Optional override price for this specific pro + service combo. */
  customPrice?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tracks a professional's break within a working day.
 */
export interface StaffBreak {
  id: string;
  professionalId: string;
  businessId: string;
  dayOfWeek: number;          // 0=Sunday..6=Saturday
  startTime: string;          // "HH:mm"
  endTime: string;            // "HH:mm"
  label?: string;             // e.g. "Almuerzo"
}

/**
 * Commission ledger entry — one per completed booking.
 */
export interface CommissionEntry {
  id: string;
  businessId: string;
  professionalId: string;
  bookingId: string;
  serviceId: string;
  servicePrice: number;
  commissionPercent: number;
  commissionAmount: number;
  currency: string;
  paidOut: boolean;
  createdAt: Date;
}
