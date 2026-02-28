import type { InventoryItem, SaleOrder, OrderLine } from '@/domain/entities/inventory';

export interface CreateInventoryItemInput {
  businessId: string;
  name: string;
  description?: string;
  sku?: string;
  imageUrl?: string;
  category?: string;
  price: number;
  currency: string;
  stockQuantity: number;
  lowStockThreshold: number;
}

export interface InventoryRepository {
  create(input: CreateInventoryItemInput): Promise<InventoryItem>;
  getById(id: string): Promise<InventoryItem | null>;
  getByBusinessId(businessId: string): Promise<InventoryItem[]>;
  getLowStock(businessId: string): Promise<InventoryItem[]>;
  update(id: string, data: Partial<CreateInventoryItemInput>): Promise<InventoryItem>;
  adjustStock(id: string, quantityDelta: number): Promise<void>;
  toggleActive(id: string, isActive: boolean): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface CreateSaleOrderInput {
  businessId: string;
  customerId?: string;
  bookingId?: string;
  lines: Omit<OrderLine, 'id'>[];
  taxAmount: number;
  paymentMethod: SaleOrder['paymentMethod'];
  externalPaymentId?: string;
  notes?: string;
}

export interface SaleOrderRepository {
  create(input: CreateSaleOrderInput): Promise<SaleOrder>;
  getById(id: string): Promise<SaleOrder | null>;
  getByBusinessId(businessId: string, dateRange?: { from: string; to: string }): Promise<SaleOrder[]>;
  getByCustomerId(customerId: string): Promise<SaleOrder[]>;
}
