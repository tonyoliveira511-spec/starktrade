export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol = 'BTCUSDT' } = req.query;
  try {
    const sym = symbol.replace('USDT', '-USD').replace('BTC', 'BTC');
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d&range=2d`;
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { return res.status(500).json({ error: 'parse', raw: text.slice(0,200) }); }
    const q = data?.chart?.result?.[0]?.meta;
    if (!q) return res.status(400).json({ error: 'Ativo não encontrado', raw: text.slice(0,200) });
    const prev = q.chartPreviousClose || q.previousClose || q.regularMarketPrice;
    const price = q.regularMarketPrice;
    const changePct = prev ? ((price - prev) / prev * 100) : 0;
    res.status(200).json({
      symbol,
      price,
      change: price - prev,
      changePct,
      high: q.regularMarketDayHigh || price,
      low: q.regularMarketDayLow || price,
      volume: q.regularMarketVolume || 0
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
