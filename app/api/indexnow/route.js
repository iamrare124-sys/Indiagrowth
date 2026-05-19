export const dynamic = 'force-dynamic';

import { verifyCronSecret } from '../../../lib/security.js';

export async function GET(request) {
  if (!verifyCronSecret(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const key = process.env.INDEX_NOW_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!key || !siteUrl) {
    return Response.json({ error: 'IndexNow not configured' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.indexnow.org/indexnow?url=${encodeURIComponent(siteUrl)}&key=${key}`
    );
    return Response.json({ success: true, status: res.status });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
