import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getRelatedPosts } from '../../lib/supabase';
import siteConfig from '../../config/site.config.js';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Not Found' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indiagrowth.in';

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.tags?.join(', '),
    authors: [{ name: post.author || siteConfig.author.name }],
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author || siteConfig.author.name],
      section: post.category,
      tags: post.tags,
      images: post.image_url ? [{ url: post.image_url, width: 1200, height: 630 }] : [],
      url: `${siteUrl}/${post.slug}`,
      siteName: siteConfig.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.image_url ? [post.image_url] : [],
    },
    alternates: { canonical: `${siteUrl}/${post.slug}` },
  };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getCategoryLabel(slug) {
  const cat = siteConfig.categories.find((c) => c.slug === slug);
  return cat?.label || slug;
}

function readingTime(text) {
  if (!text) return 3;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function ArticleContent({ content, rawContent }) {
  // Strategy 1: object with sections
  if (content && typeof content === 'object' && content.sections?.length > 0) {
    return (
      <div className="article-content">
        {content.hook && (
          <div className="article-hook">{content.hook}</div>
        )}
        {content.sections.map((section, i) => (
          <div key={i} className="article-section">
            {section.heading && <h2>{section.heading}</h2>}
            {section.body &&
              section.body.split('\n').filter(Boolean).map((para, j) => (
                <p key={j}>{para}</p>
              ))}
          </div>
        ))}
      </div>
    );
  }

  // Strategy 2: rawContent string
  const raw = content?.rawContent || rawContent;
  if (raw && typeof raw === 'string' && raw.length > 50) {
    return (
      <div className="article-content">
        {raw.split(/\n\n+/).filter(Boolean).map((para, i) => {
          if (para.startsWith('## ') || para.startsWith('# ')) {
            return <h2 key={i} className="article-section">{para.replace(/^#+\s+/, '')}</h2>;
          }
          return <p key={i} style={{ marginBottom: 18 }}>{para.trim()}</p>;
        })}
      </div>
    );
  }

  // Strategy 3: plain text
  return (
    <div className="article-content">
      <p>Content unavailable. Please check back later.</p>
    </div>
  );
}

export default async function ArticlePage({ params }) {
  let post;
  try {
    post = await getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  // Parse content
  let content = post.content;
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch {}
  }

  const related = await getRelatedPosts(post.slug, post.category, 3).catch(() => []);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indiagrowth.in';
  const articleText = content?.rawContent || content?.sections?.map((s) => s.body).join(' ') || '';
  const readMins = readingTime(articleText);

  // JSON-LD schemas
  const newsArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    image: post.image_url ? [post.image_url] : [],
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Person',
      name: post.author || siteConfig.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.siteName,
      url: siteUrl,
    },
    url: `${siteUrl}/${post.slug}`,
    mainEntityOfPage: `${siteUrl}/${post.slug}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: getCategoryLabel(post.category),
        item: `${siteUrl}/category/${post.category}`,
      },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${siteUrl}/${post.slug}` },
    ],
  };

  const faqs = post.faqs || [];
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Reading progress bar */}
      <div className="reading-progress" id="readingProgress" style={{ width: '0%' }} />

      <div className="container">
        <div className="article-layout">
          {/* Article main */}
          <article>
            {/* Breadcrumb */}
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span className="breadcrumb-sep">›</span>
              <Link href={`/category/${post.category}`}>
                {getCategoryLabel(post.category)}
              </Link>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-current">
                {post.title.substring(0, 40)}...
              </span>
            </nav>

            <div className="article-header">
              <div className="article-category-badge">
                {getCategoryLabel(post.category)}
              </div>
              <h1 className="article-title">{post.title}</h1>

              <div className="article-meta">
                <div className="article-author">
                  <div className="author-avatar">
                    {(post.author || siteConfig.author.name).charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {post.author || siteConfig.author.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray)' }}>
                      {siteConfig.author.title}
                    </div>
                  </div>
                </div>
                <span style={{ color: 'var(--border)' }}>·</span>
                <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                <span style={{ color: 'var(--border)' }}>·</span>
                <span>{readMins} min read</span>

                <div className="article-share">
                  <button
                    className="share-btn"
                    id="copyLinkBtn"
                    aria-label="Copy link"
                  >
                    🔗 Copy Link
                  </button>
                </div>
              </div>
            </div>

            {/* Hero image */}
            {post.image_url && (
              <div className="article-hero-img">
                <img src={post.image_url} alt={post.title} />
                {post.image_credit && (
                  <p className="img-credit">Photo: {post.image_credit}</p>
                )}
              </div>
            )}

            {/* Content */}
            <ArticleContent content={content} rawContent={post.rawContent} />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div style={{ margin: '32px 0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray)', marginBottom: 10 }}>
                  Tagged:
                </div>
                <div className="tag-cloud">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {faqs.length > 0 && (
              <div className="faq-section">
                <div className="faq-title">
                  ❓ Frequently Asked Questions
                </div>
                {faqs.map((faq, i) => (
                  <div key={i} className="faq-item">
                    <div className="faq-q">{faq.question}</div>
                    <div className="faq-a">{faq.answer}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Author box */}
            <div className="about-author-card" style={{ margin: '32px 0' }}>
              <div className="author-big-avatar">
                {siteConfig.author.name.charAt(0)}
              </div>
              <div className="author-info">
                <h3>{siteConfig.author.name}</h3>
                <div className="author-title">{siteConfig.author.title}</div>
                <p>{siteConfig.author.bio}</p>
              </div>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <div className="related-section">
                <div className="section-header">
                  <h2 className="section-title">Related Stories</h2>
                </div>
                <div className="related-posts">
                  {related.map((rp) => (
                    <article key={rp.slug} className="article-card">
                      <Link href={`/${rp.slug}`}>
                        <div className="card-img">
                          {rp.image_url ? (
                            <img src={rp.image_url} alt={rp.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', background: 'var(--bg-soft)', position: 'absolute', top: 0, left: 0 }} />
                          )}
                        </div>
                      </Link>
                      <div className="card-body">
                        <div className="card-category">{getCategoryLabel(rp.category)}</div>
                        <Link href={`/${rp.slug}`}>
                          <h3 className="card-title">{rp.title}</h3>
                        </Link>
                        <div className="card-meta">
                          <span>{formatDate(rp.created_at)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="sidebar">
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

            <div className="ad-slot">Advertisement</div>

            <div className="sidebar-widget">
              <div className="widget-title">About Author</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="author-avatar" style={{ width: 56, height: 56, fontSize: 22 }}>
                  {siteConfig.author.name.charAt(0)}
                </div>
                <div style={{ fontWeight: 700 }}>{siteConfig.author.name}</div>
                <div style={{ fontSize: 12, color: 'var(--red)' }}>{siteConfig.author.title}</div>
                <p style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.6 }}>
                  {siteConfig.author.bio.substring(0, 160)}...
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Reading progress
            var bar = document.getElementById('readingProgress');
            if (bar) {
              window.addEventListener('scroll', function() {
                var h = document.documentElement;
                var progress = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
                bar.style.width = Math.min(100, progress) + '%';
              });
            }
            // Copy link
            var copyBtn = document.getElementById('copyLinkBtn');
            if (copyBtn) {
              copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(window.location.href).then(function() {
                  copyBtn.textContent = '✓ Copied!';
                  setTimeout(function() { copyBtn.textContent = '🔗 Copy Link'; }, 2000);
                });
              });
            }
          `,
        }}
      />
    </>
  );
}
