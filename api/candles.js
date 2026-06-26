export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol = 'BTCUSDT', interval = '15m', limit = '300' } = req.query;
  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${encodeURIComponent(symbol.toUpperCase())}&interval=${interval}&limit=${limit}`;
    const r = await fetch(url);
    const text = await r.text();
    if (!r.ok) {
      return res.status(400).json({ error: `Binance: ${text}` });
    }
    const data = JSON.parse(text);
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
    res.status(500).json({ error: e.message });
  }
}
