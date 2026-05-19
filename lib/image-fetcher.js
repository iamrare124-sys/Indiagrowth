import siteConfig from '../config/site.config.js';

const PEXELS_BASE = 'https://api.pexels.com/v1/search';
const UNSPLASH_BASE = 'https://api.unsplash.com/search/photos';

export async function fetchImage(keywords) {
  const query = keywords || siteConfig.imageKeywords?.[0] || 'startup india';

  // Try Pexels first
  if (process.env.PEXELS_API_KEY) {
    try {
      const res = await fetch(
        `${PEXELS_BASE}?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
        { headers: { Authorization: process.env.PEXELS_API_KEY } }
      );
      if (res.ok) {
        const data = await res.json();
        const photos = data.photos || [];
        if (photos.length > 0) {
          const photo = photos[Math.floor(Math.random() * photos.length)];
          return {
            url: photo.src.large || photo.src.original,
            credit: photo.photographer,
            creditUrl: photo.photographer_url,
            source: 'pexels',
          };
        }
      }
    } catch (err) {
      console.error('Pexels fetch failed:', err.message);
    }
  }

  // Fallback to Unsplash
  if (process.env.UNSPLASH_ACCESS_KEY) {
    try {
      const res = await fetch(
        `${UNSPLASH_BASE}?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
      );
      if (res.ok) {
        const data = await res.json();
        const results = data.results || [];
        if (results.length > 0) {
          const photo = results[Math.floor(Math.random() * results.length)];
          return {
            url: photo.urls.regular,
            credit: photo.user.name,
            creditUrl: photo.user.links.html,
            source: 'unsplash',
          };
        }
      }
    } catch (err) {
      console.error('Unsplash fetch failed:', err.message);
    }
  }

  // Final fallback: picsum
  return {
    url: `https://picsum.photos/seed/${Date.now()}/1200/630`,
    credit: 'Picsum',
    creditUrl: 'https://picsum.photos',
    source: 'picsum',
  };
}

export async function fetchImageForPost(post) {
  const keywords = post.tags?.slice(0, 2).join(' ') || siteConfig.imageKeywords?.[0];
  return fetchImage(keywords);
}
