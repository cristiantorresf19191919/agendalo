import { describe, it, expect } from 'vitest';
import {
  computeAvailableSlots,
  SlotEngineInput,
  DEFAULT_SLOT_CONFIG,
} from '@/domain/services/slot-engine';
import { WeeklySchedule, ScheduleException } from '@/domain/entities/professional';

// Helper: 2025-01-20 is a Monday (day 1)
const MONDAY = '2025-01-20';
// Helper: 2025-01-21 is a Tuesday (day 2)
const TUESDAY = '2025-01-21';
// Helper: 2025-01-19 is a Sunday (day 0)
const SUNDAY = '2025-01-19';

// A "now" that is the day before (no same-day lead time filtering)
const NOW_DAY_BEFORE = new Date('2025-01-19T08:00:00');

// A "now" that is same day, early morning
const NOW_SAME_DAY_EARLY = new Date('2025-01-20T07:00:00');

function makeInput(overrides: Partial<SlotEngineInput>): SlotEngineInput {
  return {
    date: MONDAY,
    serviceDurationMinutes: 30,
    weeklySchedule: {},
    exceptions: [],
    existingBookings: [],
    blockedRanges: [],
    now: NOW_DAY_BEFORE,
    ...overrides,
  };
}

describe('computeAvailableSlots', () => {
  // ─── Basic generation ──────────────────────────────────────────────

  describe('basic generation', () => {
    it('generates slots every 15min (default step) for a Mon 09:00-17:00 schedule with 30min service', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [{ start: '09:00', end: '17:00' }],
        },
        serviceDurationMinutes: 30,
      });

      const slots = computeAvailableSlots(input);

      // Window is 480 minutes (09:00-17:00). Last slot starts at 16:30 (end 17:00).
      // From 09:00 stepping by 15: 09:00,09:15,...,16:30 = (16:30-09:00)/15 + 1 = 450/15 + 1 = 31
      expect(slots.length).toBe(31);
      expect(slots[0]).toEqual({ start: '09:00', end: '09:30' });
      expect(slots[1]).toEqual({ start: '09:15', end: '09:45' });
      expect(slots[slots.length - 1]).toEqual({ start: '16:30', end: '17:00' });
    });

    it('returns empty array for an empty schedule', () => {
      const input = makeInput({
        weeklySchedule: {},
      });

      const slots = computeAvailableSlots(input);
      expect(slots).toEqual([]);
    });

    it('returns empty array when the date has no schedule entry', () => {
      // Monday (day 1) with only a Tuesday (day 2) schedule
      const input = makeInput({
        date: MONDAY,
        weeklySchedule: {
          2: [{ start: '09:00', end: '17:00' }],
        },
      });

      const slots = computeAvailableSlots(input);
      expect(slots).toEqual([]);
    });
  });

  // ─── Working windows ──────────────────────────────────────────────

  describe('working windows', () => {
    it('uses the weekly schedule for the correct day of week', () => {
      const input = makeInput({
        date: TUESDAY, // day 2
        weeklySchedule: {
          2: [{ start: '10:00', end: '11:00' }],
        },
        serviceDurationMinutes: 30,
        now: new Date('2025-01-20T08:00:00'), // day before
      });

      const slots = computeAvailableSlots(input);
      // 10:00-11:00, 30min service, 15min step -> 10:00,10:15,10:30 = 3 slots
      expect(slots.length).toBe(3);
      expect(slots[0]).toEqual({ start: '10:00', end: '10:30' });
      expect(slots[2]).toEqual({ start: '10:30', end: '11:00' });
    });

    it('returns empty when an exception marks the day as unavailable', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [{ start: '09:00', end: '17:00' }],
        },
        exceptions: [
          { date: MONDAY, available: false },
        ],
      });

      const slots = computeAvailableSlots(input);
      expect(slots).toEqual([]);
    });

    it('uses exception windows instead of weekly schedule when exception provides custom windows', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [{ start: '09:00', end: '17:00' }],
        },
        exceptions: [
          {
            date: MONDAY,
            available: true,
            windows: [{ start: '10:00', end: '12:00' }],
          },
        ],
        serviceDurationMinutes: 30,
      });

      const slots = computeAvailableSlots(input);

      // Exception window 10:00-12:00, 30min service, 15min step
      // 10:00,10:15,10:30,10:45,11:00,11:15,11:30 = 7 slots
      expect(slots.length).toBe(7);
      expect(slots[0]).toEqual({ start: '10:00', end: '10:30' });
      expect(slots[slots.length - 1]).toEqual({ start: '11:30', end: '12:00' });
    });
  });

  // ─── Booking conflicts ─────────────────────────────────────────────

  describe('booking conflicts', () => {
    it('filters out slots that overlap with an existing booking', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [{ start: '09:00', end: '11:00' }],
        },
        serviceDurationMinutes: 30,
        existingBookings: [
          { date: MONDAY, startTime: '09:30', endTime: '10:00' },
        ],
        config: { bufferMinutes: 0 },
      });

      const slots = computeAvailableSlots(input);

      // Without buffer, booking 09:30-10:00 blocks any slot whose range overlaps [09:30, 10:00)
      // Slot 09:00-09:30: end 09:30 > start 09:30? No (09:30 is not > 09:30) => NOT blocked
      // Slot 09:15-09:45: 09:15 < 10:00 && 09:45 > 09:30 => blocked
      // Slot 09:30-10:00: 09:30 < 10:00 && 10:00 > 09:30 => blocked
      // Slot 09:45-10:15: 09:45 < 10:00 && 10:15 > 09:30 => blocked
      // Slot 10:00-10:30: 10:00 < 10:00? No => NOT blocked
      // Slot 10:15-10:45: NOT blocked
      // Slot 10:30-11:00: NOT blocked
      const startTimes = slots.map((s) => s.start);
      expect(startTimes).toContain('09:00');
      expect(startTimes).not.toContain('09:15');
      expect(startTimes).not.toContain('09:30');
      expect(startTimes).not.toContain('09:45');
      expect(startTimes).toContain('10:00');
      expect(startTimes).toContain('10:15');
      expect(startTimes).toContain('10:30');
    });

    it('applies buffer time around bookings, filtering additional slots', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [{ start: '09:00', end: '12:00' }],
        },
        serviceDurationMinutes: 30,
        existingBookings: [
          { date: MONDAY, startTime: '10:00', endTime: '10:30' },
        ],
        config: { bufferMinutes: 15 },
      });

      const slots = computeAvailableSlots(input);

      // Booking 10:00-10:30 with 15min buffer becomes effective block [09:45, 10:45)
      // Slot blocked if: slotStart < 10:45 && slotEnd > 09:45
      // 09:00-09:30: 09:00 < 10:45 && 09:30 > 09:45? No => OK
      // 09:15-09:45: 09:15 < 10:45 && 09:45 > 09:45? No => OK
      // 09:30-10:00: 09:30 < 10:45 && 10:00 > 09:45? Yes => BLOCKED
      // 09:45-10:15: blocked
      // 10:00-10:30: blocked
      // 10:15-10:45: blocked
      // 10:30-11:00: 10:30 < 10:45 && 11:00 > 09:45 => blocked
      // 10:45-11:15: 10:45 < 10:45? No => OK
      const startTimes = slots.map((s) => s.start);
      expect(startTimes).toContain('09:00');
      expect(startTimes).toContain('09:15');
      expect(startTimes).not.toContain('09:30');
      expect(startTimes).not.toContain('09:45');
      expect(startTimes).not.toContain('10:00');
      expect(startTimes).not.toContain('10:15');
      expect(startTimes).not.toContain('10:30');
      expect(startTimes).toContain('10:45');
      expect(startTimes).toContain('11:00');
    });

    it('handles multiple bookings in the same day', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [{ start: '09:00', end: '12:00' }],
        },
        serviceDurationMinutes: 30,
        existingBookings: [
          { date: MONDAY, startTime: '09:30', endTime: '10:00' },
          { date: MONDAY, startTime: '11:00', endTime: '11:30' },
        ],
        config: { bufferMinutes: 0 },
      });

      const slots = computeAvailableSlots(input);
      const startTimes = slots.map((s) => s.start);

      // First booking blocks 09:15, 09:30, 09:45
      expect(startTimes).not.toContain('09:15');
      expect(startTimes).not.toContain('09:30');
      expect(startTimes).not.toContain('09:45');

      // Second booking blocks 10:45, 11:00, 11:15
      expect(startTimes).not.toContain('10:45');
      expect(startTimes).not.toContain('11:00');
      expect(startTimes).not.toContain('11:15');

      // Slots between the two bookings should be available
      expect(startTimes).toContain('10:00');
      expect(startTimes).toContain('10:15');
      expect(startTimes).toContain('10:30');
    });

    it('ignores bookings on different dates', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [{ start: '09:00', end: '10:00' }],
        },
        serviceDurationMinutes: 30,
        existingBookings: [
          { date: TUESDAY, startTime: '09:00', endTime: '09:30' },
        ],
        config: { bufferMinutes: 0 },
      });

      const slots = computeAvailableSlots(input);
      // All 3 slots should be present since the booking is on a different date
      expect(slots.length).toBe(3);
    });
  });

  // ─── Blocked ranges ────────────────────────────────────────────────

  describe('blocked ranges', () => {
    it('prevents slot generation within a blocked range', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [{ start: '09:00', end: '12:00' }],
        },
        serviceDurationMinutes: 30,
        blockedRanges: [
          { date: MONDAY, startTime: '10:00', endTime: '11:00' },
        ],
      });

      const slots = computeAvailableSlots(input);
      const startTimes = slots.map((s) => s.start);

      // Blocked range 10:00-11:00 filters via doTimeSlotsOverlap (strict <)
      // 09:30-10:00: overlap? 09:30<11:00 && 10:00>10:00? No => OK
      // 09:45-10:15: 09:45<11:00 && 10:15>10:00? Yes => BLOCKED
      // 10:00-10:30: blocked
      // 10:30-11:00: 10:30<11:00 && 11:00>10:00? Yes => BLOCKED
      // 10:45-11:15: blocked
      // 11:00-11:30: 11:00<11:00? No => OK
      expect(startTimes).toContain('09:00');
      expect(startTimes).toContain('09:15');
      expect(startTimes).toContain('09:30');
      expect(startTimes).not.toContain('09:45');
      expect(startTimes).not.toContain('10:00');
      expect(startTimes).not.toContain('10:30');
      expect(startTimes).not.toContain('10:45');
      expect(startTimes).toContain('11:00');
      expect(startTimes).toContain('11:15');
    });

    it('handles multiple blocked ranges', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [{ start: '09:00', end: '14:00' }],
        },
        serviceDurationMinutes: 30,
        blockedRanges: [
          { date: MONDAY, startTime: '09:30', endTime: '10:00' },
          { date: MONDAY, startTime: '12:00', endTime: '13:00' },
        ],
      });

      const slots = computeAvailableSlots(input);
      const startTimes = slots.map((s) => s.start);

      // First block 09:30-10:00 blocks overlapping slots
      expect(startTimes).not.toContain('09:15');
      expect(startTimes).not.toContain('09:30');
      expect(startTimes).not.toContain('09:45');

      // Second block 12:00-13:00 blocks overlapping slots
      expect(startTimes).not.toContain('11:45');
      expect(startTimes).not.toContain('12:00');
      expect(startTimes).not.toContain('12:30');
      expect(startTimes).not.toContain('12:45');

      // Slots outside blocked ranges should be present
      expect(startTimes).toContain('09:00');
      expect(startTimes).toContain('10:00');
      expect(startTimes).toContain('11:00');
      expect(startTimes).toContain('13:00');
    });
  });

  // ─── Lead time ─────────────────────────────────────────────────────

  describe('lead time', () => {
    it('filters slots before leadTime cutoff when now is same day', () => {
      // now is 2025-01-20T09:00:00 with default 60min lead time
      // Cutoff = 9*60 + 0 + 60 = 600 minutes = 10:00
      const input = makeInput({
        date: MONDAY,
        weeklySchedule: {
          1: [{ start: '09:00', end: '12:00' }],
        },
        serviceDurationMinutes: 30,
        now: new Date('2025-01-20T09:00:00'),
        config: { leadTimeMinutes: 60, bufferMinutes: 0 },
      });

      const slots = computeAvailableSlots(input);
      const startTimes = slots.map((s) => s.start);

      // All slots before 10:00 should be filtered
      expect(startTimes).not.toContain('09:00');
      expect(startTimes).not.toContain('09:15');
      expect(startTimes).not.toContain('09:30');
      expect(startTimes).not.toContain('09:45');
      // 10:00 and after should be available
      expect(startTimes).toContain('10:00');
      expect(startTimes).toContain('10:15');
      expect(startTimes).toContain('11:30');
    });

    it('does not filter any slots when now is the day before', () => {
      const input = makeInput({
        date: MONDAY,
        weeklySchedule: {
          1: [{ start: '09:00', end: '10:00' }],
        },
        serviceDurationMinutes: 30,
        now: NOW_DAY_BEFORE, // Jan 19
        config: { leadTimeMinutes: 60, bufferMinutes: 0 },
      });

      const slots = computeAvailableSlots(input);
      // All 3 slots should be available (no same-day cutoff)
      expect(slots.length).toBe(3);
      expect(slots[0].start).toBe('09:00');
    });

    it('with 60min lead time, removes slots less than 60min from now', () => {
      // now is 10:30, lead time 60 => cutoff at 11:30 (690 minutes)
      const input = makeInput({
        date: MONDAY,
        weeklySchedule: {
          1: [{ start: '10:00', end: '13:00' }],
        },
        serviceDurationMinutes: 30,
        now: new Date('2025-01-20T10:30:00'),
        config: { leadTimeMinutes: 60, bufferMinutes: 0 },
      });

      const slots = computeAvailableSlots(input);
      const startTimes = slots.map((s) => s.start);

      // Cutoff at 11:30 (630 + 60 = 690 minutes)
      expect(startTimes).not.toContain('10:00');
      expect(startTimes).not.toContain('10:30');
      expect(startTimes).not.toContain('11:00');
      expect(startTimes).not.toContain('11:15');
      // 11:30 => 690 which is NOT < 690, so it passes
      expect(startTimes).toContain('11:30');
      expect(startTimes).toContain('11:45');
      expect(startTimes).toContain('12:30');
    });
  });

  // ─── Edge cases ────────────────────────────────────────────────────

  describe('edge cases', () => {
    it('returns no slots when service is longer than the window', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [{ start: '09:00', end: '09:45' }],
        },
        serviceDurationMinutes: 60,
      });

      const slots = computeAvailableSlots(input);
      expect(slots).toEqual([]);
    });

    it('works when step size is larger than duration', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [{ start: '09:00', end: '11:00' }],
        },
        serviceDurationMinutes: 30,
        config: { stepMinutes: 60 },
      });

      const slots = computeAvailableSlots(input);
      // Step 60: 09:00, 10:00 (10:00+30=10:30 <= 11:00 ok), next 11:00+30>11:00? 11:30>11:00 no wait
      // 11:00: 11:00+30=11:30 > 11:00? No, 11:30 > 11:00 => not <= => excluded
      // Wait: condition is start + duration <= windowEnd. 660+30=690, 690<=660? No => excluded
      expect(slots.length).toBe(2);
      expect(slots[0]).toEqual({ start: '09:00', end: '09:30' });
      expect(slots[1]).toEqual({ start: '10:00', end: '10:30' });
    });

    it('generates exactly 1 slot for a 15min window with 15min service', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [{ start: '09:00', end: '09:15' }],
        },
        serviceDurationMinutes: 15,
      });

      const slots = computeAvailableSlots(input);
      expect(slots.length).toBe(1);
      expect(slots[0]).toEqual({ start: '09:00', end: '09:15' });
    });

    it('handles multiple working windows in the same day (split schedule)', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '18:00' },
          ],
        },
        serviceDurationMinutes: 30,
      });

      const slots = computeAvailableSlots(input);
      const startTimes = slots.map((s) => s.start);

      // Morning: 09:00..11:30 with step 15 = 11 slots
      expect(startTimes).toContain('09:00');
      expect(startTimes).toContain('11:30');
      // Lunch gap: no slots between 12:00 and 14:00
      expect(startTimes).not.toContain('12:00');
      expect(startTimes).not.toContain('13:00');
      // Afternoon: 14:00..17:30 with step 15 = 15 slots
      expect(startTimes).toContain('14:00');
      expect(startTimes).toContain('17:30');

      // Morning window: (11:30-09:00)/15 + 1 = 150/15 + 1 = 11
      // Afternoon window: (17:30-14:00)/15 + 1 = 210/15 + 1 = 15
      expect(slots.length).toBe(11 + 15);
    });

    it('includes a slot that ends exactly at the window end', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [{ start: '16:00', end: '17:00' }],
        },
        serviceDurationMinutes: 30,
      });

      const slots = computeAvailableSlots(input);
      // Last slot: 16:30-17:00 (16:30 + 30 = 17:00 <= 17:00, included)
      const lastSlot = slots[slots.length - 1];
      expect(lastSlot).toEqual({ start: '16:30', end: '17:00' });
    });

    it('excludes a slot that would go past the window end', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [{ start: '16:00', end: '16:40' }],
        },
        serviceDurationMinutes: 30,
      });

      const slots = computeAvailableSlots(input);
      // 16:00-16:30: 16:00+30=16:30 <= 16:40 => included
      // 16:15-16:45: 16:15+30=16:45 <= 16:40? No => excluded
      expect(slots.length).toBe(1);
      expect(slots[0]).toEqual({ start: '16:00', end: '16:30' });
    });
  });

  // ─── Config overrides ──────────────────────────────────────────────

  describe('config overrides', () => {
    it('uses custom step, buffer, and lead time from config', () => {
      // Custom config: step 30, buffer 0, lead time 0
      const input = makeInput({
        date: MONDAY,
        weeklySchedule: {
          1: [{ start: '09:00', end: '11:00' }],
        },
        serviceDurationMinutes: 30,
        now: new Date('2025-01-20T08:00:00'),
        config: {
          stepMinutes: 30,
          bufferMinutes: 0,
          leadTimeMinutes: 0,
        },
      });

      const slots = computeAvailableSlots(input);
      // Step 30: 09:00, 09:30, 10:00, 10:30 (10:30+30=11:00 <= 11:00)
      expect(slots.length).toBe(4);
      expect(slots.map((s) => s.start)).toEqual(['09:00', '09:30', '10:00', '10:30']);
    });

    it('merges partial config with defaults', () => {
      const input = makeInput({
        weeklySchedule: {
          1: [{ start: '09:00', end: '10:00' }],
        },
        serviceDurationMinutes: 30,
        config: { stepMinutes: 30 },
        // bufferMinutes and leadTimeMinutes should use defaults (10, 60)
      });

      const slots = computeAvailableSlots(input);
      // Step 30: 09:00, 09:30 => 2 slots
      expect(slots.length).toBe(2);
    });
  });

  // ─── DEFAULT_SLOT_CONFIG ───────────────────────────────────────────

  describe('DEFAULT_SLOT_CONFIG', () => {
    it('has correct default values', () => {
      expect(DEFAULT_SLOT_CONFIG).toEqual({
        stepMinutes: 15,
        bufferMinutes: 10,
        leadTimeMinutes: 60,
      });
    });
  });
});
