import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent, AUDIT_EVENTS } from "@/lib/audit";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await logAuditEvent(AUDIT_EVENTS.USER_LOGIN, {
        userId: data.user.id,
        eventData: { provider: data.user.app_metadata?.provider },
      });
    }

    if (error) {
      return NextResponse.redirect(`${origin}/login?error=${error.message}`);
    }

    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=No code provided`);
}
