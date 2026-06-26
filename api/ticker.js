export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  const { symbol = 'BTCUSDT' } = req.query;
  try {
    const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Binance error: ${r.status}`);
    const data = await r.json();
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
    res.status(400).json({ error: e.message });
  }
}
