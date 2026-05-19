import Parser from 'rss-parser';
import siteConfig from '../config/site.config.js';

const MAX_AGE = 48 * 60 * 60 * 1000; // 48 hours in ms
const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IndiaGrowthBot/1.0)' },
});

function isRecent(pubDate) {
  if (!pubDate) return false;
  const age = Date.now() - new Date(pubDate).getTime();
  return age < MAX_AGE;
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

async function fetchRSS(url) {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items || [])
      .filter((item) => isRecent(item.pubDate || item.isoDate))
      .map((item) => ({
        title: item.title || '',
        link: item.link || item.guid || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        summary: item.contentSnippet || item.content || item.summary || '',
        source: feed.title || url,
      }));
  } catch (err) {
    console.error(`RSS fetch failed for ${url}:`, err.message);
    return [];
  }
}

async function fetchReddit(subreddit) {
  try {
    const res = await fetch(
      `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`,
      {
        headers: { 'User-Agent': 'IndiaGrowthBot/1.0' },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const posts = json?.data?.children || [];
    return posts
      .filter((p) => {
        const created = p.data.created_utc * 1000;
        return Date.now() - created < MAX_AGE;
      })
      .map((p) => ({
        title: p.data.title,
        link: `https://reddit.com${p.data.permalink}`,
        pubDate: new Date(p.data.created_utc * 1000).toISOString(),
        summary: p.data.selftext?.substring(0, 300) || p.data.title,
        source: `Reddit r/${subreddit}`,
      }));
  } catch (err) {
    console.error(`Reddit fetch failed for r/${subreddit}:`, err.message);
    return [];
  }
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

  const text = `${item.title} ${item.summary}`.toLowerCase();
  let score = 0;

  keywords.forEach((kw) => {
    if (text.includes(kw.toLowerCase())) score += 2;
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

  const [rssResults, redditResults] = await Promise.all([
    Promise.all(rssUrls.map(fetchRSS)),
    Promise.all(redditSubs.map(fetchReddit)),
  ]);

  const allItems = [
    ...rssResults.flat(),
    ...redditResults.flat(),
  ];

  const deduped = deduplicate(allItems);
  return deduped.sort((a, b) => scoreItem(b) - scoreItem(a));
}

export function selectBestStory(items) {
  if (!items || items.length === 0) return null;
  const scored = items.map((item) => ({ ...item, score: scoreItem(item) }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}
