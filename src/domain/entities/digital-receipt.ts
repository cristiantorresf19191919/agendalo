/**
 * WhatsApp Digital Receipt with Tipping & Viral Referral
 * ("Recibo por WhatsApp").
 *
 * After every service, sends a rich WhatsApp message combining:
 * - Digital receipt with service details and price
 * - One-tap "Dar Propina" (Give Tip) via Nequi/Daviplata
 * - "Dejar Reseña" (Leave Review) deep link
 * - Referral code with "Comparte con tus amigos" prompt
 * - Loyalty points earned summary
 *
 * DIFFERENTIATOR: No competitor combines receipt + tip + review +
 * referral into a single WhatsApp message. For Colombia, where
 * tipping is common but cash tips mean the professional may not
 * receive them, a direct digital tip creates transparency.
 */

export type TipStatus = 'pending' | 'completed' | 'failed' | 'expired';

export interface DigitalReceipt {
  id: string;
  businessId: string;
  bookingId: string;
  customerId: string;
  professionalId: string;
  /** Service details for the receipt. */
  serviceName: string;
  servicePrice: number;
  /** Duration of service in minutes. */
  durationMinutes: number;
  /** Surcharges (domicilio, etc.). */
  surcharges: ReceiptSurcharge[];
  /** Discounts applied. */
  discounts: ReceiptDiscount[];
  /** Total amount paid. */
  totalAmount: number;
  /** Payment method used. */
  paymentMethod: string;
  currency: string;
  /** Tip information. */
  tipTransaction?: TipTransaction;
  /** Loyalty points earned from this visit. */
  loyaltyPointsEarned: number;
  /** Customer's current loyalty tier after this visit. */
  currentLoyaltyTier?: string;
  /** Customer's total points after this visit. */
  currentTotalPoints?: number;
  /** Referral code included in receipt. */
  referralCode?: string;
  /** Review deep link. */
  reviewUrl?: string;
  /** Whether the receipt has been sent via WhatsApp. */
  sentViaWhatsApp: boolean;
  sentAt?: Date;
  /** WhatsApp message ID for delivery tracking. */
  whatsappMessageId?: string;
  createdAt: Date;
}

export interface ReceiptSurcharge {
  label: string;
  amount: number;
}

export interface ReceiptDiscount {
  label: string;
  amount: number;
  /** Source of discount (loyalty, gift card, promotion, etc.). */
  source: 'loyalty' | 'gift_card' | 'promotion' | 'bundle' | 'referral' | 'manual';
}

export interface TipTransaction {
  id: string;
  receiptId: string;
  businessId: string;
  professionalId: string;
  customerId: string;
  /** Tip amount. */
  amount: number;
  currency: string;
  /** Payment method for tip. */
  paymentMethod: 'nequi' | 'daviplata' | 'cash' | 'card';
  /** Phone number used for payment (Nequi/Daviplata). */
  paymentPhone?: string;
  status: TipStatus;
  /** Gateway transaction ID. */
  gatewayTransactionId?: string;
  paidAt?: Date;
  createdAt: Date;
}

/**
 * Generate a WhatsApp receipt message.
 * Pure function — no side effects.
 */
export function buildReceiptWhatsAppMessage(params: {
  customerName: string;
  businessName: string;
  serviceName: string;
  professionalName: string;
  date: string;
  totalAmount: string;
  paymentMethod: string;
  loyaltyPointsEarned: number;
  loyaltyTier?: string;
  tipUrl?: string;
  reviewUrl?: string;
  referralCode?: string;
}): string {
  const lines = [
    `Recibo de ${params.businessName}`,
    '',
    `Hola ${params.customerName}!`,
    `Gracias por tu visita.`,
    '',
    `Servicio: ${params.serviceName}`,
    `Profesional: ${params.professionalName}`,
    `Fecha: ${params.date}`,
    `Total: ${params.totalAmount}`,
    `Pago: ${params.paymentMethod}`,
  ];

  if (params.loyaltyPointsEarned > 0) {
    lines.push('', `+${params.loyaltyPointsEarned} puntos de fidelidad ganados`);
    if (params.loyaltyTier) {
      lines.push(`Nivel actual: ${params.loyaltyTier}`);
    }
  }

  if (params.tipUrl) {
    lines.push('', `Dar propina a ${params.professionalName}: ${params.tipUrl}`);
  }

  if (params.reviewUrl) {
    lines.push('', `Deja tu reseña: ${params.reviewUrl}`);
  }

  if (params.referralCode) {
    lines.push('', `Comparte con tus amigos y ambos ganan!`, `Código: ${params.referralCode}`);
  }

  lines.push('', `Reservado con Agendalo`);

  return lines.join('\n');
}
