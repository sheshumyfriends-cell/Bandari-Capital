import { Queue, QueueScheduler } from 'bullmq';
import IORedis from 'ioredis';

const connection = process.env.REDIS_URL ? new IORedis(process.env.REDIS_URL) : undefined;

export function createQueue(name: string) {
  const queue = new Queue(name, { connection });
  // ensure a scheduler exists for repeatable jobs
  new QueueScheduler(name, { connection });
  return queue;
}

export default createQueue;
