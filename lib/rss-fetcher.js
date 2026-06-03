import Parser from 'rss-parser';
import siteConfig from '../config/site.config.js';

const MAX_AGE = 48 * 60 * 60 * 1000; // 48 hours in ms
const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SyndicateHub/1.0 news aggregator)' },
});

function isRecent(pubDate) {
  if (!pubDate) return false;
  const age = Date.now() - new Date(pubDate).getTime();
  return age < MAX_AGE && age > 0;
}

function deduplicate(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = (item.title || '').substring(0, 60).toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchNewsFromRSS(url) {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items || [])
      .filter((item) => {
        const pubDate = item.pubDate || item.isoDate;
        if (!pubDate) return false;
        const age = Date.now() - new Date(pubDate).getTime();
        return age < MAX_AGE && age > 0;
      })
      .map((item) => ({
        title: item.title || '',
        link: item.link || item.guid || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        description: item.contentSnippet || item.content || item.summary || '',
        source: feed.title || url,
      }));
  } catch (err) {
    console.error(`RSS fetch failed for ${url}:`, err.message);
    return [];
  }
}

async function fetchBing() {
  const keywords = [
    siteConfig.primaryKeyword || 'india startup',
    ...(siteConfig.secondaryKeywords || []).slice(0, 1),
  ].join(' ');
  const url = `https://www.bing.com/news/search?q=${encodeURIComponent(keywords)}&format=rss&mkt=en-IN`;
  try {
    const feed = await parser.parseURL(url);
    return (feed.items || [])
      .filter((item) => {
        const pubDate = item.pubDate || item.isoDate;
        if (!pubDate) return false;
        const age = Date.now() - new Date(pubDate).getTime();
        return age < MAX_AGE && age > 0;
      })
      .map((item) => ({
        title: item.title || '',
        link: item.link || item.guid || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        description: item.contentSnippet || item.summary || '',
        source: 'Bing News',
      }));
  } catch (err) {
    console.error('Bing News fetch failed:', err.message);
    return [];
  }
}

async function fetchYahoo() {
  const keywords = siteConfig.primaryKeyword || 'india startup funding';
  const url = `https://finance.yahoo.com/rss/headline?s=${encodeURIComponent(keywords)}`;
  try {
    const feed = await parser.parseURL(url);
    return (feed.items || [])
      .filter((item) => {
        const pubDate = item.pubDate || item.isoDate;
        if (!pubDate) return false;
        const age = Date.now() - new Date(pubDate).getTime();
        return age < MAX_AGE && age > 0;
      })
      .map((item) => ({
        title: item.title || '',
        link: item.link || item.guid || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        description: item.contentSnippet || item.summary || '',
        source: 'Yahoo Finance',
      }));
  } catch (err) {
    console.error('Yahoo Finance fetch failed:', err.message);
    return [];
  }
}

async function fetchReddit(subreddits) {
  const items = [];
  for (const sub of (subreddits || []).slice(0, 2)) {
    try {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/hot.json?limit=10`,
        {
          headers: { 'User-Agent': 'SyndicateHub/1.0 news aggregator' },
          next: { revalidate: 0 },
        }
      );
      if (!res.ok) continue;
      const json = await res.json();
      const posts = json?.data?.children || [];
      const fresh = posts.filter((p) => {
        const age = Date.now() - p.data.created_utc * 1000;
        return age < 24 * 60 * 60 * 1000 && !p.data.stickied;
      });
      items.push(
        ...fresh.slice(0, 3).map((p) => ({
          title: p.data.title,
          link: `https://reddit.com${p.data.permalink}`,
          pubDate: new Date(p.data.created_utc * 1000).toISOString(),
          description: (p.data.selftext || p.data.title).slice(0, 400),
          source: `r/${sub}`,
        }))
      );
    } catch (err) {
      console.error(`Reddit r/${sub} failed:`, err.message);
    }
  }
  return items;
}

function scoreItem(item) {
  const keywords = [
    ...(siteConfig.secondaryKeywords || []),
    siteConfig.primaryKeyword || '',
    'india',
    'startup',
    'funding',
    'crore',
    'founder',
    'vc',
    'sequoia',
    'accel',
  ];

  const text = `${item.title} ${item.description || ''}`.toLowerCase();
  let score = 0;

  keywords.forEach((kw) => {
    if (kw && text.includes(kw.toLowerCase())) score += 2;
  });

  // Recency bonus
  const ageMs = Date.now() - new Date(item.pubDate).getTime();
  const ageHours = ageMs / (1000 * 60 * 60);
  if (ageHours < 6) score += 5;
  else if (ageHours < 12) score += 3;
  else if (ageHours < 24) score += 1;

  return score;
}

export async function fetchAllSources() {
  const rssUrls = siteConfig.rssSources || [];
  const redditSubs = siteConfig.reddit || [];

  // Use Promise.allSettled so one failure doesn't kill the rest
  const results = await Promise.allSettled([
    ...rssUrls.map((url) => fetchNewsFromRSS(url)),
    fetchBing(),
    fetchYahoo(),
    fetchReddit(redditSubs),
  ]);

  const allItems = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value || []);

  if (allItems.length === 0) {
    console.warn('fetchAllSources: all sources returned empty');
    return [];
  }

  const deduped = deduplicate(allItems);
  return deduped.sort((a, b) => scoreItem(b) - scoreItem(a));
}

export function selectBestStory(items) {
  if (!items || items.length === 0) return null;
  const scored = items.map((item) => ({ ...item, score: scoreItem(item) }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}
