import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPosts } from '../../../lib/supabase';
import siteConfig from '../../../config/site.config.js';

export async function generateMetadata({ params }) {
  const cat = siteConfig.categories.find((c) => c.slug === params.category);
  if (!cat) return { title: 'Not Found' };
  return {
    title: `${cat.label} — ${siteConfig.siteName}`,
    description: `Latest ${cat.label} news and analysis on ${siteConfig.siteName}`,
  };
}

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function CategoryPage({ params }) {
  const cat = siteConfig.categories.find((c) => c.slug === params.category);
  if (!cat) notFound();

  let posts = [];
  try {
    posts = await getPosts({ category: params.category, limit: 24 });
  } catch {}

  return (
    <div className="container">
      <div className="category-header">
        <div className="category-label">
          <span>■</span> Category
        </div>
        <h1 className="category-name">{cat.label}</h1>
        <p className="category-count">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2 className="empty-title">No articles yet</h2>
          <p className="empty-desc">Check back soon — new content is published daily.</p>
        </div>
      ) : (
        <div className="posts-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {posts.map((post) => (
            <article key={post.slug} className="article-card">
              <Link href={`/${post.slug}`}>
                <div className="card-img">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-soft)' }} />
                  )}
                </div>
              </Link>
              <div className="card-body">
                <div className="card-category">{cat.label}</div>
                <Link href={`/${post.slug}`}>
                  <h2 className="card-title">{post.title}</h2>
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
      )}
    </div>
  );
}
