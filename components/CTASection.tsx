import Button from "./Button";
import Section from "./Section";

export default function CTASection({
  title,
  description,
  primaryLabel = "Get Your Free SEO Audit",
  primaryHref = "/free-seo-audit/",
  secondaryLabel = "Talk to Our Team",
  secondaryHref = "/contact/",
}: {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <Section>
      <div className="bg-grid relative overflow-hidden rounded-[var(--r-xl)] border border-[var(--border)] bg-[var(--card)] px-6 py-16 text-center sm:px-12 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]"
        />
        <div className="relative">
          <h2 className="text-balance mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="text-balance mx-auto mt-4 max-w-xl text-base text-white/60">
            {description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={primaryHref} variant="primary" dataEvent="audit_cta_clicked">
              {primaryLabel}
            </Button>
            <Button href={secondaryHref} variant="secondary" dataEvent="consultation_cta_clicked">
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
