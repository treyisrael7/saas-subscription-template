import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { logAuditEvent, AUDIT_EVENTS } from "@/lib/audit";

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth();
  if ("unauthorized" in auth) return auth.unauthorized;
  const { user, supabase } = auth;

  const body = await request.json();
  const password = typeof body.password === "string" ? body.password : null;

  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAuditEvent(AUDIT_EVENTS.PASSWORD_RESET, {
    userId: user.id,
    eventData: { email: user.email },
  });

  return NextResponse.json({ success: true });
}
