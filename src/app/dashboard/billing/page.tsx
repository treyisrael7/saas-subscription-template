"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfileContext } from "@/contexts/ProfileContext";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { TIERS } from "@/lib/tiers";

const ALLOW_MANUAL_TIER = process.env.NEXT_PUBLIC_ALLOW_MANUAL_TIER_OVERRIDE === "true";

export default function BillingPage() {
  const router = useRouter();
  const { profile, loading, mutate } = useProfileContext();
  const [portalLoading, setPortalLoading] = useState(false);
  const [tierLoading, setTierLoading] = useState<string | null>(null);
  const [tierError, setTierError] = useState<string | null>(null);

  const handleSetTier = async (tier: string) => {
    if (!ALLOW_MANUAL_TIER) return;
    setTierError(null);
    setTierLoading(tier);
    try {
      const res = await fetch("/api/dev/set-tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update tier");

      const isFree = tier === "free";
      mutate({
        subscription_tier: tier as "free" | "pro" | "team",
        subscription_status: isFree ? null : "active",
        subscription_id: isFree ? null : "manual_override",
        subscription_current_period_end: isFree
          ? null
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      router.refresh();
    } catch (err) {
      setTierError(err instanceof Error ? err.message : "Failed to update tier");
      console.error(err);
    } finally {
      setTierLoading(null);
    }
  };

  const handleOpenPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/billing-portal", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error ?? "Failed to open billing portal");
    } catch (err) {
      console.error(err);
      setPortalLoading(false);
    }
  };

  return (
    <DashboardPageShell
      title="Billing"
      description="Manage your subscription and payment methods."
    >
      <div className="mt-8 card-glassy p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-neutral-500 text-sm">Current plan</p>
            <p className="text-white font-medium capitalize">
              {loading ? "..." : profile?.subscription_tier ?? "free"}
            </p>
          </div>
          <div>
            <p className="text-neutral-500 text-sm">Status</p>
            <p className="text-white font-medium capitalize">
              {loading ? "..." : profile?.subscription_status ?? "active"}
            </p>
          </div>
          {profile?.subscription_current_period_end && (
            <div>
              <p className="text-neutral-500 text-sm">Renews</p>
              <p className="text-white font-medium">
                {new Date(profile.subscription_current_period_end).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-700">
          {profile?.stripe_customer_id ? (
            <button
              onClick={handleOpenPortal}
              disabled={portalLoading}
              className="px-4 py-2 rounded-full btn-primary disabled:opacity-50 text-sm font-medium"
            >
              {portalLoading ? "Opening..." : "Open billing portal"}
            </button>
          ) : (
            <p className="text-neutral-500 text-sm">
              Subscribe to a plan to manage billing.{" "}
              <Link href="/#pricing" className="text-white hover:underline">
                View plans
              </Link>
            </p>
          )}
          <Link
            href="/#pricing"
            className="px-4 py-2 rounded-full btn-ghost text-sm font-medium"
          >
            Change plan
          </Link>
        </div>

        {ALLOW_MANUAL_TIER && (
          <div className="pt-6 mt-6 border-t border-neutral-700">
            <p className="text-neutral-500 text-sm font-medium mb-2">Testing: override plan</p>
            <p className="text-neutral-600 text-xs mb-3">Manually change your tier without Stripe</p>
            {tierError && (
              <p className="text-red-400 text-sm mb-3">{tierError}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {TIERS.map((tier) => {
                const isCurrent = profile?.subscription_tier === tier;
                return (
                  <button
                    key={tier}
                    onClick={() => handleSetTier(tier)}
                    disabled={loading || tierLoading !== null || isCurrent}
                    className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                      isCurrent
                        ? "bg-white/10 text-neutral-400 cursor-default"
                        : "btn-ghost hover:border-purple-500/30"
                    } disabled:opacity-50`}
                  >
                    {tierLoading === tier ? "Updating..." : tier}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardPageShell>
  );
}
