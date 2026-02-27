import { Business, MembershipPlan } from '../domain/entities/business';

export interface CreateBusinessInput {
  name: string;
  slug: string;
  ownerId: string;
  plan: MembershipPlan;
  currency: string;
  timezone: string;
  description?: string;
  coverImageUrl?: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  category?: string;
}

export interface BusinessSearchFilters {
  address?: string;
}

export interface BusinessRepository {
  create(input: CreateBusinessInput): Promise<Business>;
  getById(id: string): Promise<Business | null>;
  getBySlug(slug: string): Promise<Business | null>;
  getByOwnerId(ownerId: string): Promise<Business | null>;
  search(filters: BusinessSearchFilters): Promise<Business[]>;
  update(id: string, data: Partial<Business>): Promise<Business>;
  delete(id: string): Promise<void>;
}
