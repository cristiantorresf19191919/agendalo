import type { WhatsAppConversation, WhatsAppMessage, AiAgentConfig } from '@/domain/entities/whatsapp-ai-agent';

export interface WhatsAppConversationRepository {
  getById(id: string): Promise<WhatsAppConversation | null>;
  getActiveByPhone(businessId: string, customerPhone: string): Promise<WhatsAppConversation | null>;
  listByBusiness(businessId: string, limit?: number): Promise<WhatsAppConversation[]>;
  create(data: Omit<WhatsAppConversation, 'id' | 'createdAt'>): Promise<WhatsAppConversation>;
  update(id: string, data: Partial<WhatsAppConversation>): Promise<void>;
  addMessage(conversationId: string, message: Omit<WhatsAppMessage, 'id'>): Promise<WhatsAppMessage>;
}

export interface AiAgentConfigRepository {
  getByBusinessId(businessId: string): Promise<AiAgentConfig | null>;
  create(data: Omit<AiAgentConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<AiAgentConfig>;
  update(id: string, data: Partial<AiAgentConfig>): Promise<void>;
}

export interface AiBookingAgentPort {
  /** Process an incoming WhatsApp message and generate a response. */
  processMessage(conversationId: string, message: WhatsAppMessage): Promise<WhatsAppMessage>;
  /** Transcribe a voice note to text. */
  transcribeVoiceNote(voiceNoteUrl: string): Promise<{ text: string; confidence: number }>;
  /** Extract booking intent from natural language. */
  extractBookingIntent(text: string, context?: Record<string, string>): Promise<import('@/domain/entities/whatsapp-ai-agent').BookingIntent>;
}
