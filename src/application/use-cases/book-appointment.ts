import { BookingRepository, CreateBookingInput } from '../../ports/booking-repository';
import { ProfessionalRepository } from '../../ports/professional-repository';
import { ServiceRepository } from '../../ports/service-repository';
import { BlockedRangeRepository } from '../../ports/blocked-range-repository';
import { computeAvailableSlots } from '../../domain/services/slot-engine';
import { assertNoOverlappingBookings, assertLeadTimeRespected, BookingInvariantError } from '../../domain/invariants/booking-invariants';
import { Booking } from '../../domain/entities/booking';

export interface BookAppointmentInput {
  businessId: string;
  professionalId: string;
  customerId: string;
  serviceId: string;
  date: string;
  startTime: string;
}

export class BookAppointment {
  constructor(
    private bookingRepo: BookingRepository,
    private professionalRepo: ProfessionalRepository,
    private serviceRepo: ServiceRepository,
    private blockedRangeRepo: BlockedRangeRepository
  ) {}

  async execute(input: BookAppointmentInput, now: Date = new Date()): Promise<Booking> {
    const [professional, service] = await Promise.all([
      this.professionalRepo.getById(input.professionalId),
      this.serviceRepo.getById(input.serviceId),
    ]);

    if (!professional) throw new Error('Professional not found');
    if (!service) throw new Error('Service not found');
    if (!professional.isActive) throw new Error('Professional is not active');
    if (!service.isActive) throw new Error('Service is not active');

    // Calculate end time
    const [hours, minutes] = input.startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + service.durationMinutes;
    const endTime = `${Math.floor(totalMinutes / 60).toString().padStart(2, '0')}:${(totalMinutes % 60).toString().padStart(2, '0')}`;

    // Fetch existing bookings and blocked ranges
    const [existingBookings, blockedRanges] = await Promise.all([
      this.bookingRepo.getByProfessionalAndDate(input.professionalId, input.date),
      this.blockedRangeRepo.getByProfessionalAndDate(input.professionalId, input.date),
    ]);

    // Only consider confirmed bookings
    const confirmedBookings = existingBookings.filter(b => b.status === 'confirmed');

    // Validate invariants
    assertLeadTimeRespected(input.date, input.startTime, 60, now);
    assertNoOverlappingBookings(
      { date: input.date, startTime: input.startTime, endTime },
      confirmedBookings
    );

    // Verify slot is actually available via engine
    const availableSlots = computeAvailableSlots({
      date: input.date,
      serviceDurationMinutes: service.durationMinutes,
      weeklySchedule: professional.weeklySchedule,
      exceptions: professional.exceptions,
      existingBookings: confirmedBookings,
      blockedRanges,
      now,
    });

    const isSlotAvailable = availableSlots.some(
      (slot) => slot.start === input.startTime && slot.end === endTime
    );

    if (!isSlotAvailable) {
      throw new BookingInvariantError('Selected time slot is not available');
    }

    return this.bookingRepo.create({
      businessId: input.businessId,
      professionalId: input.professionalId,
      customerId: input.customerId,
      serviceId: input.serviceId,
      date: input.date,
      startTime: input.startTime,
      endTime,
    });
  }
}
