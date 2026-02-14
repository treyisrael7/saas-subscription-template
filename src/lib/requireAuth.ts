import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

type AuthResult =
  | { user: User; supabase: SupabaseClient }
  | { unauthorized: NextResponse };

/**
 * For API routes: get authenticated user or 401 response.
 * Returns { user, supabase } on success, or { unauthorized } to return early.
 */
export async function requireAuth(): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      unauthorized: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user, supabase };
}
