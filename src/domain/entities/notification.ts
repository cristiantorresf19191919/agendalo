/**
 * Smart Notifications & Reminder System.
 *
 * In-app notification center with configurable reminders
 * (24h before, 1h before, etc.). Supports WhatsApp link
 * generation for the LATAM market where WhatsApp is dominant.
 *
 * DIFFERENTIATOR: WhatsApp-first reminders are critical in
 * Colombia/LATAM. Combined with smart timing (send reminders
 * when customers are most likely to engage), this reduces
 * no-shows by up to 40%.
 */

export type NotificationType =
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_reminder'
  | 'booking_completed'
  | 'waitlist_spot_available'
  | 'review_request'
  | 'loyalty_tier_upgrade'
  | 'loyalty_reward_available'
  | 'referral_completed'
  | 'gift_card_received'
  | 'recurring_upcoming'
  | 'promotion'
  | 'system';

export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'whatsapp' | 'push';
export type NotificationStatus = 'unread' | 'read' | 'dismissed';

export interface Notification {
  id: string;
  recipientId: string;         // customer or professional user ID
  recipientType: 'customer' | 'professional' | 'business_owner';
  businessId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  /** Deep link within the app. */
  actionUrl?: string;
  /** Action button label. */
  actionLabel?: string;
  /** Related entity ID (booking, review, etc.). */
  referenceId?: string;
  status: NotificationStatus;
  readAt?: Date;
  /** For WhatsApp: pre-formatted message text. */
  whatsappMessage?: string;
  /** For WhatsApp: generated click-to-chat URL. */
  whatsappUrl?: string;
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt: Date;
}

export interface ReminderConfig {
  id: string;
  businessId: string;
  /** Reminder intervals before appointment (in minutes). */
  reminderIntervals: number[];   // e.g., [1440, 60] = 24h + 1h before
  /** Channels to use for each interval. */
  channelPreferences: NotificationChannel[];
  /** Whether to send a review request after completion. */
  sendReviewRequest: boolean;
  /** Hours after completion to send review request. */
  reviewRequestDelayHours: number;
  /** Whether to send waitlist notifications. */
  sendWaitlistNotifications: boolean;
  /** WhatsApp business phone number for message templates. */
  whatsappBusinessPhone?: string;
  isActive: boolean;
  updatedAt: Date;
}
