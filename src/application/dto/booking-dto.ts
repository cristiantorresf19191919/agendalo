import { Booking } from '../../domain/entities/booking';

export interface BookingDTO {
  id: string;
  businessId: string;
  professionalId: string;
  professionalName?: string;
  customerId: string;
  customerName?: string;
  serviceId: string;
  serviceName?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
}

export function toBookingDTO(booking: Booking, extra?: { professionalName?: string; customerName?: string; serviceName?: string }): BookingDTO {
  return {
    id: booking.id,
    businessId: booking.businessId,
    professionalId: booking.professionalId,
    professionalName: extra?.professionalName,
    customerId: booking.customerId,
    customerName: extra?.customerName,
    serviceId: booking.serviceId,
    serviceName: extra?.serviceName,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status,
    notes: booking.notes,
  };
}
