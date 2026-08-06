import Card from "./Card";
import { INDUSTRIES, INDUSTRY_CATEGORY_SLUGS } from "@/lib/site";

export default function IndustryGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {INDUSTRIES.map((industry) => {
        const targetSlug = INDUSTRY_CATEGORY_SLUGS[industry.slug] ?? industry.slug;
        return (
          <Card key={industry.slug} href={`/industries/${targetSlug}/`} dataEvent="industry_page_cta_clicked">
            <h3 className="text-base font-semibold text-white">{industry.name}</h3>
            <p className="mt-2 text-sm text-white/55">{industry.oneLiner}</p>
          </Card>
        );
      })}
    </div>
  );
}
