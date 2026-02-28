import type { ClientProfile, ClientNote, ClientJourneyEvent } from '@/domain/entities/client-profile';

export interface CreateClientProfileInput {
  customerId: string;
  businessId: string;
  preferences?: Partial<ClientProfile['preferences']>;
  tags?: string[];
  allergies?: string[];
  preferredChannel?: ClientProfile['preferredChannel'];
  preferredLocale?: string;
  birthday?: string;
  acquisitionSource?: ClientProfile['acquisitionSource'];
}

export interface ClientProfileRepository {
  getByCustomerAndBusiness(customerId: string, businessId: string): Promise<ClientProfile | null>;
  listByBusiness(businessId: string): Promise<ClientProfile[]>;
  searchByTags(businessId: string, tags: string[]): Promise<ClientProfile[]>;
  create(input: CreateClientProfileInput): Promise<ClientProfile>;
  update(id: string, data: Partial<ClientProfile>): Promise<void>;
  addNote(profileId: string, note: Omit<ClientNote, 'id' | 'createdAt'>): Promise<ClientNote>;
  removeNote(profileId: string, noteId: string): Promise<void>;
}

export interface ClientJourneyRepository {
  listByCustomer(customerId: string, businessId: string, limit?: number): Promise<ClientJourneyEvent[]>;
  create(data: Omit<ClientJourneyEvent, 'id' | 'createdAt'>): Promise<ClientJourneyEvent>;
}
