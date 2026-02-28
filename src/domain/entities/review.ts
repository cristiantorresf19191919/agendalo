/**
 * Review & Rating System with Verified Bookings.
 *
 * Only customers who completed a booking can leave a review,
 * ensuring authenticity. Supports photo reviews, business
 * responses, and per-professional ratings.
 *
 * DIFFERENTIATOR: Verified-only reviews build trust. Photo
 * reviews (before/after) serve as social proof AND portfolio
 * content. Business owners can respond publicly.
 */

export interface Review {
  id: string;
  businessId: string;
  professionalId: string;
  customerId: string;
  /** The booking that qualifies this review. Must be 'completed'. */
  bookingId: string;
  serviceId: string;
  /** Overall rating (1-5). */
  rating: number;
  /** Individual aspect ratings. */
  serviceQualityRating?: number;    // 1-5
  punctualityRating?: number;       // 1-5
  cleanlinessRating?: number;       // 1-5
  valuForMoneyRating?: number;      // 1-5
  /** Written review text. */
  text?: string;
  /** Photo URLs (before/after, results). */
  photoUrls: string[];
  /** Whether the review is verified (booking was completed). */
  isVerified: boolean;
  /** Business owner's response. */
  businessResponse?: string;
  businessResponseAt?: Date;
  /** Helpful votes from other customers. */
  helpfulCount: number;
  /** Whether the review is visible (can be hidden by moderation). */
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessRatingAggregate {
  businessId: string;
  totalReviews: number;
  averageRating: number;
  averageServiceQuality: number;
  averagePunctuality: number;
  averageCleanliness: number;
  averageValueForMoney: number;
  /** Distribution: how many 1-star, 2-star, etc. */
  ratingDistribution: Record<number, number>;
  /** Photo review count. */
  photoReviewCount: number;
  lastReviewAt: Date;
  updatedAt: Date;
}

export interface ProfessionalRatingAggregate {
  professionalId: string;
  businessId: string;
  totalReviews: number;
  averageRating: number;
  lastReviewAt: Date;
  updatedAt: Date;
}
