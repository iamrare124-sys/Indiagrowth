import siteConfig from '../../config/site.config.js';

export const metadata = {
  title: `About Us — ${siteConfig.siteName}`,
  description: `Learn about ${siteConfig.siteName} and our mission to cover India's startup ecosystem.`,
};

export default function AboutPage() {
  return (
    <>
      <div className="about-hero">
        <div className="container">
          <div className="about-grid">
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--red)', marginBottom: 12 }}>
                About Us
              </p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
                India's Most Opinionated Startup News
              </h1>
              <p style={{ fontSize: 17, color: '#aaa', lineHeight: 1.7 }}>
                {siteConfig.description} We don't just report — we analyze, question, and call out what matters for the ecosystem.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { num: '500+', label: 'Articles Published' },
                { num: '50K+', label: 'Monthly Readers' },
                { num: '8 Yrs', label: 'Ecosystem Coverage' },
              ].map((stat) => (
                <div key={stat.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--red)' }}>{stat.num}</span>
                  <span style={{ fontSize: 14, color: '#888' }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 0' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 20 }}>
            Our Mission
          </h2>
          <p style={{ fontSize: 17, color: 'var(--mid)', lineHeight: 1.75, marginBottom: 20 }}>
            IndiaGrowth was founded to give Indian founders, investors, and startup enthusiasts a straight-talking source of truth about the ecosystem. We cover funding rounds, founder journeys, product launches, and the policy moves that shape India's entrepreneurial landscape.
          </p>
          <p style={{ fontSize: 17, color: 'var(--mid)', lineHeight: 1.75, marginBottom: 40 }}>
            No PR fluff. No paid placements. Just real analysis from someone who's spent years in the trenches of Indian venture capital.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 20 }}>
            Meet the Author
          </h2>

          <div className="about-author-card">
            <div className="author-big-avatar">{siteConfig.author.name.charAt(0)}</div>
            <div className="author-info">
              <h3>{siteConfig.author.name}</h3>
              <div className="author-title">{siteConfig.author.title}</div>
              <p>{siteConfig.author.bio}</p>
            </div>
          </div>

          <hr className="divider" />

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 20 }}>
            What We Cover
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {siteConfig.categories.map((cat) => (
              <div key={cat.slug} style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 8, padding: '20px 24px', borderLeft: '4px solid var(--red)' }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{cat.label}</div>
                <div style={{ fontSize: 13, color: 'var(--gray)' }}>
                  Deep dives and breaking news on {cat.label.toLowerCase()} across India.
                </div>
              </div>
            ))}
          </div>

          <hr className="divider" />

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Get in Touch</h2>
            <p style={{ color: 'var(--gray)', marginBottom: 20 }}>Tips, corrections, or partnership enquiries?</p>
            <a href="mailto:hello@indiagrowth.in" className="btn-red">
              📧 hello@indiagrowth.in
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
