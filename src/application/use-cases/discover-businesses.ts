import { BusinessRepository } from '../../ports/business-repository';
import { ProfessionalRepository } from '../../ports/professional-repository';
import { ServiceRepository } from '../../ports/service-repository';
import { BookingRepository } from '../../ports/booking-repository';
import { BlockedRangeRepository } from '../../ports/blocked-range-repository';
import {
  BusinessAvailabilityData,
  DiscoveredBusiness,
  filterBusinessesByAvailability,
} from '../../domain/services/discovery-engine';

export interface DiscoverBusinessesInput {
  date?: string;
  time?: string;
  address?: string;
}

export class DiscoverBusinesses {
  constructor(
    private businessRepo: BusinessRepository,
    private professionalRepo: ProfessionalRepository,
    private serviceRepo: ServiceRepository,
    private bookingRepo: BookingRepository,
    private blockedRangeRepo: BlockedRangeRepository,
  ) {}

  async execute(
    input: DiscoverBusinessesInput,
    now: Date = new Date(),
  ): Promise<DiscoveredBusiness[]> {
    const businesses = await this.businessRepo.search({
      address: input.address,
    });

    if (businesses.length === 0) return [];

    // If no date filter, return businesses with their services (location-only mode)
    if (!input.date) {
      const results: DiscoveredBusiness[] = [];
      for (const business of businesses) {
        const services = await this.serviceRepo.getByBusinessId(business.id);
        const activeServices = services.filter((s) => s.isActive);
        if (activeServices.length === 0) continue;
        results.push({
          business,
          services: activeServices,
          matchingSlots: [],
          totalSlots: 0,
        });
      }
      return results;
    }

    // Fetch all data in parallel for schedule filtering
    const availabilityData: BusinessAvailabilityData[] = await Promise.all(
      businesses.map(async (business) => {
        const [professionals, services] = await Promise.all([
          this.professionalRepo.getByBusinessId(business.id),
          this.serviceRepo.getByBusinessId(business.id),
        ]);

        const activeProfessionals = professionals.filter((p) => p.isActive);

        const [bookingsByProfessional, blockedRangesByProfessional] =
          await Promise.all([
            this.fetchBookingsByProfessional(activeProfessionals.map((p) => p.id), input.date!),
            this.fetchBlockedRangesByProfessional(activeProfessionals.map((p) => p.id), input.date!),
          ]);

        return {
          business,
          professionals,
          services,
          bookingsByProfessional,
          blockedRangesByProfessional,
        };
      }),
    );

    return filterBusinessesByAvailability(
      availabilityData,
      { date: input.date, time: input.time },
      now,
    );
  }

  private async fetchBookingsByProfessional(
    professionalIds: string[],
    date: string,
  ) {
    const entries = await Promise.all(
      professionalIds.map(async (id) => {
        const bookings = await this.bookingRepo.getByProfessionalAndDate(id, date);
        return [id, bookings] as const;
      }),
    );
    return Object.fromEntries(entries);
  }

  private async fetchBlockedRangesByProfessional(
    professionalIds: string[],
    date: string,
  ) {
    const entries = await Promise.all(
      professionalIds.map(async (id) => {
        const ranges = await this.blockedRangeRepo.getByProfessionalAndDate(id, date);
        return [id, ranges] as const;
      }),
    );
    return Object.fromEntries(entries);
  }
}
