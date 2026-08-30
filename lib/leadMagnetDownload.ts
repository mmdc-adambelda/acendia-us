import "server-only";
import crypto from "crypto";

// Short-lived, HMAC-signed download tokens — no database row, no
// Supabase Storage bucket, no third-party service. The PDF itself lives
// outside public/ (see lib/leadMagnets.ts's filePath), so it's never
// directly reachable by URL; this token is the only thing that lets the
// download route in app/api/lead-magnets/[slug]/download/route.ts serve
// it, and only for a short window after a real form submission.

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

function getSecret(): string | null {
  return process.env.LEAD_MAGNET_DOWNLOAD_SECRET || null;
}

/**
 * Mints a signed download token for one lead magnet. Returns null (never
 * throws) if LEAD_MAGNET_DOWNLOAD_SECRET isn't configured — the caller
 * degrades to a "we'll follow up by email" message rather than serving an
 * unsigned/unprotected download link.
 */
export function signDownloadToken(slug: string): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${slug}.${exp}`;
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payloadB64}.${sig}`;
}

/**
 * Verifies a download token against the expected slug, using a
 * timing-safe comparison for the signature. Returns false for any
 * malformed, unsigned, expired, or slug-mismatched token — never throws.
 */
export function verifyDownloadToken(token: string, expectedSlug: string): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payloadB64, sig] = parts;

  let payload: string;
  try {
    payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return false;
  }

  const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expectedSigBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedSigBuf.length || !crypto.timingSafeEqual(sigBuf, expectedSigBuf)) {
    return false;
  }

  const [slug, expStr] = payload.split(".");
  if (slug !== expectedSlug) return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  return true;
}
