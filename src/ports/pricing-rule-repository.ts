import type { PricingRule } from '@/domain/entities/pricing-rule';

export interface CreatePricingRuleInput {
  businessId: string;
  name: string;
  description?: string;
  serviceIds: string[];
  daysOfWeek: number[];
  timeStart: string;
  timeEnd: string;
  discountType: 'percentage' | 'fixed';
  discountPercent?: number;
  discountAmount?: number;
  validFrom?: string;
  validUntil?: string;
  priority: number;
}

export interface PricingRuleRepository {
  create(input: CreatePricingRuleInput): Promise<PricingRule>;
  getById(id: string): Promise<PricingRule | null>;
  getByBusinessId(businessId: string): Promise<PricingRule[]>;
  /** Get active rules applicable to a service on a given date/time. */
  getApplicableRules(businessId: string, serviceId: string, date: string, time: string): Promise<PricingRule[]>;
  update(id: string, data: Partial<CreatePricingRuleInput>): Promise<PricingRule>;
  toggleActive(id: string, isActive: boolean): Promise<void>;
  delete(id: string): Promise<void>;
}
