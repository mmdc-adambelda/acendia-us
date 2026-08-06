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
        description="Last updated August 6, 2026. This policy explains what information we collect through acendia.us and how it's used."
        breadcrumbs={[{ name: "Privacy Policy", path: "/privacy-policy/" }]}
      />
      <Section>
        <div className="prose prose-invert max-w-3xl space-y-8 text-white/70">
          <div>
            <h2 className="text-xl font-semibold text-white">Information we collect</h2>
            <p className="mt-3 text-sm leading-relaxed">
              When you submit a form on acendia.us (such as the Free SEO Audit or Contact form),
              we collect the information you provide directly: name, business name, email
              address, phone number, website URL, location, industry, and any details you share
              about your marketing challenge. We do not collect payment or financial information
              through this website.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">How we use it</h2>
            <p className="mt-3 text-sm leading-relaxed">
              We use submitted information to respond to your inquiry, prepare requested audits,
              and, where you've consented, to follow up about our services. We may store this
              information in a customer relationship management (CRM) system for these purposes.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Analytics and cookies</h2>
            <p className="mt-3 text-sm leading-relaxed">
              This site may use standard analytics tools (such as Google Analytics and Google Tag
              Manager) to understand aggregate site usage. These tools may use cookies. You can
              control cookies through your browser settings.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Data sharing</h2>
            <p className="mt-3 text-sm leading-relaxed">
              We do not sell your personal information. We may share information with service
              providers who help us operate our business (such as CRM or communication tools),
              bound by confidentiality obligations.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Your choices</h2>
            <p className="mt-3 text-sm leading-relaxed">
              You may request access to, correction of, or deletion of your personal information
              by contacting us through the <a href="/contact/" className="underline hover:text-white">Contact page</a>.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Changes to this policy</h2>
            <p className="mt-3 text-sm leading-relaxed">
              We may update this policy from time to time. Material changes will be reflected by
              an updated "last updated" date at the top of this page.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
