// Tiny in-memory TTL cache shared across server route invocations (per server process).
const store = new Map();

export function getCached(key) {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    store.delete(key);
    return null;
  }
  return hit.value;
}

export function setCached(key, value, ttlMs) {
  store.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}

// Wrap an async producer with caching.
export async function cached(key, ttlMs, producer) {
  const hit = getCached(key);
  if (hit !== null) return hit;
  const value = await producer();
  return setCached(key, value, ttlMs);
}

export const TTL = {
  LIVE: 55 * 1000,
  STATS: 5 * 60 * 1000,
  STANDINGS: 5 * 60 * 1000,
  FIXTURES: 60 * 1000,
};
