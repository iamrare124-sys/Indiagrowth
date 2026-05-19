import { createClient } from '@supabase/supabase-js';

const MAX_POSTS_PER_SITE = parseInt(process.env.MAX_POSTS_PER_SITE || '30', 10);

let _supabase = null;
let _supabaseAdmin = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return _supabase;
}

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return _supabaseAdmin;
}

export async function postExists(slug) {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from('posts')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (error) return false;
  return !!data;
}

export async function savePost(post) {
  const db = getSupabaseAdmin();
  const { data, error } = await db.from('posts').insert([post]).select().single();
  if (error) throw error;
  await enforcePostLimit();
  return data;
}

export async function enforcePostLimit() {
  const db = getSupabaseAdmin();
  const { count } = await db
    .from('posts')
    .select('*', { count: 'exact', head: true });

  if (count && count > MAX_POSTS_PER_SITE) {
    const excess = count - MAX_POSTS_PER_SITE;
    const { data: oldPosts } = await db
      .from('posts')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(excess);

    if (oldPosts && oldPosts.length > 0) {
      const ids = oldPosts.map((p) => p.id);
      await db.from('posts').delete().in('id', ids);
    }
  }
}

export async function getPostBySlug(slug) {
  const db = getSupabase();
  const { data, error } = await db
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;

  if (typeof data.content === 'string') {
    try {
      data.content = JSON.parse(data.content);
    } catch {}
  }

  return data;
}

export async function getPosts({ limit = 20, category = null, offset = 0 } = {}) {
  const db = getSupabase();
  let query = db
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((post) => {
    if (typeof post.content === 'string') {
      try {
        post.content = JSON.parse(post.content);
      } catch {}
    }
    return post;
  });
}

export async function searchPosts(query) {
  const db = getSupabase();
  const { data, error } = await db
    .from('posts')
    .select('*')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data || [];
}

export async function getRelatedPosts(currentSlug, category, limit = 3) {
  const db = getSupabase();
  const { data } = await db
    .from('posts')
    .select('*')
    .eq('category', category)
    .neq('slug', currentSlug)
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

export async function getAllSlugs() {
  const db = getSupabase();
  const { data } = await db.from('posts').select('slug, updated_at');
  return data || [];
}
