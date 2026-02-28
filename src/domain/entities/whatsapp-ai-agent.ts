/**
 * WhatsApp AI Booking Agent ("Agente de Reservas").
 *
 * A full AI booking agent that lives INSIDE WhatsApp. Customers send
 * a voice note or text like "Quiero cortarme el pelo mañana a las 3"
 * and the AI agent checks real-time availability, suggests alternatives,
 * processes the booking, and sends confirmation — all without leaving
 * WhatsApp.
 *
 * DIFFERENTIATOR: Competitors (Fresha, Booksy) treat WhatsApp as a
 * notification channel. Agendalo makes it the PRIMARY booking interface.
 * With 96% WhatsApp adoption in Colombia, this removes ALL friction.
 * No app download, no website visit — just send a message.
 *
 * World-first: Voice note booking via WhatsApp speech-to-text.
 */

export type ConversationState =
  | 'idle'
  | 'greeting'
  | 'identifying_service'
  | 'identifying_professional'
  | 'identifying_datetime'
  | 'showing_availability'
  | 'confirming_booking'
  | 'processing_payment'
  | 'booking_complete'
  | 'handling_cancellation'
  | 'handling_reschedule'
  | 'faq'
  | 'handoff_to_human';

export type WhatsAppMessageType = 'text' | 'voice_note' | 'image' | 'location' | 'button_reply' | 'list_reply';

export interface WhatsAppConversation {
  id: string;
  businessId: string;
  /** Customer's WhatsApp phone number (with country code). */
  customerPhone: string;
  customerId?: string;
  /** Current state of the conversation flow. */
  state: ConversationState;
  /** Extracted booking intent from AI. */
  extractedIntent?: BookingIntent;
  /** Messages in this conversation session. */
  messages: WhatsAppMessage[];
  /** Whether the conversation has been handed off to a human. */
  isHandedOff: boolean;
  /** Human agent handling the conversation (if handed off). */
  handoffAgentId?: string;
  /** Session timeout (conversations expire after inactivity). */
  lastActivityAt: Date;
  createdAt: Date;
}

export interface WhatsAppMessage {
  id: string;
  conversationId: string;
  /** Direction: inbound from customer, outbound from AI/business. */
  direction: 'inbound' | 'outbound';
  type: WhatsAppMessageType;
  /** Text content (or transcription for voice notes). */
  text?: string;
  /** Original voice note URL (for voice_note type). */
  voiceNoteUrl?: string;
  /** Voice note duration in seconds. */
  voiceNoteDuration?: number;
  /** Whether this voice note was auto-transcribed. */
  isTranscribed?: boolean;
  /** Confidence score of AI intent extraction (0-1). */
  aiConfidence?: number;
  /** WhatsApp message ID for delivery tracking. */
  whatsappMessageId?: string;
  /** Delivery status. */
  deliveryStatus?: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
}

export interface BookingIntent {
  /** Detected service name or category. */
  serviceName?: string;
  serviceId?: string;
  /** Detected professional name. */
  professionalName?: string;
  professionalId?: string;
  /** Detected date (YYYY-MM-DD). */
  date?: string;
  /** Detected time (HH:mm). */
  time?: string;
  /** Number of people (for group bookings). */
  partySize?: number;
  /** Whether this is a home visit request. */
  isDomicilio?: boolean;
  /** Customer's address (for domicilio). */
  address?: string;
  /** Overall confidence of the extracted intent (0-1). */
  confidence: number;
}

export interface AiAgentConfig {
  id: string;
  businessId: string;
  /** Whether the AI agent is active. */
  isActive: boolean;
  /** Business greeting (first message when customer initiates). */
  greeting: string;
  /** Maximum AI turns before suggesting human handoff. */
  maxAiTurns: number;
  /** Languages the agent supports. */
  supportedLanguages: string[];
  /** Working hours for AI agent (outside = away message). */
  activeHours?: Record<number, { open: string; close: string }>;
  /** Away message when outside active hours. */
  awayMessage: string;
  /** Whether to accept voice notes. */
  acceptVoiceNotes: boolean;
  /** Whether to auto-confirm bookings or require human approval. */
  autoConfirmBookings: boolean;
  /** Keywords that trigger human handoff. */
  handoffKeywords: string[];
  createdAt: Date;
  updatedAt: Date;
}
