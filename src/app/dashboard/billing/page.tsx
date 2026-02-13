"use client";

import { useState } from "react";
import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";

export default function BillingPage() {
  const { profile, loading } = useProfile();
  const [portalLoading, setPortalLoading] = useState(false);

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white">Billing</h1>
      <p className="text-neutral-400 mt-2">
        Manage your subscription and payment methods.
      </p>

      <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-6">
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
              <Link href="/pricing" className="text-white hover:underline">
                View plans
              </Link>
            </p>
          )}
          <Link
            href="/pricing"
            className="px-4 py-2 rounded-full btn-ghost text-sm font-medium"
          >
            Change plan
          </Link>
        </div>
      </div>
    </div>
  );
}
