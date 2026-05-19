import siteConfig from '../../config/site.config.js';

export const metadata = {
  title: `Cookie Policy — ${siteConfig.siteName}`,
};

export default function CookiePolicyPage() {
  return (
    <div className="static-page">
      <h1>Cookie Policy</h1>
      <p className="page-date">Last updated: January 1, 2025</p>

      <p>
        This Cookie Policy explains how <strong>indiagrowth.in</strong> uses cookies and similar technologies when you visit our website.
      </p>

      <h2>What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, improve performance, and provide analytics about how visitors use the site.
      </p>

      <h2>Types of Cookies We Use</h2>

      <h2>Essential Cookies</h2>
      <p>These are necessary for the website to function and cannot be switched off. They include:</p>
      <ul>
        <li>Session management cookies</li>
        <li>Security cookies</li>
        <li>Cookie consent preferences (ig_cookies)</li>
      </ul>

      <h2>Analytics Cookies</h2>
      <p>We use Google Analytics 4 to understand how visitors interact with our website. These cookies collect information anonymously, including:</p>
      <ul>
        <li>Pages visited and time spent</li>
        <li>Traffic sources and referrers</li>
        <li>Device and browser type</li>
        <li>Geographic location (country/city level)</li>
      </ul>

      <h2>Advertising Cookies</h2>
      <p>
        We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalised advertising by visiting{' '}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>
          Google Ads Settings
        </a>.
      </p>

      <h2>Third-Party Cookies</h2>
      <p>Some of our pages may contain embedded content from third-party services (such as YouTube or Twitter). These services may set their own cookies. We have no control over third-party cookies.</p>

      <h2>Managing Cookies</h2>
      <p>You can control cookies through:</p>
      <ul>
        <li><strong>Browser settings</strong> — most browsers allow you to refuse cookies or delete existing ones</li>
        <li><strong>Our cookie banner</strong> — decline non-essential cookies when you first visit</li>
        <li><strong>Google Analytics Opt-out</strong> — install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>browser add-on</a></li>
      </ul>
      <p>Note: disabling cookies may affect the functionality of parts of our website.</p>

      <h2>Changes to This Policy</h2>
      <p>We may update this Cookie Policy from time to time. Check this page periodically for updates.</p>

      <h2>Contact</h2>
      <p>Questions? Email <a href="mailto:privacy@indiagrowth.in" style={{ color: 'var(--red)' }}>privacy@indiagrowth.in</a>.</p>
    </div>
  );
}
