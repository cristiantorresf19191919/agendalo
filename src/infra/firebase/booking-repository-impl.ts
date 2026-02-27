import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Booking } from '../../domain/entities/booking';
import { BookingRepository, CreateBookingInput } from '../../ports/booking-repository';
import { BookingStatus } from '../../domain/entities/booking';

const COLLECTION = 'bookings';

function toBooking(id: string, data: Record<string, unknown>): Booking {
  return {
    id,
    businessId: data.businessId as string,
    professionalId: data.professionalId as string,
    customerId: data.customerId as string,
    serviceId: data.serviceId as string,
    date: data.date as string,
    startTime: data.startTime as string,
    endTime: data.endTime as string,
    status: (data.status as BookingStatus) ?? 'confirmed',
    notes: data.notes as string | undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
  };
}

export class FirebaseBookingRepository implements BookingRepository {
  async create(input: CreateBookingInput): Promise<Booking> {
    const ref = doc(collection(db, COLLECTION));
    const data = { ...input, status: 'confirmed', createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
    await setDoc(ref, data);
    return toBooking(ref.id, { ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  }

  async getById(id: string): Promise<Booking | null> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return toBooking(snap.id, snap.data());
  }

  async getByProfessionalAndDate(professionalId: string, date: string): Promise<Booking[]> {
    const q = query(
      collection(db, COLLECTION),
      where('professionalId', '==', professionalId),
      where('date', '==', date)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => toBooking(d.id, d.data()));
  }

  async getByCustomerId(customerId: string): Promise<Booking[]> {
    const q = query(collection(db, COLLECTION), where('customerId', '==', customerId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toBooking(d.id, d.data()));
  }

  async getByBusinessId(businessId: string, dateRange?: { from: string; to: string }): Promise<Booking[]> {
    let q = query(collection(db, COLLECTION), where('businessId', '==', businessId));
    if (dateRange) {
      q = query(q, where('date', '>=', dateRange.from), where('date', '<=', dateRange.to));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => toBooking(d.id, d.data()));
  }

  async updateStatus(id: string, status: BookingStatus): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), { status, updatedAt: serverTimestamp() });
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }
}
