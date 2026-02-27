export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'no-show';

export interface Booking {
  id: string;
  businessId: string;
  professionalId: string;
  customerId: string;
  serviceId: string;
  date: string;           // "YYYY-MM-DD"
  startTime: string;      // "HH:mm"
  endTime: string;        // "HH:mm"
  status: BookingStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
