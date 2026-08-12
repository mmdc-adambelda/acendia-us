import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import JsonLd from "@/components/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses, and protects information submitted through acendia.us.`,
  path: "/privacy-policy/",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Privacy Policy",
          description: "How Acendia collects, uses, and protects information submitted through acendia.us.",
          path: "/privacy-policy/",
        })}
      />
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated August 11, 2026. This policy explains what information we collect through acendia.us — including the client portal and account features — and how it's used."
        breadcrumbs={[{ name: "Privacy Policy", path: "/privacy-policy/" }]}
      />
      <Section>
        <div className="prose prose-invert max-w-3xl space-y-8 text-white/70">
          <div className="rounded-[var(--r-md)] border border-amber-900/40 bg-amber-950/20 px-5 py-4 text-sm text-amber-200">
            <strong>Note for Acendia:</strong> this page was updated to reflect the addition of registered
            accounts, the client portal, and payment processing. It is a good-faith draft, not legal advice —
            have it reviewed by a qualified attorney before relying on it, especially the payment-processor and
            data-retention language.
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Information we collect</h2>
            <p className="mt-3 text-sm leading-relaxed">
              <strong>From website visitors:</strong> when you submit a form on acendia.us (such as the Free SEO
              Audit or Contact form), we collect the information you provide directly — name, business name, email
              address, phone number, website URL, location, industry, and any details you share about your
              marketing challenge.
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              <strong>From registered account holders:</strong> if you create an Acendia account, we additionally
              collect your account credentials (handled by our authentication provider, Supabase — we never store
              your password ourselves), business details, website and marketing information, campaign goals, and
              any files, messages, or support requests you submit through the client portal.
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              <strong>Payment information:</strong> when you subscribe to a paid plan, payment is processed by our
              third-party payment providers — Stripe, PayPal, and/or Wise. We do not collect or store your full
              card number or bank credentials ourselves; those remain with the payment provider. We retain
              transaction identifiers, subscription status, invoice records, and billing history needed to manage
              your account.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">How we use it</h2>
            <p className="mt-3 text-sm leading-relaxed">
              We use submitted information to respond to your inquiry, prepare requested audits, deliver the
              services you've subscribed to, operate your client portal account, process payments, communicate
              about your campaign, and, where you've consented, follow up about our services. We may store
              information in a customer relationship management (CRM) system for these purposes.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Analytics and cookies</h2>
            <p className="mt-3 text-sm leading-relaxed">
              This site may use standard analytics tools (such as Google Analytics and Google Tag Manager) to
              understand aggregate site usage, and authentication cookies to keep you signed in to the client
              portal. You can control non-essential cookies through your browser settings; authentication cookies
              are required for the portal to function.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Data sharing</h2>
            <p className="mt-3 text-sm leading-relaxed">
              We do not sell your personal information. We share information with the service providers who help
              us operate our business and are bound by confidentiality/data-processing obligations, including our
              authentication and database provider (Supabase), payment processors (Stripe, PayPal, Wise), and
              CRM/communication tools.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Data retention</h2>
            <p className="mt-3 text-sm leading-relaxed">
              We retain account, campaign, and billing records for as long as your account is active and for a
              reasonable period afterward for legal, accounting, and record-keeping purposes. Cancelling a
              subscription does not delete your historical reports, invoices, or campaign records — see our{" "}
              <a href="/terms/" className="underline hover:text-white">Terms of Service</a> for how cancellation is
              handled.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Your choices</h2>
            <p className="mt-3 text-sm leading-relaxed">
              You may request access to, correction of, or deletion of your personal information, or request
              deletion of your account, by contacting us through the{" "}
              <a href="/contact/" className="underline hover:text-white">Contact page</a>. Some information may be
              retained where required for legal, tax, or accounting purposes even after an account deletion request.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Changes to this policy</h2>
            <p className="mt-3 text-sm leading-relaxed">
              We may update this policy from time to time. Material changes will be reflected by an updated
              "last updated" date at the top of this page.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
