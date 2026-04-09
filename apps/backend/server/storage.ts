<<<<<<< HEAD
// Storage proxy disabled in this deployment

type StorageConfig = { baseUrl: string; apiKey: string };

function getStorageConfig(): StorageConfig {
  throw new Error("Storage service is not available in this deployment");
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array,
  contentType?: string,
): Promise<{ key: string; url: string }> {
  throw new Error("Storage service is not available in this deployment");
}

export async function storageGet(
  relKey: string,
  expiresIn?: number,
): Promise<{ key: string; url: string }> {
  throw new Error("Storage service is not available in this deployment");
=======
/**
 * Storage helpers stub
 * Refactor this to use your preferred storage provider (S3, Cloudinary, etc.)
 */

export async function storagePut(
  relKey: string,
  _data: Buffer | Uint8Array | string,
  _contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  console.warn("[Storage] storagePut is not implemented. Returning mock URL.");
  return { 
    key: relKey, 
    url: `https://storage.example.com/${relKey}` 
  };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  console.warn("[Storage] storageGet is not implemented. Returning mock URL.");
  return {
    key: relKey,
    url: `https://storage.example.com/${relKey}`,
  };
>>>>>>> c4cfd05 (refactor: remover dependencias Manus)
}
