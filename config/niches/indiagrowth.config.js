const indiaGrowthConfig = {
  niche: 'indiagrowth',
  siteName: 'IndiaGrowth',
  // SITE_NAME env var must be set to 'indiagrowth' in Vercel — used by supabase.js to filter DB rows
  domain: 'indiagrowth.in',
  tagline: 'India Startup Funding & Entrepreneur News',
  description:
    'Latest India startup funding news, founder stories, new product launches and entrepreneurship tips for Indian founders.',
  author: {
    name: 'Ankit Mehta',
    title: 'Startup Ecosystem Expert | 8 Years Experience',
    bio: "Ankit Mehta has 8 years in India's startup ecosystem. Former analyst at Sequoia India, he tracks funding rounds, startup failures and success stories at StartupKhabar.in",
  },
  primaryKeyword: 'india startup news',
  secondaryKeywords: [
    'startup funding india',
    'new startup india 2026',
    'Indian entrepreneur',
    'startup investment india',
  ],
  rssSources: [
    'https://news.google.com/rss/search?q=startup+funding+india+crore+2026&hl=en-IN&gl=IN&ceid=IN:en',
    'https://news.google.com/rss/search?q=india+startup+launch+founder+new&hl=en-IN&gl=IN&ceid=IN:en',
    'https://news.google.com/rss/search?q=Sequoia+Accel+startup+investment+india&hl=en-IN&gl=IN&ceid=IN:en',
  ],
  reddit: ['india', 'startups', 'IndiaInvestments'],
  liveDataProvider: 'static',
  liveDataSymbols: ['Funding Today', 'Startups Launched This Week'],
  imageKeywords: [
    'startup office india team',
    'entrepreneur business laptop india',
    'funding investment growth',
  ],
  categories: [
    { slug: 'funding-news', label: 'Funding News' },
    { slug: 'startup-stories', label: 'Startup Stories' },
    { slug: 'product-launches', label: 'Product Launches' },
    { slug: 'founder-tips', label: 'Founder Tips' },
  ],
  cron: '30 9 * * *',
  aiPersonality: `You are Ankit Mehta, startup analyst at indiagrowth.in. Write like a well-connected VC analyst who knows everyone in the ecosystem. Always mention real Indian VCs: Sequoia, Accel, Nexus, Lightspeed. Name real startups. Strong opinions: "This valuation is completely insane." India-specific: Bengaluru startup scene, IIT/IIM founders, government policies. End with what this means for the Indian startup ecosystem. Never say "Furthermore" or "In this article".`,
  colors: {
    primary: '#e8002d',
    secondary: '#1a1a2e',
    accent: '#ff6b35',
  },
};

module.exports = indiaGrowthConfig;
