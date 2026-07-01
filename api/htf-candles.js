export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol = 'BTCUSDT', interval = '4h' } = req.query;
  const tfMap = {'1m':'1min','5m':'5min','15m':'15min','1h':'1h','4h':'4h'};
  const tf = tfMap[interval] || '4h';
  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol.replace('USDT','/USD')}&interval=${tf}&outputsize=60&apikey=demo`;
    const r = await fetch(url);
    const data = await r.json();
    if (data.status === 'error') return res.status(400).json({ error: data.message });
    const candles = data.values.map(k => ({
      time: Math.floor(new Date(k.datetime).getTime() / 1000),
      open: parseFloat(k.open), high: parseFloat(k.high),
      low: parseFloat(k.low), close: parseFloat(k.close),
      volume: parseFloat(k.volume || 0)
    })).reverse();
    res.status(200).json({ candles });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
