/**
 * Loyalty & Rewards Program.
 *
 * Customers earn points for every booking. Points unlock tiers
 * (Bronze → Silver → Gold → Platinum) with increasing perks
 * like priority booking, free services, and exclusive discounts.
 *
 * DIFFERENTIATOR: Unlike Fresha/Booksy which have basic loyalty,
 * Agendalo offers a full gamified tier system with automatic
 * tier progression and business-customizable reward catalog.
 */

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface LoyaltyProgram {
  id: string;
  businessId: string;
  /** Points earned per currency unit spent (e.g., 1 point per 1000 COP). */
  pointsPerCurrencyUnit: number;
  /** Currency unit divisor (e.g., 1000 means 1 point per 1000 COP). */
  currencyUnitDivisor: number;
  /** Bonus points for first-time booking. */
  firstBookingBonus: number;
  /** Bonus points for completing a review after booking. */
  reviewBonus: number;
  /** Bonus points for successful referral. */
  referralBonus: number;
  tiers: LoyaltyTierConfig[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyTierConfig {
  tier: LoyaltyTier;
  /** Minimum points to reach this tier. */
  minPoints: number;
  /** Discount percentage for this tier (0-100). */
  discountPercent: number;
  /** Whether this tier gets priority booking (earlier access to slots). */
  priorityBooking: boolean;
  /** Free service every N bookings (0 = disabled). */
  freeServiceEveryN: number;
  /** Custom perks description. */
  perks: string[];
}

export interface CustomerLoyalty {
  id: string;
  customerId: string;
  businessId: string;
  totalPointsEarned: number;
  currentPoints: number;
  currentTier: LoyaltyTier;
  totalBookings: number;
  totalSpent: number;
  currency: string;
  /** Date of first booking with this business. */
  memberSince: Date;
  updatedAt: Date;
}

export type PointsTransactionType =
  | 'earned_booking'
  | 'earned_referral'
  | 'earned_review'
  | 'earned_first_booking'
  | 'redeemed_discount'
  | 'redeemed_free_service'
  | 'expired'
  | 'adjustment';

export interface PointsTransaction {
  id: string;
  customerId: string;
  businessId: string;
  type: PointsTransactionType;
  points: number;           // positive = earned, negative = spent
  /** Reference to the related entity (booking, review, etc.). */
  referenceId?: string;
  description: string;
  createdAt: Date;
}
