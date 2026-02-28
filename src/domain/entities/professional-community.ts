/**
 * Professional Community Hub ("Comunidad de Profesionales").
 *
 * A professional network where stylists, barbers, and beauty
 * professionals share techniques, access education, find substitutes
 * when they need days off, and discover supply deals from local
 * distributors.
 *
 * DIFFERENTIATOR: No booking platform has a professional community
 * layer. In Colombia, where many beauty professionals are independent
 * contractors or work from home ("a domicilio"), creating a
 * professional network adds retention value beyond the booking tool.
 */

export type PostCategory =
  | 'technique_share'
  | 'before_after'
  | 'product_review'
  | 'education'
  | 'supply_deal'
  | 'substitute_request'
  | 'job_opportunity'
  | 'general';

export type SubstituteRequestStatus = 'open' | 'accepted' | 'completed' | 'cancelled';

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  /** Author's business (optional, for context). */
  businessId?: string;
  businessName?: string;
  category: PostCategory;
  title: string;
  body: string;
  /** Attached images/videos. */
  mediaUrls: string[];
  /** Tags for discoverability. */
  tags: string[];
  /** Like count. */
  likeCount: number;
  /** Comment count. */
  commentCount: number;
  /** Save/bookmark count. */
  saveCount: number;
  /** Whether this post is pinned (by moderator). */
  isPinned: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  text: string;
  likeCount: number;
  /** Parent comment ID (for replies). */
  parentCommentId?: string;
  createdAt: Date;
}

export interface SubstituteRequest {
  id: string;
  /** Professional requesting a substitute. */
  requesterId: string;
  requesterName: string;
  businessId: string;
  businessName: string;
  /** Date needing coverage — "YYYY-MM-DD". */
  date: string;
  /** Hours needing coverage. */
  startTime: string;
  endTime: string;
  /** Services that need coverage. */
  serviceIds: string[];
  serviceNames: string[];
  /** Compensation offered. */
  compensationType: 'percentage' | 'fixed' | 'negotiable';
  compensationAmount?: number;
  currency: string;
  /** Additional notes. */
  notes?: string;
  /** Professional who accepted. */
  acceptedById?: string;
  acceptedByName?: string;
  status: SubstituteRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierDeal {
  id: string;
  /** Supplier or distributor name. */
  supplierName: string;
  /** Contact info. */
  contactPhone?: string;
  contactWhatsApp?: string;
  /** Deal details. */
  title: string;
  description: string;
  /** Product category. */
  productCategory: string;
  /** Discount percentage or special price. */
  discountPercent?: number;
  specialPrice?: number;
  currency: string;
  /** Image of products. */
  imageUrl?: string;
  /** Cities where available. */
  availableCities: string[];
  /** Barrios where delivery is available. */
  deliveryBarrios?: string[];
  /** Expiration date — "YYYY-MM-DD". */
  validUntil: string;
  /** Number of professionals who claimed this deal. */
  claimCount: number;
  isActive: boolean;
  createdAt: Date;
}
