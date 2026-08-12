import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import RegisterWizard, { type PlanOption } from "@/components/register/RegisterWizard";
import { buildMetadata } from "@/lib/seo";
import { getActivePlans } from "@/lib/plans";

export const metadata: Metadata = buildMetadata({
  title: "Create Your Acendia Account",
  description: "Register for an Acendia account and get started with your SEO and digital growth plan.",
  path: "/register/",
  noIndex: true,
});

export default async function RegisterPage() {
  const plansData = await getActivePlans();

  const plans: PlanOption[] = plansData.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    planType: p.plan_type,
    setupFeeCents: p.setup_fee_cents,
    monthlyPriceCents: p.monthly_price_cents,
    features: p.features ?? [],
  }));

  return (
    <div className="bg-grid min-h-screen border-b border-[var(--border-dim)] py-14 sm:py-20">
      <Container className="max-w-2xl">
        <Link href="/" className="focus-ring mb-10 flex items-center gap-2" aria-label="Acendia home">
          <Image src="/brand/acendia-logo.png" alt="Acendia" width={120} height={38} className="h-7 w-auto" />
        </Link>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Let's get your account set up
        </h1>
        <p className="mt-3 text-white/60">
          A few quick steps and you'll have your Acendia account, business profile, and growth plan ready to go.
        </p>

        <div className="mt-10">
          <RegisterWizard plans={plans} />
        </div>

        <p className="mt-10 text-sm text-white/40">
          Already have an account?{" "}
          <Link href="/login/" className="underline hover:text-white">
            Log in
          </Link>
        </p>
      </Container>
    </div>
  );
}
