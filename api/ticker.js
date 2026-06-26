export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol = 'BTCUSDT' } = req.query;
  try {
    const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${encodeURIComponent(symbol.toUpperCase())}`;
    const r = await fetch(url);
    const text = await r.text();
    if (!r.ok) {
      return res.status(400).json({ error: `Binance: ${text}` });
    }
    const data = JSON.parse(text);
    res.status(200).json({
      symbol: data.symbol,
      price: parseFloat(data.lastPrice),
      change: parseFloat(data.priceChange),
      changePct: parseFloat(data.priceChangePercent),
      high: parseFloat(data.highPrice),
      low: parseFloat(data.lowPrice),
      volume: parseFloat(data.volume)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
