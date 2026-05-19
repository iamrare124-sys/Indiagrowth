# IndiaGrowth — India Startup Funding & Entrepreneur News

A production-ready Next.js 14 blog site that auto-publishes AI-written startup news daily using Groq AI, Supabase, and Vercel.

---

## 🚀 Quick Start (5 Steps)

### 1. Clone & Install
```bash
cd indiagrowth
npm install
```

### 2. Set Up Supabase
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the contents of `supabase-schema.sql` → Run
3. Copy your Project URL, Anon Key, and Service Role Key

### 3. Configure Environment Variables
```bash
cp .env.example .env.local
```
Fill in your `.env.local`:
```
NICHE=indiagrowth
GROQ_API_KEY=gsk_...
PEXELS_API_KEY=...
UNSPLASH_ACCESS_KEY=...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CRON_SECRET=your-random-secret-string
NEXT_PUBLIC_SITE_URL=https://indiagrowth.in
MAX_POSTS_PER_SITE=30
```

### 4. Run Locally
```bash
npm run dev
# Open http://localhost:3000
```

### 5. Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
# Add all env vars in Vercel dashboard → Settings → Environment Variables
```

---

## 📰 Publishing Your First Post

After deployment, trigger the cron manually:
```
https://your-domain.vercel.app/api/cron?secret=YOUR_CRON_SECRET
```

The response will be:
```json
{
  "success": true,
  "published": 1,
  "posts": [{ "slug": "...", "title": "..." }]
}
```

---

## ⚙️ How It Works

```
Daily Cron (3PM IST)
    ↓
Fetch RSS from Google News (3 feeds) + Reddit
    ↓
Score & select best story (keyword match + recency)
    ↓
Generate 800-1200 word post via Groq llama-3.3-70b
    ↓
Humanize pass (second Groq call)
    ↓
Fetch image from Pexels/Unsplash
    ↓
Save to Supabase
    ↓
Ping IndexNow for Google/Bing indexing
```

---

## 📁 Project Structure

```
/app
  layout.js          — Header, ticker, nav, footer, cookie banner
  page.js            — Homepage (hero + grid + sidebar)
  globals.css        — All styles (YourStory-inspired)
  not-found.js       — Custom 404
  error.js           — Error boundary
  robots.js          — SEO robots.txt
  sitemap.js         — Auto-generated sitemap
  /[slug]/page.js    — Article page with schemas
  /category/[cat]/   — Category listing
  /search/page.js    — Client-side search
  /about/            — About page
  /privacy-policy/   — Privacy policy
  /terms/            — Terms of use
  /disclaimer/       — Disclaimer
  /cookie-policy/    — Cookie policy
  /api/cron/         — Content generation endpoint
  /api/search/       — Search API
  /api/indexnow/     — IndexNow ping
  /api/fix-excerpts/ — Utility: fix missing excerpts
/components
  MobileMenu.js      — Mobile hamburger menu
  CookieBanner.js    — GDPR cookie consent
/config
  site.config.js     — Config loader
  /niches/indiagrowth.config.js — All site settings
/lib
  supabase.js        — DB helpers (lazy init)
  rss-fetcher.js     — Multi-source RSS + Reddit
  blog-generator.js  — Groq AI generation
  image-fetcher.js   — Pexels/Unsplash
  live-data.js       — Ticker data
  security.js        — Cron auth
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ | Groq API key (free at console.groq.com) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key |
| `CRON_SECRET` | ✅ | Random string to protect cron endpoint |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Your domain (no trailing slash) |
| `PEXELS_API_KEY` | Recommended | For article images |
| `UNSPLASH_ACCESS_KEY` | Recommended | Fallback images |
| `NEXT_PUBLIC_GA4_ID` | Optional | Google Analytics (G-XXXXXXXX) |
| `NEXT_PUBLIC_ADSENSE_ID` | Optional | AdSense (ca-pub-XXXXXXXX) |
| `INDEX_NOW_KEY` | Optional | IndexNow key for fast indexing |
| `MAX_POSTS_PER_SITE` | Optional | Max posts (default: 30) |

---

## 🕐 Cron Schedule

The cron runs daily at **3:00 PM IST** (9:30 AM UTC).

Configured in `vercel.json`:
```json
{ "crons": [{ "path": "/api/cron", "schedule": "30 9 * * *" }] }
```

> Note: Vercel crons require a **Pro plan** ($20/mo). Alternative: use cron-job.org (free) to call the URL daily.

---

## 🎨 Design

The UI is inspired by YourStory's clean editorial design:
- **Font**: Playfair Display (headings) + Source Sans 3 (body)
- **Color**: Red `#e8002d` accent on white/black
- **Layout**: Sticky header + category nav + hero + grid + sidebar
- **Mobile**: Hamburger menu, responsive grid, touch-optimized
- **Features**: Reading progress bar, copy link, cookie consent, back-to-top

---

## 🛡️ Security

- All API keys in environment variables only
- Supabase lazy initialization (no module-level clients)
- Cron endpoint protected by secret (Authorization header, query param, or x-cron-secret)
- Security headers: X-Frame-Options DENY, HSTS, XSS-Protection, nosniff
- RLS enabled on Supabase posts table

---

## 📊 SEO Features

- NewsArticle schema on every article
- BreadcrumbList schema
- FAQPage schema (when FAQs exist)
- Full OpenGraph + Twitter Card meta
- Auto sitemap at /sitemap.xml
- robots.txt at /robots.txt
- IndexNow ping after each post
- Canonical URLs

---

## 🐛 Troubleshooting

**Build fails with DB error**: Normal — Supabase isn't connected at build time. The site shows an empty state with cron instructions.

**Cron returns `No recent stories found`**: RSS feeds have no news in the last 48 hours for your keywords. Try adjusting `rssSources` in the niche config.

**Images not loading**: Check your Pexels/Unsplash API keys. Falls back to Picsum if both fail.

**Duplicate posts**: The slug deduplication uses the post title. If the same story appears twice, adjust `selectBestStory()` in `rss-fetcher.js`.

---

## 📄 License

MIT — use freely, attribution appreciated.
