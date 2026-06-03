export function verifyCronSecret(request) {
  const secret = process.env.CRON_SECRET;

  // If no secret configured, DENY by default (fail secure)
  if (!secret) return false;

  // Method 1: Vercel automatic cron — Authorization Bearer header
  if (request.headers.get('authorization') === `Bearer ${secret}`) return true;

  // Method 2: Manual trigger — ?secret= query param
  if (new URL(request.url).searchParams.get('secret') === secret) return true;

  // Method 3: Legacy header support
  if (request.headers.get('x-cron-secret') === secret) return true;

  return false;
}

export function verifyApiPassword(request) {
  const password = process.env.SITE_API_PASSWORD;
  if (!password) return false; // Fail secure — deny if no password set
  return request.headers.get('authorization') === `Bearer ${password}`;
}
