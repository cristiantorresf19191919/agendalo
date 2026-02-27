import { describe, it, expect } from 'vitest';
import {
  filterBusinessesByAvailability,
  BusinessAvailabilityData,
} from '@/domain/services/discovery-engine';
import { Business } from '@/domain/entities/business';
import { Professional } from '@/domain/entities/professional';
import { Service } from '@/domain/entities/service';

// 2025-01-20 is a Monday (day 1)
const MONDAY = '2025-01-20';
const NOW_DAY_BEFORE = new Date('2025-01-19T08:00:00');

function makeBusiness(overrides: Partial<Business> = {}): Business {
  return {
    id: 'biz-1',
    name: 'Test Business',
    slug: 'test-business',
    ownerId: 'owner-1',
    plan: 'individual',
    maxProfessionals: 1,
    currency: 'COP',
    timezone: 'America/Bogota',
    address: 'Calle 85 #15-30, Chapinero',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makeProfessional(overrides: Partial<Professional> = {}): Professional {
  return {
    id: 'prof-1',
    businessId: 'biz-1',
    name: 'Juan',
    email: 'juan@test.com',
    specialties: ['haircut'],
    weeklySchedule: {
      1: [{ start: '09:00', end: '17:00' }],
    },
    exceptions: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makeService(overrides: Partial<Service> = {}): Service {
  return {
    id: 'svc-1',
    businessId: 'biz-1',
    name: 'Corte',
    description: 'Basic cut',
    durationMinutes: 30,
    price: 25000,
    currency: 'COP',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makeEntry(overrides: Partial<BusinessAvailabilityData> = {}): BusinessAvailabilityData {
  return {
    business: makeBusiness(),
    professionals: [makeProfessional()],
    services: [makeService()],
    bookingsByProfessional: {},
    blockedRangesByProfessional: {},
    ...overrides,
  };
}

describe('filterBusinessesByAvailability', () => {
  it('returns businesses that have available slots on the given date', () => {
    const entry = makeEntry();
    const results = filterBusinessesByAvailability(
      [entry],
      { date: MONDAY },
      NOW_DAY_BEFORE,
    );

    expect(results).toHaveLength(1);
    expect(results[0].business.id).toBe('biz-1');
    expect(results[0].matchingSlots).toHaveLength(1);
    expect(results[0].matchingSlots[0].slots.length).toBeGreaterThan(0);
  });

  it('filters out businesses with no active professionals', () => {
    const entry = makeEntry({
      professionals: [makeProfessional({ isActive: false })],
    });
    const results = filterBusinessesByAvailability(
      [entry],
      { date: MONDAY },
      NOW_DAY_BEFORE,
    );

    expect(results).toHaveLength(0);
  });

  it('filters out businesses with no active services', () => {
    const entry = makeEntry({
      services: [makeService({ isActive: false })],
    });
    const results = filterBusinessesByAvailability(
      [entry],
      { date: MONDAY },
      NOW_DAY_BEFORE,
    );

    expect(results).toHaveLength(0);
  });

  it('filters out businesses when professional has no schedule for the date', () => {
    const entry = makeEntry({
      professionals: [makeProfessional({
        weeklySchedule: {
          // Only works on Tuesday (day 2), not Monday (day 1)
          2: [{ start: '09:00', end: '17:00' }],
        },
      })],
    });
    const results = filterBusinessesByAvailability(
      [entry],
      { date: MONDAY },
      NOW_DAY_BEFORE,
    );

    expect(results).toHaveLength(0);
  });

  it('filters by specific time — returns only slots containing the requested time', () => {
    const entry = makeEntry();
    const results = filterBusinessesByAvailability(
      [entry],
      { date: MONDAY, time: '10:00' },
      NOW_DAY_BEFORE,
    );

    expect(results).toHaveLength(1);
    // All returned slots should contain 10:00 (start <= 10:00 && end > 10:00)
    for (const match of results[0].matchingSlots) {
      for (const slot of match.slots) {
        expect(slot.start <= '10:00').toBe(true);
        expect(slot.end > '10:00').toBe(true);
      }
    }
  });

  it('returns empty when time filter has no matching slots', () => {
    // Professional works 09:00-10:00, request at 16:00
    const entry = makeEntry({
      professionals: [makeProfessional({
        weeklySchedule: {
          1: [{ start: '09:00', end: '10:00' }],
        },
      })],
    });
    const results = filterBusinessesByAvailability(
      [entry],
      { date: MONDAY, time: '16:00' },
      NOW_DAY_BEFORE,
    );

    expect(results).toHaveLength(0);
  });

  it('sorts results by total number of available slots (most first)', () => {
    const busyEntry = makeEntry({
      business: makeBusiness({ id: 'busy-biz', name: 'Busy Business' }),
      professionals: [makeProfessional({
        id: 'busy-prof',
        weeklySchedule: {
          1: [{ start: '09:00', end: '10:00' }], // only 1 hour
        },
      })],
    });
    const freeEntry = makeEntry({
      business: makeBusiness({ id: 'free-biz', name: 'Free Business' }),
      professionals: [makeProfessional({
        id: 'free-prof',
        weeklySchedule: {
          1: [{ start: '09:00', end: '17:00' }], // full day
        },
      })],
    });

    const results = filterBusinessesByAvailability(
      [busyEntry, freeEntry],
      { date: MONDAY },
      NOW_DAY_BEFORE,
    );

    expect(results).toHaveLength(2);
    expect(results[0].business.id).toBe('free-biz');
    expect(results[1].business.id).toBe('busy-biz');
    expect(results[0].totalSlots).toBeGreaterThan(results[1].totalSlots);
  });

  it('respects existing bookings when computing slots', () => {
    // Professional works 09:00-10:00, has a booking 09:00-09:30
    const entry = makeEntry({
      professionals: [makeProfessional({
        weeklySchedule: {
          1: [{ start: '09:00', end: '10:00' }],
        },
      })],
      bookingsByProfessional: {
        'prof-1': [
          { date: MONDAY, startTime: '09:00', endTime: '09:30', status: 'confirmed' },
        ],
      },
    });

    const results = filterBusinessesByAvailability(
      [entry],
      { date: MONDAY },
      NOW_DAY_BEFORE,
    );

    if (results.length > 0) {
      // Slot at 09:00 should NOT be in results (it conflicts with booking + buffer)
      for (const match of results[0].matchingSlots) {
        const has0900 = match.slots.some((s) => s.start === '09:00');
        expect(has0900).toBe(false);
      }
    }
  });

  it('respects blocked ranges when computing slots', () => {
    const entry = makeEntry({
      professionals: [makeProfessional({
        weeklySchedule: {
          1: [{ start: '09:00', end: '12:00' }],
        },
      })],
      blockedRangesByProfessional: {
        'prof-1': [
          { date: MONDAY, startTime: '09:00', endTime: '11:00' },
        ],
      },
    });

    const results = filterBusinessesByAvailability(
      [entry],
      { date: MONDAY },
      NOW_DAY_BEFORE,
    );

    if (results.length > 0) {
      for (const match of results[0].matchingSlots) {
        for (const slot of match.slots) {
          // No slots should start before 11:00
          expect(slot.start >= '11:00').toBe(true);
        }
      }
    }
  });

  it('handles multiple professionals — merges slots across professionals', () => {
    const entry = makeEntry({
      professionals: [
        makeProfessional({ id: 'p1', weeklySchedule: { 1: [{ start: '09:00', end: '12:00' }] } }),
        makeProfessional({ id: 'p2', weeklySchedule: { 1: [{ start: '14:00', end: '17:00' }] } }),
      ],
    });

    const results = filterBusinessesByAvailability(
      [entry],
      { date: MONDAY },
      NOW_DAY_BEFORE,
    );

    expect(results).toHaveLength(1);
    expect(results[0].matchingSlots).toHaveLength(2);
  });

  it('uses shortest-duration service as reference for slot computation', () => {
    const entry = makeEntry({
      services: [
        makeService({ id: 'short', durationMinutes: 15 }),
        makeService({ id: 'long', durationMinutes: 120 }),
      ],
      professionals: [makeProfessional({
        weeklySchedule: {
          1: [{ start: '09:00', end: '10:00' }], // 1 hour window
        },
      })],
    });

    const results = filterBusinessesByAvailability(
      [entry],
      { date: MONDAY },
      NOW_DAY_BEFORE,
    );

    // With 15-min service in a 1h window, there should be slots
    expect(results).toHaveLength(1);
    expect(results[0].matchingSlots[0].slots.length).toBeGreaterThan(0);
  });

  it('handles empty input gracefully', () => {
    const results = filterBusinessesByAvailability(
      [],
      { date: MONDAY },
      NOW_DAY_BEFORE,
    );

    expect(results).toHaveLength(0);
  });
});
