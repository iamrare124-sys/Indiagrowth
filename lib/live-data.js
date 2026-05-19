import siteConfig from '../config/site.config.js';

export async function getLiveData() {
  const provider = siteConfig.liveDataProvider || 'static';

  if (provider === 'static') {
    return getStaticData();
  }

  return getStaticData();
}

function getStaticData() {
  const symbols = siteConfig.liveDataSymbols || [];
  return symbols.map((symbol, i) => ({
    symbol,
    value: i === 0 ? '₹847 Cr' : '23',
    change: i === 0 ? '+12.4%' : '+5',
    direction: 'up',
  }));
}

export async function getTickerData() {
  const liveData = await getLiveData();
  const extras = [
    { symbol: 'SENSEX', value: '74,382', change: '+0.8%', direction: 'up' },
    { symbol: 'NIFTY 50', value: '22,604', change: '+0.6%', direction: 'up' },
    { symbol: 'USDINR', value: '83.42', change: '-0.1%', direction: 'down' },
  ];
  return [...liveData, ...extras];
}
