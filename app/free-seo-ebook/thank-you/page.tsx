import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Card from "@/components/Card";
import BookingCtaButton from "@/components/leadMagnets/BookingCtaButton";
import { getLeadMagnet } from "@/lib/leadMagnets";
import { buildMetadata } from "@/lib/seo";

const magnet = getLeadMagnet("free-seo-ebook")!;

export const metadata: Metadata = buildMetadata({
  title: "Your SEO Ebook Is Ready",
  description: "Download link for the Acendia free SEO ebook.",
  path: `${magnet.path}thank-you/`,
  noIndex: true,
});

/**
 * Reached only via the subscribe route's redirect
 * (app/api/lead-magnets/[slug]/subscribe/route.ts), carrying a
 * short-lived signed `?token=`. This page itself doesn't re-verify the
 * token — that happens for real, server-side, at the moment the download
 * button is actually clicked (app/api/lead-magnets/[slug]/download/route.ts)
 * — it just decides whether to show a download button or a "request it
 * again" fallback based on whether a token is present at all.
 */
export default async function FreeSeoEbookThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string; unlock_unavailable?: string }>;
}) {
  const { token, error, unlock_unavailable: unlockUnavailable } = await searchParams;
  const canDownload = Boolean(token) && !unlockUnavailable;

  return (
    <div className="min-h-screen py-14 sm:py-20">
      <Container className="max-w-2xl">
        {!canDownload ? (
          <Card className="text-center">
            <h1 className="text-xl font-semibold text-white">
              {error === "expired" ? "This download link has expired" : "We couldn't unlock your download"}
            </h1>
            <p className="mt-3 text-sm text-white/60">
              {error === "expired"
                ? "Download links are only valid for a short time after you request the guide."
                : "Something went wrong generating your download link."}{" "}
              Please request the guide again, or{" "}
              <Link href="/contact/" className="underline hover:text-white">
                contact us
              </Link>{" "}
              and we&apos;ll send it directly.
            </p>
            <Link
              href={magnet.path}
              className="focus-ring mt-6 inline-flex items-center justify-center rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)]"
            >
              Request the Guide Again
            </Link>
          </Card>
        ) : (
          <>
            <Card className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{magnet.unlock.headline}</h1>
              <p className="mt-3 text-white/60">{magnet.unlock.supporting}</p>
              <a
                href={`/api/lead-magnets/${magnet.slug}/download?token=${encodeURIComponent(token!)}`}
                data-event="ebook_download"
                className="focus-ring mt-8 inline-flex items-center justify-center rounded-[var(--r-sm)] bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-black transition-all hover:shadow-[var(--glow-white)]"
              >
                {magnet.unlock.downloadLabel}
              </a>
            </Card>

            <Card className="mt-8 text-center">
              <h2 className="text-xl font-semibold text-white">{magnet.postDownload.headline}</h2>
              <p className="mx-auto mt-4 max-w-xl whitespace-pre-line text-sm leading-relaxed text-white/60">
                {magnet.postDownload.body}
              </p>
              <div className="mt-8 flex justify-center">
                <BookingCtaButton href={magnet.postDownload.bookingUrl} label={magnet.postDownload.ctaLabel} />
              </div>
            </Card>
          </>
        )}
      </Container>
    </div>
  );
}
