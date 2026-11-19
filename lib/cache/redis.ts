type CacheEntry = {
  value: unknown;
  freshUntil: number;
  staleUntil: number;
};

export type CachedLookup<T> = {
  value: T;
  isStale: boolean;
};

const MAX_CACHE_ENTRIES = 500;

const globalForCache = globalThis as unknown as {
  __sportseraMemoryCache?: Map<string, CacheEntry>;
};

const memoryStore = globalForCache.__sportseraMemoryCache ?? new Map<string, CacheEntry>();
globalForCache.__sportseraMemoryCache = memoryStore;

export async function getCachedEntry<T>(key: string): Promise<CachedLookup<T> | null> {
  const found = memoryStore.get(key);
  if (!found) return null;
  const now = Date.now();
  if (now > found.staleUntil) {
    memoryStore.delete(key);
    return null;
  }
  return {
    value: found.value as T,
    isStale: now > found.freshUntil
  };
}

export async function getCached<T>(key: string): Promise<T | null> {
  const entry = await getCachedEntry<T>(key);
  if (!entry || entry.isStale) return null;
  return entry.value;
}

export async function setCached<T>(key: string, value: T, ttlSeconds: number, staleSeconds?: number): Promise<void> {
  if (!memoryStore.has(key) && memoryStore.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = memoryStore.keys().next().value;
    if (oldestKey !== undefined) {
      memoryStore.delete(oldestKey);
    }
  }
  const now = Date.now();
  const effectiveStale = staleSeconds ?? Math.max(ttlSeconds * 6, 120);
  memoryStore.set(key, {
    value,
    freshUntil: now + ttlSeconds * 1000,
    staleUntil: now + effectiveStale * 1000
  });
}

export function clearCache(): void {
  memoryStore.clear();
}
