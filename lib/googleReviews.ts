import "server-only";

export type GoogleReview = {
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number; // 1-5
  relativeTime: string; // Google's own "2 weeks ago"-style string
  text: string;
};

export type GoogleReviewsData = {
  overallRating: number;
  totalReviewCount: number;
  reviews: GoogleReview[];
  placeUrl: string; // real link back to the Google listing, required by Google's attribution rules
};

// Google's Places API (New) "Place Details" endpoint. Returns up to 5 of
// the place's most relevant reviews — Google's own terms require
// displaying whatever it returns as-is (no editing review text, no
// cherry-picking beyond what the API gives you) with attribution and a
// link back to the listing, which is exactly what
// components/GoogleReviewsSection.tsx does.
const PLACE_DETAILS_URL = "https://places.googleapis.com/v1/places";

/**
 * Fetches this business's real Google reviews. Returns null (never
 * throws) if the API isn't configured or the request fails — the
 * homepage section simply doesn't render rather than showing fabricated
 * or stale placeholder reviews, consistent with this site's no-fake-
 * content rule for testimonials/case studies.
 *
 * Cached for 24 hours (Next's fetch cache) — reviews don't change
 * minute-to-minute, and this keeps real API usage to roughly once a day
 * regardless of site traffic.
 */
export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null;

  try {
    const res = await fetch(`${PLACE_DETAILS_URL}/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok) {
      console.error("getGoogleReviews: Places API request failed", res.status, await res.text());
      return null;
    }

    const data = await res.json();

    const reviews: GoogleReview[] = Array.isArray(data.reviews)
      ? data.reviews.map(
          (r: {
            authorAttribution?: { displayName?: string; photoUri?: string };
            rating?: number;
            relativePublishTimeDescription?: string;
            text?: { text?: string };
          }) => ({
            authorName: r.authorAttribution?.displayName ?? "Google user",
            authorPhotoUrl: r.authorAttribution?.photoUri ?? null,
            rating: typeof r.rating === "number" ? r.rating : 0,
            relativeTime: r.relativePublishTimeDescription ?? "",
            text: r.text?.text ?? "",
          }),
        )
      : [];

    if (reviews.length === 0) return null;

    return {
      overallRating: typeof data.rating === "number" ? data.rating : 0,
      totalReviewCount: typeof data.userRatingCount === "number" ? data.userRatingCount : 0,
      reviews,
      placeUrl: data.googleMapsUri ?? `https://search.google.com/local/reviews?placeid=${placeId}`,
    };
  } catch (err) {
    console.error("getGoogleReviews failed", err);
    return null;
  }
}
