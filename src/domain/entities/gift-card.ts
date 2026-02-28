/**
 * Gift Cards & Vouchers.
 *
 * Customers can purchase digital gift cards for friends/family.
 * Businesses can create promotional vouchers. Both can be redeemed
 * during checkout. Gift cards have balances that decrease with use.
 *
 * DIFFERENTIATOR: Gift card functionality is rare in LATAM booking
 * apps. This creates a new revenue stream and drives new customer
 * acquisition through gifting.
 */

export type GiftCardStatus = 'active' | 'fully_redeemed' | 'expired' | 'cancelled';
export type GiftCardType = 'purchased' | 'promotional' | 'reward';

export interface GiftCard {
  id: string;
  businessId: string;
  /** Unique redemption code (e.g., "GIFT-ABCD-1234"). */
  code: string;
  type: GiftCardType;
  /** Original value of the card. */
  originalAmount: number;
  /** Remaining balance. */
  remainingBalance: number;
  currency: string;
  status: GiftCardStatus;
  /** Who purchased/created the card. */
  purchasedByCustomerId?: string;
  /** Recipient's name (for display). */
  recipientName?: string;
  /** Recipient's email (for delivery). */
  recipientEmail?: string;
  /** Personal message from buyer. */
  personalMessage?: string;
  /** Optional: restrict to specific services. */
  restrictedServiceIds?: string[];
  expiresAt?: Date;
  redeemedAt?: Date;
  createdAt: Date;
}

export interface GiftCardRedemption {
  id: string;
  giftCardId: string;
  bookingId: string;
  customerId: string;
  amountRedeemed: number;
  remainingBalanceAfter: number;
  createdAt: Date;
}

export interface GiftCardDesign {
  id: string;
  businessId: string;
  name: string;
  imageUrl: string;
  /** Preset amounts customers can choose from. */
  presetAmounts: number[];
  /** Whether custom amounts are allowed. */
  allowCustomAmount: boolean;
  minAmount: number;
  maxAmount: number;
  isActive: boolean;
}
