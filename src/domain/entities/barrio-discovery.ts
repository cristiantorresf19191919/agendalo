/**
 * Barrio Discovery — Hyper-Local Neighborhood Marketplace.
 *
 * Neighborhood-level ("barrio") discovery experience for Colombian
 * cities. Users filter by barrio, see walking distance, "trending
 * in your barrio" salons, and "your neighbors are booking here"
 * social proof.
 *
 * DIFFERENTIATOR: Competitors (Fresha, Booksy, Treatwell) have
 * city-level marketplaces. Colombian consumers are intensely
 * neighborhood-loyal — beauty services are hyper-local, people
 * rarely cross the city for a haircut. No competitor has
 * neighborhood-granular discovery.
 */

export interface Barrio {
  id: string;
  name: string;
  /** Alternative names / common spellings. */
  aliases: string[];
  /** Locality (Localidad) — Bogotá administrative division. */
  localidad: string;
  /** UPZ (Unidad de Planeamiento Zonal) — Bogotá planning unit. */
  upz?: string;
  city: string;
  department: string;
  /** Center point GPS coordinates. */
  centerLatitude: number;
  centerLongitude: number;
  /** Approximate boundary polygon (GeoJSON-style). */
  boundaryCoords?: Array<{ lat: number; lng: number }>;
  /** Socioeconomic stratum (1-6, Colombia-specific). */
  estrato?: number;
  /** Number of businesses registered in this barrio. */
  businessCount: number;
  /** Is this barrio "trending" (growing bookings)? */
  isTrending: boolean;
}

export interface BarrioTrend {
  id: string;
  barrioId: string;
  /** Period — "YYYY-MM". */
  period: string;
  /** Total bookings in this barrio this period. */
  totalBookings: number;
  /** Change vs previous period (percentage). */
  bookingChange: number;
  /** New businesses added this period. */
  newBusinesses: number;
  /** Most popular service category in this barrio. */
  topCategory: string;
  /** Most popular service. */
  topServiceName: string;
  /** Average rating of businesses in this barrio. */
  avgRating: number;
  /** Average price range in COP. */
  avgPriceMin: number;
  avgPriceMax: number;
  currency: string;
  updatedAt: Date;
}

export interface NeighborhoodSocialProof {
  id: string;
  barrioId: string;
  businessId: string;
  /** "X vecinos reservaron aquí esta semana" */
  neighborsBookedThisWeek: number;
  /** "Y personas de tu barrio lo recomiendan" */
  neighborsRecommend: number;
  /** Walking distance from barrio center (minutes). */
  walkingMinutes: number;
  /** Driving distance from barrio center (minutes). */
  drivingMinutes: number;
  /** Distance in meters from barrio center. */
  distanceMeters: number;
  updatedAt: Date;
}

/**
 * Calculate walking time estimate from distance.
 * Pure function — assumes 80m/min walking speed (typical for Bogotá's elevation).
 */
export function estimateWalkingMinutes(distanceMeters: number): number {
  return Math.ceil(distanceMeters / 80);
}

/**
 * Determine socioeconomic stratum label.
 * Pure function — Colombian estrato system (1-6).
 */
export function getEstratoLabel(estrato: number): string {
  const labels: Record<number, string> = {
    1: 'Bajo-bajo',
    2: 'Bajo',
    3: 'Medio-bajo',
    4: 'Medio',
    5: 'Medio-alto',
    6: 'Alto',
  };
  return labels[estrato] ?? 'Desconocido';
}
