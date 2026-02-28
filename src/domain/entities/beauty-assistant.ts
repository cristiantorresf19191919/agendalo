/**
 * AI Consumer Beauty Assistant ("Mi Asistente de Belleza").
 *
 * Consumer-facing AI that learns preferences, proactively suggests
 * next appointments, recommends services based on history, and
 * suggests looks from portfolio gallery based on hair/skin type.
 * Delivered via WhatsApp or in-app.
 *
 * DIFFERENTIATOR: EVERY competitor's AI is business-facing (B2B).
 * GlossGenius has AI Growth Analyst for owners. Zenoti has Zeenie.
 * Boulevard has Billie. NO platform has a consumer-facing AI beauty
 * advisor. Delivering it through WhatsApp makes it feel like texting
 * a knowledgeable friend — not interacting with software.
 */

export type AssistantMessageRole = 'assistant' | 'customer';
export type ReminderTrigger = 'time_based' | 'pattern_based' | 'seasonal' | 'trend_based';

export interface BeautyAssistantSession {
  id: string;
  customerId: string;
  /** Channel where this session is active. */
  channel: 'whatsapp' | 'in_app';
  /** Customer's style profile (learned over time). */
  styleProfile: StyleProfile;
  /** Conversation messages. */
  messages: AssistantMessage[];
  /** Last interaction timestamp. */
  lastInteractionAt: Date;
  createdAt: Date;
}

export interface StyleProfile {
  /** Learned preferences (aggregated from all businesses). */
  hairType?: string;
  hairLength?: string;
  preferredStyles: string[];
  skinType?: string;
  skinConcerns: string[];
  nailPreferences: string[];
  preferredColors: string[];
  /** Service frequency patterns (days between visits per service type). */
  serviceFrequency: Record<string, number>;
  /** Preferred price range. */
  priceRangeMin?: number;
  priceRangeMax?: number;
  /** Preferred barrios for services. */
  preferredBarrios: string[];
  /** Favorite professionals. */
  favoriteProfessionalIds: string[];
  /** Favorite businesses. */
  favoriteBusinessIds: string[];
  updatedAt: Date;
}

export interface AssistantMessage {
  id: string;
  sessionId: string;
  role: AssistantMessageRole;
  text: string;
  /** Recommendations included in this message. */
  recommendations?: StyleRecommendation[];
  /** Portfolio images suggested. */
  suggestedLooks?: SuggestedLook[];
  timestamp: Date;
}

export interface StyleRecommendation {
  type: 'next_appointment' | 'new_service' | 'trending_style' | 'seasonal_suggestion' | 'professional_match';
  /** Recommended service. */
  serviceId?: string;
  serviceName?: string;
  /** Recommended professional. */
  professionalId?: string;
  professionalName?: string;
  /** Recommended business. */
  businessId?: string;
  businessName?: string;
  /** Why this is recommended. */
  reason: string;
  /** Suggested date for the appointment — "YYYY-MM-DD". */
  suggestedDate?: string;
  /** Confidence of the recommendation (0-1). */
  confidence: number;
  /** Deep link to book. */
  bookingUrl?: string;
}

export interface SuggestedLook {
  /** Portfolio image ID. */
  portfolioImageId: string;
  imageUrl: string;
  /** Professional who created this look. */
  professionalName: string;
  /** Service used to create this look. */
  serviceName: string;
  /** Match score based on customer's profile (0-1). */
  matchScore: number;
  /** Why this look matches the customer. */
  matchReason: string;
  /** Deep link to book this look. */
  bookingUrl: string;
}

export interface ProactiveReminder {
  id: string;
  customerId: string;
  businessId: string;
  /** What triggered this reminder. */
  trigger: ReminderTrigger;
  /** Message to send. */
  message: string;
  /** Recommended action (book, explore, etc.). */
  recommendedServiceId?: string;
  recommendedProfessionalId?: string;
  /** Suggested date — "YYYY-MM-DD". */
  suggestedDate?: string;
  /** Channel to deliver on. */
  channel: 'whatsapp' | 'push' | 'in_app';
  /** Whether the reminder has been sent. */
  isSent: boolean;
  /** Whether the customer acted on it. */
  isActedUpon: boolean;
  sentAt?: Date;
  actedUponAt?: Date;
  createdAt: Date;
}
