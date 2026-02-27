import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Service } from '../../domain/entities/service';
import { ServiceRepository, CreateServiceInput } from '../../ports/service-repository';

const COLLECTION = 'services';

function toService(id: string, data: Record<string, unknown>): Service {
  return {
    id,
    businessId: data.businessId as string,
    name: data.name as string,
    description: data.description as string,
    durationMinutes: data.durationMinutes as number,
    price: data.price as number,
    currency: data.currency as string,
    imageUrl: data.imageUrl as string | undefined,
    category: data.category as string | undefined,
    isActive: (data.isActive as boolean) ?? true,
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
  };
}

export class FirebaseServiceRepository implements ServiceRepository {
  async create(input: CreateServiceInput): Promise<Service> {
    const ref = doc(collection(db, COLLECTION));
    const data = { ...input, isActive: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
    await setDoc(ref, data);
    return toService(ref.id, { ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  }

  async getById(id: string): Promise<Service | null> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return toService(snap.id, snap.data());
  }

  async getByBusinessId(businessId: string): Promise<Service[]> {
    const q = query(collection(db, COLLECTION), where('businessId', '==', businessId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toService(d.id, d.data()));
  }

  async update(id: string, data: Partial<Service>): Promise<Service> {
    await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
    const updated = await this.getById(id);
    if (!updated) throw new Error('Service not found');
    return updated;
  }

  async toggleActive(id: string, isActive: boolean): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), { isActive, updatedAt: serverTimestamp() });
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }
}
