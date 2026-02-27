import type { Business } from '@/domain/entities/business';
import type { Service } from '@/domain/entities/service';
import type { Professional, WeeklySchedule } from '@/domain/entities/professional';

/* ─── Extended types for UI ─── */

export interface MockBusiness extends Business {
  rating: number;
  reviewCount: number;
  galleryImages: string[];
  openingHours: string;
  instagram?: string;
  whatsapp?: string;
}

export interface MockService extends Service {
  popular?: boolean;
}

/* ─── Shared schedule templates ─── */

const MON_SAT_8_20: WeeklySchedule = {
  1: [{ start: '08:00', end: '20:00' }],
  2: [{ start: '08:00', end: '20:00' }],
  3: [{ start: '08:00', end: '20:00' }],
  4: [{ start: '08:00', end: '20:00' }],
  5: [{ start: '08:00', end: '20:00' }],
  6: [{ start: '08:00', end: '20:00' }],
};

const TUE_SAT_9_21: WeeklySchedule = {
  2: [{ start: '09:00', end: '21:00' }],
  3: [{ start: '09:00', end: '21:00' }],
  4: [{ start: '09:00', end: '21:00' }],
  5: [{ start: '09:00', end: '21:00' }],
  6: [{ start: '09:00', end: '21:00' }],
};

const MON_SAT_9_19_SUN: WeeklySchedule = {
  0: [{ start: '10:00', end: '15:00' }],
  1: [{ start: '09:00', end: '19:00' }],
  2: [{ start: '09:00', end: '19:00' }],
  3: [{ start: '09:00', end: '19:00' }],
  4: [{ start: '09:00', end: '19:00' }],
  5: [{ start: '09:00', end: '19:00' }],
  6: [{ start: '09:00', end: '19:00' }],
};

const MON_SAT_8_19: WeeklySchedule = {
  1: [{ start: '08:00', end: '19:00' }],
  2: [{ start: '08:00', end: '19:00' }],
  3: [{ start: '08:00', end: '19:00' }],
  4: [{ start: '08:00', end: '19:00' }],
  5: [{ start: '08:00', end: '19:00' }],
  6: [{ start: '08:00', end: '19:00' }],
};

const MON_SAT_9_18: WeeklySchedule = {
  1: [{ start: '09:00', end: '18:00' }],
  2: [{ start: '09:00', end: '18:00' }],
  3: [{ start: '09:00', end: '18:00' }],
  4: [{ start: '09:00', end: '18:00' }],
  5: [{ start: '09:00', end: '18:00' }],
  6: [{ start: '09:00', end: '18:00' }],
};

const MON_FRI_8_18_SAT_13: WeeklySchedule = {
  1: [{ start: '08:00', end: '18:00' }],
  2: [{ start: '08:00', end: '18:00' }],
  3: [{ start: '08:00', end: '18:00' }],
  4: [{ start: '08:00', end: '18:00' }],
  5: [{ start: '08:00', end: '18:00' }],
  6: [{ start: '08:00', end: '13:00' }],
};

/* ─── Helpers ─── */

const d = new Date('2025-01-01');

function makeBusiness(partial: Omit<MockBusiness, 'createdAt' | 'updatedAt'>): MockBusiness {
  return { ...partial, createdAt: d, updatedAt: d };
}

function makeService(partial: Omit<MockService, 'createdAt' | 'updatedAt' | 'isActive'>): MockService {
  return { ...partial, isActive: true, createdAt: d, updatedAt: d };
}

function makeProfessional(
  partial: Omit<Professional, 'createdAt' | 'updatedAt' | 'isActive' | 'exceptions'>
): Professional {
  return { ...partial, isActive: true, exceptions: [], createdAt: d, updatedAt: d };
}

/* ═══════════════════════════════════════════════════
   BUSINESSES
   ═══════════════════════════════════════════════════ */

