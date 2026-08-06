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
        description="Last updated August 6, 2026. Please read these terms before using acendia.us."
        breadcrumbs={[{ name: "Terms", path: "/terms/" }]}
      />
      <Section>
        <div className="max-w-3xl space-y-8 text-white/70">
          <div>
            <h2 className="text-xl font-semibold text-white">Use of this website</h2>
            <p className="mt-3 text-sm leading-relaxed">
              This website is provided for informational purposes and to allow US businesses to
              learn about and request Acendia's digital marketing services. By using this site,
              you agree not to misuse it, attempt to disrupt it, or submit false information
              through its forms.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">No guaranteed results</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Content on this site describing SEO, marketing, or website services is general in
              nature. Search engine rankings, traffic, and lead outcomes depend on many factors
              outside our control, including search engine algorithm changes and market
              competition. Nothing on this site constitutes a guarantee of specific results.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Intellectual property</h2>
            <p className="mt-3 text-sm leading-relaxed">
              All content on acendia.us, including text, graphics, and the Acendia name and logo,
              is the property of Acendia International or its licensors and may not be
              reproduced without permission.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Service agreements</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Any services purchased from Acendia are governed by a separate signed service
              agreement or statement of work, which takes precedence over the general terms on
              this website.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Limitation of liability</h2>
            <p className="mt-3 text-sm leading-relaxed">
              This website and its content are provided "as is" without warranties of any kind.
              Acendia is not liable for any indirect or consequential damages arising from your
              use of this site.
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
