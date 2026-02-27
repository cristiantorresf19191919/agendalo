export interface StoragePort {
  uploadImage(path: string, file: File | Blob): Promise<string>;
  deleteImage(path: string): Promise<void>;
  getImageUrl(path: string): Promise<string>;
}
