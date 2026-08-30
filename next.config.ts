import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every canonical URL, internal link, and sitemap entry in this site uses
  // a trailing slash (e.g. /services/seo/). Without this flag, Next.js
  // defaults to redirecting trailing-slash URLs to non-trailing-slash ones,
  // which would put every canonical out of sync with the URL that actually
  // serves — a redirect-chain and trailing-slash-inconsistency bug.
  trailingSlash: true,
  images: {
    remotePatterns: [
      // YouTube thumbnail used by the homepage's click-to-play video embed.
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
  // The lead-magnet PDFs under private-assets/ are read from disk at
  // request time (app/api/lead-magnets/[slug]/download/route.ts) via a
  // plain string path, not a static import — Next's automatic file
  // tracing for serverless functions doesn't reliably pick that up, so
  // it's included explicitly here. Without this, the download route
  // would 500 in production (file not found) despite working in local
  // dev, where the whole repo is on disk regardless.
  outputFileTracingIncludes: {
    "/api/lead-magnets/[slug]/download": ["./private-assets/lead-magnets/**/*"],
  },
};

export default nextConfig;
