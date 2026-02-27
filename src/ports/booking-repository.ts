import { Booking, BookingStatus } from '../domain/entities/booking';

export interface CreateBookingInput {
  businessId: string;
  professionalId: string;
  customerId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface BookingRepository {
  create(input: CreateBookingInput): Promise<Booking>;
  getById(id: string): Promise<Booking | null>;
  getByProfessionalAndDate(professionalId: string, date: string): Promise<Booking[]>;
  getByCustomerId(customerId: string): Promise<Booking[]>;
  getByBusinessId(businessId: string, dateRange?: { from: string; to: string }): Promise<Booking[]>;
  updateStatus(id: string, status: BookingStatus): Promise<void>;
  delete(id: string): Promise<void>;
}
