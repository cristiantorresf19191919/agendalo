import type { GroupEvent, GroupBooking } from '@/domain/entities/group-booking';

export interface CreateGroupEventInput {
  businessId: string;
  professionalIds: string[];
  name: string;
  description: string;
  category?: string;
  imageUrl?: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  maxCapacity: number;
  minCapacity: number;
  pricePerPerson: number;
  currency: string;
  location?: string;
  meetingUrl?: string;
  recurrence: GroupEvent['recurrence'];
  groupDiscountMinSize?: number;
  groupDiscountPercent?: number;
  requirements?: string[];
}

export interface GroupEventRepository {
  getById(id: string): Promise<GroupEvent | null>;
  listByBusiness(businessId: string): Promise<GroupEvent[]>;
  listUpcoming(businessId: string): Promise<GroupEvent[]>;
  create(input: CreateGroupEventInput): Promise<GroupEvent>;
  update(id: string, data: Partial<GroupEvent>): Promise<void>;
}

export interface CreateGroupBookingInput {
  groupEventId: string;
  businessId: string;
  customerId: string;
  partySize: number;
  amountPaid: number;
  currency: string;
  notes?: string;
}

export interface GroupBookingRepository {
  getById(id: string): Promise<GroupBooking | null>;
  listByEvent(groupEventId: string): Promise<GroupBooking[]>;
  listByCustomer(customerId: string, businessId: string): Promise<GroupBooking[]>;
  create(input: CreateGroupBookingInput): Promise<GroupBooking>;
  update(id: string, data: Partial<GroupBooking>): Promise<void>;
}
