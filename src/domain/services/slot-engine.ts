import { TimeWindow, WeeklySchedule, ScheduleException } from '../entities/professional';
import { Booking } from '../entities/booking';
import { BlockedRange } from '../entities/blocked-range';
import { timeToMinutes, minutesToTime, doTimeSlotsOverlap, TimeSlot } from '../value-objects/time-slot';

export interface SlotEngineConfig {
  stepMinutes: number;         // Default: 15
  bufferMinutes: number;       // Default: 10 (gap between bookings)
  leadTimeMinutes: number;     // Default: 60 (minimum advance notice)
}

export const DEFAULT_SLOT_CONFIG: SlotEngineConfig = {
  stepMinutes: 15,
  bufferMinutes: 10,
  leadTimeMinutes: 60,
};

export interface SlotEngineInput {
  date: string;                          // "YYYY-MM-DD"
  serviceDurationMinutes: number;
  weeklySchedule: WeeklySchedule;
  exceptions: ScheduleException[];
  existingBookings: Pick<Booking, 'date' | 'startTime' | 'endTime'>[];
  blockedRanges: Pick<BlockedRange, 'date' | 'startTime' | 'endTime'>[];
  config?: Partial<SlotEngineConfig>;
  now: Date;                             // Current time for lead-time calc
}

export interface AvailableSlot {
  start: string;  // "HH:mm"
  end: string;    // "HH:mm"
}

/**
 * Pure function to compute available booking slots for a given date.
 *
 * Algorithm:
 * 1. Determine working windows for the date (exceptions override weekly schedule)
 * 2. Generate candidate slots in `stepMinutes` increments within working windows
 * 3. Filter out slots that overlap with existing bookings (+ buffer)
 * 4. Filter out slots that overlap with blocked ranges
 * 5. Filter out slots that don't respect lead time
 */
export function computeAvailableSlots(input: SlotEngineInput): AvailableSlot[] {
  const config = { ...DEFAULT_SLOT_CONFIG, ...input.config };
  const { date, serviceDurationMinutes, weeklySchedule, exceptions, existingBookings, blockedRanges, now } = input;

  // Step 1: Get working windows for this specific date
  const windows = getWorkingWindows(date, weeklySchedule, exceptions);
  if (windows.length === 0) return [];

  // Step 2: Generate candidate slots
  const candidates: AvailableSlot[] = [];
  for (const window of windows) {
    const windowStart = timeToMinutes(window.start);
    const windowEnd = timeToMinutes(window.end);

    for (let start = windowStart; start + serviceDurationMinutes <= windowEnd; start += config.stepMinutes) {
      candidates.push({
        start: minutesToTime(start),
        end: minutesToTime(start + serviceDurationMinutes),
      });
    }
  }

  // Step 3: Filter out conflicts with existing bookings (considering buffer)
  const dayBookings = existingBookings.filter((b) => b.date === date);
  const dayBlocked = blockedRanges.filter((b) => b.date === date);

  // Step 4: Compute lead time cutoff
  const nowDate = now.toISOString().split('T')[0];
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const leadTimeCutoff = nowDate === date ? nowMinutes + config.leadTimeMinutes : -1;

  return candidates.filter((slot) => {
    const slotStart = timeToMinutes(slot.start);
    const slotEnd = timeToMinutes(slot.end);

    // Check lead time
    if (leadTimeCutoff > 0 && slotStart < leadTimeCutoff) {
      return false;
    }

    // Check booking conflicts (with buffer)
    const hasBookingConflict = dayBookings.some((booking) => {
      const bookingStart = timeToMinutes(booking.startTime) - config.bufferMinutes;
      const bookingEnd = timeToMinutes(booking.endTime) + config.bufferMinutes;
      return slotStart < bookingEnd && slotEnd > bookingStart;
    });
    if (hasBookingConflict) return false;

    // Check blocked range conflicts
    const hasBlockedConflict = dayBlocked.some((blocked) => {
      return doTimeSlotsOverlap(
        { start: slot.start, end: slot.end },
        { start: blocked.startTime, end: blocked.endTime }
      );
    });
    if (hasBlockedConflict) return false;

    return true;
  });
}

function getWorkingWindows(
  date: string,
  weeklySchedule: WeeklySchedule,
  exceptions: ScheduleException[]
): TimeWindow[] {
  // Check for exception on this date first
  const exception = exceptions.find((e) => e.date === date);
  if (exception) {
    if (!exception.available) return [];
    return exception.windows ?? [];
  }

  // Fall back to weekly schedule
  const dayOfWeek = new Date(date + 'T12:00:00').getDay();
  return weeklySchedule[dayOfWeek] ?? [];
}
