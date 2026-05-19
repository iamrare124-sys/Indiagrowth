export const dynamic = 'force-dynamic';

import { searchPosts } from '../../../lib/supabase.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (!q || q.length < 2) {
    return Response.json({ results: [], query: q });
  }

  try {
    const results = await searchPosts(q);
    return Response.json({ results, query: q });
  } catch (err) {
    return Response.json({ error: err.message, results: [] }, { status: 500 });
  }
}
