import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/portal/",
        "/admin/",
        "/checkout/",
        "/onboarding/",
        "/login/",
        "/register/",
        "/forgot-password/",
        "/reset-password/",
        "/verify-email/",
        "/get-started/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
