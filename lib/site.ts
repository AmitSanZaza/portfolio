// Absolute base URL for metadata (Open Graph, canonical URLs, sitemap).
// Set NEXT_PUBLIC_SITE_URL once you have a custom domain; on Vercel the
// production URL is picked up automatically otherwise.
export function getSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return new URL(configured);

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);

  return new URL("http://localhost:3000");
}
