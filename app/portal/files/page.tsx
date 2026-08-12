import type { Metadata } from "next";
import Card from "@/components/Card";
import { buildMetadata } from "@/lib/seo";
import { getPortalContext } from "@/lib/portal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Files",
  description: "Files shared with you by Acendia.",
  path: "/portal/files/",
  noIndex: true,
});

// Storage bucket "client-files" must exist in Supabase Storage (private,
// not public) — see CLIENT-PORTAL-SETUP.md. Files are stored at
// {organization_id}/{filename} and signed URLs are generated per request
// rather than storing public URLs, so access always requires this
// server-side check.
const BUCKET = "client-files";

export default async function FilesPage() {
  const ctx = await getPortalContext();
  const supabase = await createClient();

  const { data: files } = await supabase
    .from("files")
    .select("id, file_name, file_type, file_size_bytes, category, storage_path, created_at")
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false });

  const filesWithUrls = await Promise.all(
    (files ?? []).map(async (f) => {
      try {
        const { data } = await supabase.storage.from(BUCKET).createSignedUrl(f.storage_path, 60 * 10);
        return { ...f, url: data?.signedUrl ?? null };
      } catch {
        return { ...f, url: null };
      }
    }),
  );

  function formatSize(bytes: number | null): string {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Files</h1>
      <p className="mt-1 text-sm text-white/50">Reports, drafts, and assets your account team has shared with you.</p>

      <div className="mt-6 space-y-2">
        {filesWithUrls.length === 0 && (
          <Card>
            <p className="text-sm text-white/60">No files have been shared yet.</p>
          </Card>
        )}
        {filesWithUrls.map((f) => (
          <Card key={f.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-white">{f.file_name}</p>
              <p className="mt-0.5 text-xs text-white/40">
                {f.category ?? "File"} · {formatSize(f.file_size_bytes)} · {new Date(f.created_at).toLocaleDateString("en-US")}
              </p>
            </div>
            {f.url ? (
              <a href={f.url} target="_blank" rel="noopener noreferrer" className="focus-ring text-sm text-white/60 underline hover:text-white">
                Download
              </a>
            ) : (
              <span className="text-xs text-white/30">Unavailable</span>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
