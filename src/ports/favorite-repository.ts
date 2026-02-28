import type { Favorite, RebookSnapshot } from '@/domain/entities/favorite';

export interface CreateFavoriteInput {
  customerId: string;
  businessId: string;
  professionalId?: string;
}

export interface FavoriteRepository {
  create(input: CreateFavoriteInput): Promise<Favorite>;
  getByCustomerId(customerId: string): Promise<Favorite[]>;
  exists(customerId: string, businessId: string): Promise<boolean>;
  delete(id: string): Promise<void>;
}

export interface RebookSnapshotRepository {
  /** Upsert a rebook snapshot (increment timesBooked if exists). */
  upsert(snapshot: Omit<RebookSnapshot, 'id' | 'updatedAt'>): Promise<RebookSnapshot>;
  /** Get the customer's most recent rebook snapshots, ordered by lastBookedDate desc. */
  getByCustomerId(customerId: string, limit?: number): Promise<RebookSnapshot[]>;
  delete(id: string): Promise<void>;
}
