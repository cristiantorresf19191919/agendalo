/**
 * Seed script for Agendalo development data.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires:
 *   - Firebase project configured in .env.local
 *   - npm install -D tsx (already included)
 *
 * Creates sample data for development:
 *   - 2 Businesses (Barbershop + Spa)
 *   - 5 Professionals across both businesses
 *   - 11 Services with images and categories
 *   - Sample bookings for availability testing
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const now = Timestamp.now();

// --- Schedules ---

const barberSchedule = {
  1: [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '20:00' }],
  2: [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '20:00' }],
  3: [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '20:00' }],
  4: [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '20:00' }],
  5: [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '20:00' }],
  6: [{ start: '09:00', end: '15:00' }],
};

const spaSchedule = {
  1: [{ start: '10:00', end: '14:00' }, { start: '15:00', end: '20:00' }],
  2: [{ start: '10:00', end: '14:00' }, { start: '15:00', end: '20:00' }],
  3: [{ start: '10:00', end: '14:00' }, { start: '15:00', end: '20:00' }],
  4: [{ start: '10:00', end: '14:00' }, { start: '15:00', end: '20:00' }],
  5: [{ start: '10:00', end: '14:00' }, { start: '15:00', end: '20:00' }],
  6: [{ start: '10:00', end: '16:00' }],
  0: [{ start: '11:00', end: '16:00' }],
};

// --- Helper to get future dates for sample bookings ---
function getFutureDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

async function seed() {
  console.log('Seeding Agendalo development data...\n');

  // ============================================================
  // BUSINESS 1: La Barbería Premium (Barbershop)
  // ============================================================
  const barberId = 'biz-barberia-001';
  await setDoc(doc(db, 'businesses', barberId), {
    name: 'La Barbería Premium',
    slug: 'la-barberia-premium',
    ownerId: 'owner-demo-001',
    plan: 'duo',
    maxProfessionals: 2,
    currency: 'USD',
    timezone: 'America/Mexico_City',
    description: 'Barbería de estilo clásico con toques modernos. Especialistas en cortes, barba y diseño capilar.',
    coverImageUrl: 'https://images.unsplash.com/photo-1585747860019-8f7b64c6a6b1?w=800&h=400&fit=crop',
    address: 'Av. Reforma 234, Col. Centro, CDMX',
    phone: '+52 55 1234 5678',
    category: 'barbershop',
    createdAt: now,
    updatedAt: now,
  });
  console.log('  + Business: La Barbería Premium (barbershop)');

  // Barber Professionals
  const barberProfessionals = [
    {
      id: 'prof-carlos-001',
      name: 'Carlos Mendez',
      email: 'carlos@barberia.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      specialties: ['Corte clásico', 'Barba', 'Diseño capilar'],
    },
    {
      id: 'prof-miguel-002',
      name: 'Miguel Ángel Ruiz',
      email: 'miguel@barberia.com',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      specialties: ['Fade', 'Corte moderno', 'Coloración'],
    },
  ];

  for (const prof of barberProfessionals) {
    await setDoc(doc(db, 'professionals', prof.id), {
      businessId: barberId,
      name: prof.name,
      email: prof.email,
      avatarUrl: prof.avatarUrl,
      specialties: prof.specialties,
      weeklySchedule: barberSchedule,
      exceptions: [],
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  + Professional: ${prof.name}`);
  }

  // Barber Services
  const barberServices = [
    {
      id: 'svc-corte-001',
      name: 'Corte clásico',
      description: 'Corte de cabello profesional con lavado, secado y styling personalizado.',
      durationMinutes: 30,
      price: 25,
      category: 'Corte',
      imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop',
    },
    {
      id: 'svc-barba-002',
      name: 'Barba completa',
      description: 'Afeitado clásico con toalla caliente, navaja y perfilado de barba premium.',
      durationMinutes: 20,
      price: 15,
      category: 'Barba',
      imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop',
    },
    {
      id: 'svc-combo-003',
      name: 'Corte + Barba',
      description: 'Paquete completo: corte de cabello profesional más arreglo de barba con toalla caliente.',
      durationMinutes: 45,
      price: 35,
      category: 'Paquete',
      imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
    },
    {
      id: 'svc-design-004',
      name: 'Diseño capilar',
      description: 'Diseño artístico con máquina y navaja. Líneas, figuras y degradados creativos.',
      durationMinutes: 60,
      price: 45,
      category: 'Diseño',
      imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=300&fit=crop',
    },
    {
      id: 'svc-color-005',
      name: 'Coloración express',
      description: 'Coloración parcial o completa con productos premium. Incluye lavado y secado.',
      durationMinutes: 90,
      price: 65,
      category: 'Color',
      imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400&h=300&fit=crop',
    },
  ];

  for (const svc of barberServices) {
    await setDoc(doc(db, 'services', svc.id), {
      businessId: barberId,
      name: svc.name,
      description: svc.description,
      durationMinutes: svc.durationMinutes,
      price: svc.price,
      currency: 'USD',
      category: svc.category,
      imageUrl: svc.imageUrl,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  + Service: ${svc.name} (${svc.durationMinutes}min / $${svc.price})`);
  }

  // ============================================================
  // BUSINESS 2: Serenity Spa & Wellness
  // ============================================================
  const spaId = 'biz-serenity-002';
  await setDoc(doc(db, 'businesses', spaId), {
    name: 'Serenity Spa & Wellness',
    slug: 'serenity-spa',
    ownerId: 'owner-demo-002',
    plan: 'unlimited',
    maxProfessionals: 999,
    currency: 'USD',
    timezone: 'America/Mexico_City',
    description: 'Un oasis de tranquilidad en la ciudad. Masajes, faciales, y tratamientos de bienestar con productos orgánicos.',
    coverImageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&h=400&fit=crop',
    address: 'Calle Durango 145, Col. Roma, CDMX',
    phone: '+52 55 9876 5432',
    category: 'spa',
    createdAt: now,
    updatedAt: now,
  });
  console.log('\n  + Business: Serenity Spa & Wellness (spa)');

  // Spa Professionals
  const spaProfessionals = [
    {
      id: 'prof-ana-003',
      name: 'Ana Torres',
      email: 'ana@serenityspa.com',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      specialties: ['Masaje sueco', 'Masaje profundo', 'Piedras calientes'],
    },
    {
      id: 'prof-sofia-004',
      name: 'Sofía Hernández',
      email: 'sofia@serenityspa.com',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      specialties: ['Facial', 'Aromaterapia', 'Tratamientos corporales'],
    },
    {
      id: 'prof-laura-005',
      name: 'Laura Castillo',
      email: 'laura@serenityspa.com',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
      specialties: ['Manicure', 'Pedicure', 'Nail art'],
    },
  ];

  for (const prof of spaProfessionals) {
    await setDoc(doc(db, 'professionals', prof.id), {
      businessId: spaId,
      name: prof.name,
      email: prof.email,
      avatarUrl: prof.avatarUrl,
      specialties: prof.specialties,
      weeklySchedule: spaSchedule,
      exceptions: [],
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  + Professional: ${prof.name}`);
  }

  // Spa Services
  const spaServices = [
    {
      id: 'svc-masaje-sueco-006',
      name: 'Masaje sueco',
      description: 'Masaje relajante de cuerpo completo con aceites esenciales. Reduce estrés y tensión muscular.',
      durationMinutes: 60,
      price: 55,
      category: 'Masaje',
      imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
    },
    {
      id: 'svc-masaje-profundo-007',
      name: 'Masaje tejido profundo',
      description: 'Masaje terapéutico enfocado en zonas de tensión crónica. Ideal para dolor de espalda y cuello.',
      durationMinutes: 75,
      price: 70,
      category: 'Masaje',
      imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop',
    },
    {
      id: 'svc-facial-008',
      name: 'Facial rejuvenecedor',
      description: 'Limpieza profunda, exfoliación, mascarilla y suero hidratante. Piel radiante al instante.',
      durationMinutes: 50,
      price: 45,
      category: 'Facial',
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop',
    },
    {
      id: 'svc-mani-pedi-009',
      name: 'Manicure & Pedicure',
      description: 'Tratamiento completo de manos y pies: limado, cutículas, exfoliación y esmaltado.',
      durationMinutes: 75,
      price: 40,
      category: 'Uñas',
      imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
    },
    {
      id: 'svc-piedras-010',
      name: 'Piedras calientes',
      description: 'Terapia con piedras volcánicas calientes que relajan músculos y equilibran energía.',
      durationMinutes: 90,
      price: 80,
      category: 'Masaje',
      imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=300&fit=crop',
    },
    {
      id: 'svc-aroma-011',
      name: 'Aromaterapia completa',
      description: 'Experiencia sensorial con aceites esenciales orgánicos. Masaje, inhalación y relajación profunda.',
      durationMinutes: 60,
      price: 60,
      category: 'Bienestar',
      imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400&h=300&fit=crop',
    },
  ];

  for (const svc of spaServices) {
    await setDoc(doc(db, 'services', svc.id), {
      businessId: spaId,
      name: svc.name,
      description: svc.description,
      durationMinutes: svc.durationMinutes,
      price: svc.price,
      currency: 'USD',
      category: svc.category,
      imageUrl: svc.imageUrl,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  + Service: ${svc.name} (${svc.durationMinutes}min / $${svc.price})`);
  }

  // ============================================================
  // SAMPLE BOOKINGS (for availability testing)
  // ============================================================
  const tomorrow = getFutureDate(1);
  const dayAfter = getFutureDate(2);

  const sampleBookings = [
    {
      id: 'booking-001',
      businessId: barberId,
      professionalId: 'prof-carlos-001',
      customerId: 'customer-demo-001',
      serviceId: 'svc-corte-001',
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:30',
      status: 'confirmed',
    },
    {
      id: 'booking-002',
      businessId: barberId,
      professionalId: 'prof-carlos-001',
      customerId: 'customer-demo-002',
      serviceId: 'svc-combo-003',
      date: tomorrow,
      startTime: '14:00',
      endTime: '14:45',
      status: 'confirmed',
    },
    {
      id: 'booking-003',
      businessId: spaId,
      professionalId: 'prof-ana-003',
      customerId: 'customer-demo-001',
      serviceId: 'svc-masaje-sueco-006',
      date: dayAfter,
      startTime: '11:00',
      endTime: '12:00',
      status: 'confirmed',
    },
    {
      id: 'booking-004',
      businessId: spaId,
      professionalId: 'prof-sofia-004',
      customerId: 'customer-demo-003',
      serviceId: 'svc-facial-008',
      date: tomorrow,
      startTime: '15:00',
      endTime: '15:50',
      status: 'confirmed',
    },
  ];

  console.log('');
  for (const booking of sampleBookings) {
    await setDoc(doc(db, 'bookings', booking.id), {
      ...booking,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  + Booking: ${booking.id} (${booking.date} ${booking.startTime}-${booking.endTime})`);
  }

  // ============================================================
  // USER ROLES
  // ============================================================
  await setDoc(doc(db, 'userRoles', 'owner-demo-001'), {
    role: 'business',
    updatedAt: now,
  });
  await setDoc(doc(db, 'userRoles', 'owner-demo-002'), {
    role: 'business',
    updatedAt: now,
  });
  console.log('\n  + UserRole: owner-demo-001 -> business');
  console.log('  + UserRole: owner-demo-002 -> business');

  console.log('\nSeed complete!');
  console.log('\nBusinesses created:');
  console.log('  - /book/la-barberia-premium (barbershop)');
  console.log('  - /book/serenity-spa (spa)');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
