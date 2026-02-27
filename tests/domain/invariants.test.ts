import { describe, it, expect } from 'vitest';
import {
  assertNoOverlappingBookings,
  assertBookingInFuture,
  assertLeadTimeRespected,
  BookingInvariantError,
} from '@/domain/invariants/booking-invariants';
import {
  assertProfessionalLimit,
  BusinessInvariantError,
} from '@/domain/invariants/business-invariants';

describe('assertNoOverlappingBookings', () => {
  it('does not throw when there are no overlapping bookings', () => {
    const newBooking = { date: '2025-01-20', startTime: '10:00', endTime: '10:30' };
    const existing = [
      { date: '2025-01-20', startTime: '09:00', endTime: '09:30' },
      { date: '2025-01-20', startTime: '11:00', endTime: '11:30' },
    ];

    expect(() => assertNoOverlappingBookings(newBooking, existing)).not.toThrow();
  });

  it('does not throw when bookings are on different dates', () => {
    const newBooking = { date: '2025-01-20', startTime: '10:00', endTime: '10:30' };
    const existing = [
      { date: '2025-01-21', startTime: '10:00', endTime: '10:30' },
    ];

    expect(() => assertNoOverlappingBookings(newBooking, existing)).not.toThrow();
  });

  it('does not throw when bookings are adjacent (end touches start)', () => {
    const newBooking = { date: '2025-01-20', startTime: '10:00', endTime: '10:30' };
    const existing = [
      { date: '2025-01-20', startTime: '10:30', endTime: '11:00' },
    ];

    // doTimeSlotsOverlap uses strict < so adjacent slots do not overlap
    expect(() => assertNoOverlappingBookings(newBooking, existing)).not.toThrow();
  });

  it('throws BookingInvariantError when bookings overlap', () => {
    const newBooking = { date: '2025-01-20', startTime: '10:00', endTime: '10:30' };
    const existing = [
      { date: '2025-01-20', startTime: '10:15', endTime: '10:45' },
    ];

    expect(() => assertNoOverlappingBookings(newBooking, existing)).toThrow(
      BookingInvariantError
    );
  });

  it('throws when new booking is fully contained within an existing one', () => {
    const newBooking = { date: '2025-01-20', startTime: '10:15', endTime: '10:45' };
    const existing = [
      { date: '2025-01-20', startTime: '10:00', endTime: '11:00' },
    ];

    expect(() => assertNoOverlappingBookings(newBooking, existing)).toThrow(
      BookingInvariantError
    );
  });

  it('throws with a descriptive message including the overlapping booking times', () => {
    const newBooking = { date: '2025-01-20', startTime: '10:00', endTime: '10:30' };
    const existing = [
      { date: '2025-01-20', startTime: '10:15', endTime: '10:45' },
    ];

    expect(() => assertNoOverlappingBookings(newBooking, existing)).toThrow(
      'Booking overlaps with existing booking from 10:15 to 10:45'
    );
  });

  it('does not throw when existing bookings array is empty', () => {
    const newBooking = { date: '2025-01-20', startTime: '10:00', endTime: '10:30' };

    expect(() => assertNoOverlappingBookings(newBooking, [])).not.toThrow();
  });
});

describe('assertBookingInFuture', () => {
  it('does not throw when booking is in the future', () => {
    const now = new Date('2025-01-20T09:00:00');

    expect(() => assertBookingInFuture('2025-01-20', '10:00', now)).not.toThrow();
  });

  it('throws BookingInvariantError when booking is in the past', () => {
    const now = new Date('2025-01-20T11:00:00');

    expect(() => assertBookingInFuture('2025-01-20', '10:00', now)).toThrow(
      BookingInvariantError
    );
  });

  it('throws when booking time is exactly now (not strictly future)', () => {
    // bookingDate <= now, so exact match throws
    const now = new Date('2025-01-20T10:00:00');

    expect(() => assertBookingInFuture('2025-01-20', '10:00', now)).toThrow(
      'Cannot book in the past'
    );
  });

  it('does not throw when booking is on a future date', () => {
    const now = new Date('2025-01-19T23:59:00');

    expect(() => assertBookingInFuture('2025-01-20', '08:00', now)).not.toThrow();
  });

  it('throws when booking date is in the past', () => {
    const now = new Date('2025-01-21T08:00:00');

    expect(() => assertBookingInFuture('2025-01-20', '10:00', now)).toThrow(
      BookingInvariantError
    );
  });
});

