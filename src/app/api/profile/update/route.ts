import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { logAuditEvent, AUDIT_EVENTS } from "@/lib/audit";

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth();
  if ("unauthorized" in auth) return auth.unauthorized;
  const { user, supabase } = auth;

  const body = await request.json();
  const fullName = typeof body.full_name === "string" ? body.full_name.trim() : undefined;

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (fullName !== undefined) updates.full_name = fullName;

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAuditEvent(AUDIT_EVENTS.PROFILE_UPDATE, {
    userId: user.id,
    eventData: { full_name: fullName },
  });

  return NextResponse.json({ success: true });
}
