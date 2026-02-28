import type { CommunityPost, CommunityComment, SubstituteRequest, SupplierDeal } from '@/domain/entities/professional-community';

export interface CommunityPostRepository {
  getById(id: string): Promise<CommunityPost | null>;
  listRecent(limit?: number): Promise<CommunityPost[]>;
  listByCategory(category: CommunityPost['category'], limit?: number): Promise<CommunityPost[]>;
  listByAuthor(authorId: string): Promise<CommunityPost[]>;
  search(query: string): Promise<CommunityPost[]>;
  create(data: Omit<CommunityPost, 'id' | 'likeCount' | 'commentCount' | 'saveCount' | 'createdAt' | 'updatedAt'>): Promise<CommunityPost>;
  update(id: string, data: Partial<CommunityPost>): Promise<void>;
  incrementLikeCount(id: string): Promise<void>;
  decrementLikeCount(id: string): Promise<void>;
}

export interface CommunityCommentRepository {
  listByPost(postId: string): Promise<CommunityComment[]>;
  create(data: Omit<CommunityComment, 'id' | 'likeCount' | 'createdAt'>): Promise<CommunityComment>;
  delete(id: string): Promise<void>;
}

export interface SubstituteRequestRepository {
  getById(id: string): Promise<SubstituteRequest | null>;
  listOpen(city?: string): Promise<SubstituteRequest[]>;
  listByRequester(requesterId: string): Promise<SubstituteRequest[]>;
  create(data: Omit<SubstituteRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<SubstituteRequest>;
  update(id: string, data: Partial<SubstituteRequest>): Promise<void>;
}

export interface SupplierDealRepository {
  getById(id: string): Promise<SupplierDeal | null>;
  listActive(city?: string): Promise<SupplierDeal[]>;
  listByCategory(productCategory: string): Promise<SupplierDeal[]>;
  create(data: Omit<SupplierDeal, 'id' | 'claimCount' | 'createdAt'>): Promise<SupplierDeal>;
  update(id: string, data: Partial<SupplierDeal>): Promise<void>;
  incrementClaimCount(id: string): Promise<void>;
}
