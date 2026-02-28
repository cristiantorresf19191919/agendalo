/**
 * Factura Electrónica — DIAN Colombian Electronic Invoicing.
 *
 * Generates DIAN-compliant electronic invoices (Factura Electrónica)
 * directly from completed bookings, sent via WhatsApp or email.
 * Colombian businesses are REQUIRED BY LAW to issue electronic
 * invoices — most small beauty businesses use separate (manual)
 * systems for this.
 *
 * DIFFERENTIATOR: No international competitor addresses Colombian
 * tax compliance. Building DIAN integration into Agendalo eliminates
 * a major pain point and positions the platform as truly built for
 * the Colombian market. This is a legal requirement, not optional.
 */

export type InvoiceStatus = 'draft' | 'issued' | 'sent' | 'accepted_dian' | 'rejected_dian' | 'cancelled' | 'credit_note';
export type InvoiceType = 'factura_venta' | 'nota_credito' | 'nota_debito';
export type TaxType = 'iva' | 'ica' | 'retefuente' | 'reteica';
export type IdentificationType = 'cc' | 'nit' | 'ce' | 'pasaporte' | 'ti';

export interface ElectronicInvoice {
  id: string;
  businessId: string;
  bookingId?: string;
  paymentTransactionId?: string;
  /** DIAN consecutive invoice number. */
  invoiceNumber: string;
  /** DIAN authorization prefix. */
  prefix: string;
  /** CUFE — Código Único de Factura Electrónica. */
  cufe?: string;
  type: InvoiceType;
  status: InvoiceStatus;
  /** Issuer (business) details. */
  issuer: InvoiceParty;
  /** Recipient (customer) details. */
  recipient: InvoiceParty;
  /** Invoice line items. */
  lines: InvoiceLine[];
  /** Subtotal before taxes. */
  subtotal: number;
  /** Tax breakdown. */
  taxes: InvoiceTax[];
  /** Total tax amount. */
  totalTax: number;
  /** Total amount (subtotal + taxes). */
  total: number;
  currency: string;
  /** Payment method used. */
  paymentMethod: string;
  /** Notes/observations. */
  notes?: string;
  /** Issue date — "YYYY-MM-DD". */
  issueDate: string;
  /** Due date — "YYYY-MM-DD". */
  dueDate: string;
  /** DIAN XML document URL (signed). */
  xmlUrl?: string;
  /** PDF representation URL. */
  pdfUrl?: string;
  /** Whether sent via WhatsApp. */
  sentViaWhatsApp: boolean;
  /** Whether sent via email. */
  sentViaEmail: boolean;
  /** DIAN response timestamp. */
  dianResponseAt?: Date;
  /** DIAN rejection reason (if rejected). */
  dianRejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceParty {
  /** Legal name. */
  name: string;
  /** Identification type (CC, NIT, CE, etc.). */
  identificationType: IdentificationType;
  /** Identification number. */
  identificationNumber: string;
  /** Address. */
  address: string;
  city: string;
  department: string;
  /** Phone number. */
  phone?: string;
  /** Email. */
  email?: string;
  /** Tax regime (Régimen Simplificado, Común, etc.). */
  taxRegime?: 'simplificado' | 'comun' | 'no_responsable';
}

export interface InvoiceLine {
  /** Service or product description. */
  description: string;
  /** Quantity. */
  quantity: number;
  /** Unit price. */
  unitPrice: number;
  /** Discount amount. */
  discount: number;
  /** Line subtotal (quantity * unitPrice - discount). */
  subtotal: number;
  /** Tax rate applied (e.g., 19 for 19% IVA). */
  taxRate: number;
  /** Tax amount for this line. */
  taxAmount: number;
  /** Total (subtotal + taxAmount). */
  total: number;
  /** Related service ID. */
  serviceId?: string;
}

export interface InvoiceTax {
  type: TaxType;
  /** Tax rate percentage. */
  rate: number;
  /** Taxable base amount. */
  baseAmount: number;
  /** Tax amount. */
  taxAmount: number;
}

export interface DianConfig {
  id: string;
  businessId: string;
  /** NIT of the business. */
  nit: string;
  /** Verification digit. */
  verificationDigit: string;
  /** DIAN authorization resolution number. */
  resolutionNumber: string;
  /** Resolution date — "YYYY-MM-DD". */
  resolutionDate: string;
  /** Authorized prefix. */
  prefix: string;
  /** Authorized range start. */
  rangeStart: number;
  /** Authorized range end. */
  rangeEnd: number;
  /** Current consecutive number. */
  currentConsecutive: number;
  /** Technical key for CUFE generation. */
  technicalKey: string;
  /** Digital certificate (for signing). */
  certificateUrl?: string;
  /** Tax regime. */
  taxRegime: 'simplificado' | 'comun' | 'no_responsable';
  /** Default IVA rate. */
  defaultIvaRate: number;
  /** Auto-generate invoice on booking completion? */
  autoGenerateOnCompletion: boolean;
  isActive: boolean;
  updatedAt: Date;
}
