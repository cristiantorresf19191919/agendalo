import type { InstagramConnection, InstagramPost, BookThisLookLink } from '@/domain/entities/instagram-sync';

export interface InstagramConnectionRepository {
  getByProfessional(professionalId: string): Promise<InstagramConnection | null>;
  listByBusiness(businessId: string): Promise<InstagramConnection[]>;
  create(data: Omit<InstagramConnection, 'id' | 'createdAt' | 'updatedAt'>): Promise<InstagramConnection>;
  update(id: string, data: Partial<InstagramConnection>): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface InstagramPostRepository {
  getById(id: string): Promise<InstagramPost | null>;
  listByProfessional(professionalId: string, limit?: number): Promise<InstagramPost[]>;
  listByBusiness(businessId: string, limit?: number): Promise<InstagramPost[]>;
  create(data: Omit<InstagramPost, 'id'>): Promise<InstagramPost>;
  update(id: string, data: Partial<InstagramPost>): Promise<void>;
}

export interface BookThisLookLinkRepository {
  getById(id: string): Promise<BookThisLookLink | null>;
  getByInstagramPost(instagramPostId: string): Promise<BookThisLookLink | null>;
  create(data: Omit<BookThisLookLink, 'id' | 'createdAt' | 'clickCount' | 'conversionCount'>): Promise<BookThisLookLink>;
  incrementClickCount(id: string): Promise<void>;
  incrementConversionCount(id: string): Promise<void>;
}

export interface InstagramSyncPort {
  /** Fetch recent posts from Instagram Graph API. */
  fetchRecentPosts(accessToken: string, limit?: number): Promise<Array<{ mediaId: string; mediaUrl: string; mediaType: string; caption?: string; likeCount: number; commentCount: number; permalink: string; timestamp: string }>>;
  /** Refresh an expiring access token. */
  refreshAccessToken(accessToken: string): Promise<{ accessToken: string; expiresAt: Date }>;
}
