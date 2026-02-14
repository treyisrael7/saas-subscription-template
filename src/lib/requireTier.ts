import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { hasAccess } from "@/lib/access";
import type { SubscriptionTier } from "@/types/database";

/**
 * Server-only helper for pages that require auth and a minimum subscription tier.
 * Returns { user, profile } or redirects to /login or /dashboard?upgrade=<key>.
 */
export async function requireTier(
  minTier: SubscriptionTier,
  upgradeKey?: string
): Promise<{ user: NonNullable<Awaited<ReturnType<typeof getAuth>>["user"]>; profile: Awaited<ReturnType<typeof getAuth>>["profile"] }> {
  const { user, profile } = await getAuth();

  if (!user) redirect("/login");

  const tier = (profile?.subscription_tier ?? "free") as SubscriptionTier;
  if (!hasAccess(tier, minTier)) {
    redirect(upgradeKey ? `/dashboard?upgrade=${upgradeKey}` : "/dashboard");
  }

  return { user, profile };
}
