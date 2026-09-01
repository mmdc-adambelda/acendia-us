import { Star } from "lucide-react";
import Section, { Eyebrow } from "@/components/Section";
import Card from "@/components/Card";
import { getGoogleReviews } from "@/lib/googleReviews";

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rounded ? "fill-[var(--accent-2)] text-[var(--accent-2)]" : "text-white/20"}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

/**
 * Real Google reviews, fetched server-side via the official Places API
 * (see lib/googleReviews.ts) — never fabricated placeholder content.
 * Renders nothing at all if reviews aren't configured/available yet,
 * same honesty pattern as the homepage's "Case studies placeholder"
 * section.
 *
 * Deliberately carries no review/rating JSON-LD: Google's own structured
 * data guidelines disallow AggregateRating/Review rich-result markup for
 * a business's own site promoting itself (self-serving review snippets
 * are ignored or can trigger a manual action) — third-party review
 * platforms are the only place that markup is meant for. This section is
 * plain visual content with a real, required link back to the Google
 * listing itself instead.
 */
export default async function GoogleReviewsSection() {
  const data = await getGoogleReviews();
  if (!data) return null;

  return (
    <Section className="border-t border-[var(--border-dim)]">
      <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <Eyebrow>What clients say</Eyebrow>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Real reviews from real clients
          </h2>
        </div>
        <a
          href={data.placeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex shrink-0 items-center gap-2 text-sm text-white/60 hover:text-white"
        >
          <Stars rating={data.overallRating} />
          <span className="font-medium text-white">{data.overallRating.toFixed(1)}</span>
          <span>
            ({data.totalReviewCount} Google review{data.totalReviewCount === 1 ? "" : "s"})
          </span>
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.reviews.slice(0, 6).map((review, i) => (
          <Card key={i}>
            <div className="flex items-center gap-3">
              {review.authorPhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- external, unpredictable Google-hosted avatar URLs; not worth a remotePatterns entry for a small round avatar
                <img
                  src={review.authorPhotoUrl}
                  alt=""
                  aria-hidden="true"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white/70">
                  {review.authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white">{review.authorName}</p>
                <p className="text-xs text-white/40">{review.relativeTime}</p>
              </div>
            </div>
            <div className="mt-3">
              <Stars rating={review.rating} />
            </div>
            <p className="mt-3 line-clamp-6 text-sm leading-relaxed text-white/65">{review.text}</p>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-xs text-white/35">
        Reviews shown as posted, via the{" "}
        <a href={data.placeUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white/60">
          Acendia International Google Business Profile
        </a>
        .
      </p>
    </Section>
  );
}
