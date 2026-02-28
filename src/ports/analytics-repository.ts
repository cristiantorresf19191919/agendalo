import type {
  DailyRevenueSnapshot,
  ServiceAnalytics,
  ProfessionalPerformance,
  ClientRetentionMetric,
  BusinessKPISummary,
} from '@/domain/entities/analytics';

export interface AnalyticsSnapshotRepository {
  getDailySnapshots(businessId: string, startDate: string, endDate: string): Promise<DailyRevenueSnapshot[]>;
  upsertDailySnapshot(data: Omit<DailyRevenueSnapshot, 'id' | 'createdAt'>): Promise<void>;
}

export interface ServiceAnalyticsRepository {
  getByService(businessId: string, serviceId: string, period: ServiceAnalytics['period'], periodStart: string): Promise<ServiceAnalytics | null>;
  listByBusiness(businessId: string, period: ServiceAnalytics['period'], periodStart: string): Promise<ServiceAnalytics[]>;
  upsert(data: Omit<ServiceAnalytics, 'id'>): Promise<void>;
}

export interface ProfessionalPerformanceRepository {
  getByProfessional(businessId: string, professionalId: string, period: ProfessionalPerformance['period'], periodStart: string): Promise<ProfessionalPerformance | null>;
  listByBusiness(businessId: string, period: ProfessionalPerformance['period'], periodStart: string): Promise<ProfessionalPerformance[]>;
  upsert(data: Omit<ProfessionalPerformance, 'id'>): Promise<void>;
}

export interface ClientRetentionRepository {
  listByBusiness(businessId: string): Promise<ClientRetentionMetric[]>;
  listAtRisk(businessId: string): Promise<ClientRetentionMetric[]>;
  upsert(data: Omit<ClientRetentionMetric, 'id'>): Promise<void>;
}

export interface BusinessKPIRepository {
  getSummary(businessId: string, period: BusinessKPISummary['period']): Promise<BusinessKPISummary | null>;
  upsert(data: BusinessKPISummary): Promise<void>;
}
