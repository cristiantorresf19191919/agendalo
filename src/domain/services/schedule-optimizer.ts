/**
 * Schedule Optimizer — Pure Domain Service.
 *
 * Analyzes booking history for a professional and generates
 * optimization recommendations. All functions are pure — no
 * side effects, no external dependencies.
 */

import type {
  ScheduleMetrics,
  OptimizationRecommendation,
  RecommendationType,
} from '@/domain/entities/schedule-optimizer';

interface BookingHistoryEntry {
  date: string;
  startTime: string;
  endTime: string;
  revenue: number;
  durationMinutes: number;
}

interface WorkingHours {
  open: string;
  close: string;
}

interface AnalyzeInput {
  /** Professional's working schedule per day (0=Sunday..6=Saturday). */
  weeklySchedule: Record<number, WorkingHours>;
  /** Booking history for the analysis period. */
  bookings: BookingHistoryEntry[];
  /** Analysis period in days. */
  periodDays: number;
  currency: string;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

/**
 * Compute schedule metrics from booking history.
 * Pure function — no side effects.
 */
export function computeScheduleMetrics(input: AnalyzeInput): ScheduleMetrics {
  const { weeklySchedule, bookings, periodDays, currency } = input;

  // Calculate total available hours
  let totalAvailableMinutes = 0;
  const daysInPeriod = periodDays;
  for (let d = 0; d < 7; d++) {
    const hours = weeklySchedule[d];
    if (hours) {
      const dailyMinutes = timeToMinutes(hours.close) - timeToMinutes(hours.open);
      const weeksInPeriod = Math.floor(daysInPeriod / 7);
      totalAvailableMinutes += dailyMinutes * weeksInPeriod;
    }
  }

  const totalBookedMinutes = bookings.reduce((sum, b) => sum + b.durationMinutes, 0);
  const totalRevenue = bookings.reduce((sum, b) => sum + b.revenue, 0);
  const totalAvailableHours = totalAvailableMinutes / 60;
  const totalBookedHours = totalBookedMinutes / 60;
  const utilizationRate = totalAvailableHours > 0 ? (totalBookedHours / totalAvailableHours) * 100 : 0;
  const revenuePerHour = totalAvailableHours > 0 ? totalRevenue / totalAvailableHours : 0;

  // Calculate gaps between bookings (per day)
  const bookingsByDate = new Map<string, BookingHistoryEntry[]>();
  for (const b of bookings) {
    const existing = bookingsByDate.get(b.date) ?? [];
    existing.push(b);
    bookingsByDate.set(b.date, existing);
  }

  let totalGapMinutes = 0;
  let gapCount = 0;
  let largeGapCount = 0;

  for (const [, dayBookings] of bookingsByDate) {
    const sorted = [...dayBookings].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    for (let i = 1; i < sorted.length; i++) {
      const gap = timeToMinutes(sorted[i].startTime) - timeToMinutes(sorted[i - 1].endTime);
      if (gap > 0) {
        totalGapMinutes += gap;
        gapCount++;
        if (gap > 30) largeGapCount++;
      }
    }
  }

  const avgGapMinutes = gapCount > 0 ? totalGapMinutes / gapCount : 0;

  // Find peak and dead hours
  const hourCounts: Record<string, number> = {};
  for (const b of bookings) {
    const hour = b.startTime.split(':')[0] + ':00';
    hourCounts[hour] = (hourCounts[hour] ?? 0) + 1;
  }

  const sortedHours = Object.entries(hourCounts).sort((a, b) => b[1] - a[1]);
  const peakHours = sortedHours.slice(0, 3).map(([h]) => h);
  const deadHours = sortedHours.slice(-3).map(([h]) => h);

  // Find busiest/slowest days
  const dayCounts: Record<number, number> = {};
  for (const b of bookings) {
    const d = new Date(b.date).getDay();
    dayCounts[d] = (dayCounts[d] ?? 0) + 1;
  }
  const sortedDays = Object.entries(dayCounts).sort((a, b) => Number(b[1]) - Number(a[1]));
  const busiestDay = sortedDays.length > 0 ? Number(sortedDays[0][0]) : 1;
  const slowestDay = sortedDays.length > 0 ? Number(sortedDays[sortedDays.length - 1][0]) : 0;

  return {
    totalAvailableHours: Math.round(totalAvailableHours * 10) / 10,
    totalBookedHours: Math.round(totalBookedHours * 10) / 10,
    utilizationRate: Math.round(utilizationRate * 10) / 10,
    totalRevenue,
    revenuePerHour: Math.round(revenuePerHour),
    avgGapMinutes: Math.round(avgGapMinutes),
    largeGapCount,
    peakHours,
    deadHours,
    busiestDay,
    slowestDay,
    currency,
  };
}

/**
 * Generate optimization recommendations from schedule metrics.
 * Pure function — no side effects.
 */
export function generateRecommendations(
  metrics: ScheduleMetrics,
  weeklySchedule: Record<number, WorkingHours>,
): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = [];
  let priority = 1;

