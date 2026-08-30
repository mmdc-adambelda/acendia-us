import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getLeadMagnet } from "@/lib/leadMagnets";
import { verifyDownloadToken } from "@/lib/leadMagnetDownload";

/**
 * Generic lead-magnet download endpoint, parameterized by slug. Requires
 * a short-lived, HMAC-signed `token` query param minted by the subscribe
 * route above — there is no way to reach the PDF without one. The file
 * itself lives outside public/ (see lib/leadMagnets.ts's filePath), so
 * it was never reachable by a guessable URL in the first place; this
 * route is the ONLY path to it.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug);
  if (!magnet) {
    return NextResponse.redirect(new URL("/", req.url), 303);
  }

  const token = req.nextUrl.searchParams.get("token") ?? "";
  if (!verifyDownloadToken(token, slug)) {
    const url = new URL(magnet.path, req.url);
    url.searchParams.set("error", "expired");
    return NextResponse.redirect(url, 303);
  }

  const filePath = path.join(process.cwd(), magnet.filePath);
  let file: Buffer;
  try {
    file = await readFile(filePath);
  } catch (err) {
    console.error("lead-magnet download: failed to read file", { slug, err });
    return NextResponse.json(
      { error: "This file is temporarily unavailable. Please contact us and we'll send it directly." },
      { status: 500 },
    );
  }

  return new NextResponse(new Uint8Array(file), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${magnet.fileName}"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
