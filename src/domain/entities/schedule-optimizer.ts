/**
 * AI Schedule Optimizer for Micro-Businesses ("Horario Inteligente").
 *
 * Analyzes booking patterns for solo/micro businesses (1-5 people),
 * identifies profitable hours, suggests optimal working schedules,
 * recommends dynamic pricing rules, and projects revenue impact.
 *
 * DIFFERENTIATOR: Boulevard's Precision Scheduling is designed for
 * large salons with complex multi-provider calendars. No competitor
 * optimizes for the solo/micro-business segment — Agendalo's
 * core target market (1-5 professionals).
 */

export type OptimizationGoal = 'maximize_revenue' | 'maximize_utilization' | 'maximize_work_life_balance' | 'reduce_gaps';

export interface ScheduleOptimization {
  id: string;
  businessId: string;
  professionalId: string;
  /** Analysis period — "YYYY-MM-DD". */
  periodStart: string;
  periodEnd: string;
  /** Current metrics (before optimization). */
  currentMetrics: ScheduleMetrics;
  /** Projected metrics (after optimization). */
  projectedMetrics: ScheduleMetrics;
  /** Generated recommendations. */
  recommendations: OptimizationRecommendation[];
  /** Optimization goal used. */
  goal: OptimizationGoal;
  /** Whether recommendations have been applied. */
  isApplied: boolean;
  appliedAt?: Date;
  createdAt: Date;
}

export interface ScheduleMetrics {
  /** Total available hours in the period. */
  totalAvailableHours: number;
  /** Total booked hours. */
  totalBookedHours: number;
  /** Utilization rate (0-100). */
  utilizationRate: number;
  /** Total revenue in the period. */
  totalRevenue: number;
  /** Revenue per available hour. */
  revenuePerHour: number;
  /** Average gap between bookings (minutes). */
  avgGapMinutes: number;
  /** Number of gaps > 30 minutes (wasted time). */
  largeGapCount: number;
  /** Peak hours (most bookings). */
  peakHours: string[];
  /** Dead hours (fewest bookings). */
  deadHours: string[];
  /** Busiest day of week (0-6). */
  busiestDay: number;
  /** Slowest day of week (0-6). */
  slowestDay: number;
  currency: string;
}

export type RecommendationType =
  | 'adjust_working_hours'
  | 'add_off_peak_discount'
  | 'remove_dead_hours'
  | 'add_peak_surcharge'
  | 'extend_peak_hours'
  | 'compress_schedule'
  | 'add_break_time'
  | 'increase_buffer';

export interface OptimizationRecommendation {
  id: string;
  type: RecommendationType;
  /** Human-readable title. */
  title: string;
  /** Detailed explanation. */
  description: string;
  /** Projected revenue impact (positive = gain). */
  projectedRevenueImpact: number;
  /** Projected utilization change (percentage points). */
  projectedUtilizationChange: number;
  /** Confidence level (0-1). */
  confidence: number;
  /** Priority (1 = highest). */
  priority: number;
  /** Specific parameters for this recommendation. */
  params: RecommendationParams;
}

export interface RecommendationParams {
  /** For adjust_working_hours: suggested new hours. */
  suggestedHours?: Record<number, { open: string; close: string }>;
  /** For pricing recommendations: suggested pricing rule. */
  suggestedPricingRule?: {
    name: string;
    discountPercent?: number;
    surchargePercent?: number;
    applicableDays?: number[];
    startTime?: string;
    endTime?: string;
  };
  /** For schedule changes: days affected. */
  affectedDays?: number[];
  /** For buffer changes: suggested buffer minutes. */
  suggestedBufferMinutes?: number;
}
