import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  taskId: z.string().uuid(),
  status: z.enum(["planned", "in_progress", "waiting_for_client", "review", "completed", "blocked"]),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 422 });

  const update: Record<string, unknown> = { status: parsed.data.status };
  if (parsed.data.status === "completed") update.completed_at = new Date().toISOString();

  const { data, error } = await supabase.from("tasks").update(update).eq("id", parsed.data.taskId).select("id").maybeSingle();
  if (error || !data) {
    return NextResponse.json({ ok: false, error: "Not authorized or task not found." }, { status: 403 });
  }
  return NextResponse.json({ ok: true });
}
