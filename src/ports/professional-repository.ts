import { Professional, WeeklySchedule, ScheduleException } from '../domain/entities/professional';

export interface CreateProfessionalInput {
  businessId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  specialties: string[];
  weeklySchedule: WeeklySchedule;
}

export interface ProfessionalRepository {
  create(input: CreateProfessionalInput): Promise<Professional>;
  getById(id: string): Promise<Professional | null>;
  getByBusinessId(businessId: string): Promise<Professional[]>;
  update(id: string, data: Partial<Professional>): Promise<Professional>;
  updateSchedule(id: string, schedule: WeeklySchedule): Promise<void>;
  addException(id: string, exception: ScheduleException): Promise<void>;
  removeException(id: string, date: string): Promise<void>;
  toggleActive(id: string, isActive: boolean): Promise<void>;
  delete(id: string): Promise<void>;
}
