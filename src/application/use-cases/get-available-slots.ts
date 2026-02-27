import { ProfessionalRepository } from '../../ports/professional-repository';
import { BookingRepository } from '../../ports/booking-repository';
import { BlockedRangeRepository } from '../../ports/blocked-range-repository';
import { ServiceRepository } from '../../ports/service-repository';
import { computeAvailableSlots, AvailableSlot, SlotEngineConfig } from '../../domain/services/slot-engine';

export interface GetAvailableSlotsInput {
  professionalId: string;
  serviceId: string;
  date: string;
  config?: Partial<SlotEngineConfig>;
}

export class GetAvailableSlots {
  constructor(
    private professionalRepo: ProfessionalRepository,
    private bookingRepo: BookingRepository,
    private blockedRangeRepo: BlockedRangeRepository,
    private serviceRepo: ServiceRepository
  ) {}

  async execute(input: GetAvailableSlotsInput, now: Date = new Date()): Promise<AvailableSlot[]> {
    const [professional, service] = await Promise.all([
      this.professionalRepo.getById(input.professionalId),
      this.serviceRepo.getById(input.serviceId),
    ]);

    if (!professional) throw new Error('Professional not found');
    if (!service) throw new Error('Service not found');

    const [existingBookings, blockedRanges] = await Promise.all([
      this.bookingRepo.getByProfessionalAndDate(input.professionalId, input.date),
      this.blockedRangeRepo.getByProfessionalAndDate(input.professionalId, input.date),
    ]);

    const confirmedBookings = existingBookings.filter(b => b.status === 'confirmed');

    return computeAvailableSlots({
      date: input.date,
      serviceDurationMinutes: service.durationMinutes,
      weeklySchedule: professional.weeklySchedule,
      exceptions: professional.exceptions,
      existingBookings: confirmedBookings,
      blockedRanges,
      config: input.config,
      now,
    });
  }
}
