/**
 * Pure domain service for computing dynamic prices.
 * Applies pricing rules (off-peak discounts, seasonal promos)
 * to a service price based on date, time, and day of week.
 */

import type { PricingRule, ComputedPrice } from '@/domain/entities/pricing-rule';
import { timeToMinutes } from '@/domain/value-objects/time-slot';

/**
 * Compute the final price after applying the best matching pricing rule.
 *
 * Rules are evaluated in priority order (highest priority wins).
 * Only one rule is applied — no stacking.
 */
export function computeDynamicPrice(
  originalPrice: number,
  rules: PricingRule[],
  date: string,     // "YYYY-MM-DD"
  time: string,     // "HH:mm"
): ComputedPrice {
  if (rules.length === 0) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discountPercent: 0,
      appliedRuleId: null,
      ruleName: null,
    };
  }

  const d = new Date(date + 'T00:00:00');
  const dayOfWeek = d.getDay();
  const timeMinutes = timeToMinutes(time);

  // Sort by priority descending — highest priority checked first
  const sorted = [...rules]
    .filter((r) => r.isActive)
    .sort((a, b) => b.priority - a.priority);

  for (const rule of sorted) {
    // Check day of week
    if (!rule.daysOfWeek.includes(dayOfWeek)) continue;

    // Check time window
    const ruleStart = timeToMinutes(rule.timeStart);
    const ruleEnd = timeToMinutes(rule.timeEnd);
    if (timeMinutes < ruleStart || timeMinutes >= ruleEnd) continue;

    // Check date validity
    if (rule.validFrom && date < rule.validFrom) continue;
    if (rule.validUntil && date > rule.validUntil) continue;

    // Compute discount
    let discountAmount: number;
    let discountPercent: number;

    if (rule.discountType === 'percentage') {
      discountPercent = rule.discountPercent ?? 0;
      discountAmount = Math.round(originalPrice * discountPercent / 100);
    } else {
      discountAmount = rule.discountAmount ?? 0;
      discountPercent = originalPrice > 0
        ? Math.round((discountAmount / originalPrice) * 100)
        : 0;
    }

    const discountedPrice = Math.max(0, originalPrice - discountAmount);

    return {
      originalPrice,
      discountedPrice,
      discountPercent,
      appliedRuleId: rule.id,
      ruleName: rule.name,
    };
  }

  return {
    originalPrice,
    discountedPrice: originalPrice,
    discountPercent: 0,
    appliedRuleId: null,
    ruleName: null,
  };
}
