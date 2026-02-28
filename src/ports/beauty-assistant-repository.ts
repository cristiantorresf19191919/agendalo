import type { BeautyAssistantSession, ProactiveReminder, StyleRecommendation } from '@/domain/entities/beauty-assistant';

export interface BeautyAssistantSessionRepository {
  getById(id: string): Promise<BeautyAssistantSession | null>;
  getActiveByCustomer(customerId: string, channel: 'whatsapp' | 'in_app'): Promise<BeautyAssistantSession | null>;
  create(data: Omit<BeautyAssistantSession, 'id' | 'createdAt'>): Promise<BeautyAssistantSession>;
  update(id: string, data: Partial<BeautyAssistantSession>): Promise<void>;
}

export interface ProactiveReminderRepository {
  getById(id: string): Promise<ProactiveReminder | null>;
  listPendingByCustomer(customerId: string): Promise<ProactiveReminder[]>;
  listDueForSending(): Promise<ProactiveReminder[]>;
  create(data: Omit<ProactiveReminder, 'id' | 'createdAt'>): Promise<ProactiveReminder>;
  update(id: string, data: Partial<ProactiveReminder>): Promise<void>;
}

export interface BeautyAssistantAiPort {
  /** Generate style recommendations based on customer profile and history. */
  generateRecommendations(params: { customerId: string; styleProfile: import('@/domain/entities/beauty-assistant').StyleProfile; bookingHistory: Array<{ serviceName: string; professionalName: string; date: string; rating?: number }> }): Promise<StyleRecommendation[]>;
  /** Match portfolio looks to customer profile. */
  matchLooks(params: { customerId: string; styleProfile: import('@/domain/entities/beauty-assistant').StyleProfile; portfolioImages: Array<{ id: string; imageUrl: string; tags: string[]; serviceName: string; professionalName: string }> }): Promise<Array<{ portfolioImageId: string; matchScore: number; matchReason: string }>>;
  /** Determine if a proactive reminder should be sent. */
  shouldSendReminder(params: { customerId: string; daysSinceLastVisit: number; avgFrequency: number; lastServiceName: string }): Promise<{ shouldSend: boolean; message: string; suggestedDate: string }>;
}
