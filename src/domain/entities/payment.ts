/**
 * Colombian Payment Integration (Nequi / Daviplata / PSE / Wompi).
 *
 * Full integration with Colombia's payment rails: Nequi (21M+ users),
 * Daviplata (16M+ users), PSE bank transfers, Bancolombia button,
 * and traditional credit/debit cards — all through Wompi gateway.
 *
 * DIFFERENTIATOR: NO international competitor supports Colombian
 * payment methods. Fresha/Booksy/Square all use Stripe for US/EU
 * card-dominant markets. In Colombia, Nequi + Daviplata have 30M+
 * combined users and PSE handles 29% of online payments.
 *
 * Includes "Paga Después" (BNPL) micro-installments via Nequi
 * for premium services above a configurable threshold.
 */

export type PaymentMethodType =
  | 'nequi'
  | 'daviplata'
  | 'pse'
  | 'bancolombia_transfer'
  | 'bancolombia_button'
  | 'credit_card'
  | 'debit_card'
  | 'cash'
  | 'gift_card'
  | 'loyalty_points';

export type PaymentStatus =
  | 'pending'
  | 'approved'
  | 'declined'
  | 'voided'
  | 'refunded'
  | 'partially_refunded'
  | 'expired'
  | 'error';

export type InstallmentStatus = 'active' | 'completed' | 'defaulted' | 'cancelled';

export interface PaymentTransaction {
  id: string;
  businessId: string;
  bookingId?: string;
  customerId: string;
  /** Wompi transaction reference. */
  gatewayTransactionId?: string;
  /** Wompi payment link ID. */
  gatewayPaymentLinkId?: string;
  method: PaymentMethodType;
  amount: number;
  currency: string;
  /** Tip amount (separate from service amount). */
  tipAmount: number;
  /** Platform fee deducted. */
  platformFee: number;
  /** Net amount received by business. */
  netAmount: number;
  status: PaymentStatus;
  /** For PSE: bank code. */
  bankCode?: string;
  /** For Nequi/Daviplata: phone number used. */
  phoneNumber?: string;
  /** For cards: last 4 digits. */
  cardLast4?: string;
  /** For cards: brand (visa, mastercard, etc.). */
  cardBrand?: string;
  /** Refund reason (if refunded). */
  refundReason?: string;
  /** Associated electronic invoice ID. */
  invoiceId?: string;
  /** Whether a digital receipt was sent via WhatsApp. */
  receiptSentViaWhatsApp: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentGatewayConfig {
  id: string;
  businessId: string;
  /** Wompi public key. */
  gatewayPublicKey: string;
  /** Accepted payment methods. */
  acceptedMethods: PaymentMethodType[];
  /** Whether to enable installments (Paga Después). */
  installmentsEnabled: boolean;
  /** Minimum amount for installments (in COP). */
  installmentMinAmount: number;
  /** Maximum number of installments allowed. */
  maxInstallments: number;
  /** Nequi business phone number. */
  nequiPhoneNumber?: string;
  /** Whether to auto-send WhatsApp receipts. */
  autoSendWhatsAppReceipts: boolean;
  /** Whether to accept tips. */
  tipsEnabled: boolean;
  /** Suggested tip percentages. */
  suggestedTipPercents: number[];
  isActive: boolean;
  updatedAt: Date;
}

export interface InstallmentPlan {
  id: string;
  businessId: string;
  paymentTransactionId: string;
  customerId: string;
  /** Total amount of the plan. */
  totalAmount: number;
  /** Number of installments. */
  numberOfInstallments: number;
  /** Amount per installment. */
  installmentAmount: number;
  /** Installments paid so far. */
  paidInstallments: number;
  /** Amount remaining. */
  remainingAmount: number;
  currency: string;
  /** Payment method for automatic charges (nequi/daviplata). */
  autoChargeMethod: 'nequi' | 'daviplata';
  autoChargePhone: string;
  status: InstallmentStatus;
  /** Next charge date — "YYYY-MM-DD". */
  nextChargeDate: string;
  /** Individual installment records. */
  installments: InstallmentRecord[];
  createdAt: Date;
}

export interface InstallmentRecord {
  installmentNumber: number;
  amount: number;
  dueDate: string;
  paidAt?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'failed';
  gatewayTransactionId?: string;
}
