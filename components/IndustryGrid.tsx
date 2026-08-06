import Card from "./Card";
import { INDUSTRIES } from "@/lib/site";

const LIVE_SLUGS = new Set(["home-services", "legal"]);

export default function IndustryGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {INDUSTRIES.map((industry) => {
        const href = industry.slug === "legal"
          ? "/industries/law-firm-seo/"
          : `/industries/${industry.slug}/`;
        return (
          <Card key={industry.slug} href={href} dataEvent="industry_page_cta_clicked">
            <h3 className="text-base font-semibold text-white">{industry.name}</h3>
            <p className="mt-2 text-sm text-white/55">{industry.oneLiner}</p>
            {!LIVE_SLUGS.has(industry.slug) && (
              <span className="mt-4 inline-block text-xs font-medium uppercase tracking-wide text-white/35">
                Coming soon
              </span>
            )}
          </Card>
        );
      })}
    </div>
  );
}
