export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  const { symbol = 'BTCUSDT', interval = '15m', limit = '300' } = req.query;
  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Binance error: ${r.status}`);
    const data = await r.json();
    const candles = data.map(k => ({
      time: Math.floor(k[0] / 1000),
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5])
    }));
    res.status(200).json({ candles });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}
