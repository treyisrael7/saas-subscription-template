import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAuthRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const { allowed, retryAfter } = checkAuthRateLimit(request);
  const baseUrl = new URL(request.url).origin;

  if (!allowed) {
    const redirect = NextResponse.redirect(
      new URL("/signup?error=rate_limited", baseUrl),
      302
    );
    if (retryAfter) redirect.headers.set("Retry-After", String(retryAfter));
    return redirect;
  }

  const formData = await request.formData();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const fullName = (formData.get("fullName") as string)?.trim();

  if (!email || !password || password.length < 6) {
    return NextResponse.redirect(
      new URL("/signup?error=missing", baseUrl),
      302
    );
  }

  const supabase = await createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? baseUrl;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName || undefined },
      emailRedirectTo: `${appUrl}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    return NextResponse.redirect(
      new URL("/signup?error=failed", baseUrl),
      302
    );
  }

  return NextResponse.redirect(new URL("/signup?success=1", baseUrl), 302);
}
