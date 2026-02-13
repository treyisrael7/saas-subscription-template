import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAuthRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const { allowed, retryAfter } = checkAuthRateLimit(request);
  const baseUrl = new URL(request.url).origin;

  if (!allowed) {
    const redirect = NextResponse.redirect(
      new URL("/login?error=rate_limited", baseUrl),
      302
    );
    if (retryAfter) redirect.headers.set("Retry-After", String(retryAfter));
    return redirect;
  }

  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email?.trim() || !password) {
    return NextResponse.redirect(
      new URL("/login?error=missing", baseUrl),
      302
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=invalid", baseUrl),
      302
    );
  }

  return NextResponse.redirect(new URL("/dashboard", baseUrl), 302);
}
