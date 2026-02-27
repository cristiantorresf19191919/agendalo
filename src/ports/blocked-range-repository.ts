import { BlockedRange } from '../domain/entities/blocked-range';

export interface CreateBlockedRangeInput {
  professionalId: string;
  businessId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

export interface BlockedRangeRepository {
  create(input: CreateBlockedRangeInput): Promise<BlockedRange>;
  getByProfessionalAndDate(professionalId: string, date: string): Promise<BlockedRange[]>;
  getByProfessionalAndDateRange(professionalId: string, from: string, to: string): Promise<BlockedRange[]>;
  delete(id: string): Promise<void>;
}
