import type { PortfolioImage } from '@/domain/entities/portfolio';

export interface CreatePortfolioImageInput {
  businessId: string;
  professionalId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  tags: string[];
  serviceId?: string;
  sortOrder?: number;
}

export interface PortfolioRepository {
  create(input: CreatePortfolioImageInput): Promise<PortfolioImage>;
  getById(id: string): Promise<PortfolioImage | null>;
  getByProfessionalId(professionalId: string): Promise<PortfolioImage[]>;
  getByBusinessId(businessId: string): Promise<PortfolioImage[]>;
  getByTag(businessId: string, tag: string): Promise<PortfolioImage[]>;
  incrementBookingCount(id: string): Promise<void>;
  update(id: string, data: Partial<CreatePortfolioImageInput>): Promise<PortfolioImage>;
  reorder(ids: string[]): Promise<void>;
  delete(id: string): Promise<void>;
}
