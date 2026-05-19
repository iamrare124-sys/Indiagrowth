-- ============================================================
-- IndiaGrowth — Supabase Schema
-- Run this once in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── POSTS TABLE ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  meta_title      TEXT,
  meta_description TEXT,
  excerpt         TEXT,
  content         JSONB,
  tags            TEXT[] DEFAULT '{}',
  category        TEXT NOT NULL DEFAULT 'startup-stories',
  author          TEXT DEFAULT 'Ankit Mehta',
  image_url       TEXT,
  image_credit    TEXT,
  source_url      TEXT,
  source_title    TEXT,
  faqs            JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── INDEXES ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_posts_slug        ON posts (slug);
CREATE INDEX IF NOT EXISTS idx_posts_category    ON posts (category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at  ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_tags        ON posts USING GIN (tags);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_posts_fts ON posts
  USING GIN (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(excerpt,'')));

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can read published posts)
CREATE POLICY "Public read access"
  ON posts FOR SELECT
  USING (true);

-- Only service role can insert/update/delete (server-side only)
CREATE POLICY "Service role insert"
  ON posts FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role update"
  ON posts FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role delete"
  ON posts FOR DELETE
  USING (auth.role() = 'service_role');

-- ── UPDATED_AT TRIGGER ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ── SAMPLE VERIFICATION QUERY ────────────────────────────────
-- Run this to verify the schema was created correctly:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'posts' ORDER BY ordinal_position;
