-- ============================================================
-- IndiaGrowth / SyndicateHub — Supabase Schema
-- Supports multiple sites in ONE Supabase project
-- Run this once in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── DROP OLD TABLE IF MIGRATING ──────────────────────────────
-- Uncomment ONLY if you need to reset (WARNING: deletes all data)
-- DROP TABLE IF EXISTS posts CASCADE;

-- ── POSTS TABLE ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name        TEXT NOT NULL DEFAULT 'indiagrowth',
  slug             TEXT NOT NULL,
  title            TEXT NOT NULL,
  excerpt          TEXT,
  content          JSONB,
  category         TEXT NOT NULL DEFAULT 'startup-stories',
  tags             TEXT[] DEFAULT '{}',
  cover_image      TEXT,
  cover_image_alt  TEXT,
  author_name      TEXT DEFAULT 'Ankit Mehta',
  author_title     TEXT,
  meta_title       TEXT,
  meta_description TEXT,
  schema_json      JSONB,
  live_data        JSONB,
  reading_time     INT DEFAULT 5,
  word_count       INT DEFAULT 800,
  ai_score         INT DEFAULT 7,
  published        BOOLEAN DEFAULT true,
  tweeted          BOOLEAN DEFAULT false,
  views            INT DEFAULT 0,
  source_url       TEXT,
  source_headline  TEXT,
  faqs             JSONB DEFAULT '[]',
  published_at     TIMESTAMPTZ DEFAULT now(),
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- ── UNIQUE CONSTRAINT ─────────────────────────────────────────
-- Same slug can exist on different sites — unique per (site_name, slug)
CREATE UNIQUE INDEX IF NOT EXISTS posts_site_slug_idx ON posts(site_name, slug);

-- ── PERFORMANCE INDEXES ───────────────────────────────────────
CREATE INDEX IF NOT EXISTS posts_site_name_idx  ON posts(site_name);
CREATE INDEX IF NOT EXISTS posts_category_idx   ON posts(category);
CREATE INDEX IF NOT EXISTS posts_created_idx    ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS posts_published_idx  ON posts(published);
CREATE INDEX IF NOT EXISTS posts_source_url_idx ON posts(source_url);
CREATE INDEX IF NOT EXISTS posts_views_idx      ON posts(views DESC);

-- Full-text search
CREATE INDEX IF NOT EXISTS posts_fts_idx ON posts
  USING GIN (to_tsvector('english',
    coalesce(title, '') || ' ' || coalesce(excerpt, '')
  ));

-- ── ROW LEVEL SECURITY ────────────────────────────────────────
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public: can only read published posts
DROP POLICY IF EXISTS "Public read published" ON posts;
CREATE POLICY "Public read published" ON posts
  FOR SELECT USING (published = true);

-- Service role: full access (used by cron/admin operations)
DROP POLICY IF EXISTS "Service full access" ON posts;
CREATE POLICY "Service full access" ON posts
  FOR ALL USING (auth.role() = 'service_role');

-- ── UPDATED_AT TRIGGER ────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS posts_updated_at ON posts;
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ── VERIFICATION ─────────────────────────────────────────────
-- Run this after to confirm schema is correct:
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'posts'
-- ORDER BY ordinal_position;
