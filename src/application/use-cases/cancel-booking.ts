import { BookingRepository } from '../../ports/booking-repository';
import { Booking } from '../../domain/entities/booking';

export class CancelBooking {
  constructor(private bookingRepo: BookingRepository) {}

  async execute(bookingId: string, userId: string): Promise<void> {
    const booking = await this.bookingRepo.getById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.customerId !== userId && booking.businessId !== userId) {
      throw new Error('Not authorized to cancel this booking');
    }
    if (booking.status !== 'confirmed') {
      throw new Error('Only confirmed bookings can be cancelled');
    }
    await this.bookingRepo.updateStatus(bookingId, 'cancelled');
  }
}
