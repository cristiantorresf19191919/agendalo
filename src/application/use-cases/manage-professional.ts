import { ProfessionalRepository, CreateProfessionalInput } from '../../ports/professional-repository';
import { BusinessRepository } from '../../ports/business-repository';
import { assertProfessionalLimit } from '../../domain/invariants/business-invariants';
import { Professional, WeeklySchedule, ScheduleException } from '../../domain/entities/professional';

export class CreateProfessional {
  constructor(
    private professionalRepo: ProfessionalRepository,
    private businessRepo: BusinessRepository
  ) {}

  async execute(input: CreateProfessionalInput): Promise<Professional> {
    const business = await this.businessRepo.getById(input.businessId);
    if (!business) throw new Error('Business not found');

    const existing = await this.professionalRepo.getByBusinessId(input.businessId);
    assertProfessionalLimit(business.plan, existing.length);

    return this.professionalRepo.create(input);
  }
}

export class UpdateProfessionalSchedule {
  constructor(private professionalRepo: ProfessionalRepository) {}

  async execute(professionalId: string, schedule: WeeklySchedule): Promise<void> {
    await this.professionalRepo.updateSchedule(professionalId, schedule);
  }
}

export class ToggleProfessionalAvailability {
  constructor(private professionalRepo: ProfessionalRepository) {}

  async execute(professionalId: string, isActive: boolean): Promise<void> {
    await this.professionalRepo.toggleActive(professionalId, isActive);
  }
}

export class AddScheduleException {
  constructor(private professionalRepo: ProfessionalRepository) {}

  async execute(professionalId: string, exception: ScheduleException): Promise<void> {
    await this.professionalRepo.addException(professionalId, exception);
  }
}
