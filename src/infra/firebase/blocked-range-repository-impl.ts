import {
  collection, doc, getDocs, setDoc, deleteDoc, query, where, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { BlockedRange } from '../../domain/entities/blocked-range';
import { BlockedRangeRepository, CreateBlockedRangeInput } from '../../ports/blocked-range-repository';

const COLLECTION = 'blockedRanges';

function toBlockedRange(id: string, data: Record<string, unknown>): BlockedRange {
  return {
    id,
    professionalId: data.professionalId as string,
    businessId: data.businessId as string,
    date: data.date as string,
    startTime: data.startTime as string,
    endTime: data.endTime as string,
    reason: data.reason as string | undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
  };
}

export class FirebaseBlockedRangeRepository implements BlockedRangeRepository {
  async create(input: CreateBlockedRangeInput): Promise<BlockedRange> {
    const ref = doc(collection(db, COLLECTION));
    const data = { ...input, createdAt: serverTimestamp() };
    await setDoc(ref, data);
    return toBlockedRange(ref.id, { ...data, createdAt: Timestamp.now() });
  }

  async getByProfessionalAndDate(professionalId: string, date: string): Promise<BlockedRange[]> {
    const q = query(
      collection(db, COLLECTION),
      where('professionalId', '==', professionalId),
      where('date', '==', date)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => toBlockedRange(d.id, d.data()));
  }

  async getByProfessionalAndDateRange(professionalId: string, from: string, to: string): Promise<BlockedRange[]> {
    const q = query(
      collection(db, COLLECTION),
      where('professionalId', '==', professionalId),
      where('date', '>=', from),
      where('date', '<=', to)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => toBlockedRange(d.id, d.data()));
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }
}
