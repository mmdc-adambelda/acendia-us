import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Set a New Password",
  description: "Set a new password for your Acendia account.",
  path: "/reset-password/",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return (
    <div className="bg-grid flex min-h-screen items-center border-b border-[var(--border-dim)] py-14">
      <Container className="max-w-md">
        <Link href="/" className="focus-ring mb-10 flex items-center gap-2" aria-label="Acendia home">
          <Image src="/brand/acendia-logo.png" alt="Acendia" width={120} height={38} className="h-7 w-auto" />
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Set a new password</h1>
        <p className="mt-2 text-white/60">Choose a new password for your account.</p>
        <div className="mt-8">
          <ResetPasswordForm />
        </div>
      </Container>
    </div>
  );
}
