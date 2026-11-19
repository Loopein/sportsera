type CacheEntry = {
  value: unknown;
  expiresAt: number;
};

const memoryStore = new Map<string, CacheEntry>();

export async function getCached<T>(key: string): Promise<T | null> {
  const found = memoryStore.get(key);
  if (!found) return null;
  if (Date.now() > found.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return found.value as T;
}

export async function setCached<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  memoryStore.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
}
