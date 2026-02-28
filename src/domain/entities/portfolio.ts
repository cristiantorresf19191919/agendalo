/**
 * Visual Portfolio.
 * Individual barbers/stylists can upload photos of their work.
 * Customers can browse the gallery and book directly from a specific photo.
 */

export interface PortfolioImage {
  id: string;
  businessId: string;
  professionalId: string;
  imageUrl: string;
  /** Optional thumbnail for gallery grid. */
  thumbnailUrl?: string;
  caption?: string;
  /** Tags for categorization (e.g. "fade", "balayage", "manicure"). */
  tags: string[];
  /** Link to the service shown in the image. */
  serviceId?: string;
  /** Number of times customers booked from this image. */
  bookingCount: number;
  /** Sort order within the gallery. */
  sortOrder: number;
  createdAt: Date;
}
