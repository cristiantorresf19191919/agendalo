/**
 * Revenue Analytics & Business Intelligence.
 *
 * Pre-computed analytics snapshots for fast dashboard rendering.
 * Covers revenue, bookings, professional performance, service
 * popularity, and client retention metrics.
 *
 * DIFFERENTIATOR: Mindbody charges $129+/month for analytics.
 * Agendalo includes actionable analytics at every tier,
 * including "clients at risk" prediction and "top services"
 * ranking — features typically locked behind enterprise plans.
 */

export interface DailyRevenueSnapshot {
  id: string;
  businessId: string;
  date: string;                 // "YYYY-MM-DD"
  totalRevenue: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;
  newCustomers: number;
  returningCustomers: number;
  averageBookingValue: number;
  currency: string;
  /** Revenue from retail/POS. */
  retailRevenue: number;
  /** Revenue from gift card sales. */
  giftCardRevenue: number;
  createdAt: Date;
}

export interface ServiceAnalytics {
  id: string;
  businessId: string;
  serviceId: string;
  serviceName: string;
  period: 'daily' | 'weekly' | 'monthly';
  periodStart: string;          // "YYYY-MM-DD"
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  cancellationRate: number;     // 0-100
  /** Most popular time slots for this service. */
  peakHours: string[];          // ["10:00", "14:00"]
  /** Most popular day of week. */
  peakDayOfWeek: number;        // 0-6
  currency: string;
  updatedAt: Date;
}

export interface ProfessionalPerformance {
  id: string;
  businessId: string;
  professionalId: string;
  professionalName: string;
  period: 'daily' | 'weekly' | 'monthly';
  periodStart: string;          // "YYYY-MM-DD"
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  averageRating: number;
  /** Utilization rate: booked hours / available hours (0-100). */
  utilizationRate: number;
  /** Average service duration vs. expected. */
  avgDurationVariance: number;  // minutes (+ = over, - = under)
  totalCommissionEarned: number;
  currency: string;
  updatedAt: Date;
}

/**
 * Client Retention / Churn Risk Analysis.
 * Inspired by Mindbody's "Clients at Risk" AI feature.
 */
export type ChurnRiskLevel = 'low' | 'medium' | 'high';

export interface ClientRetentionMetric {
  id: string;
  businessId: string;
  customerId: string;
  customerName: string;
  /** Days since last visit. */
  daysSinceLastVisit: number;
  /** Average days between visits (historical). */
  avgDaysBetweenVisits: number;
  /** Total lifetime bookings with this business. */
  lifetimeBookings: number;
  /** Total lifetime spend. */
  lifetimeSpend: number;
  /** Cancellation rate (0-100). */
  cancellationRate: number;
  /** No-show rate (0-100). */
  noShowRate: number;
  /** Computed churn risk. */
  churnRisk: ChurnRiskLevel;
  /** Recommended action (e.g., "Send re-engagement offer"). */
  recommendedAction?: string;
  currency: string;
  updatedAt: Date;
}

/**
 * Business-wide KPI summary for the dashboard header.
 */
export interface BusinessKPISummary {
  businessId: string;
  period: 'today' | 'week' | 'month' | 'year';
  totalRevenue: number;
  revenueChange: number;        // percentage vs previous period
  totalBookings: number;
  bookingsChange: number;
  averageRating: number;
  newCustomers: number;
  returningCustomerRate: number; // 0-100
  topServiceName: string;
  topProfessionalName: string;
  occupancyRate: number;        // 0-100
  currency: string;
  updatedAt: Date;
}
