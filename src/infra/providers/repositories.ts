import { FirebaseAuthAdapter } from '../firebase/auth-adapter';
import { FirebaseBusinessRepository } from '../firebase/business-repository-impl';
import { FirebaseProfessionalRepository } from '../firebase/professional-repository-impl';
import { FirebaseServiceRepository } from '../firebase/service-repository-impl';
import { FirebaseBookingRepository } from '../firebase/booking-repository-impl';
import { FirebaseBlockedRangeRepository } from '../firebase/blocked-range-repository-impl';
import { FirebaseStorageAdapter } from '../firebase/storage-adapter';

// Singleton instances
let authAdapter: FirebaseAuthAdapter | null = null;
let businessRepo: FirebaseBusinessRepository | null = null;
let professionalRepo: FirebaseProfessionalRepository | null = null;
let serviceRepo: FirebaseServiceRepository | null = null;
let bookingRepo: FirebaseBookingRepository | null = null;
let blockedRangeRepo: FirebaseBlockedRangeRepository | null = null;
let storageAdapter: FirebaseStorageAdapter | null = null;

export function getAuthAdapter(): FirebaseAuthAdapter {
  if (!authAdapter) authAdapter = new FirebaseAuthAdapter();
  return authAdapter;
}

export function getBusinessRepository(): FirebaseBusinessRepository {
  if (!businessRepo) businessRepo = new FirebaseBusinessRepository();
  return businessRepo;
}

export function getProfessionalRepository(): FirebaseProfessionalRepository {
  if (!professionalRepo) professionalRepo = new FirebaseProfessionalRepository();
  return professionalRepo;
}

export function getServiceRepository(): FirebaseServiceRepository {
  if (!serviceRepo) serviceRepo = new FirebaseServiceRepository();
  return serviceRepo;
}

export function getBookingRepository(): FirebaseBookingRepository {
  if (!bookingRepo) bookingRepo = new FirebaseBookingRepository();
  return bookingRepo;
}

export function getBlockedRangeRepository(): FirebaseBlockedRangeRepository {
  if (!blockedRangeRepo) blockedRangeRepo = new FirebaseBlockedRangeRepository();
  return blockedRangeRepo;
}

export function getStorageAdapter(): FirebaseStorageAdapter {
  if (!storageAdapter) storageAdapter = new FirebaseStorageAdapter();
  return storageAdapter;
}