  // Recommendation: Remove dead hours if utilization is low
  if (metrics.utilizationRate < 50 && metrics.deadHours.length > 0) {
    const projectedUtilizationGain = metrics.deadHours.length * 3;
    const projectedRevenueImpact = metrics.revenuePerHour * metrics.deadHours.length * 0.3;

    recommendations.push({
      id: `rec-${priority}`,
      type: 'remove_dead_hours' as RecommendationType,
      title: 'Eliminar horas con baja demanda',
      description: `Las horas ${metrics.deadHours.join(', ')} tienen muy pocas reservas. Considera cerrar en esos horarios y concentrar tu disponibilidad en horas de alta demanda.`,
      projectedRevenueImpact,
      projectedUtilizationChange: projectedUtilizationGain,
      confidence: 0.75,
      priority: priority++,
      params: { affectedDays: [metrics.slowestDay] },
    });
  }

  // Recommendation: Add off-peak discounts
  if (metrics.deadHours.length > 0 && metrics.utilizationRate < 70) {
    recommendations.push({
      id: `rec-${priority}`,
      type: 'add_off_peak_discount' as RecommendationType,
      title: 'Descuento en horas valle',
      description: `Ofrece 15-20% de descuento en horarios con baja demanda (${metrics.deadHours.join(', ')}) para atraer clientes en esas horas.`,
      projectedRevenueImpact: metrics.revenuePerHour * 0.8 * 2,
      projectedUtilizationChange: 8,
      confidence: 0.8,
      priority: priority++,
      params: {
        suggestedPricingRule: {
          name: 'Descuento horas valle',
          discountPercent: 15,
          startTime: metrics.deadHours[0],
          endTime: minutesToTime(timeToMinutes(metrics.deadHours[0]) + 120),
        },
      },
    });
  }

  // Recommendation: Compress schedule if large gaps exist
  if (metrics.largeGapCount > 3) {
    recommendations.push({
      id: `rec-${priority}`,
      type: 'compress_schedule' as RecommendationType,
      title: 'Comprimir horario de trabajo',
      description: `Tienes ${metrics.largeGapCount} brechas mayores a 30 min entre citas. Considera reducir tu ventana de trabajo en ${Math.round(metrics.avgGapMinutes * metrics.largeGapCount / 60)} horas.`,
      projectedRevenueImpact: 0,
      projectedUtilizationChange: 15,
      confidence: 0.7,
      priority: priority++,
      params: {},
    });
  }

  // Recommendation: Extend peak hours
  if (metrics.utilizationRate > 80 && metrics.peakHours.length > 0) {
    const peakDay = metrics.busiestDay;
    const schedule = weeklySchedule[peakDay];
    if (schedule) {
      recommendations.push({
        id: `rec-${priority}`,
        type: 'extend_peak_hours' as RecommendationType,
        title: 'Extender horario en días de alta demanda',
        description: `Tu utilización es del ${metrics.utilizationRate}%. Considera extender el horario 1-2 horas en tu día más ocupado para captar más citas.`,
        projectedRevenueImpact: metrics.revenuePerHour * 1.5,
        projectedUtilizationChange: -5,
        confidence: 0.85,
        priority: priority++,
        params: {
          suggestedHours: {
            [peakDay]: {
              open: schedule.open,
              close: minutesToTime(timeToMinutes(schedule.close) + 60),
            },
          },
          affectedDays: [peakDay],
        },
      });
    }
  }

  // Recommendation: Add peak surcharge
  if (metrics.utilizationRate > 85) {
    recommendations.push({
      id: `rec-${priority}`,
      type: 'add_peak_surcharge' as RecommendationType,
      title: 'Recargo en horas de alta demanda',
      description: `Con ${metrics.utilizationRate}% de utilización, puedes agregar un pequeño recargo (10-15%) en tus horas más demandadas (${metrics.peakHours.join(', ')}).`,
      projectedRevenueImpact: metrics.revenuePerHour * 0.12 * metrics.peakHours.length,
      projectedUtilizationChange: -2,
      confidence: 0.7,
      priority: priority++,
      params: {
        suggestedPricingRule: {
          name: 'Recargo hora pico',
          surchargePercent: 10,
          startTime: metrics.peakHours[0],
          endTime: minutesToTime(timeToMinutes(metrics.peakHours[0]) + 180),
        },
      },
    });
  }

  return recommendations;
}
