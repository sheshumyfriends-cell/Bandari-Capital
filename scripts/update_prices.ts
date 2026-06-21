import dbConnect from '../src/lib/mongodb';
import Position from '../src/models/Position';
import { fetchPrice } from '../src/lib/market';

async function updatePrices() {
  await dbConnect();
  const positions = await Position.find({ status: { $ne: 'exited' } });
  for (const p of positions) {
    try {
      const sym = p.symbol || p.companyName;
      const { price, timestamp } = await fetchPrice(sym, p.exchange);
      if (price !== null) {
        p.lastPrice = price;
        p.priceUpdatedAt = timestamp || new Date();
        // update remaining/realized calcs if needed
        if (p.quantity && p.soldQuantity !== undefined) {
          p.remainingQuantity = (p.quantity || 0) - (p.soldQuantity || 0);
        }
        await p.save();
      }
    } catch (e) {
      console.error('price update error for', p._id, e.message || e);
    }
  }
  process.exit(0);
}

updatePrices().catch((err) => { console.error(err); process.exit(1); });
