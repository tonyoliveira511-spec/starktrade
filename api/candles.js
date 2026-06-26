export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol = 'BTCUSDT', interval = '15', limit = '300' } = req.query;

  const tfMap = { '1m':'1','5m':'5','15m':'15','1h':'60','4h':'240' };
  const bybitTf = tfMap[interval] || interval.replace('m','').replace('h','0');

  try {
    const url = `https://api.bybit.com/v5/market/kline?category=spot&symbol=${symbol.toUpperCase()}&interval=${bybitTf}&limit=${limit}`;
    const r = await fetch(url);
    const data = await r.json();
    if (data.retCode !== 0) return res.status(400).json({ error: data.retMsg });
    const candles = data.result.list
      .map(k => ({
        time: Math.floor(parseInt(k[0]) / 1000),
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5])
      }))
      .reverse();
    res.status(200).json({ candles });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
