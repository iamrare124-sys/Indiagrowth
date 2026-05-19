import Link from 'next/link';

export const metadata = {
  title: '404 — Page Not Found | IndiaGrowth',
};

export default function NotFound() {
  return (
    <div className="container">
      <div className="not-found">
        <div className="not-found-num">
          4<span>0</span>4
        </div>
        <h2>Page Not Found</h2>
        <p>
          The article or page you are looking for has been moved, deleted, or never existed.
          Don't worry — there's plenty more startup news to read.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-red">
            ← Back to Home
          </Link>
          <Link href="/search" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', border: '2px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600, color: 'var(--mid)', transition: 'all 0.2s' }}>
            🔍 Search Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
