export interface StorageProvider {
  uploadFile(file: File): Promise<string>;
  deleteFile(path: string): Promise<void>;
}
