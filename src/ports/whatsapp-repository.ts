import type { WhatsAppConfig, ShareableBookingLink } from '@/domain/entities/whatsapp';

export interface WhatsAppConfigRepository {
  getByBusinessId(businessId: string): Promise<WhatsAppConfig | null>;
  create(data: Omit<WhatsAppConfig, 'id' | 'updatedAt'>): Promise<WhatsAppConfig>;
  update(id: string, data: Partial<WhatsAppConfig>): Promise<void>;
}

export interface CreateShareableLinkInput {
  businessId: string;
  type: ShareableBookingLink['type'];
  referenceId?: string;
  shortUrl: string;
  fullUrl: string;
  whatsappMessage: string;
  whatsappUrl: string;
}

export interface ShareableBookingLinkRepository {
  getById(id: string): Promise<ShareableBookingLink | null>;
  listByBusiness(businessId: string): Promise<ShareableBookingLink[]>;
  create(input: CreateShareableLinkInput): Promise<ShareableBookingLink>;
  incrementClickCount(id: string): Promise<void>;
  incrementConversionCount(id: string): Promise<void>;
}
