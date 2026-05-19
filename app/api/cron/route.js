export const dynamic = 'force-dynamic';
export const maxDuration = 300;

import { fetchAllSources, selectBestStory } from '../../../lib/rss-fetcher.js';
import { generatePost } from '../../../lib/blog-generator.js';
import { fetchImageForPost } from '../../../lib/image-fetcher.js';
import { postExists, savePost } from '../../../lib/supabase.js';
import { verifyCronSecret } from '../../../lib/security.js';
import siteConfig from '../../../config/site.config.js';

export async function GET(request) {
  const start = Date.now();

  if (!verifyCronSecret(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const errors = [];
  const published = [];
  let requested = 0;

  try {
    // Fetch news sources
    const stories = await fetchAllSources();
    requested = stories.length;

    if (stories.length === 0) {
      return Response.json({
        success: false,
        message: 'No recent stories found',
        requested: 0,
        published: 0,
        duration_seconds: (Date.now() - start) / 1000,
      });
    }

    // Try up to 5 stories to find one we can publish
    const candidates = stories.slice(0, 5);

    for (const story of candidates) {
      try {
        // Generate blog post
        const generated = await generatePost(story);

        if (!generated || !generated.title) {
          errors.push({ story: story.title, error: 'Generation failed' });
          continue;
        }

        // Check for duplicate
        const exists = await postExists(generated.slug);
        if (exists) {
          errors.push({ story: story.title, error: 'Duplicate slug' });
          continue;
        }

        // Fetch image
        const image = await fetchImageForPost(generated);

        // Build excerpt with 3 fallbacks
        const excerpt =
          generated.metaDescription ||
          generated.content?.hook?.substring(0, 160) ||
          generated.content?.sections?.[0]?.body?.substring(0, 160) ||
          `${generated.title} - ${siteConfig.tagline}`;

        // Save to DB
        const post = await savePost({
          slug: generated.slug,
          title: generated.title,
          meta_title: generated.metaTitle,
          meta_description: generated.metaDescription,
          excerpt: excerpt.substring(0, 300),
          content: JSON.stringify({
            ...generated.content,
            rawContent: generated.rawContent || '',
          }),
          tags: generated.tags || [],
          category: generated.category || 'startup-stories',
          author: siteConfig.author?.name || 'IndiaGrowth Team',
          image_url: image?.url || '',
          image_credit: image?.credit || '',
          source_url: story.link || '',
          source_title: story.source || '',
          faqs: generated.faqs || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        published.push({ slug: post.slug, title: post.title });

        // Ping IndexNow (fire and forget)
        pingIndexNow(post.slug).catch(() => {});

        break; // Published one, done
      } catch (err) {
        errors.push({ story: story.title, error: err.message });
      }
    }
  } catch (err) {
    errors.push({ error: err.message });
  }

  return Response.json({
    success: published.length > 0,
    requested,
    published: published.length,
    duration_seconds: Math.round((Date.now() - start) / 1000),
    posts: published,
    errors,
  });
}

async function pingIndexNow(slug) {
  const key = process.env.INDEX_NOW_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!key || !siteUrl) return;

  try {
    await fetch(
      `https://api.indexnow.org/indexnow?url=${encodeURIComponent(`${siteUrl}/${slug}`)}&key=${key}`
    );
  } catch {}
}
