import type { LoyaltyProgram, CustomerLoyalty, PointsTransaction } from '@/domain/entities/loyalty';

export interface CreateLoyaltyProgramInput {
  businessId: string;
  pointsPerCurrencyUnit: number;
  currencyUnitDivisor: number;
  firstBookingBonus: number;
  reviewBonus: number;
  referralBonus: number;
  tiers: LoyaltyProgram['tiers'];
}

export interface LoyaltyProgramRepository {
  getByBusinessId(businessId: string): Promise<LoyaltyProgram | null>;
  create(input: CreateLoyaltyProgramInput): Promise<LoyaltyProgram>;
  update(id: string, data: Partial<LoyaltyProgram>): Promise<void>;
}

export interface CustomerLoyaltyRepository {
  getByCustomerAndBusiness(customerId: string, businessId: string): Promise<CustomerLoyalty | null>;
  listByBusiness(businessId: string): Promise<CustomerLoyalty[]>;
  upsert(data: Omit<CustomerLoyalty, 'id'>): Promise<CustomerLoyalty>;
  update(id: string, data: Partial<CustomerLoyalty>): Promise<void>;
}

export interface PointsTransactionRepository {
  listByCustomer(customerId: string, businessId: string): Promise<PointsTransaction[]>;
  create(data: Omit<PointsTransaction, 'id' | 'createdAt'>): Promise<PointsTransaction>;
}
