import siteConfig from '../../config/site.config.js';

export const metadata = {
  title: `Terms of Use — ${siteConfig.siteName}`,
};

export default function TermsPage() {
  const email = `legal@${siteConfig.domain}`;
  return (
    <div className="static-page">
      <h1>Terms of Use</h1>
      <p className="page-date">Last updated: January 1, 2025</p>
      <p>By accessing and using <strong>{siteConfig.domain}</strong>, you accept and agree to be bound by these Terms of Use.</p>
      <h2>Use of Content</h2>
      <p>All content published on {siteConfig.siteName} is the intellectual property of {siteConfig.siteName} or its content providers and is protected by applicable copyright laws.</p>
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
      <p>{siteConfig.siteName} strives for accuracy but does not warrant that all information is complete, accurate, or current. Content is provided for informational purposes only and should not be construed as financial, legal, or investment advice.</p>
      <h2>Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, {siteConfig.siteName} shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this website.</p>
      <h2>Governing Law</h2>
      <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.</p>
      <h2>Contact</h2>
      <p>Questions? Email us at <a href={`mailto:${email}`} style={{ color: 'var(--red)' }}>{email}</a>.</p>
    </div>
  );
}
