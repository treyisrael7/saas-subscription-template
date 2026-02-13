import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

export const PLANS = {
  free: {
    name: "Free",
    priceId: null,
    features: ["1 project", "Basic analytics", "Community support"],
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "API access",
    ],
  },
  team: {
    name: "Team",
    priceId: process.env.STRIPE_TEAM_PRICE_ID || "price_team",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Shared workspaces",
      "SSO (coming soon)",
    ],
  },
  enterprise: {
    name: "Enterprise",
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise",
    features: [
      "Everything in Team",
      "Custom contracts",
      "Dedicated support",
      "SLA guarantee",
    ],
  },
} as const;

export type SubscriptionTier = keyof typeof PLANS;