const businesses: MockBusiness[] = [
  makeBusiness({
    id: 'biz-1',
    name: 'Barbería Urbana',
    slug: 'barberia-urbana',
    ownerId: 'owner-1',
    plan: 'duo',
    maxProfessionals: 2,
    currency: 'COP',
    timezone: 'America/Bogota',
    description: 'El corte que define tu estilo. Barbería premium en el corazón de Chapinero.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=400&fit=crop',
    logoUrl: undefined,
    address: 'Cra. 7 #45-12, Chapinero, Bogotá',
    phone: '+57 310 456 7890',
    category: 'barberia',
    rating: 4.9,
    reviewCount: 234,
    openingHours: 'Lun–Sáb: 8:00 AM – 8:00 PM',
    instagram: '@barberiaurbana',
    whatsapp: '+573104567890',
    galleryImages: [
      'https://images.unsplash.com/photo-1585747860019-8f7b64c6a6b1?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop',
    ],
  }),
  makeBusiness({
    id: 'biz-2',
    name: 'The Barber Club',
    slug: 'the-barber-club',
    ownerId: 'owner-2',
    plan: 'duo',
    maxProfessionals: 2,
    currency: 'COP',
    timezone: 'America/Bogota',
    description: 'Donde la tradición se encuentra con el estilo moderno. Zona T, Bogotá.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=400&fit=crop',
    logoUrl: undefined,
    address: 'Calle 82 #12-35, Zona T, Bogotá',
    phone: '+57 315 789 0123',
    category: 'barberia',
    rating: 4.7,
    reviewCount: 189,
    openingHours: 'Mar–Sáb: 9:00 AM – 9:00 PM',
    instagram: '@thebarberclub',
    whatsapp: '+573157890123',
    galleryImages: [
      'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=600&h=400&fit=crop',
    ],
  }),
  makeBusiness({
    id: 'biz-3',
    name: 'Serenity Spa & Bienestar',
    slug: 'serenity-spa',
    ownerId: 'owner-3',
    plan: 'unlimited',
    maxProfessionals: Infinity,
    currency: 'COP',
    timezone: 'America/Bogota',
    description: 'Tu oasis de tranquilidad en Usaquén. Relájate, renuévate, renace.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&h=400&fit=crop',
    logoUrl: undefined,
    address: 'Cra. 6 #119-24, Usaquén, Bogotá',
    phone: '+57 320 123 4567',
    category: 'spa',
    rating: 4.8,
    reviewCount: 312,
    openingHours: 'Lun–Sáb: 9:00 AM – 7:00 PM · Dom: 10:00 AM – 3:00 PM',
    instagram: '@serenityspa',
    whatsapp: '+573201234567',
    galleryImages: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=400&fit=crop',
    ],
  }),
  makeBusiness({
    id: 'biz-4',
    name: 'Salón Eleganza',
    slug: 'salon-eleganza',
    ownerId: 'owner-4',
    plan: 'duo',
    maxProfessionals: 2,
    currency: 'COP',
    timezone: 'America/Bogota',
    description: 'Colorimetría avanzada, cortes de autor y peinados para toda ocasión.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop',
    logoUrl: undefined,
    address: 'Calle 93 #11A-28, Chicó, Bogotá',
    phone: '+57 318 654 3210',
    category: 'salon',
    rating: 4.6,
    reviewCount: 156,
    openingHours: 'Lun–Sáb: 8:00 AM – 7:00 PM',
    instagram: '@saloneleganza',
    whatsapp: '+573186543210',
    galleryImages: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=400&fit=crop',
    ],
  }),
  makeBusiness({
    id: 'biz-5',
    name: 'Nails & Co Studio',
    slug: 'nails-co-studio',
    ownerId: 'owner-5',
    plan: 'duo',
    maxProfessionals: 2,
    currency: 'COP',
    timezone: 'America/Bogota',
    description: 'Nail art, semipermanente y mucho más. Tu espacio de uñas en La Macarena.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=400&fit=crop',
    logoUrl: undefined,
    address: 'Cra. 4A #27-08, La Macarena, Bogotá',
    phone: '+57 322 987 6543',
    category: 'unas',
    rating: 4.7,
    reviewCount: 98,
    openingHours: 'Lun–Sáb: 9:00 AM – 6:00 PM',
    instagram: '@nailscostudio',
    whatsapp: '+573229876543',
    galleryImages: [
      'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&h=400&fit=crop',
    ],
  }),
  makeBusiness({
    id: 'biz-6',
    name: 'Clínica Estética Lux',
    slug: 'clinica-estetica-lux',
    ownerId: 'owner-6',
    plan: 'duo',
    maxProfessionals: 2,
    currency: 'COP',
    timezone: 'America/Bogota',
    description: 'Tratamientos estéticos de última generación con los mejores especialistas.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=400&fit=crop',
    logoUrl: undefined,
    address: 'Calle 70 #5-30, Rosales, Bogotá',
    phone: '+57 316 111 2233',
    category: 'clinica',
    rating: 4.9,
    reviewCount: 87,
    openingHours: 'Lun–Vie: 8:00 AM – 6:00 PM · Sáb: 8:00 AM – 1:00 PM',
    instagram: '@clinicalux',
    whatsapp: '+573161112233',
    galleryImages: [
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
    ],
  }),
];

