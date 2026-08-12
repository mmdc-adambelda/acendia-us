import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import LoginForm from "@/components/auth/LoginForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Log In to Your Acendia Account",
  description: "Log in to your Acendia client portal.",
  path: "/login/",
  noIndex: true,
});

export default function LoginPage() {
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
