import { Service } from '../domain/entities/service';

export interface CreateServiceInput {
  businessId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  currency: string;
  imageUrl?: string;
  category?: string;
}

export interface ServiceRepository {
  create(input: CreateServiceInput): Promise<Service>;
  getById(id: string): Promise<Service | null>;
  getByBusinessId(businessId: string): Promise<Service[]>;
  update(id: string, data: Partial<Service>): Promise<Service>;
  toggleActive(id: string, isActive: boolean): Promise<void>;
  delete(id: string): Promise<void>;
}
