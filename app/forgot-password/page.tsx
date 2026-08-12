import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Reset Your Password",
  description: "Request a password reset link for your Acendia account.",
  path: "/forgot-password/",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return (
    <div className="bg-grid flex min-h-screen items-center border-b border-[var(--border-dim)] py-14">
      <Container className="max-w-md">
        <Link href="/" className="focus-ring mb-10 flex items-center gap-2" aria-label="Acendia home">
          <Image src="/brand/acendia-logo.png" alt="Acendia" width={120} height={38} className="h-7 w-auto" />
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Forgot your password?</h1>
        <p className="mt-2 text-white/60">Enter your email and we'll send you a reset link.</p>
        <div className="mt-8">
          <ForgotPasswordForm />
        </div>
        <p className="mt-8 text-sm text-white/40">
          <Link href="/login/" className="underline hover:text-white">
            Back to login
          </Link>
        </p>
      </Container>
    </div>
  );
}
