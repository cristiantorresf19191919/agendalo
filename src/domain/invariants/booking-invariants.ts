import { Booking } from '../entities/booking';
import { doTimeSlotsOverlap } from '../value-objects/time-slot';

export class BookingInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BookingInvariantError';
  }
}

export function assertNoOverlappingBookings(
  newBooking: Pick<Booking, 'date' | 'startTime' | 'endTime'>,
  existingBookings: Pick<Booking, 'date' | 'startTime' | 'endTime'>[]
): void {
  const overlapping = existingBookings.find(
    (existing) =>
      existing.date === newBooking.date &&
      doTimeSlotsOverlap(
        { start: newBooking.startTime, end: newBooking.endTime },
        { start: existing.startTime, end: existing.endTime }
      )
  );

  if (overlapping) {
    throw new BookingInvariantError(
      `Booking overlaps with existing booking from ${overlapping.startTime} to ${overlapping.endTime}`
    );
  }
}

export function assertBookingInFuture(
  date: string,
  startTime: string,
  now: Date
): void {
  const bookingDate = new Date(`${date}T${startTime}:00`);
  if (bookingDate <= now) {
    throw new BookingInvariantError('Cannot book in the past');
  }
}

export function assertLeadTimeRespected(
  date: string,
  startTime: string,
  leadTimeMinutes: number,
  now: Date
): void {
  const bookingDate = new Date(`${date}T${startTime}:00`);
  const minBookingTime = new Date(now.getTime() + leadTimeMinutes * 60 * 1000);
  if (bookingDate < minBookingTime) {
    throw new BookingInvariantError(
      `Booking must be at least ${leadTimeMinutes} minutes in advance`
    );
  }
}
