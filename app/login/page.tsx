import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import LoginForm from "@/components/auth/LoginForm";
import { buildMetadata } from "@/lib/seo";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = buildMetadata({
  title: "Log In to Your Acendia Account",
  description: "Log in to your Acendia client portal.",
  path: "/login/",
  noIndex: true,
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Skip the form entirely for someone who's already signed in — matches
  // LoginForm's own post-login redirect target (?next=, defaulting to
  // /portal/) so this behaves like a no-op instead of asking for
  // credentials again. Found live: visiting /login/ with a valid session
  // (e.g. from a marketing-page link, since the shared Header doesn't yet
  // know who's logged in) forced a real second login before continuing.
  const current = await getCurrentUser();
  if (current) {
    const { next } = await searchParams;
    redirect(next || "/portal/");
  }

  return (
    <div className="bg-grid flex min-h-screen items-center border-b border-[var(--border-dim)] py-14">
      <Container className="max-w-md">
        <Link href="/" className="focus-ring mb-10 flex items-center gap-2" aria-label="Acendia home">
          <Image src="/brand/acendia-logo.png" alt="Acendia" width={120} height={38} className="h-7 w-auto" />
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
        <p className="mt-2 text-white/60">Log in to your Acendia client portal.</p>

        <div className="mt-8">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-8 text-sm text-white/40">
          Don't have an account?{" "}
          <Link href="/register/" className="underline hover:text-white">
            Get started
          </Link>
        </p>
      </Container>
    </div>
  );
}
