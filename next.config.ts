import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every canonical URL, internal link, and sitemap entry in this site uses
  // a trailing slash (e.g. /services/seo/). Without this flag, Next.js
  // defaults to redirecting trailing-slash URLs to non-trailing-slash ones,
  // which would put every canonical out of sync with the URL that actually
  // serves — a redirect-chain and trailing-slash-inconsistency bug.
  trailingSlash: true,
};

export default nextConfig;
