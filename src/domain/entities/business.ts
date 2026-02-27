export type MembershipPlan = 'individual' | 'duo' | 'unlimited';

export interface Business {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  plan: MembershipPlan;
  maxProfessionals: number; // 1 for individual, 2 for duo, Infinity for unlimited
  currency: string;
  timezone: string;
  description?: string;
  coverImageUrl?: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function getProfessionalLimit(plan: MembershipPlan): number {
  const limits: Record<MembershipPlan, number> = {
    individual: 1,
    duo: 2,
    unlimited: Infinity,
  };
  return limits[plan];
}
