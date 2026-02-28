import type { DigitalReceipt, TipTransaction } from '@/domain/entities/digital-receipt';

export interface DigitalReceiptRepository {
  getById(id: string): Promise<DigitalReceipt | null>;
  getByBookingId(bookingId: string): Promise<DigitalReceipt | null>;
  listByBusiness(businessId: string, limit?: number): Promise<DigitalReceipt[]>;
  listByCustomer(customerId: string, limit?: number): Promise<DigitalReceipt[]>;
  create(data: Omit<DigitalReceipt, 'id' | 'createdAt'>): Promise<DigitalReceipt>;
  update(id: string, data: Partial<DigitalReceipt>): Promise<void>;
}

export interface TipTransactionRepository {
  getById(id: string): Promise<TipTransaction | null>;
  listByProfessional(professionalId: string, startDate?: string, endDate?: string): Promise<TipTransaction[]>;
  getTotalByProfessional(professionalId: string, period: 'week' | 'month' | 'year'): Promise<{ total: number; count: number }>;
  create(data: Omit<TipTransaction, 'id' | 'createdAt'>): Promise<TipTransaction>;
  update(id: string, data: Partial<TipTransaction>): Promise<void>;
}
