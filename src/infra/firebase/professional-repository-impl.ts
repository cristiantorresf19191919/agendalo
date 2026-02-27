import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, serverTimestamp, Timestamp, arrayUnion, arrayRemove,
} from 'firebase/firestore';
import { db } from './config';
import { Professional, WeeklySchedule, ScheduleException } from '../../domain/entities/professional';
import { ProfessionalRepository, CreateProfessionalInput } from '../../ports/professional-repository';

const COLLECTION = 'professionals';

function toProfessional(id: string, data: Record<string, unknown>): Professional {
  return {
    id,
    businessId: data.businessId as string,
    name: data.name as string,
    email: data.email as string,
    avatarUrl: data.avatarUrl as string | undefined,
    specialties: (data.specialties as string[]) ?? [],
    weeklySchedule: (data.weeklySchedule as WeeklySchedule) ?? {},
    exceptions: (data.exceptions as ScheduleException[]) ?? [],
    isActive: (data.isActive as boolean) ?? true,
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
  };
}

export class FirebaseProfessionalRepository implements ProfessionalRepository {
  async create(input: CreateProfessionalInput): Promise<Professional> {
    const ref = doc(collection(db, COLLECTION));
    const data = {
      ...input,
      exceptions: [],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, data);
    return toProfessional(ref.id, { ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  }

  async getById(id: string): Promise<Professional | null> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return toProfessional(snap.id, snap.data());
  }

  async getByBusinessId(businessId: string): Promise<Professional[]> {
    const q = query(collection(db, COLLECTION), where('businessId', '==', businessId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toProfessional(d.id, d.data()));
  }

  async update(id: string, data: Partial<Professional>): Promise<Professional> {
    await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
    const updated = await this.getById(id);
    if (!updated) throw new Error('Professional not found');
    return updated;
  }

  async updateSchedule(id: string, schedule: WeeklySchedule): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), { weeklySchedule: schedule, updatedAt: serverTimestamp() });
  }

  async addException(id: string, exception: ScheduleException): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), {
      exceptions: arrayUnion(exception),
      updatedAt: serverTimestamp(),
    });
  }

  async removeException(id: string, date: string): Promise<void> {
    const prof = await this.getById(id);
    if (!prof) throw new Error('Professional not found');
    const exception = prof.exceptions.find((e) => e.date === date);
    if (exception) {
      await updateDoc(doc(db, COLLECTION, id), {
        exceptions: arrayRemove(exception),
        updatedAt: serverTimestamp(),
      });
    }
  }

  async toggleActive(id: string, isActive: boolean): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), { isActive, updatedAt: serverTimestamp() });
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }
}
