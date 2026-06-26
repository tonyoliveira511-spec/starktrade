export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol = 'BTCUSDT' } = req.query;
  try {
    const url = `https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol.toUpperCase()}`;
    const r = await fetch(url);
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { return res.status(500).json({ error: 'JSON parse error', raw: text.slice(0,500) }); }
    if (data.retCode !== 0) return res.status(400).json({ error: data.retMsg });
    const t = data.result.list[0];
    res.status(200).json({
      symbol: t.symbol,
      price: parseFloat(t.lastPrice),
      change: parseFloat(t.price24hPcnt) * parseFloat(t.lastPrice),
      changePct: parseFloat(t.price24hPcnt) * 100,
      high: parseFloat(t.highPrice24h),
      low: parseFloat(t.lowPrice24h),
      volume: parseFloat(t.volume24h)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
