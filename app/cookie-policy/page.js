import siteConfig from '../../config/site.config.js';

export const metadata = {
  title: `Cookie Policy — ${siteConfig.siteName}`,
};

export default function CookiePolicyPage() {
  const email = `privacy@${siteConfig.domain}`;
  return (
    <div className="static-page">
      <h1>Cookie Policy</h1>
      <p className="page-date">Last updated: January 1, 2025</p>
      <p>This Cookie Policy explains how <strong>{siteConfig.domain}</strong> uses cookies and similar technologies when you visit our website.</p>
      <h2>What Are Cookies?</h2>
      <p>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and provide analytics.</p>
      <h2>Essential Cookies</h2>
      <ul>
        <li>Session management cookies</li>
        <li>Security cookies</li>
        <li>Cookie consent preferences</li>
      </ul>
      <h2>Analytics Cookies</h2>
      <p>We use Google Analytics 4 to understand how visitors interact with our website, collecting data anonymously about pages visited, traffic sources, and device types.</p>
      <h2>Advertising Cookies</h2>
      <p>We use Google AdSense to display advertisements. You can opt out at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>Google Ads Settings</a>.</p>
      <h2>Managing Cookies</h2>
      <ul>
        <li><strong>Browser settings</strong> — refuse or delete cookies</li>
        <li><strong>Our cookie banner</strong> — decline non-essential cookies on first visit</li>
        <li><strong>Google Analytics Opt-out</strong> — install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>browser add-on</a></li>
      </ul>
      <h2>Contact</h2>
      <p>Questions? Email <a href={`mailto:${email}`} style={{ color: 'var(--red)' }}>{email}</a>.</p>
    </div>
  );
}
