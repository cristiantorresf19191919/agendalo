import type { DepositPolicy, PaymentRecord } from '@/domain/entities/deposit-policy';

export interface CreateDepositPolicyInput {
  businessId: string;
  requireDeposit: boolean;
  depositType: 'percentage' | 'fixed';
  depositPercent?: number;
  depositAmount?: number;
  currency: string;
  captureCardOnFile: boolean;
  freeCancellationHours: number;
  lateCancellationPenalty: 'none' | 'forfeit_deposit' | 'charge_fee';
  lateCancellationFeePercent?: number;
  noShowPenalty: 'none' | 'forfeit_deposit' | 'charge_fee';
  noShowFeePercent?: number;
}

export interface DepositPolicyRepository {
  upsert(input: CreateDepositPolicyInput): Promise<DepositPolicy>;
  getByBusinessId(businessId: string): Promise<DepositPolicy | null>;
  delete(id: string): Promise<void>;
}

export interface PaymentRecordRepository {
  create(record: Omit<PaymentRecord, 'id' | 'createdAt'>): Promise<PaymentRecord>;
  getByBookingId(bookingId: string): Promise<PaymentRecord[]>;
  getByCustomerId(customerId: string): Promise<PaymentRecord[]>;
  getByBusinessId(businessId: string, dateRange?: { from: string; to: string }): Promise<PaymentRecord[]>;
  updateStatus(id: string, status: PaymentRecord['status']): Promise<void>;
}
