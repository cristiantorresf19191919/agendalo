import { BlockedRangeRepository, CreateBlockedRangeInput } from '../../ports/blocked-range-repository';
import { BlockedRange } from '../../domain/entities/blocked-range';

export class CreateBlockedRange {
  constructor(private blockedRangeRepo: BlockedRangeRepository) {}

  async execute(input: CreateBlockedRangeInput): Promise<BlockedRange> {
    return this.blockedRangeRepo.create(input);
  }
}

export class DeleteBlockedRange {
  constructor(private blockedRangeRepo: BlockedRangeRepository) {}

  async execute(id: string): Promise<void> {
    await this.blockedRangeRepo.delete(id);
  }
}
