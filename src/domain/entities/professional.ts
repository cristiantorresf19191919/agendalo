export interface WeeklySchedule {
  [dayOfWeek: number]: TimeWindow[]; // 0=Sunday..6=Saturday
}

export interface TimeWindow {
  start: string; // "HH:mm" format
  end: string;   // "HH:mm" format
}

export interface ScheduleException {
  date: string;       // "YYYY-MM-DD"
  available: boolean;
  windows?: TimeWindow[]; // Override windows for this date
}

export interface Professional {
  id: string;
  businessId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  specialties: string[];
  weeklySchedule: WeeklySchedule;
  exceptions: ScheduleException[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
