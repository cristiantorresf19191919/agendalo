export interface BlockedRange {
  id: string;
  professionalId: string;
  businessId: string;
  date: string;        // "YYYY-MM-DD"
  startTime: string;   // "HH:mm"
  endTime: string;     // "HH:mm"
  reason?: string;
  createdAt: Date;
}
