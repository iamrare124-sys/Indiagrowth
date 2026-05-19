'use client';

import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <div className="container">
      <div className="not-found">
        <div className="not-found-num" style={{ fontSize: 80 }}>
          ⚠️
        </div>
        <h2>Something Went Wrong</h2>
        <p>
          {error?.message || 'An unexpected error occurred. Our team has been notified.'}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-red"
            onClick={reset}
          >
            ↺ Try Again
          </button>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', border: '2px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600, color: 'var(--mid)' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
