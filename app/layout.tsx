import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { SITE_NAME, SITE_URL, TAGLINE } from "@/lib/site";
import { getCurrentUser } from "@/lib/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | SEO & Digital Growth Agency for US Businesses`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Acendia helps US businesses grow through SEO, local search, high-converting websites, and AI-powered digital marketing. YOUR Business, OUR Business.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Every page uses this one root layout (marketing pages, /checkout,
  // /onboarding — everywhere except /portal and /admin, which have their
  // own layout with their own session-aware nav). Without this, the
  // shared Header always showed a static "Client Login" link regardless
  // of session state — found live: a client who'd just paid landed back
  // on /onboarding with no way to tell they were still logged in, or to
  // get back to their portal, other than re-entering credentials.
  const current = await getCurrentUser();

  return (
    <html lang="en-US" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Analytics />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <Header isAuthenticated={Boolean(current)} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <span className="sr-only">{TAGLINE}</span>
      </body>
    </html>
  );
}
