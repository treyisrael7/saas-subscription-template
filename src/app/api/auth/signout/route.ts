import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent, AUDIT_EVENTS } from "@/lib/audit";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    void logAuditEvent(AUDIT_EVENTS.USER_LOGOUT, {
      userId: user.id,
      eventData: { email: user.email },
    });
  }
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"), 302);
}
