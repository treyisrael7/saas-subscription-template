import type { SubscriptionTier } from "@/types/database";

const TIER_HIERARCHY: Record<SubscriptionTier, number> = {
  free: 0,
  pro: 1,
  team: 2,
  enterprise: 3,
};

export function hasAccess(
  userTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean {
  return TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[requiredTier];
}

export function canAccessFeature(
  userTier: SubscriptionTier,
  feature: "api" | "team" | "sso" | "priority_support"
): boolean {
  const featureTiers: Record<string, SubscriptionTier> = {
    api: "pro",
    team: "team",
    sso: "team",
    priority_support: "pro",
  };
  return hasAccess(userTier, featureTiers[feature] ?? "free");
}
