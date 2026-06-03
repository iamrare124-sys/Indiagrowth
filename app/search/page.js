'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false });

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="search-wrap">
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 24 }}>
        Search Articles
      </h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="search"
          className="search-input"
          placeholder="Search startup news, funding rounds, founders..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search query"
          autoFocus
        />
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <div className="spinner" />
        </div>
      )}

      {searched && !loading && (
        <>
          <p className="search-results-count">
            {results.length > 0
              ? `Found ${results.length} result${results.length > 1 ? 's' : ''} for "${query}"`
              : `No results found for "${query}"`}
          </p>

          {results.length === 0 && (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <div className="empty-icon">🔍</div>
              <p className="empty-desc">Try different keywords or browse categories below.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {['Funding News', 'Startup Stories', 'Product Launches', 'Founder Tips'].map((cat) => (
                  <Link key={cat} href={`/category/${cat.toLowerCase().replace(/ /g, '-')}`} className="tag-pill">
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {results.map((post) => (
              <article key={post.slug} className="list-card" style={{ padding: '20px 0' }}>
                {post.cover_image && (
                  <Link href={`/${post.slug}`} className="list-card-img" style={{ width: 120, height: 80 }}>
                    <img src={post.cover_image} alt={post.cover_image_alt || post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </Link>
                )}
                <div className="list-card-body">
                  <div className="list-card-cat">{post.category}</div>
                  <Link href={`/${post.slug}`}>
                    <h2 className="list-card-title" style={{ fontSize: 17, marginBottom: 6 }}>{post.title}</h2>
                  </Link>
                  <p style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.5, marginBottom: 8 }}>
                    {post.excerpt?.substring(0, 120)}...
                  </p>
                  <div className="list-card-date">
                    {post.author_name} · {formatDate(post.created_at)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="container">
      <Suspense fallback={<div className="search-wrap"><div className="sk sk-card" /></div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
