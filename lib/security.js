export function verifyCronSecret(request) {
  const authHeader = request.headers.get('authorization');
  const url = new URL(request.url);
  const secretParam = url.searchParams.get('secret');
  const cronHeader = request.headers.get('x-cron-secret');

  const secret = process.env.CRON_SECRET;

  if (!secret) return true; // No secret configured, allow

  if (authHeader === `Bearer ${secret}`) return true;
  if (secretParam === secret) return true;
  if (cronHeader === secret) return true;

  return false;
}

export function verifyApiPassword(request) {
  const authHeader = request.headers.get('authorization');
  const password = process.env.SITE_API_PASSWORD;
  if (!password) return true;
  return authHeader === `Bearer ${password}`;
}
