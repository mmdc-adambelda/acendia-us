import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "You're All Set",
  description: "Your Acendia account is being set up.",
  path: "/get-started/success/",
  noIndex: true,
});

export default function GetStartedSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-20">
      <Container className="max-w-lg text-center">
        <Card>
          <h1 className="text-2xl font-semibold text-white">You&apos;re all set 🎉</h1>
          <p className="mt-3 text-sm text-white/60">
            Thanks — we&apos;ve got your details and your setup payment. Check your email for a link to set your
            portal password. We&apos;ll be in touch within 24 hours with your project start date.
          </p>
          <Link
            href="/login/"
            className="focus-ring mt-6 inline-flex items-center rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)]"
          >
            Go to Login
          </Link>
        </Card>
      </Container>
    </div>
  );
}
