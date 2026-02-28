import type { ReferralProgram, ReferralCode, Referral } from '@/domain/entities/referral';

export interface CreateReferralProgramInput {
  businessId: string;
  referrerReward: ReferralProgram['referrerReward'];
  refereeReward: ReferralProgram['refereeReward'];
  maxReferralsPerCustomer: number;
  expirationDays: number;
}

export interface ReferralProgramRepository {
  getByBusinessId(businessId: string): Promise<ReferralProgram | null>;
  create(input: CreateReferralProgramInput): Promise<ReferralProgram>;
  update(id: string, data: Partial<ReferralProgram>): Promise<void>;
}

export interface ReferralCodeRepository {
  getByCustomerAndBusiness(customerId: string, businessId: string): Promise<ReferralCode | null>;
  getByCode(code: string): Promise<ReferralCode | null>;
  create(data: Omit<ReferralCode, 'id' | 'createdAt' | 'totalReferrals' | 'successfulReferrals'>): Promise<ReferralCode>;
  incrementCounters(id: string, successful: boolean): Promise<void>;
}

export interface ReferralRepository {
  getById(id: string): Promise<Referral | null>;
  listByReferrer(customerId: string, businessId: string): Promise<Referral[]>;
  create(data: Omit<Referral, 'id' | 'createdAt'>): Promise<Referral>;
  update(id: string, data: Partial<Referral>): Promise<void>;
}
