import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./site";

type BuildMetadataArgs = {
  title: string;
  description: string;
  path: string; // e.g. "/services/seo/" — must start and end with "/"
  ogImage?: string;
  noIndex?: boolean;
};

/**
 * Single reusable metadata builder so every page gets a consistent,
 * self-referencing canonical, absolute OG/Twitter URLs, and no risk of a
 * preview/dev URL leaking into production metadata.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage = "/brand/acendia-logo.png",
  noIndex = false,
}: BuildMetadataArgs): Metadata {
  const url = `${SITE_URL}${path}`;
  // The root layout's `title.template` already appends " | Acendia
  // International" to any plain string title from a child page — don't
  // double it up here. OG/Twitter tags don't inherit the template, so we
  // build the full title once for those explicitly.
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: `${SITE_URL}${ogImage}` }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${SITE_URL}${ogImage}`],
    },
  };
}
