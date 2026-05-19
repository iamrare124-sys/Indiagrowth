import siteConfig from '../../config/site.config.js';

export const metadata = {
  title: `Disclaimer — ${siteConfig.siteName}`,
};

export default function DisclaimerPage() {
  return (
    <div className="static-page">
      <h1>Disclaimer</h1>
      <p className="page-date">Last updated: January 1, 2025</p>

      <p>
        The information provided on <strong>indiagrowth.in</strong> is for general informational and educational purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information.
      </p>

      <h2>Not Financial Advice</h2>
      <p>
        Nothing on this website constitutes financial, investment, legal, or any other professional advice. IndiaGrowth covers startup funding news and ecosystem analysis — this is journalism, not investment counsel. Always consult a qualified financial advisor before making investment decisions.
      </p>

      <h2>No Endorsement</h2>
      <p>
        Mention of any company, product, or individual on IndiaGrowth does not constitute an endorsement. We report on the ecosystem as journalists. Coverage of a funding round is not a recommendation to invest.
      </p>

      <h2>Forward-Looking Statements</h2>
      <p>
        Some articles may contain forward-looking statements about startups, markets, or economic trends. These are based on current expectations and are subject to change. Actual results may differ materially.
      </p>

      <h2>External Links</h2>
      <p>
        Our articles may link to external websites, press releases, or SEC/regulatory filings. We are not responsible for the accuracy or content of those external sources.
      </p>

      <h2>Errors and Omissions</h2>
      <p>
        While we strive for accuracy, startup news moves fast. If you spot an error, please email <a href="mailto:corrections@indiagrowth.in" style={{ color: 'var(--red)' }}>corrections@indiagrowth.in</a> and we will review and correct promptly.
      </p>

      <h2>Affiliate and Sponsored Content</h2>
      <p>
        IndiaGrowth may participate in affiliate marketing programs. Any sponsored content or affiliate links will be clearly disclosed. Our editorial opinions are not influenced by advertisers or affiliates.
      </p>

      <h2>Contact</h2>
      <p>For any disclaimer-related queries, contact us at <a href="mailto:hello@indiagrowth.in" style={{ color: 'var(--red)' }}>hello@indiagrowth.in</a>.</p>
    </div>
  );
}
