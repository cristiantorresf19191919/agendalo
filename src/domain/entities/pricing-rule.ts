/**
 * Dynamic Pricing / Off-Peak Discounts.
 * Allows businesses to display crossed-out prices and discounts
 * for appointments booked during slow hours or specific time windows.
 */

export type DiscountType = 'percentage' | 'fixed';

export interface PricingRule {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  /** Which services this rule applies to. Empty = all services. */
  serviceIds: string[];
  /** Days of week this rule applies (0=Sunday..6=Saturday). */
  daysOfWeek: number[];
  /** Time window start — "HH:mm" */
  timeStart: string;
  /** Time window end — "HH:mm" */
  timeEnd: string;
  discountType: DiscountType;
  /** Percentage off (0-100) when type is 'percentage'. */
  discountPercent?: number;
  /** Fixed amount off when type is 'fixed'. */
  discountAmount?: number;
  /** Optional date range (e.g. seasonal promos). */
  validFrom?: string;        // "YYYY-MM-DD"
  validUntil?: string;       // "YYYY-MM-DD"
  /** Priority for stacking rules (higher = takes precedence). */
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Computed price after applying applicable pricing rules.
 */
export interface ComputedPrice {
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  appliedRuleId: string | null;
  ruleName: string | null;
}
