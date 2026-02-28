import type { ElectronicInvoice, DianConfig } from '@/domain/entities/electronic-invoice';

export interface CreateInvoiceInput {
  businessId: string;
  bookingId?: string;
  paymentTransactionId?: string;
  type: ElectronicInvoice['type'];
  recipient: ElectronicInvoice['recipient'];
  lines: ElectronicInvoice['lines'];
  paymentMethod: string;
  notes?: string;
}

export interface ElectronicInvoiceRepository {
  getById(id: string): Promise<ElectronicInvoice | null>;
  getByBookingId(bookingId: string): Promise<ElectronicInvoice | null>;
  listByBusiness(businessId: string, startDate?: string, endDate?: string): Promise<ElectronicInvoice[]>;
  create(input: CreateInvoiceInput): Promise<ElectronicInvoice>;
  update(id: string, data: Partial<ElectronicInvoice>): Promise<void>;
}

export interface DianConfigRepository {
  getByBusinessId(businessId: string): Promise<DianConfig | null>;
  create(data: Omit<DianConfig, 'id' | 'updatedAt'>): Promise<DianConfig>;
  update(id: string, data: Partial<DianConfig>): Promise<void>;
  incrementConsecutive(id: string): Promise<number>;
}

export interface DianIntegrationPort {
  /** Sign and send an invoice to DIAN. */
  submitInvoice(invoice: ElectronicInvoice, config: DianConfig): Promise<{ cufe: string; xmlUrl: string; status: 'accepted' | 'rejected'; rejectionReason?: string }>;
  /** Generate CUFE hash. */
  generateCufe(params: { invoiceNumber: string; issueDate: string; total: number; taxAmount: number; nit: string; technicalKey: string }): Promise<string>;
  /** Generate PDF representation of the invoice. */
  generatePdf(invoice: ElectronicInvoice): Promise<{ pdfUrl: string }>;
}
