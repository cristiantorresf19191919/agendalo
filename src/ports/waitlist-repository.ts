import type { WaitlistEntry, WaitlistStatus } from '@/domain/entities/waitlist';

export interface CreateWaitlistEntryInput {
  businessId: string;
  customerId: string;
  serviceId: string;
  preferredProfessionalId: string | null;
  date: string;
  preferredTimeStart: string;
  preferredTimeEnd: string;
}

export interface WaitlistRepository {
  create(input: CreateWaitlistEntryInput): Promise<WaitlistEntry>;
  getById(id: string): Promise<WaitlistEntry | null>;
  getByBusinessAndDate(businessId: string, date: string): Promise<WaitlistEntry[]>;
  getByCustomerId(customerId: string): Promise<WaitlistEntry[]>;
  /** Get the next person in line for a specific time window. */
  getNextInLine(businessId: string, date: string, timeStart: string, timeEnd: string): Promise<WaitlistEntry | null>;
  updateStatus(id: string, status: WaitlistStatus, notifiedAt?: Date, expiresAt?: Date): Promise<void>;
  delete(id: string): Promise<void>;
}
