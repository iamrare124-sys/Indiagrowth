import siteConfig from '../../config/site.config.js';

export const metadata = {
  title: `Terms of Use — ${siteConfig.siteName}`,
};

export default function TermsPage() {
  return (
    <div className="static-page">
      <h1>Terms of Use</h1>
      <p className="page-date">Last updated: January 1, 2025</p>

      <p>
        By accessing and using <strong>indiagrowth.in</strong>, you accept and agree to be bound by these Terms of Use. If you do not agree, please do not use this website.
      </p>

      <h2>Use of Content</h2>
      <p>
        All content published on IndiaGrowth — including articles, analysis, images, and data — is the intellectual property of IndiaGrowth or its content providers and is protected by applicable copyright laws.
      </p>
      <p>You may:</p>
      <ul>
        <li>Read and share links to our articles</li>
        <li>Quote brief excerpts (under 100 words) with attribution and a link back</li>
        <li>Share our content on social media with proper credit</li>
      </ul>
      <p>You may not:</p>
      <ul>
        <li>Republish our articles in full without written permission</li>
        <li>Scrape or systematically copy our content</li>
        <li>Use our content for commercial purposes without authorisation</li>
      </ul>

      <h2>Accuracy of Information</h2>
      <p>
        IndiaGrowth strives for accuracy but does not warrant that all information is complete, accurate, or current. Content is provided for informational purposes only and should not be construed as financial, legal, or investment advice.
      </p>

      <h2>User Conduct</h2>
      <p>When using this website, you agree not to:</p>
      <ul>
        <li>Violate any applicable laws or regulations</li>
        <li>Attempt to gain unauthorised access to our systems</li>
        <li>Transmit any malicious code or harmful content</li>
        <li>Impersonate any person or entity</li>
      </ul>

      <h2>Third-Party Links</h2>
      <p>Our website may contain links to third-party websites. We are not responsible for the content, privacy practices, or terms of those sites.</p>

      <h2>Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, IndiaGrowth shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this website or reliance on its content.
      </p>

      <h2>Governing Law</h2>
      <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.</p>

      <h2>Changes to Terms</h2>
      <p>We reserve the right to modify these Terms at any time. Continued use of the website after changes constitutes acceptance of the revised Terms.</p>

      <h2>Contact</h2>
      <p>Questions about these Terms? Email us at <a href="mailto:legal@indiagrowth.in" style={{ color: 'var(--red)' }}>legal@indiagrowth.in</a>.</p>
    </div>
  );
}
