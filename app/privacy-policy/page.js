import siteConfig from '../../config/site.config.js';

export const metadata = {
  title: `Privacy Policy — ${siteConfig.siteName}`,
};

export default function PrivacyPage() {
  const email = `privacy@${siteConfig.domain}`;
  return (
    <div className="static-page">
      <h1>Privacy Policy</h1>
      <p className="page-date">Last updated: January 1, 2025</p>
      <p>At <strong>{siteConfig.siteName}</strong> ({siteConfig.domain}), we are committed to protecting your personal information and your right to privacy.</p>
      <h2>Information We Collect</h2>
      <p>We collect information you provide directly to us, and automatically collect certain information when you visit, including:</p>
      <ul>
        <li>Log data (IP address, browser type, pages visited, time spent)</li>
        <li>Device information (hardware model, operating system)</li>
        <li>Cookies and similar tracking technologies</li>
        <li>Analytics data via Google Analytics 4</li>
      </ul>
      <h2>How We Use Your Information</h2>
      <ul>
        <li>Provide, maintain, and improve our website</li>
        <li>Understand how visitors use our content</li>
        <li>Send newsletters and updates (if subscribed)</li>
        <li>Comply with legal obligations</li>
        <li>Serve relevant advertisements via Google AdSense</li>
      </ul>
      <h2>Cookies</h2>
      <p>We use cookies and similar tracking technologies. See our <a href="/cookie-policy" style={{ color: 'var(--red)' }}>Cookie Policy</a> for details.</p>
      <h2>Third-Party Services</h2>
      <ul>
        <li><strong>Google Analytics 4</strong> — website analytics</li>
        <li><strong>Google AdSense</strong> — advertising</li>
        <li><strong>Supabase</strong> — database hosting</li>
        <li><strong>Vercel</strong> — website hosting</li>
      </ul>
      <h2>Your Rights</h2>
      <p>Contact us at <a href={`mailto:${email}`} style={{ color: 'var(--red)' }}>{email}</a> to exercise your data rights.</p>
      <h2>Children's Privacy</h2>
      <p>Our website is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
      <h2>Contact Us</h2>
      <p>Questions? Contact us at <a href={`mailto:${email}`} style={{ color: 'var(--red)' }}>{email}</a>.</p>
    </div>
  );
}
