import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import JsonLd from "@/components/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: `Terms governing your use of the ${SITE_NAME} website, acendia.us.`,
  path: "/terms/",
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Terms of Service",
          description: "Terms governing your use of the Acendia website, acendia.us.",
          path: "/terms/",
        })}
      />
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="Last updated August 11, 2026. Please read these terms before using acendia.us, including registering an account or subscribing to a paid plan."
        breadcrumbs={[{ name: "Terms", path: "/terms/" }]}
      />
      <Section>
        <div className="max-w-3xl space-y-8 text-white/70">
          <div className="rounded-[var(--r-md)] border border-amber-900/40 bg-amber-950/20 px-5 py-4 text-sm text-amber-200">
            <strong>Note for Acendia:</strong> this page was updated to account for online registration and paid
            subscriptions. It is a good-faith draft, not legal advice — have it reviewed by a qualified attorney
            before relying on it, especially the subscription, cancellation, and liability sections.
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Use of this website</h2>
            <p className="mt-3 text-sm leading-relaxed">
              This website is provided for informational purposes, to allow US businesses to learn about and
              request Acendia's digital marketing services, and to operate a client portal for registered
              account holders. By using this site, you agree not to misuse it, attempt to disrupt it, or submit
              false information through its forms or during registration.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Accounts and registration</h2>
            <p className="mt-3 text-sm leading-relaxed">
              You must provide accurate information when creating an account and keep your login credentials
              confidential. You're responsible for activity under your account. We may suspend or terminate
              accounts that violate these terms or that we reasonably believe involve fraudulent or abusive
              activity.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Subscriptions and payment</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Paid plans are billed according to the pricing and billing cycle presented at checkout, processed by
              our third-party payment providers (Stripe, PayPal, and/or Wise). By completing checkout, you
              authorize recurring charges for the applicable billing cycle until you cancel. Wise-based plans are
              billed via bank transfer and are not automatically recurring unless explicitly stated at checkout —
              see the payment method details shown to you before you pay.
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              You may cancel your subscription at any time from your account billing settings or by contacting us.
              Unless otherwise stated at signup, cancellation takes effect at the end of your current billing
              period — you retain access through the period you've already paid for. We do not delete your
              historical reports, invoices, or campaign records solely because a subscription is cancelled.
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              By checking the consent box at checkout, you agree to these Terms of Service and to the applicable
              Acendia Service Agreement referenced below.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">No guaranteed results</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Content on this site describing SEO, marketing, or website services is general in nature. Search
              engine rankings, traffic, and lead outcomes depend on many factors outside our control, including
              search engine algorithm changes and market competition. Nothing on this site or in the client
              portal constitutes a guarantee of specific results.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Intellectual property</h2>
            <p className="mt-3 text-sm leading-relaxed">
              All content on acendia.us, including text, graphics, and the Acendia name and logo, is the property
              of Acendia International or its licensors and may not be reproduced without permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Service Agreement</h2>
            <p className="mt-3 text-sm leading-relaxed">
              The specific scope of work, deliverables, and terms for any service you purchase from Acendia are
              governed by the applicable Acendia Service Agreement / statement of work, which takes precedence
              over these general terms. Where an account references a "Terms version" and "Service Agreement
              version," those refer to the specific documents you accepted at the time of purchase — we keep a
              record of what you accepted and when.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Limitation of liability</h2>
            <p className="mt-3 text-sm leading-relaxed">
              This website, the client portal, and their content are provided "as is" without warranties of any
              kind. Acendia is not liable for any indirect or consequential damages arising from your use of this
              site or the client portal.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Questions about these terms can be sent through our{" "}
              <a href="/contact/" className="underline hover:text-white">Contact page</a>.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
