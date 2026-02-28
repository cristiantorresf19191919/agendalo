import type { Review, BusinessRatingAggregate, ProfessionalRatingAggregate } from '@/domain/entities/review';

export interface CreateReviewInput {
  businessId: string;
  professionalId: string;
  customerId: string;
  bookingId: string;
  serviceId: string;
  rating: number;
  serviceQualityRating?: number;
  punctualityRating?: number;
  cleanlinessRating?: number;
  valuForMoneyRating?: number;
  text?: string;
  photoUrls?: string[];
}

export interface ReviewRepository {
  getById(id: string): Promise<Review | null>;
  listByBusiness(businessId: string, limit?: number): Promise<Review[]>;
  listByProfessional(professionalId: string, limit?: number): Promise<Review[]>;
  getByBookingId(bookingId: string): Promise<Review | null>;
  create(input: CreateReviewInput): Promise<Review>;
  update(id: string, data: Partial<Review>): Promise<void>;
}

export interface BusinessRatingRepository {
  getByBusinessId(businessId: string): Promise<BusinessRatingAggregate | null>;
  upsert(data: BusinessRatingAggregate): Promise<void>;
}

export interface ProfessionalRatingRepository {
  getByProfessionalId(professionalId: string, businessId: string): Promise<ProfessionalRatingAggregate | null>;
  upsert(data: ProfessionalRatingAggregate): Promise<void>;
}
