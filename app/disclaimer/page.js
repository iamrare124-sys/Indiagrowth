import siteConfig from '../../config/site.config.js';

export const metadata = {
  title: `Disclaimer — ${siteConfig.siteName}`,
};

export default function DisclaimerPage() {
  const email = `hello@${siteConfig.domain}`;
  const corrections = `corrections@${siteConfig.domain}`;
  return (
    <div className="static-page">
      <h1>Disclaimer</h1>
      <p className="page-date">Last updated: January 1, 2025</p>
      <p>The information provided on <strong>{siteConfig.domain}</strong> is for general informational and educational purposes only.</p>
      <h2>Not Financial Advice</h2>
      <p>Nothing on this website constitutes financial, investment, legal, or any other professional advice. {siteConfig.siteName} covers startup funding news and ecosystem analysis — this is journalism, not investment counsel.</p>
      <h2>No Endorsement</h2>
      <p>Mention of any company, product, or individual on {siteConfig.siteName} does not constitute an endorsement.</p>
      <h2>Errors and Omissions</h2>
      <p>While we strive for accuracy, news moves fast. If you spot an error, please email <a href={`mailto:${corrections}`} style={{ color: 'var(--red)' }}>{corrections}</a> and we will review and correct promptly.</p>
      <h2>Affiliate and Sponsored Content</h2>
      <p>{siteConfig.siteName} may participate in affiliate marketing programs. Any sponsored content or affiliate links will be clearly disclosed.</p>
      <h2>Contact</h2>
      <p>For queries, contact us at <a href={`mailto:${email}`} style={{ color: 'var(--red)' }}>{email}</a>.</p>
    </div>
  );
}
