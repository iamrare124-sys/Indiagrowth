import Link from 'next/link';
import { getPosts } from '../lib/supabase';
import siteConfig from '../config/site.config.js';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getCategoryLabel(slug) {
  const cat = siteConfig.categories.find((c) => c.slug === slug);
  return cat?.label || slug;
}

function PostImage({ post, className, sizes }) {
  if (!post.image_url) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #e8002d22 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#e8002d',
          fontSize: '32px',
        }}
      >
        📈
      </div>
    );
  }
  return (
    <img
      src={post.image_url}
      alt={post.title}
      className={className}
      loading="lazy"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}

export default async function HomePage() {
  let posts = [];
  let fetchError = false;

  try {
    posts = await getPosts({ limit: 30 });
  } catch {
    fetchError = true;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indiagrowth.in';

  // No posts state
  if (!posts || posts.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">🚀</div>
          <h1 className="empty-title">India's Startup News Hub</h1>
          <p className="empty-desc">
            {fetchError
              ? 'Could not connect to the database. Please check your Supabase configuration.'
              : `${siteConfig.tagline} — First article will be published soon.`}
          </p>
          <div className="cron-info">
            <p>Trigger the cron manually to generate the first post:</p>
            <code className="cron-url">
              {siteUrl}/api/cron?secret=YOUR_CRON_SECRET
            </code>
          </div>
        </div>
      </div>
    );
  }

  const heroPost = posts[0];
  const featuredPosts = posts.slice(1, 5);
  const latestPosts = posts.slice(5, 11);
  const fundingPosts = posts.filter((p) => p.category === 'funding-news').slice(0, 4);
  const founderPosts = posts.filter((p) => p.category === 'founder-tips').slice(0, 4);
  const popularPosts = posts.slice(0, 5);

  return (
    <>
      <div className="container">
        {/* Hero */}
        <section className="hero-section">
          <Link href={`/${heroPost.slug}`}>
            <article className="hero-card">
              <div className="hero-img">
                <PostImage post={heroPost} />
              </div>
              <div className="hero-content">
                <div className="hero-category">
                  {getCategoryLabel(heroPost.category)}
                </div>
                <h1 className="hero-title">{heroPost.title}</h1>
                <p className="hero-excerpt">{heroPost.excerpt}</p>
                <div className="hero-meta">
                  <span className="hero-author">{heroPost.author}</span>
                  <span>·</span>
                  <span>{formatDate(heroPost.created_at)}</span>
                </div>
              </div>
            </article>
          </Link>
        </section>

        <div className="page-grid">
          {/* Main content */}
          <div>
            {/* Latest News */}
            {featuredPosts.length > 0 && (
              <section style={{ marginBottom: '48px' }}>
                <div className="section-header">
                  <h2 className="section-title">Latest News</h2>
                  <Link href="/category/funding-news" className="section-more">
                    View All →
                  </Link>
                </div>
                <div className="posts-grid">
                  {featuredPosts.map((post) => (
                    <article key={post.slug} className="article-card">
                      <Link href={`/${post.slug}`}>
                        <div className="card-img">
                          <PostImage post={post} />
                        </div>
                      </Link>
                      <div className="card-body">
                        <div className="card-category">
                          {getCategoryLabel(post.category)}
                        </div>
                        <Link href={`/${post.slug}`}>
                          <h3 className="card-title">{post.title}</h3>
                        </Link>
                        <p className="card-excerpt">{post.excerpt}</p>
                        <div className="card-meta">
                          <span className="card-author">{post.author}</span>
                          <span className="card-dot">·</span>
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Funding News */}
            {fundingPosts.length > 0 && (
              <section style={{ marginBottom: '48px' }}>
                <div className="section-header">
                  <h2 className="section-title">Funding Roundup</h2>
                  <Link href="/category/funding-news" className="section-more">
                    More →
                  </Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {fundingPosts.map((post) => (
                    <article key={post.slug} className="list-card">
                      <Link href={`/${post.slug}`} className="list-card-img">
                        <PostImage post={post} />
                      </Link>
                      <div className="list-card-body">
                        <div className="list-card-cat">Funding</div>
                        <Link href={`/${post.slug}`}>
                          <h3 className="list-card-title">{post.title}</h3>
                        </Link>
                        <div className="list-card-date">
                          {formatDate(post.created_at)}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* More Latest */}
            {latestPosts.length > 0 && (
              <section style={{ marginBottom: '48px' }}>
                <div className="section-header">
                  <h2 className="section-title">More Stories</h2>
                </div>
                <div className="posts-grid-3">
                  {latestPosts.map((post) => (
                    <article key={post.slug} className="article-card">
                      <Link href={`/${post.slug}`}>
                        <div className="card-img">
                          <PostImage post={post} />
                        </div>
                      </Link>
                      <div className="card-body">
                        <div className="card-category">
                          {getCategoryLabel(post.category)}
                        </div>
                        <Link href={`/${post.slug}`}>
                          <h3 className="card-title">{post.title}</h3>
                        </Link>
                        <div className="card-meta">
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Founder Tips */}
            {founderPosts.length > 0 && (
              <section style={{ marginBottom: '48px' }}>
                <div className="section-header">
                  <h2 className="section-title">Founder Playbook</h2>
                  <Link href="/category/founder-tips" className="section-more">
                    More →
                  </Link>
                </div>
                <div className="posts-grid">
                  {founderPosts.slice(0, 2).map((post) => (
                    <article key={post.slug} className="article-card">
                      <Link href={`/${post.slug}`}>
                        <div className="card-img">
                          <PostImage post={post} />
                        </div>
                      </Link>
                      <div className="card-body">
                        <div className="card-category">Founder Tips</div>
                        <Link href={`/${post.slug}`}>
                          <h3 className="card-title">{post.title}</h3>
                        </Link>
                        <p className="card-excerpt">{post.excerpt}</p>
                        <div className="card-meta">
                          <span className="card-author">{post.author}</span>
                          <span className="card-dot">·</span>
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-widget">
              <div className="widget-title">Trending</div>
              <ol className="popular-list">
                {popularPosts.map((post, i) => (
                  <li key={post.slug} className="popular-item">
                    <span className="popular-num">0{i + 1}</span>
                    <Link href={`/${post.slug}`} className="popular-title">
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            <div className="sidebar-widget">
              <div className="widget-title">Categories</div>
              <div className="tag-cloud">
                {siteConfig.categories.map((cat) => (
                  <Link key={cat.slug} href={`/category/${cat.slug}`} className="tag-pill">
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="sidebar-widget">
              <div className="widget-title">About</div>
              <div className="about-author-card" style={{ padding: 0, border: 'none', background: 'none' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div className="author-avatar" style={{ width: 48, height: 48, fontSize: 18 }}>
                    {siteConfig.author.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{siteConfig.author.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 6 }}>{siteConfig.author.title}</div>
                    <p style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.5 }}>
                      {siteConfig.author.bio.substring(0, 120)}...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="ad-slot">Advertisement</div>
          </aside>
        </div>
      </div>
    </>
  );
}
