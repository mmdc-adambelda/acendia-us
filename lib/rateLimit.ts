// Simple in-memory sliding-window rate limiter. Good enough to blunt basic
// form abuse on a single-instance deployment; swap for a durable store
// (Upstash/Redis) if the app scales to multiple serverless instances.

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > MAX_REQUESTS;
}
