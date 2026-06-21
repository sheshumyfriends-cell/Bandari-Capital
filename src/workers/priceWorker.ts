import 'dotenv/config';
import { Worker } from 'bullmq';
import dbConnect from '../lib/mongodb';
import Position from '../models/Position';
import { fetchPrice } from '../lib/market';
import redis from '../lib/redis';
import Notification from '../models/Notification';
import { createAudit } from '../lib/audit';

async function processUpdatePrices() {
  await dbConnect();
  console.log('Price worker started — fetching positions');
  const positions = await Position.find({ status: { $ne: 'exited' } });
  for (const p of positions) {
    try {
      const sym = p.symbol || p.companyName;
      const { price, timestamp } = await fetchPrice(sym, p.exchange);
      if (price !== null && price !== undefined) {
        const old = { lastPrice: p.lastPrice, priceUpdatedAt: p.priceUpdatedAt };
        p.lastPrice = price;
        p.priceUpdatedAt = timestamp || new Date();
        // update remaining quantity if soldQuantity present
        if (p.quantity !== undefined && p.soldQuantity !== undefined) {
          p.remainingQuantity = (p.quantity || 0) - (p.soldQuantity || 0);
        }
        await p.save();

        // cache price in redis for quick reads
        try {
          if (redis) await redis.hset('prices', `${p._id}`, JSON.stringify({ price, ts: p.priceUpdatedAt }));
        } catch (e) {
          console.warn('Redis cache write failed', e?.message || e);
        }

        // create small audit record for price update (non-sensitive)
        await createAudit({ user: null, action: 'price_update', collection: 'Position', documentId: p._id, oldValue: old, newValue: { lastPrice: p.lastPrice, priceUpdatedAt: p.priceUpdatedAt } });

        // send notification to interested parties (broadcast for now)
        try {
          await Notification.create({ user: null, type: 'price_update', title: `Price updated: ${p.companyName}`, body: `${p.companyName} price updated to ${price}`, data: { positionId: p._id, price } });
        } catch (e) {
          console.warn('Notification create failed', e?.message || e);
        }
      }
    } catch (e) {
      console.error('Error updating price for position', p._id, e?.message || e);
    }
  }
}

const worker = new Worker('price-updates', async job => {
  console.log('Processing job', job.id, job.name, job.opts.repeat);
  await processUpdatePrices();
}, { connection: process.env.REDIS_URL ? { connectionString: process.env.REDIS_URL } as any : undefined });

worker.on('completed', job => { console.log('Job completed', job.id); });
worker.on('failed', (job, err) => { console.error('Job failed', job?.id, err); });

console.log('Price worker registered');
