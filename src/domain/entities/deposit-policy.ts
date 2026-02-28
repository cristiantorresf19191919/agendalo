/**
 * No-Show Protection & Deposit Policy.
 * Allows businesses to require a percentage deposit upfront,
 * capture a card on file, and charge late-cancellation fees.
 */

export type DepositType = 'percentage' | 'fixed';
export type CancellationPenalty = 'none' | 'forfeit_deposit' | 'charge_fee';

export interface DepositPolicy {
  id: string;
  businessId: string;
  /** Whether deposits are required for bookings. */
  requireDeposit: boolean;
  depositType: DepositType;
  /** Percentage of service price (0-100) when type is 'percentage'. */
  depositPercent?: number;
  /** Fixed amount when type is 'fixed'. */
  depositAmount?: number;
  currency: string;
  /** Whether to capture a card on file even if no deposit. */
  captureCardOnFile: boolean;
  /** Hours before appointment that free cancellation is allowed. */
  freeCancellationHours: number;
  /** What happens if cancelled after the free period. */
  lateCancellationPenalty: CancellationPenalty;
  /** Fee charged on late cancellation (fixed amount or percentage). */
  lateCancellationFeePercent?: number;
  /** Policy for no-shows. */
  noShowPenalty: CancellationPenalty;
  noShowFeePercent?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Record of a deposit or penalty charge.
 */
export interface PaymentRecord {
  id: string;
  businessId: string;
  bookingId: string;
  customerId: string;
  type: 'deposit' | 'cancellation_fee' | 'no_show_fee' | 'refund';
  amount: number;
  currency: string;
  /** External payment provider reference (e.g. Stripe PaymentIntent ID). */
  externalPaymentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
}
