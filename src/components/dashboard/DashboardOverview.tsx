"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useProfileContext } from "@/contexts/ProfileContext";

export function DashboardOverview() {
  const { profile, user, mutate } = useProfileContext();
  const searchParams = useSearchParams();
  const checkoutSuccess = searchParams.get("checkout") === "success";

  useEffect(() => {
    if (checkoutSuccess) mutate();
  }, [checkoutSuccess, mutate]);

  return (
    <div className="space-y-8">
      {checkoutSuccess && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 px-4 py-3 backdrop-blur-sm">
          Subscription activated! Your plan is now active.
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {profile?.full_name || user?.email?.split("@")[0] || "User"}
        </h1>
        <p className="text-neutral-400 mt-1">
          You&apos;re on the <span className="capitalize text-neutral-300">{profile?.subscription_tier ?? "free"}</span> plan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Projects"
          description="Manage your projects"
          href="/dashboard/projects"
        />
        <Card
          title="Billing"
          description="Manage subscription & payment"
          href="/dashboard/billing"
        />
        <Card
          title="Settings"
          description="Account & preferences"
          href="/dashboard/settings"
        />
      </div>

      <div className="card-glassy p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Plan" value={profile?.subscription_tier ?? "free"} />
          <Stat label="Status" value={profile?.subscription_status ?? "active"} />
          <Stat
            label="Period end"
            value={
              profile?.subscription_current_period_end
                ? new Date(profile.subscription_current_period_end).toLocaleDateString()
                : "—"
            }
          />
          <Stat label="Email" value={user?.email ?? "—"} />
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="card-glassy block p-6 sm:p-8 transition-all duration-300"
    >
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-neutral-400 text-sm mt-1">{description}</p>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-neutral-500 text-sm">{label}</p>
      <p className="text-white font-medium capitalize">{value}</p>
    </div>
  );
}
