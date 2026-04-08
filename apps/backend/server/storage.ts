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
}
