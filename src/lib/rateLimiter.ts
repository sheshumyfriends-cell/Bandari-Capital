import Redis from 'ioredis';

const RATE_LIMIT_WINDOW = Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 60); // seconds
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 100); // max requests per window

let redis: Redis.Redis | null = null;
if (process.env.REDIS_URL) redis = new Redis(process.env.REDIS_URL);

export async function checkRateLimit(key: string) {
  // If no redis, allow by default (dev)
  if (!redis) return { ok: true };
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `rate:${key}:${Math.floor(now / RATE_LIMIT_WINDOW)}`;
  const current = await redis.incr(windowKey);
  if (current === 1) {
    await redis.expire(windowKey, RATE_LIMIT_WINDOW + 2);
  }
  const remaining = Math.max(0, RATE_LIMIT_MAX - current);
  const reset = await redis.pttl(windowKey);
  if (current > RATE_LIMIT_MAX) {
    return { ok: false, remaining: 0, reset };
  }
  return { ok: true, remaining, reset };
}
