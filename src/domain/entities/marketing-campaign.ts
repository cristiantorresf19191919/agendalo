/**
 * WhatsApp Marketing Broadcasts with Smart Segmentation.
 *
 * Targeted WhatsApp broadcasts using Meta's Business API template
 * messages. Auto-generated segments from analytics: "clients at
 * churn risk," "birthday this week," "inactive 30+ days," "loyalty
 * tier upgrade available." Open rates: 98% WhatsApp vs 20% email.
 *
 * DIFFERENTIATOR: Fresha/Booksy/Zenoti offer email/SMS marketing.
 * Email is largely ignored in the Colombian beauty market. WhatsApp
 * messages have near-universal open rates. Combined with Agendalo's
 * existing client segmentation, this is the most effective
 * re-engagement tool in the market.
 */

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
export type CampaignChannel = 'whatsapp' | 'email' | 'sms' | 'push';
export type AudienceSegment =
  | 'all_clients'
  | 'at_risk_churn'
  | 'inactive_30_days'
  | 'inactive_60_days'
  | 'birthday_this_week'
  | 'birthday_this_month'
  | 'loyalty_bronze'
  | 'loyalty_silver'
  | 'loyalty_gold'
  | 'loyalty_platinum'
  | 'first_time_clients'
  | 'vip_clients'
  | 'no_review_left'
  | 'referral_eligible'
  | 'bundle_expiring'
  | 'custom';

export interface MarketingCampaign {
  id: string;
  businessId: string;
  name: string;
  /** Campaign channel. */
  channel: CampaignChannel;
  /** Target audience segment. */
  audienceSegment: AudienceSegment;
  /** Custom filter for 'custom' segment. */
  customFilter?: CampaignCustomFilter;
  /** WhatsApp template message (Meta-approved). */
  templateId?: string;
  /** Message content. */
  message: CampaignMessage;
  /** Schedule date/time (null = send immediately). */
  scheduledAt?: Date;
  /** Estimated audience size. */
  estimatedAudienceSize: number;
  /** Actual messages sent. */
  sentCount: number;
  /** Messages delivered. */
  deliveredCount: number;
  /** Messages read/opened. */
  readCount: number;
  /** Click-throughs on CTA. */
  clickCount: number;
  /** Bookings generated from this campaign. */
  conversionCount: number;
  /** Revenue attributed to this campaign. */
  attributedRevenue: number;
  currency: string;
  status: CampaignStatus;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignMessage {
  /** Header text or image URL. */
  header?: string;
  headerImageUrl?: string;
  /** Body text with {{variable}} placeholders. */
  body: string;
  /** Footer text. */
  footer?: string;
  /** CTA button. */
  ctaLabel?: string;
  ctaUrl?: string;
  /** Quick reply buttons. */
  quickReplies?: string[];
}

export interface CampaignCustomFilter {
  /** Minimum days since last visit. */
  minDaysSinceVisit?: number;
  /** Maximum days since last visit. */
  maxDaysSinceVisit?: number;
  /** Minimum lifetime spend. */
  minLifetimeSpend?: number;
  /** Specific service IDs (clients who booked these). */
  serviceIds?: string[];
  /** Specific professional IDs. */
  professionalIds?: string[];
  /** Client tags to include. */
  includeTags?: string[];
  /** Client tags to exclude. */
  excludeTags?: string[];
  /** Preferred communication channel. */
  preferredChannel?: string;
}

export interface MarketingTemplate {
  id: string;
  businessId: string;
  /** Template name (for internal reference). */
  name: string;
  /** WhatsApp template status (Meta approval). */
  whatsappApprovalStatus?: 'pending' | 'approved' | 'rejected';
  /** Template category. */
  category: 'reengagement' | 'promotion' | 'birthday' | 'loyalty' | 'referral' | 'review_request' | 'custom';
  /** Template message. */
  message: CampaignMessage;
  /** How many times this template has been used. */
  usageCount: number;
  /** Average conversion rate when used. */
  avgConversionRate: number;
  isActive: boolean;
  createdAt: Date;
}
