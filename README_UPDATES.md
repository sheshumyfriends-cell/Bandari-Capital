- Added a job queue and worker scaffolding using BullMQ (Redis) to process scheduled price updates.

How to run
1. Install dependencies (already in package.json). Ensure REDIS_URL is set.
2. Start the worker (in a separate terminal or process):
   npm run worker
3. Schedule the repeat job (run once to create repeatable job):
   npm run schedule

Environment variables used
- REDIS_URL
- PRICE_UPDATE_INTERVAL_MS (default 60000)

Notes
- Worker will fetch positions and update lastPrice using the market adapter.
- Price updates are cached in Redis and an audit entry + notification are created for each update.
