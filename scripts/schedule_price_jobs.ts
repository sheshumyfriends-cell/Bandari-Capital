import createQueue from '../src/lib/queue';

async function schedule() {
  const queue = createQueue('price-updates');
  // schedule repeatable job based on env interval (ms)
  const interval = Number(process.env.PRICE_UPDATE_INTERVAL_MS || 60000);
  console.log('Scheduling price update job every', interval, 'ms');
  await queue.add('update-prices', {}, { repeat: { every: interval } });
  console.log('Scheduled');
  process.exit(0);
}

schedule().catch(err => { console.error(err); process.exit(1); });
