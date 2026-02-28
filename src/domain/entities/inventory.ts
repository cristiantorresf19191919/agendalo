/**
 * Inventory & Point of Sale (POS).
 * Businesses can sell retail products (e.g. beard oil, shampoo)
 * alongside services, track stock levels, and create checkout flows.
 */

export interface InventoryItem {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  sku?: string;
  imageUrl?: string;
  category?: string;
  price: number;
  currency: string;
  /** Current stock quantity. */
  stockQuantity: number;
  /** Alert when stock falls to this level. */
  lowStockThreshold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * A completed sale — can include services + retail products.
 */
export interface SaleOrder {
  id: string;
  businessId: string;
  customerId?: string;
  /** Associated booking, if any. */
  bookingId?: string;
  lines: OrderLine[];
  subtotal: number;
  taxAmount: number;
  total: number;
  currency: string;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'other';
  externalPaymentId?: string;
  notes?: string;
  createdAt: Date;
}

export interface OrderLine {
  id: string;
  type: 'service' | 'product';
  /** Reference to Service.id or InventoryItem.id */
  referenceId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
