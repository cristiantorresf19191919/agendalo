import type { MarketingCampaign, MarketingTemplate } from '@/domain/entities/marketing-campaign';

export interface CreateCampaignInput {
  businessId: string;
  name: string;
  channel: MarketingCampaign['channel'];
  audienceSegment: MarketingCampaign['audienceSegment'];
  customFilter?: MarketingCampaign['customFilter'];
  templateId?: string;
  message: MarketingCampaign['message'];
  scheduledAt?: Date;
}

export interface MarketingCampaignRepository {
  getById(id: string): Promise<MarketingCampaign | null>;
  listByBusiness(businessId: string, limit?: number): Promise<MarketingCampaign[]>;
  create(input: CreateCampaignInput): Promise<MarketingCampaign>;
  update(id: string, data: Partial<MarketingCampaign>): Promise<void>;
}

export interface MarketingTemplateRepository {
  getById(id: string): Promise<MarketingTemplate | null>;
  listByBusiness(businessId: string): Promise<MarketingTemplate[]>;
  listByCategory(businessId: string, category: MarketingTemplate['category']): Promise<MarketingTemplate[]>;
  create(data: Omit<MarketingTemplate, 'id' | 'createdAt' | 'usageCount' | 'avgConversionRate'>): Promise<MarketingTemplate>;
  update(id: string, data: Partial<MarketingTemplate>): Promise<void>;
}

export interface WhatsAppBroadcastPort {
  /** Send a WhatsApp template message to a list of phone numbers. */
  sendBroadcast(params: { templateId: string; phoneNumbers: string[]; variables: Record<string, string>[] }): Promise<{ sentCount: number; failedCount: number; messageIds: string[] }>;
  /** Submit a template for Meta approval. */
  submitTemplate(params: { name: string; category: string; language: string; body: string; header?: string; footer?: string; buttons?: Array<{ type: string; text: string; url?: string }> }): Promise<{ templateId: string; status: string }>;
}
