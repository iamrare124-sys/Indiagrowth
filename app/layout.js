import './globals.css';
import Link from 'next/link';
import MobileMenu from '../components/MobileMenu';
import CookieBanner from '../components/CookieBanner';
import { getTickerData } from '../lib/live-data';
import siteConfig from '../config/site.config.js';

export const metadata = {
  title: {
    default: `${siteConfig.siteName} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.description,
  keywords: [siteConfig.primaryKeyword, ...siteConfig.secondaryKeywords],
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://indiagrowth.in'),
  openGraph: {
    type: 'website',
    siteName: siteConfig.siteName,
    title: `${siteConfig.siteName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@indiagrowth',
  },
  robots: { index: true, follow: true },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
};

const categories = siteConfig.categories || [];

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

const isValidGA = GA4_ID && !GA4_ID.includes('placeholder') && GA4_ID.startsWith('G-');
const isValidAds = ADSENSE_ID && !ADSENSE_ID.includes('placeholder') && ADSENSE_ID.startsWith('ca-pub-');

export default async function RootLayout({ children }) {
  let tickerItems = [];
  try {
    tickerItems = await getTickerData();
  } catch {}

  // Duplicate for seamless loop
  const ticker = [...tickerItems, ...tickerItems];

  return (
    <html lang="en">
      <head>
        {isValidGA && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA4_ID}');`,
              }}
            />
          </>
        )}
        {isValidAds && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>
        {/* Ticker */}
        {tickerItems.length > 0 && (
          <div className="ticker-wrap" aria-label="Live market data">
            <div className="ticker-label">📈 LIVE</div>
            <div className="ticker-track">
              {ticker.map((item, i) => (
                <span key={i} className="ticker-item">
                  <span className="sym">{item.symbol}</span>
                  <span className="val">{item.value}</span>
                  <span className={`chg ${item.direction === 'up' ? 'up' : 'down'}`}>
                    {item.direction === 'up' ? '▲' : '▼'} {item.change}
                  </span>
                  <span className="ticker-sep">|</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Header */}
        <header className="site-header">
          <div className="header-inner">
            <MobileMenu />
            <Link href="/" className="site-logo">
              India<span>Growth</span>
            </Link>
            <div className="header-actions">
              <Link href="/search" className="header-search-btn" aria-label="Search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <span>Search</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Category Nav */}
        <nav className="cat-nav" aria-label="Category navigation">
          <div className="cat-nav-inner">
            <Link href="/" className="cat-nav-link">
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="cat-nav-link"
              >
                {cat.label}
              </Link>
            ))}
            <Link href="/about" className="cat-nav-link">
              About
            </Link>
          </div>
        </nav>

        {/* Main content */}
        <main id="main-content">{children}</main>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-main">
            <div className="footer-brand-col">
              <div className="footer-logo">{siteConfig.siteName}</div>
              <p className="footer-tagline">{siteConfig.tagline}</p>
              <div className="footer-social">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">𝕏</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">in</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">◎</a>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Categories</div>
              <ul className="footer-links">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/category/${cat.slug}`}>{cat.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Company</div>
              <ul className="footer-links">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/search">Search</Link></li>
                <li><a href={`mailto:hello@${siteConfig.domain}`}>Contact</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Legal</div>
              <ul className="footer-links">
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Use</Link></li>
                <li><Link href="/disclaimer">Disclaimer</Link></li>
                <li><Link href="/cookie-policy">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {siteConfig.siteName}. All rights reserved.</span>
            <span>Made with ❤️ for Indian founders</span>
          </div>
        </footer>

        <CookieBanner />

        {/* Back to top */}
        <button className="back-top" id="backTop" aria-label="Back to top">↑</button>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              var btn = document.getElementById('backTop');
              window.addEventListener('scroll', function() {
                btn.classList.toggle('visible', window.scrollY > 400);
              });
              btn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
