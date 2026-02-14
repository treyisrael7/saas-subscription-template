import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Cached auth fetcher - deduplicates getUser + profile within a single request.
 * Multiple components can call this; only one Supabase request runs.
 */
export const getAuth = cache(async () => {
  const supabase = await createClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && err.code === "refresh_token_not_found") {
      await supabase.auth.signOut();
    }
  }
  const { data: profile } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).single()
    : { data: null };
  return { user, profile };
});
