/**
 * WhatsApp Integration & Smart Sharing.
 *
 * Deep WhatsApp integration for the LATAM market where 96% of
 * smartphone users have WhatsApp. Generates click-to-chat links,
 * booking confirmations, and shareable business cards.
 *
 * DIFFERENTIATOR: WhatsApp is THE communication channel in
 * Colombia/LATAM. While competitors treat it as an afterthought,
 * Agendalo makes it a first-class citizen — booking confirmations,
 * reminders, sharing, and customer support all flow through WhatsApp.
 */

export interface WhatsAppConfig {
  id: string;
  businessId: string;
  /** Business WhatsApp phone number (with country code). */
  phoneNumber: string;
  /** Business display name on WhatsApp. */
  displayName: string;
  /** Whether to send booking confirmations via WhatsApp. */
  sendBookingConfirmations: boolean;
  /** Whether to send reminders via WhatsApp. */
  sendReminders: boolean;
  /** Default greeting message for new customers. */
  greetingMessage: string;
  /** Away message when outside business hours. */
  awayMessage: string;
  /** Quick reply templates. */
  quickReplies: WhatsAppQuickReply[];
  isActive: boolean;
  updatedAt: Date;
}

export interface WhatsAppQuickReply {
  id: string;
  label: string;
  message: string;
}

export interface ShareableBookingLink {
  id: string;
  businessId: string;
  /** Type of shareable link. */
  type: 'business_profile' | 'specific_service' | 'specific_professional' | 'promotion' | 'gift_card' | 'referral';
  /** Reference ID (service, professional, promo, etc.). */
  referenceId?: string;
  /** Short URL for sharing. */
  shortUrl: string;
  /** Full booking page URL. */
  fullUrl: string;
  /** Pre-formatted WhatsApp message with the link. */
  whatsappMessage: string;
  /** WhatsApp click-to-chat URL (wa.me link). */
  whatsappUrl: string;
  /** Click count for tracking. */
  clickCount: number;
  /** Bookings generated from this link. */
  conversionCount: number;
  createdAt: Date;
}

/**
 * Generate a WhatsApp click-to-chat URL.
 * Pure function — no side effects.
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Generate a booking confirmation message for WhatsApp.
 */
export function buildBookingConfirmationMessage(params: {
  customerName: string;
  businessName: string;
  serviceName: string;
  professionalName: string;
  date: string;
  time: string;
  price: string;
}): string {
  return [
    `Hola ${params.customerName}! Tu cita ha sido confirmada:`,
    '',
    `${params.businessName}`,
    `Servicio: ${params.serviceName}`,
    `Profesional: ${params.professionalName}`,
    `Fecha: ${params.date}`,
    `Hora: ${params.time}`,
    `Precio: ${params.price}`,
    '',
    `Reservado con Agendalo`,
  ].join('\n');
}
