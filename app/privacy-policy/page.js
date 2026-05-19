import siteConfig from '../../config/site.config.js';

export const metadata = {
  title: `Privacy Policy — ${siteConfig.siteName}`,
};

export default function PrivacyPage() {
  return (
    <div className="static-page">
      <h1>Privacy Policy</h1>
      <p className="page-date">Last updated: January 1, 2025</p>

      <p>
        At IndiaGrowth (<strong>indiagrowth.in</strong>), we are committed to protecting your personal information and your right to privacy.
      </p>

      <h2>Information We Collect</h2>
      <p>We collect information you provide directly to us, such as when you contact us or subscribe to our newsletter. We also automatically collect certain information when you visit our website, including:</p>
      <ul>
        <li>Log data (IP address, browser type, pages visited, time spent)</li>
        <li>Device information (hardware model, operating system)</li>
        <li>Cookies and similar tracking technologies</li>
        <li>Analytics data via Google Analytics 4</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve our website</li>
        <li>Understand how visitors use our content</li>
        <li>Send newsletters and updates (if you've subscribed)</li>
        <li>Comply with legal obligations</li>
        <li>Serve relevant advertisements via Google AdSense</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. See our{' '}
        <a href="/cookie-policy" style={{ color: 'var(--red)' }}>Cookie Policy</a> for details.
      </p>

      <h2>Third-Party Services</h2>
      <p>We use the following third-party services that may collect data:</p>
      <ul>
        <li><strong>Google Analytics 4</strong> — website analytics</li>
        <li><strong>Google AdSense</strong> — advertising</li>
        <li><strong>Supabase</strong> — database hosting</li>
        <li><strong>Vercel</strong> — website hosting</li>
      </ul>

      <h2>Data Retention</h2>
      <p>We retain personal data only for as long as necessary to fulfil the purposes outlined in this policy, unless a longer retention period is required by law.</p>

      <h2>Your Rights</h2>
      <p>Depending on your location, you may have the right to access, correct, or delete your personal data. Contact us at <a href="mailto:privacy@indiagrowth.in" style={{ color: 'var(--red)' }}>privacy@indiagrowth.in</a> to exercise these rights.</p>

      <h2>Children's Privacy</h2>
      <p>Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>

      <h2>Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated date.</p>

      <h2>Contact Us</h2>
      <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@indiagrowth.in" style={{ color: 'var(--red)' }}>privacy@indiagrowth.in</a>.</p>
    </div>
  );
}
