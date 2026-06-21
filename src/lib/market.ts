import axios from 'axios';

const provider = process.env.STOCK_API_PROVIDER || 'finnhub';
const key = process.env.STOCK_API_KEY || '';

export async function fetchPrice(symbol: string, exchange?: string) {
  // symbol should be adapted per provider — this is a simple adapter placeholder
  if (provider === 'finnhub') {
    // finnhub expects symbol like 'NSE:INFY' or 'AAPL'
    const sym = exchange ? `${exchange}:${symbol}` : symbol;
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${key}`;
    const { data } = await axios.get(url);
    // data.c is current price, data.t timestamp
    return { price: data.c || null, timestamp: data.t ? new Date(data.t * 1000) : null };
  }

  if (provider === 'yahoo') {
    // very basic Yahoo rapidapi placeholder — user must configure
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`;
    const { data } = await axios.get(url);
    const quote = data?.quoteResponse?.result?.[0];
    return { price: quote?.regularMarketPrice || null, timestamp: new Date() };
  }

  // fallback: return null
  return { price: null, timestamp: null };
}
