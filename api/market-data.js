export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { symbol = 'BTCUSDT' } = req.query;
  const base = symbol.replace('USDT','').replace('BUSD','').toUpperCase();

  const results = { fearGreed: null, news: null, calendar: null, funding: null };

  await Promise.allSettled([
    // Fear & Greed
    fetch('https://api.alternative.me/fng/?limit=1')
      .then(r => r.json())
      .then(d => { results.fearGreed = { value: parseInt(d.data[0].value), label: d.data[0].value_classification } })
      .catch(() => {}),

    // CryptoPanic news
    fetch(`https://cryptopanic.com/api/free/v1/posts/?auth_token=free&currencies=${base}&filter=important&public=true`)
      .then(r => r.json())
      .then(d => {
        if (!d.results) return;
        const news = d.results.slice(0, 5).map(n => ({
          title: n.title,
          sentiment: n.votes?.positive > n.votes?.negative ? 'positive' : n.votes?.negative > n.votes?.positive ? 'negative' : 'neutral',
          url: n.url,
          age: Math.round((Date.now() - new Date(n.published_at)) / 60000)
        }));
        results.news = news;
      })
      .catch(() => {}),

    // Bybit funding rate
    fetch(`https://api.bybit.com/v5/market/tickers?category=linear&symbol=${base}USDT`)
      .then(r => r.json())
      .then(d => {
        const t = d?.result?.list?.[0];
        if (t) results.funding = { rate: parseFloat(t.fundingRate) * 100, symbol: t.symbol };
      })
      .catch(() => {}),
  ]);

  // Calendário econômico simplificado - eventos fixos de alto impacto conhecidos
  // Em produção, integrar com ForexFactory RSS
  results.calendar = { events: [], source: 'static' };

  res.status(200).json(results);
}
