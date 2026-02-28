import type { GiftCard, GiftCardRedemption, GiftCardDesign } from '@/domain/entities/gift-card';

export interface CreateGiftCardInput {
  businessId: string;
  type: GiftCard['type'];
  originalAmount: number;
  currency: string;
  purchasedByCustomerId?: string;
  recipientName?: string;
  recipientEmail?: string;
  personalMessage?: string;
  restrictedServiceIds?: string[];
  expiresAt?: Date;
}

export interface GiftCardRepository {
  getById(id: string): Promise<GiftCard | null>;
  getByCode(code: string): Promise<GiftCard | null>;
  listByBusiness(businessId: string): Promise<GiftCard[]>;
  listByCustomer(customerId: string): Promise<GiftCard[]>;
  create(input: CreateGiftCardInput): Promise<GiftCard>;
  update(id: string, data: Partial<GiftCard>): Promise<void>;
}

export interface GiftCardRedemptionRepository {
  listByGiftCard(giftCardId: string): Promise<GiftCardRedemption[]>;
  create(data: Omit<GiftCardRedemption, 'id' | 'createdAt'>): Promise<GiftCardRedemption>;
}

export interface GiftCardDesignRepository {
  listByBusiness(businessId: string): Promise<GiftCardDesign[]>;
  create(data: Omit<GiftCardDesign, 'id'>): Promise<GiftCardDesign>;
  update(id: string, data: Partial<GiftCardDesign>): Promise<void>;
}