/* ═══════════════════════════════════════════════════
   SERVICES
   ═══════════════════════════════════════════════════ */

const services: MockService[] = [
  // Barbería Urbana
  makeService({ id: 'svc-1-1', businessId: 'biz-1', name: 'Corte clásico', description: 'Corte tradicional con tijera y máquina, incluye lavado.', durationMinutes: 30, price: 35000, currency: 'COP', category: 'corte', popular: true, imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=200&h=200&fit=crop' }),
  makeService({ id: 'svc-1-2', businessId: 'biz-1', name: 'Corte + Barba', description: 'Corte completo más diseño y perfilado de barba.', durationMinutes: 45, price: 55000, currency: 'COP', category: 'combo', popular: true, imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=200&h=200&fit=crop' }),
  makeService({ id: 'svc-1-3', businessId: 'biz-1', name: 'Afeitado clásico', description: 'Afeitado con navaja y toalla caliente.', durationMinutes: 30, price: 30000, currency: 'COP', category: 'barba' }),
  makeService({ id: 'svc-1-4', businessId: 'biz-1', name: 'Diseño de barba', description: 'Perfilado y diseño de barba personalizado.', durationMinutes: 20, price: 25000, currency: 'COP', category: 'barba' }),
  makeService({ id: 'svc-1-5', businessId: 'biz-1', name: 'Corte niño', description: 'Corte para niños menores de 12 años.', durationMinutes: 25, price: 25000, currency: 'COP', category: 'corte' }),

  // The Barber Club
  makeService({ id: 'svc-2-1', businessId: 'biz-2', name: 'Corte premium', description: 'Corte personalizado con consultoría de estilo.', durationMinutes: 40, price: 45000, currency: 'COP', category: 'corte', popular: true }),
  makeService({ id: 'svc-2-2', businessId: 'biz-2', name: 'Barba esculpida', description: 'Esculpido de barba con acabado impecable.', durationMinutes: 30, price: 35000, currency: 'COP', category: 'barba' }),
  makeService({ id: 'svc-2-3', businessId: 'biz-2', name: 'Corte + Barba + Cejas', description: 'Paquete completo: corte, barba y diseño de cejas.', durationMinutes: 60, price: 70000, currency: 'COP', category: 'combo', popular: true }),
  makeService({ id: 'svc-2-4', businessId: 'biz-2', name: 'Tratamiento capilar', description: 'Tratamiento hidratante y nutritivo para el cabello.', durationMinutes: 45, price: 50000, currency: 'COP', category: 'tratamiento' }),

  // Serenity Spa
  makeService({ id: 'svc-3-1', businessId: 'biz-3', name: 'Masaje relajante', description: 'Masaje corporal completo con aceites esenciales.', durationMinutes: 60, price: 120000, currency: 'COP', category: 'masaje', popular: true, imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop' }),
  makeService({ id: 'svc-3-2', businessId: 'biz-3', name: 'Masaje deportivo', description: 'Masaje profundo para recuperación muscular.', durationMinutes: 60, price: 130000, currency: 'COP', category: 'masaje' }),
  makeService({ id: 'svc-3-3', businessId: 'biz-3', name: 'Facial hidratante', description: 'Limpieza facial profunda e hidratación intensiva.', durationMinutes: 45, price: 90000, currency: 'COP', category: 'facial', popular: true }),
  makeService({ id: 'svc-3-4', businessId: 'biz-3', name: 'Aromaterapia', description: 'Sesión de aromaterapia para cuerpo y mente.', durationMinutes: 50, price: 100000, currency: 'COP', category: 'bienestar' }),
  makeService({ id: 'svc-3-5', businessId: 'biz-3', name: 'Circuito de aguas', description: 'Recorrido por piscinas, saunas y jacuzzi.', durationMinutes: 90, price: 80000, currency: 'COP', category: 'bienestar' }),

  // Salón Eleganza
  makeService({ id: 'svc-4-1', businessId: 'biz-4', name: 'Corte femenino', description: 'Corte personalizado con lavado y secado.', durationMinutes: 40, price: 60000, currency: 'COP', category: 'corte', popular: true }),
  makeService({ id: 'svc-4-2', businessId: 'biz-4', name: 'Tinte completo', description: 'Coloración completa con productos premium.', durationMinutes: 120, price: 150000, currency: 'COP', category: 'color' }),
  makeService({ id: 'svc-4-3', businessId: 'biz-4', name: 'Mechas / Balayage', description: 'Técnica de mechas o balayage para un look natural.', durationMinutes: 150, price: 200000, currency: 'COP', category: 'color', popular: true }),
  makeService({ id: 'svc-4-4', businessId: 'biz-4', name: 'Peinado evento', description: 'Peinado profesional para eventos especiales.', durationMinutes: 60, price: 80000, currency: 'COP', category: 'peinado' }),
  makeService({ id: 'svc-4-5', businessId: 'biz-4', name: 'Tratamiento keratina', description: 'Alisado y nutrición profunda con keratina.', durationMinutes: 120, price: 180000, currency: 'COP', category: 'tratamiento' }),

  // Nails & Co Studio
  makeService({ id: 'svc-5-1', businessId: 'biz-5', name: 'Manicure clásico', description: 'Limado, cutícula y esmaltado tradicional.', durationMinutes: 30, price: 30000, currency: 'COP', category: 'manicure', popular: true }),
  makeService({ id: 'svc-5-2', businessId: 'biz-5', name: 'Manicure semipermanente', description: 'Esmaltado semipermanente con secado UV.', durationMinutes: 45, price: 50000, currency: 'COP', category: 'manicure', popular: true }),
  makeService({ id: 'svc-5-3', businessId: 'biz-5', name: 'Pedicure spa', description: 'Pedicure completo con exfoliación y masaje.', durationMinutes: 40, price: 45000, currency: 'COP', category: 'pedicure' }),
  makeService({ id: 'svc-5-4', businessId: 'biz-5', name: 'Diseño nail art', description: 'Diseño artístico personalizado en uñas.', durationMinutes: 60, price: 65000, currency: 'COP', category: 'nail-art' }),
  makeService({ id: 'svc-5-5', businessId: 'biz-5', name: 'Combo mani + pedi', description: 'Manicure + pedicure con descuento especial.', durationMinutes: 75, price: 70000, currency: 'COP', category: 'combo', popular: true }),

  // Clínica Estética Lux
  makeService({ id: 'svc-6-1', businessId: 'biz-6', name: 'Limpieza facial profunda', description: 'Limpieza con tecnología de punta y productos médicos.', durationMinutes: 60, price: 100000, currency: 'COP', category: 'facial', popular: true }),
  makeService({ id: 'svc-6-2', businessId: 'biz-6', name: 'Microdermoabrasión', description: 'Exfoliación mecánica para piel renovada.', durationMinutes: 45, price: 150000, currency: 'COP', category: 'facial' }),
  makeService({ id: 'svc-6-3', businessId: 'biz-6', name: 'Bótox', description: 'Aplicación de toxina botulínica por especialista certificado.', durationMinutes: 30, price: 400000, currency: 'COP', category: 'inyectable', popular: true }),
  makeService({ id: 'svc-6-4', businessId: 'biz-6', name: 'Ácido hialurónico', description: 'Relleno facial con ácido hialurónico de alta gama.', durationMinutes: 45, price: 500000, currency: 'COP', category: 'inyectable' }),
];

/* ═══════════════════════════════════════════════════
   PROFESSIONALS
   ═══════════════════════════════════════════════════ */

const professionals: Professional[] = [
  // Barbería Urbana
  makeProfessional({ id: 'pro-1-1', businessId: 'biz-1', name: 'Carlos Mendoza', email: 'carlos@barberiaurbana.co', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', specialties: ['Fade', 'Pompadour', 'Barba'], weeklySchedule: MON_SAT_8_20 }),
  makeProfessional({ id: 'pro-1-2', businessId: 'biz-1', name: 'Julián Torres', email: 'julian@barberiaurbana.co', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', specialties: ['Corte clásico', 'Diseño de barba'], weeklySchedule: MON_SAT_8_20 }),

  // The Barber Club
  makeProfessional({ id: 'pro-2-1', businessId: 'biz-2', name: 'Andrés Rojas', email: 'andres@thebarberclub.co', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', specialties: ['Corte premium', 'Fade', 'Coloración'], weeklySchedule: TUE_SAT_9_21 }),
  makeProfessional({ id: 'pro-2-2', businessId: 'biz-2', name: 'Miguel Patiño', email: 'miguel@thebarberclub.co', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', specialties: ['Barba esculpida', 'Tratamiento capilar'], weeklySchedule: TUE_SAT_9_21 }),

  // Serenity Spa
  makeProfessional({ id: 'pro-3-1', businessId: 'biz-3', name: 'Laura Gutiérrez', email: 'laura@serenityspa.co', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face', specialties: ['Masaje sueco', 'Masaje profundo', 'Piedras calientes'], weeklySchedule: MON_SAT_9_19_SUN }),
  makeProfessional({ id: 'pro-3-2', businessId: 'biz-3', name: 'Valentina Herrera', email: 'valentina@serenityspa.co', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', specialties: ['Facial', 'Aromaterapia'], weeklySchedule: MON_SAT_9_19_SUN }),
  makeProfessional({ id: 'pro-3-3', businessId: 'biz-3', name: 'Camila Reyes', email: 'camila@serenityspa.co', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', specialties: ['Circuito de aguas', 'Bienestar'], weeklySchedule: MON_SAT_9_19_SUN }),

  // Salón Eleganza
  makeProfessional({ id: 'pro-4-1', businessId: 'biz-4', name: 'Sofía Ramírez', email: 'sofia@eleganza.co', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', specialties: ['Colorimetría', 'Balayage', 'Peinados'], weeklySchedule: MON_SAT_8_19 }),
  makeProfessional({ id: 'pro-4-2', businessId: 'biz-4', name: 'Diana López', email: 'diana@eleganza.co', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', specialties: ['Corte femenino', 'Keratina'], weeklySchedule: MON_SAT_8_19 }),

  // Nails & Co
  makeProfessional({ id: 'pro-5-1', businessId: 'biz-5', name: 'Natalia Vargas', email: 'natalia@nailsco.co', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face', specialties: ['Nail art', 'Semipermanente'], weeklySchedule: MON_SAT_9_18 }),
  makeProfessional({ id: 'pro-5-2', businessId: 'biz-5', name: 'Andrea Cruz', email: 'andrea@nailsco.co', avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face', specialties: ['Manicure', 'Pedicure spa'], weeklySchedule: MON_SAT_9_18 }),

  // Clínica Estética Lux
  makeProfessional({ id: 'pro-6-1', businessId: 'biz-6', name: 'Dra. María Fernanda Castro', email: 'mfcastro@clinicalux.co', avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face', specialties: ['Bótox', 'Ácido hialurónico'], weeklySchedule: MON_FRI_8_18_SAT_13 }),
  makeProfessional({ id: 'pro-6-2', businessId: 'biz-6', name: 'Dra. Patricia Ortiz', email: 'portiz@clinicalux.co', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face', specialties: ['Microdermoabrasión', 'Limpieza facial'], weeklySchedule: MON_FRI_8_18_SAT_13 }),
];

/* ═══════════════════════════════════════════════════
   CATEGORIES
   ═══════════════════════════════════════════════════ */

export const CATEGORIES = [
  { id: 'all', labelKey: 'search.allCategories', icon: 'LayoutGrid' as const },
  { id: 'barberia', labelKey: 'search.barbershop', icon: 'Scissors' as const },
  { id: 'spa', labelKey: 'search.spa', icon: 'Sparkles' as const },
  { id: 'salon', labelKey: 'search.beautySalon', icon: 'Brush' as const },
  { id: 'unas', labelKey: 'search.nailSalon', icon: 'Hand' as const },
  { id: 'clinica', labelKey: 'search.aestheticClinic', icon: 'Stethoscope' as const },
] as const;

/* ═══════════════════════════════════════════════════
   QUERY HELPERS
   ═══════════════════════════════════════════════════ */

export function getAllBusinesses(): MockBusiness[] {
  return businesses;
}

export function getBusinessBySlug(slug: string): MockBusiness | undefined {
  return businesses.find((b) => b.slug === slug);
}

export function getServicesByBusinessId(businessId: string): MockService[] {
  return services.filter((s) => s.businessId === businessId);
}

export function getProfessionalsByBusinessId(businessId: string): Professional[] {
  return professionals.filter((p) => p.businessId === businessId);
}

export function getBusinessesByCategory(category: string): MockBusiness[] {
  if (category === 'all') return businesses;
  return businesses.filter((b) => b.category === category);
}

export function searchBusinesses(query: string): MockBusiness[] {
  const q = query.toLowerCase().trim();
  if (!q) return businesses;
  return businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.category?.toLowerCase().includes(q) ||
      b.address?.toLowerCase().includes(q)
  );
}

/* ─── Price range helper ─── */

export function getAveragePrice(businessId: string): number {
  const bServices = services.filter((s) => s.businessId === businessId);
  if (bServices.length === 0) return 0;
  return bServices.reduce((sum, s) => sum + s.price, 0) / bServices.length;
}

export function getPriceRange(businessId: string): 1 | 2 | 3 {
  const avg = getAveragePrice(businessId);
  if (avg < 60000) return 1;
  if (avg < 120000) return 2;
  return 3;
}

/* ─── Mock availability slots ─── */

export interface MockAvailableSlot {
  start: string;
  end: string;
}

export function getMockAvailableSlots(
  _businessId: string,
  _professionalId: string,
  date: string
): MockAvailableSlot[] {
  // Deterministic pseudo-random based on date string
  const seed = date.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const rand = (i: number) => ((seed * 31 + i * 17) % 100) / 100;

  const allSlots: MockAvailableSlot[] = [];
  // Generate slots from 8:00 to 19:00, every 30 min
  for (let h = 8; h < 19; h++) {
    for (const m of [0, 30]) {
      const start = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const endH = m === 30 ? h + 1 : h;
      const endM = m === 30 ? 0 : 30;
      const end = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
      allSlots.push({ start, end });
    }
  }

  // Remove some slots to simulate bookings (keep ~60-80%)
  return allSlots.filter((_, i) => rand(i) > 0.25);
}

/* ─── Mock reviews ─── */

export interface MockReview {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  date: string;
}

export function getMockReviews(businessId: string): MockReview[] {
  const reviewPool: Record<string, MockReview[]> = {
    'biz-1': [
      { id: 'r1', authorName: 'Santiago M.', rating: 5, text: 'El mejor corte que me han hecho. Carlos es un crack.', date: '2026-02-15' },
      { id: 'r2', authorName: 'Andrés P.', rating: 5, text: 'Ambiente increíble y atención de primera.', date: '2026-02-10' },
      { id: 'r3', authorName: 'Juan D.', rating: 4, text: 'Muy buen servicio, solo mejoraría la espera.', date: '2026-01-28' },
    ],
    'biz-2': [
      { id: 'r4', authorName: 'Felipe R.', rating: 5, text: 'Excelente experiencia, volveré sin duda.', date: '2026-02-12' },
      { id: 'r5', authorName: 'Diego C.', rating: 4, text: 'Buen corte y ambiente. Recomendado.', date: '2026-02-01' },
    ],
    'biz-3': [
      { id: 'r6', authorName: 'María L.', rating: 5, text: 'Salí como nueva. El masaje fue increíble.', date: '2026-02-18' },
      { id: 'r7', authorName: 'Catalina G.', rating: 5, text: 'Un lugar perfecto para desconectar.', date: '2026-02-05' },
      { id: 'r8', authorName: 'Paula A.', rating: 4, text: 'Muy relajante, precios justos.', date: '2026-01-22' },
    ],
    'biz-4': [
      { id: 'r9', authorName: 'Valentina S.', rating: 5, text: 'Sofía hizo un balayage espectacular.', date: '2026-02-14' },
      { id: 'r10', authorName: 'Laura M.', rating: 4, text: 'Buen servicio, el salón es muy bonito.', date: '2026-01-30' },
    ],
    'biz-5': [
      { id: 'r11', authorName: 'Camila R.', rating: 5, text: 'Las mejores uñas de Bogotá. Diseño impecable.', date: '2026-02-17' },
      { id: 'r12', authorName: 'Isabella F.', rating: 5, text: 'Amo el nail art que me hicieron!', date: '2026-02-08' },
    ],
    'biz-6': [
      { id: 'r13', authorName: 'Patricia V.', rating: 5, text: 'Profesionales de primer nivel. Resultado natural.', date: '2026-02-19' },
      { id: 'r14', authorName: 'Mónica H.', rating: 5, text: 'La mejor clínica estética de Bogotá.', date: '2026-02-03' },
    ],
  };
  return reviewPool[businessId] ?? [];
}
