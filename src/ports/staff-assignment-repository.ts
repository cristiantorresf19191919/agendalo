import type { StaffAssignment, StaffBreak, CommissionEntry } from '@/domain/entities/staff-assignment';

export interface CreateStaffAssignmentInput {
  businessId: string;
  professionalId: string;
  serviceId: string;
  commissionPercent: number;
  customDurationMinutes?: number;
  customPrice?: number;
}

export interface StaffAssignmentRepository {
  create(input: CreateStaffAssignmentInput): Promise<StaffAssignment>;
  getByBusinessId(businessId: string): Promise<StaffAssignment[]>;
  getByProfessionalId(professionalId: string): Promise<StaffAssignment[]>;
  getByServiceId(serviceId: string): Promise<StaffAssignment[]>;
  update(id: string, data: Partial<CreateStaffAssignmentInput>): Promise<StaffAssignment>;
  toggleActive(id: string, isActive: boolean): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface CreateStaffBreakInput {
  professionalId: string;
  businessId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  label?: string;
}

export interface StaffBreakRepository {
  create(input: CreateStaffBreakInput): Promise<StaffBreak>;
  getByProfessionalId(professionalId: string): Promise<StaffBreak[]>;
  delete(id: string): Promise<void>;
}

export interface CommissionRepository {
  create(entry: Omit<CommissionEntry, 'id' | 'createdAt'>): Promise<CommissionEntry>;
  getByProfessionalId(professionalId: string, dateRange?: { from: string; to: string }): Promise<CommissionEntry[]>;
  getByBusinessId(businessId: string, dateRange?: { from: string; to: string }): Promise<CommissionEntry[]>;
  markAsPaid(ids: string[]): Promise<void>;
}
