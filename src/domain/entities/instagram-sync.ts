/**
 * Instagram Portfolio Auto-Sync with "Book This Look" Deep Links.
 *
 * Auto-imports Instagram posts (via Graph API) into the professional's
 * Agendalo portfolio. Each imported photo generates a "Reserva Este
 * Look" (Book This Look) deep link. When tapped in the stylist's
 * Instagram bio/story, it opens the booking flow pre-populated with
 * the service, professional, and next available slots.
 *
 * DIFFERENTIATOR: Instagram is THE marketing channel for beauty
 * businesses in Colombia. No competitor has bi-directional Instagram
 * integration. This closes the loop between "I saw it on Instagram"
 * and "I booked it" in one tap.
 */

export type InstagramSyncStatus = 'connected' | 'disconnected' | 'expired' | 'error';

export interface InstagramConnection {
  id: string;
  businessId: string;
  professionalId: string;
  /** Instagram user ID. */
  instagramUserId: string;
  /** Instagram username. */
  instagramUsername: string;
  /** Instagram profile picture URL. */
  profilePictureUrl?: string;
  /** OAuth access token (encrypted). */
  accessToken: string;
  /** Token expiration date. */
  tokenExpiresAt: Date;
  /** Whether to auto-sync new posts. */
  autoSyncEnabled: boolean;
  /** Last successful sync timestamp. */
  lastSyncAt?: Date;
  /** Number of posts synced. */
  totalPostsSynced: number;
  status: InstagramSyncStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstagramPost {
  id: string;
  businessId: string;
  professionalId: string;
  instagramConnectionId: string;
  /** Instagram media ID. */
  instagramMediaId: string;
  /** Instagram post URL. */
  instagramPermalink: string;
  /** Media type. */
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  /** Media URL (image or thumbnail). */
  mediaUrl: string;
  /** Post caption. */
  caption?: string;
  /** Instagram engagement metrics. */
  likeCount: number;
  commentCount: number;
  /** Whether this post has been imported to the portfolio. */
  importedToPortfolio: boolean;
  /** Linked portfolio image ID. */
  portfolioImageId?: string;
  /** Auto-detected service from caption/tags. */
  detectedServiceId?: string;
  /** "Book This Look" deep link. */
  bookThisLookUrl?: string;
  /** Clicks on the "Book This Look" link. */
  bookThisLookClicks: number;
  /** Bookings generated from this post. */
  bookingConversions: number;
  postedAt: Date;
  syncedAt: Date;
}

export interface BookThisLookLink {
  id: string;
  businessId: string;
  professionalId: string;
  instagramPostId: string;
  serviceId: string;
  /** Short URL for sharing (e.g., agendalo.co/look/abc123). */
  shortUrl: string;
  /** Full booking URL with pre-populated params. */
  fullBookingUrl: string;
  /** Pre-formatted message for Instagram bio/story. */
  instagramCaption: string;
  clickCount: number;
  conversionCount: number;
  createdAt: Date;
}
