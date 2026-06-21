import Redis from 'ioredis';

let redis: Redis.Redis | null = null;

if (!process.env.REDIS_URL) {
  console.warn('REDIS_URL not set — caching and rate-limiting disabled in local env');
} else {
  redis = new Redis(process.env.REDIS_URL);
}

export default redis;
