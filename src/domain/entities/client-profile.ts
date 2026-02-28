/**
 * Client Insights, Preferences & Journey Timeline.
 *
 * Rich customer profiles that remember preferences (hair type,
 * allergies, preferred products, communication style). Full
 * journey timeline of every interaction. Internal notes for
 * professionals.
 *
 * DIFFERENTIATOR: Personalized service based on stored preferences
 * creates a "they know me" feeling that drives loyalty. The
 * journey timeline gives businesses CRM-like visibility without
 * needing a separate CRM tool.
 */

export interface ClientProfile {
  id: string;
  customerId: string;
  businessId: string;
  /** Client preferences (business-specific). */
  preferences: ClientPreferences;
  /** Tags for segmentation (VIP, first-timer, etc.). */
  tags: string[];
  /** Internal notes visible only to the business. */
  notes: ClientNote[];
  /** Allergies/sensitivities (critical for safety). */
  allergies: string[];
  /** Preferred communication channel. */
  preferredChannel: 'whatsapp' | 'email' | 'sms' | 'phone';
  /** Preferred language. */
  preferredLocale: string;
  /** Birthday for special promotions. */
  birthday?: string;             // "MM-DD"
  /** How the client discovered the business. */
  acquisitionSource?: 'referral' | 'google' | 'instagram' | 'whatsapp' | 'walk_in' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientPreferences {
  /** Hair-related (for salons/barbershops). */
  hairType?: string;
  hairLength?: string;
  preferredStyle?: string;
  /** Skin-related (for spas/clinics). */
  skinType?: string;
  skinConcerns?: string[];
  /** Nail-related. */
  nailShape?: string;
  preferredColors?: string[];
  /** Product preferences. */
  preferredProducts?: string[];
  /** Pressure preference (for massage). */
  pressurePreference?: 'light' | 'medium' | 'firm' | 'deep';
  /** Custom key-value preferences. */
  custom?: Record<string, string>;
}

export interface ClientNote {
  id: string;
  authorId: string;              // professional or business owner
  authorName: string;
  text: string;
  /** Whether this note is pinned to top. */
  isPinned: boolean;
  createdAt: Date;
}

export type JourneyEventType =
  | 'first_visit'
  | 'booking_created'
  | 'booking_completed'
  | 'booking_cancelled'
  | 'booking_no_show'
  | 'review_left'
  | 'referral_made'
  | 'loyalty_tier_change'
  | 'gift_card_purchased'
  | 'gift_card_redeemed'
  | 'bundle_purchased'
  | 'note_added'
  | 'preference_updated';

export interface ClientJourneyEvent {
  id: string;
  customerId: string;
  businessId: string;
  type: JourneyEventType;
  title: string;
  description?: string;
  /** Related entity ID. */
  referenceId?: string;
  /** Metadata (service name, amount, etc.). */
  metadata?: Record<string, string>;
  createdAt: Date;
}
