import Link from "next/link";
import Button from "@/components/Button";
import Section, { Eyebrow } from "@/components/Section";

export default function NotFound() {
  return (
    <Section className="flex min-h-[60vh] items-center">
      <div className="mx-auto max-w-xl text-center">
        <Eyebrow>404</Eyebrow>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 text-white/60">
          The page you&apos;re looking for may have moved or no longer exists. Try one of these
          instead:
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/">Back to Homepage</Button>
          <Button href="/services/" variant="secondary">
            Browse Services
          </Button>
        </div>
        <p className="mt-8 text-sm text-white/40">
          Or{" "}
          <Link href="/contact/" className="underline hover:text-white">
            contact us
          </Link>{" "}
          if you think this is a mistake.
        </p>
      </div>
    </Section>
  );
}
