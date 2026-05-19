'use client';

import { useState } from 'react';
import Link from 'next/link';

const categories = [
  { slug: 'funding-news', label: 'Funding News' },
  { slug: 'startup-stories', label: 'Startup Stories' },
  { slug: 'product-launches', label: 'Product Launches' },
  { slug: 'founder-tips', label: 'Founder Tips' },
];

const pages = [
  { href: '/about', label: 'About Us' },
  { href: '/search', label: 'Search' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="hamburger"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={() => setOpen(false)}
          />
          <nav className="mobile-menu">
            <div className="mobile-menu-header">
              <Link
                href="/"
                className="mobile-menu-logo"
                onClick={() => setOpen(false)}
              >
                IndiaGrowth
              </Link>
              <button
                className="mobile-menu-close"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="mobile-nav-section">
              <div className="mobile-nav-title">Categories</div>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="mobile-nav-link"
                  onClick={() => setOpen(false)}
                >
                  {cat.label}
                  <span>›</span>
                </Link>
              ))}
            </div>

            <div className="mobile-nav-section">
              <div className="mobile-nav-title">More</div>
              {pages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="mobile-nav-link"
                  onClick={() => setOpen(false)}
                >
                  {page.label}
                  <span>›</span>
                </Link>
              ))}
            </div>

            <div className="mobile-social">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                𝕏
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                in
              </a>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
