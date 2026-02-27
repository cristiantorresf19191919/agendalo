import { ServiceRepository, CreateServiceInput } from '../../ports/service-repository';
import { StoragePort } from '../../ports/storage-port';
import { Service } from '../../domain/entities/service';

export class CreateService {
  constructor(
    private serviceRepo: ServiceRepository,
    private storage: StoragePort
  ) {}

  async execute(input: CreateServiceInput, imageFile?: File | Blob): Promise<Service> {
    let imageUrl: string | undefined;
    if (imageFile) {
      const path = `services/${input.businessId}/${Date.now()}`;
      imageUrl = await this.storage.uploadImage(path, imageFile);
    }
    return this.serviceRepo.create({ ...input, imageUrl });
  }
}

export class UpdateService {
  constructor(
    private serviceRepo: ServiceRepository,
    private storage: StoragePort
  ) {}

  async execute(id: string, data: Partial<Service>, imageFile?: File | Blob): Promise<Service> {
    if (imageFile) {
      const service = await this.serviceRepo.getById(id);
      if (!service) throw new Error('Service not found');
      const path = `services/${service.businessId}/${Date.now()}`;
      data.imageUrl = await this.storage.uploadImage(path, imageFile);
    }
    return this.serviceRepo.update(id, data);
  }
}

export class DeleteService {
  constructor(private serviceRepo: ServiceRepository) {}

  async execute(id: string): Promise<void> {
    await this.serviceRepo.delete(id);
  }
}
