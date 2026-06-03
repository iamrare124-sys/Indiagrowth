export const dynamic = 'force-dynamic';

import { getSupabaseAdmin } from '../../../lib/supabase.js';
import { verifyApiPassword } from '../../../lib/security.js';
import siteConfig from '../../../config/site.config.js';

export async function GET(request) {
  if (!verifyApiPassword(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const siteName = process.env.SITE_NAME || 'indiagrowth';
  const db = getSupabaseAdmin();
  const { data: posts } = await db
    .from('posts')
    .select('id, title, excerpt, content, meta_description')
    .eq('site_name', siteName);

  let fixed = 0;
  for (const post of posts || []) {
    if (!post.excerpt || post.excerpt.trim().length < 20) {
      let content = post.content;
      if (typeof content === 'string') {
        try { content = JSON.parse(content); } catch {}
      }
      const excerpt =
        post.meta_description ||
        content?.hook?.substring(0, 160) ||
        content?.sections?.[0]?.body?.substring(0, 160) ||
        `${post.title} — ${siteConfig.tagline}`;

      await db
        .from('posts')
        .update({ excerpt: excerpt.substring(0, 300) })
        .eq('id', post.id);
      fixed++;
    }
  }

  return Response.json({ success: true, fixed, total: posts?.length || 0 });
}
