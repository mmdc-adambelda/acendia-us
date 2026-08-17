import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import VerifyEmailHandler from "@/components/auth/VerifyEmailHandler";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Verify Your Email",
  description: "Verify your email to activate your Acendia account.",
  path: "/verify-email/",
  noIndex: true,
});

export default function VerifyEmailPage() {
  return (
    <div className="bg-grid flex min-h-screen items-center border-b border-[var(--border-dim)] py-14">
      <Container className="max-w-md text-center">
        <Link href="/" className="focus-ring mb-10 inline-flex items-center gap-2" aria-label="Acendia home">
          <Image src="/brand/acendia-logo.png" alt="Acendia" width={120} height={38} className="mx-auto h-7 w-auto" />
        </Link>
        <div className="rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--card)] p-8">
          <h1 className="text-2xl font-semibold text-white">Check your inbox</h1>
          <p className="mt-3 text-sm text-white/60">
            We've sent a confirmation link to the email address you signed up with. Click it to verify your account,
            then log in to continue.
          </p>
          <p className="mt-6 text-xs text-white/40">
            Didn't get it? Check your spam folder, or{" "}
            <Link href="/contact/" className="underline hover:text-white">
              contact us
            </Link>{" "}
            if it's been more than a few minutes.
          </p>
          <VerifyEmailHandler />
        </div>
        <p className="mt-8 text-sm text-white/40">
          Already verified?{" "}
          <Link href="/login/" className="underline hover:text-white">
            Log in
          </Link>
        </p>
      </Container>
    </div>
  );
}
