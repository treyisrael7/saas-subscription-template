import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAuthRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const { allowed, retryAfter } = checkAuthRateLimit(request);
  const baseUrl = new URL(request.url).origin;

  if (!allowed) {
    const redirect = NextResponse.redirect(
      new URL("/forgot-password?error=rate_limited", baseUrl),
      302
    );
    if (retryAfter) redirect.headers.set("Retry-After", String(retryAfter));
    return redirect;
  }

  const formData = await request.formData();
  const email = (formData.get("email") as string)?.trim();

  if (!email) {
    return NextResponse.redirect(
      new URL("/forgot-password?error=missing", baseUrl),
      302
    );
  }

  const supabase = await createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? baseUrl;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return NextResponse.redirect(
      new URL("/forgot-password?error=failed", baseUrl),
      302
    );
  }

  return NextResponse.redirect(new URL("/forgot-password?success=1", baseUrl), 302);
}
