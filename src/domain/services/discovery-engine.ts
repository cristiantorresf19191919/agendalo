import { Business } from '../entities/business';
import { Professional } from '../entities/professional';
import { Service } from '../entities/service';
import { Booking } from '../entities/booking';
import { BlockedRange } from '../entities/blocked-range';
import { computeAvailableSlots, AvailableSlot } from './slot-engine';
import { timeToMinutes } from '../value-objects/time-slot';

export interface BusinessAvailabilityData {
  business: Business;
  professionals: Professional[];
  services: Service[];
  bookingsByProfessional: Record<string, Pick<Booking, 'date' | 'startTime' | 'endTime' | 'status'>[]>;
  blockedRangesByProfessional: Record<string, Pick<BlockedRange, 'date' | 'startTime' | 'endTime'>[]>;
}

export interface DiscoveryFilters {
  date?: string;
  time?: string;
}

export interface DiscoveredBusiness {
  business: Business;
  services: Service[];
  matchingSlots: Array<{
    professionalId: string;
    professionalName: string;
    slots: AvailableSlot[];
  }>;
  totalSlots: number;
}

/**
 * Pure function that filters businesses by schedule availability.
 *
 * For each business, computes available slots using the shortest-duration active service
 * as reference, then filters by the requested time if provided.
 */
export function filterBusinessesByAvailability(
  data: BusinessAvailabilityData[],
  filters: DiscoveryFilters,
  now: Date,
): DiscoveredBusiness[] {
  const results: DiscoveredBusiness[] = [];

  for (const entry of data) {
    const activeServices = entry.services.filter((s) => s.isActive);
    if (activeServices.length === 0) continue;

    const activeProfessionals = entry.professionals.filter((p) => p.isActive);
    if (activeProfessionals.length === 0) continue;

    // Use the shortest-duration service as reference for slot computation
    const refService = activeServices.reduce((shortest, s) =>
      s.durationMinutes < shortest.durationMinutes ? s : shortest
    );

    const matchingSlots: DiscoveredBusiness['matchingSlots'] = [];

    for (const prof of activeProfessionals) {
      const bookings = (entry.bookingsByProfessional[prof.id] ?? [])
        .filter((b) => b.status === 'confirmed');
      const blocked = entry.blockedRangesByProfessional[prof.id] ?? [];

      const allSlots = computeAvailableSlots({
        date: filters.date!,
        serviceDurationMinutes: refService.durationMinutes,
        weeklySchedule: prof.weeklySchedule,
        exceptions: prof.exceptions,
        existingBookings: bookings,
        blockedRanges: blocked,
        now,
      });

      let filtered = allSlots;

      // If a specific time is requested, keep only slots that contain that time
      if (filters.time) {
        const requestedMinutes = timeToMinutes(filters.time);
        filtered = allSlots.filter((slot) => {
          const start = timeToMinutes(slot.start);
          const end = timeToMinutes(slot.end);
          return start <= requestedMinutes && end > requestedMinutes;
        });
      }

      if (filtered.length > 0) {
        matchingSlots.push({
          professionalId: prof.id,
          professionalName: prof.name,
          slots: filtered,
        });
      }
    }

    if (matchingSlots.length > 0) {
      const totalSlots = matchingSlots.reduce((sum, m) => sum + m.slots.length, 0);
      results.push({
        business: entry.business,
        services: activeServices,
        matchingSlots,
        totalSlots,
      });
    }
  }

  // Sort by total available slots descending (most availability first)
  results.sort((a, b) => b.totalSlots - a.totalSlots);

  return results;
}
