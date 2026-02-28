import type { PaymentTransaction, PaymentGatewayConfig, InstallmentPlan } from '@/domain/entities/payment';

export interface CreatePaymentInput {
  businessId: string;
  bookingId?: string;
  customerId: string;
  method: PaymentTransaction['method'];
  amount: number;
  currency: string;
  tipAmount?: number;
  phoneNumber?: string;
}

export interface PaymentTransactionRepository {
  getById(id: string): Promise<PaymentTransaction | null>;
  getByBookingId(bookingId: string): Promise<PaymentTransaction | null>;
  listByBusiness(businessId: string, startDate?: string, endDate?: string): Promise<PaymentTransaction[]>;
  listByCustomer(customerId: string): Promise<PaymentTransaction[]>;
  create(input: CreatePaymentInput): Promise<PaymentTransaction>;
  update(id: string, data: Partial<PaymentTransaction>): Promise<void>;
}

export interface PaymentGatewayConfigRepository {
  getByBusinessId(businessId: string): Promise<PaymentGatewayConfig | null>;
  create(data: Omit<PaymentGatewayConfig, 'id' | 'updatedAt'>): Promise<PaymentGatewayConfig>;
  update(id: string, data: Partial<PaymentGatewayConfig>): Promise<void>;
}

export interface InstallmentPlanRepository {
  getById(id: string): Promise<InstallmentPlan | null>;
  listByCustomer(customerId: string): Promise<InstallmentPlan[]>;
  listActiveByBusiness(businessId: string): Promise<InstallmentPlan[]>;
  create(data: Omit<InstallmentPlan, 'id' | 'createdAt'>): Promise<InstallmentPlan>;
  update(id: string, data: Partial<InstallmentPlan>): Promise<void>;
}

export interface PaymentGatewayPort {
  /** Create a payment link (Wompi). */
  createPaymentLink(params: { amount: number; currency: string; description: string; redirectUrl: string }): Promise<{ paymentLinkId: string; paymentUrl: string }>;
  /** Initiate a Nequi push payment. */
  initiateNequiPayment(params: { amount: number; phoneNumber: string; description: string }): Promise<{ transactionId: string; status: string }>;
  /** Check payment status. */
  getPaymentStatus(transactionId: string): Promise<{ status: string; amount: number }>;
  /** Process a refund. */
  processRefund(transactionId: string, amount: number, reason: string): Promise<{ refundId: string; status: string }>;
}
