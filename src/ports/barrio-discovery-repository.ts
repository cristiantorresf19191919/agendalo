import type { Barrio, BarrioTrend, NeighborhoodSocialProof } from '@/domain/entities/barrio-discovery';

export interface BarrioRepository {
  getById(id: string): Promise<Barrio | null>;
  getByName(name: string, city: string): Promise<Barrio | null>;
  listByCity(city: string): Promise<Barrio[]>;
  listTrending(city: string, limit?: number): Promise<Barrio[]>;
  search(query: string, city: string): Promise<Barrio[]>;
  create(data: Omit<Barrio, 'id'>): Promise<Barrio>;
  update(id: string, data: Partial<Barrio>): Promise<void>;
}

export interface BarrioTrendRepository {
  getByBarrio(barrioId: string, period: string): Promise<BarrioTrend | null>;
  listByCity(city: string, period: string): Promise<BarrioTrend[]>;
  upsert(data: Omit<BarrioTrend, 'id'>): Promise<void>;
}

export interface NeighborhoodSocialProofRepository {
  getByBusinessAndBarrio(businessId: string, barrioId: string): Promise<NeighborhoodSocialProof | null>;
  listByBarrio(barrioId: string): Promise<NeighborhoodSocialProof[]>;
  upsert(data: Omit<NeighborhoodSocialProof, 'id'>): Promise<void>;
}
