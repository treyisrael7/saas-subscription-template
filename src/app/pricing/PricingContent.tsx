"use client";

import { useState } from "react";
import Link from "next/link";
import { PLANS } from "@/lib/stripe";
import type { User } from "@supabase/supabase-js";
import type { SubscriptionTier } from "@/types/database";

interface PricingContentProps {
  user: User | null;
  profile: { subscription_tier: SubscriptionTier } | null;
}

const PRICES: Record<string, { monthly: string; annual: string }> = {
  free: { monthly: "$0", annual: "$0" },
  pro: { monthly: "$19", annual: "$15" },
  team: { monthly: "$49", annual: "$39" },
};

/** 3 main plans for display: Free, Pro (middle/emphasized), Team */
const DISPLAY_TIERS: (keyof typeof PLANS)[] = ["free", "pro", "team"];

export function PricingContent({ user, profile }: PricingContentProps) {
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const handleSubscribe = async (tier: keyof typeof PLANS) => {
    const plan = PLANS[tier];
    if (!plan.priceId || tier === "free") return;

    setCheckoutLoading(tier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error ?? "Failed to create checkout");
    } catch (err) {
      console.error(err);
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto relative z-10">
      <div className="text-center mb-14">
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          Plans Built for Growth
        </h1>
        <p className="mt-4 text-neutral-400 text-lg max-w-2xl mx-auto">
          Get access to powerful tools to manage your sales, boost productivity, and delight your customers.
        </p>

        {/* Segmented toggle - glassy */}
        <div className="mt-10 inline-flex rounded-full p-1 border border-white/[0.1] bg-white/[0.03] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              billingCycle === "monthly"
                ? "bg-white/10 text-white border border-white/20 shadow-[0_0_20px_-5px_rgba(255,255,255,0.15)]"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annual")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              billingCycle === "annual"
                ? "bg-white/10 text-white border border-white/20 shadow-[0_0_20px_-5px_rgba(255,255,255,0.15)]"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Yearly <span className="text-emerald-400/90">(20% save)</span>
          </button>
        </div>
      </div>

      {/* 3 pricing cards - middle (Pro) emphasized */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DISPLAY_TIERS.map((tier) => {
          const plan = PLANS[tier];
          const isCurrent = profile?.subscription_tier === tier;
          const isPaid = tier !== "free";
          const isMiddle = tier === "pro";
          const prices = PRICES[tier] ?? { monthly: "—", annual: "—" };
          const price = billingCycle === "monthly" ? prices.monthly : prices.annual;

          return (
            <div
              key={tier}
              className={`relative rounded-2xl border backdrop-blur-2xl flex flex-col min-h-[360px] transition-all duration-300 ${
                isMiddle
                  ? "card-glassy border-white/[0.14] scale-[1.02] md:scale-105 shadow-[0_0_60px_-20px_rgba(168,85,247,0.2)] z-10"
                  : "card border-white/[0.08] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05]"
              }`}
            >
              {isMiddle && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
                  Most popular
                </div>
              )}
              <div className={`p-6 sm:p-8 flex flex-col flex-1 ${isMiddle ? "pt-10" : ""}`}>
                <h3 className="text-lg font-semibold text-white capitalize">
                  {plan.name} plan
                </h3>
                <p className="text-neutral-500 text-sm mt-1">
                  {tier === "free" && "Best for getting started"}
                  {tier === "pro" && "For growing teams"}
                  {tier === "team" && "For scaling teams"}
                </p>
                <p className="mt-6 text-3xl sm:text-4xl font-bold text-white">
                  {price}
                </p>
                <p className="text-neutral-500 text-sm">
                  {tier === "free" ? "/month" : "/month"}
                </p>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-neutral-400 text-sm">
                      <span className="text-emerald-500/80 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  {isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 rounded-full bg-white/5 text-neutral-500 text-sm font-medium cursor-not-allowed border border-white/5"
                    >
                      Current plan
                    </button>
                  ) : isPaid && user ? (
                    <button
                      onClick={() => handleSubscribe(tier)}
                      disabled={!!checkoutLoading}
                      className={`w-full py-2.5 rounded-full text-sm font-medium disabled:opacity-50 transition-all ${
                        isMiddle ? "btn-glassy" : "btn-ghost"
                      }`}
                    >
                      {checkoutLoading === tier ? "Redirecting..." : "Get started"}
                    </button>
                  ) : isPaid ? (
                    <Link
                      href="/login"
                      className={`block w-full py-2.5 rounded-full text-center text-sm font-medium ${
                        isMiddle ? "btn-glassy" : "btn-ghost"
                      }`}
                    >
                      Sign in to subscribe
                    </Link>
                  ) : (
                    <Link
                      href="/signup"
                      className={`block w-full py-2.5 rounded-full text-center text-sm font-medium ${
                        isMiddle ? "btn-glassy" : "btn-ghost"
                      }`}
                    >
                      Get started
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {(user && profile?.subscription_tier === "free") || !user ? (
        <div className="mt-14 text-center">
          {user ? (
            <button
              onClick={() => handleSubscribe("pro")}
              disabled={!!checkoutLoading}
              className="btn-primary px-10 py-4 text-lg font-semibold disabled:opacity-50"
            >
              {checkoutLoading === "pro" ? "Redirecting..." : "Upgrade now"}
            </button>
          ) : (
            <Link
              href="/signup"
              className="btn-primary inline-block px-10 py-4 text-lg font-semibold"
            >
              Start for free
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
}
