import type { ScheduleOptimization } from '@/domain/entities/schedule-optimizer';

export interface ScheduleOptimizationRepository {
  getById(id: string): Promise<ScheduleOptimization | null>;
  getLatestByProfessional(professionalId: string): Promise<ScheduleOptimization | null>;
  listByBusiness(businessId: string): Promise<ScheduleOptimization[]>;
  create(data: Omit<ScheduleOptimization, 'id' | 'createdAt'>): Promise<ScheduleOptimization>;
  update(id: string, data: Partial<ScheduleOptimization>): Promise<void>;
}
