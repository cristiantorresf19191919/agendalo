import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Business } from '../../domain/entities/business';
import { BusinessRepository, CreateBusinessInput, BusinessSearchFilters } from '../../ports/business-repository';
import { getProfessionalLimit } from '../../domain/entities/business';

const COLLECTION = 'businesses';

function toBusiness(id: string, data: Record<string, unknown>): Business {
  const business: Business = {
    id,
    name: data.name as string,
    slug: data.slug as string,
    ownerId: data.ownerId as string,
    plan: data.plan as Business['plan'],
    maxProfessionals: getProfessionalLimit(data.plan as Business['plan']),
    currency: data.currency as string,
    timezone: data.timezone as string,
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
  };
  if (data.description) business.description = data.description as string;
  if (data.coverImageUrl) business.coverImageUrl = data.coverImageUrl as string;
  if (data.logoUrl) business.logoUrl = data.logoUrl as string;
  if (data.address) business.address = data.address as string;
  if (data.phone) business.phone = data.phone as string;
  if (data.category) business.category = data.category as string;
  return business;
}

export class FirebaseBusinessRepository implements BusinessRepository {
  async create(input: CreateBusinessInput): Promise<Business> {
    const ref = doc(collection(db, COLLECTION));
    const data = {
      ...input,
      maxProfessionals: getProfessionalLimit(input.plan),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, data);
    return toBusiness(ref.id, { ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  }

  async getById(id: string): Promise<Business | null> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return toBusiness(snap.id, snap.data());
  }

  async getBySlug(slug: string): Promise<Business | null> {
    const q = query(collection(db, COLLECTION), where('slug', '==', slug));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return toBusiness(d.id, d.data());
  }

  async getByOwnerId(ownerId: string): Promise<Business | null> {
    const q = query(collection(db, COLLECTION), where('ownerId', '==', ownerId));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return toBusiness(d.id, d.data());
  }

  async update(id: string, data: Partial<Business>): Promise<Business> {
    const updateData = { ...data, updatedAt: serverTimestamp() };
    delete (updateData as Record<string, unknown>).id;
    await updateDoc(doc(db, COLLECTION, id), updateData);
    const updated = await this.getById(id);
    if (!updated) throw new Error('Business not found after update');
    return updated;
  }

  async search(filters: BusinessSearchFilters): Promise<Business[]> {
    const snap = await getDocs(collection(db, COLLECTION));
    let results = snap.docs.map((d) => toBusiness(d.id, d.data()));

    if (filters.address) {
      const needle = filters.address.toLowerCase();
      results = results.filter(
        (b) => b.address && b.address.toLowerCase().includes(needle)
      );
    }

    return results;
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }
}