describe('assertLeadTimeRespected', () => {
  it('does not throw when booking respects lead time', () => {
    const now = new Date('2025-01-20T09:00:00');

    // 120 min lead time, booking at 12:00 => 3 hours from now => OK
    expect(() => assertLeadTimeRespected('2025-01-20', '12:00', 120, now)).not.toThrow();
  });

  it('throws BookingInvariantError when booking is within lead time', () => {
    const now = new Date('2025-01-20T09:00:00');

    // 120 min lead time, booking at 10:00 => only 60 min from now => FAIL
    expect(() => assertLeadTimeRespected('2025-01-20', '10:00', 120, now)).toThrow(
      BookingInvariantError
    );
  });

  it('throws with a descriptive message including the lead time', () => {
    const now = new Date('2025-01-20T09:00:00');

    expect(() => assertLeadTimeRespected('2025-01-20', '09:30', 60, now)).toThrow(
      'Booking must be at least 60 minutes in advance'
    );
  });

  it('does not throw when booking is exactly at the lead time boundary', () => {
    const now = new Date('2025-01-20T09:00:00');

    // 60 min lead time, booking at 10:00 => exactly 60 min from now
    // minBookingTime = 09:00 + 60min = 10:00
    // bookingDate = 10:00
    // bookingDate < minBookingTime? 10:00 < 10:00? No => does NOT throw
    expect(() => assertLeadTimeRespected('2025-01-20', '10:00', 60, now)).not.toThrow();
  });

  it('throws when booking is 1 minute before the lead time boundary', () => {
    const now = new Date('2025-01-20T09:00:00');

    // 60 min lead time, booking at 09:59
    // minBookingTime = 10:00
    // bookingDate = 09:59 < 10:00 => throws
    expect(() => assertLeadTimeRespected('2025-01-20', '09:59', 60, now)).toThrow(
      BookingInvariantError
    );
  });
});

describe('assertProfessionalLimit', () => {
  it('does not throw when under the limit for individual plan', () => {
    // individual plan allows 1, current is 0
    expect(() => assertProfessionalLimit('individual', 0)).not.toThrow();
  });

  it('throws BusinessInvariantError when at the limit for individual plan', () => {
    // individual plan allows 1, current is 1
    expect(() => assertProfessionalLimit('individual', 1)).toThrow(
      BusinessInvariantError
    );
  });

  it('does not throw when under the limit for duo plan', () => {
    expect(() => assertProfessionalLimit('duo', 0)).not.toThrow();
    expect(() => assertProfessionalLimit('duo', 1)).not.toThrow();
  });

  it('throws BusinessInvariantError when at the limit for duo plan', () => {
    expect(() => assertProfessionalLimit('duo', 2)).toThrow(
      BusinessInvariantError
    );
  });

  it('never throws for unlimited plan', () => {
    expect(() => assertProfessionalLimit('unlimited', 0)).not.toThrow();
    expect(() => assertProfessionalLimit('unlimited', 100)).not.toThrow();
    expect(() => assertProfessionalLimit('unlimited', 999999)).not.toThrow();
  });

  it('includes the plan name and limit in the error message for individual', () => {
    expect(() => assertProfessionalLimit('individual', 1)).toThrow(
      'Plan "individual" allows a maximum of 1 professional(s). Current count: 1'
    );
  });

  it('includes the plan name and limit in the error message for duo', () => {
    expect(() => assertProfessionalLimit('duo', 2)).toThrow(
      'Plan "duo" allows a maximum of 2 professional(s). Current count: 2'
    );
  });
});
