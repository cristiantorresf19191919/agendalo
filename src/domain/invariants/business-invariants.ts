import { MembershipPlan, getProfessionalLimit } from '../entities/business';

export class BusinessInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessInvariantError';
  }
}

export function assertProfessionalLimit(
  plan: MembershipPlan,
  currentCount: number
): void {
  const limit = getProfessionalLimit(plan);
  if (currentCount >= limit) {
    throw new BusinessInvariantError(
      `Plan "${plan}" allows a maximum of ${limit === Infinity ? 'unlimited' : limit} professional(s). Current count: ${currentCount}`
    );
  }
}
