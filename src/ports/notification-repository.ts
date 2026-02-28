import type { Notification, ReminderConfig } from '@/domain/entities/notification';

export interface CreateNotificationInput {
  recipientId: string;
  recipientType: Notification['recipientType'];
  businessId: string;
  type: Notification['type'];
  channel: Notification['channel'];
  title: string;
  body: string;
  actionUrl?: string;
  actionLabel?: string;
  referenceId?: string;
  whatsappMessage?: string;
  whatsappUrl?: string;
  scheduledAt?: Date;
}

export interface NotificationRepository {
  getById(id: string): Promise<Notification | null>;
  listByRecipient(recipientId: string, limit?: number): Promise<Notification[]>;
  listUnread(recipientId: string): Promise<Notification[]>;
  countUnread(recipientId: string): Promise<number>;
  create(input: CreateNotificationInput): Promise<Notification>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(recipientId: string): Promise<void>;
  dismiss(id: string): Promise<void>;
}

export interface ReminderConfigRepository {
  getByBusinessId(businessId: string): Promise<ReminderConfig | null>;
  create(data: Omit<ReminderConfig, 'id' | 'updatedAt'>): Promise<ReminderConfig>;
  update(id: string, data: Partial<ReminderConfig>): Promise<void>;
}
