/**
 * Referral Program — Viral Customer Acquisition.
 *
 * Each customer gets a unique referral code. When a new customer
 * books using that code, BOTH get rewards (points, discounts, or
 * free services). This creates a Calendly-style viral loop
 * specifically designed for the beauty/wellness industry.
 *
 * DIFFERENTIATOR: No LATAM booking app has a proper referral system.
 * Combined with WhatsApp sharing (the dominant channel), this becomes
 * a powerful growth engine.
 */

export type ReferralStatus = 'pending' | 'completed' | 'expired' | 'rewarded';
export type ReferralRewardType = 'points' | 'discount_percent' | 'free_service';

export interface ReferralProgram {
  id: string;
  businessId: string;
  /** Reward for the referrer when their referral completes a booking. */
  referrerReward: ReferralReward;
  /** Reward for the new customer on their first booking. */
  refereeReward: ReferralReward;
  /** Maximum referrals per customer (0 = unlimited). */
  maxReferralsPerCustomer: number;
  /** Days before a pending referral expires. */
  expirationDays: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReferralReward {
  type: ReferralRewardType;
  /** Points awarded when type is 'points'. */
  points?: number;
  /** Discount percentage when type is 'discount_percent'. */
  discountPercent?: number;
  /** Service ID for free service when type is 'free_service'. */
  freeServiceId?: string;
}

export interface ReferralCode {
  id: string;
  businessId: string;
  customerId: string;
  code: string;              // e.g., "MARIA2024", auto-generated
  /** Pre-built WhatsApp share URL. */
  whatsappShareUrl: string;
  /** Pre-built general share URL. */
  shareUrl: string;
  totalReferrals: number;
  successfulReferrals: number;
  createdAt: Date;
}

export interface Referral {
  id: string;
  businessId: string;
  referrerCustomerId: string;
  refereeCustomerId: string;
  referralCodeId: string;
  status: ReferralStatus;
  /** Booking ID that completed the referral. */
  completingBookingId?: string;
  referrerRewardedAt?: Date;
  refereeRewardedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
}
