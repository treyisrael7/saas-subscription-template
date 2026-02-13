"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { hasAccess } from "@/lib/access";
import type { SubscriptionTier } from "@/types/database";

const navItems: { href: string; label: string; minTier?: SubscriptionTier }[] = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/analytics", label: "Analytics", minTier: "pro" },
  { href: "/dashboard/team", label: "Team", minTier: "team" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/dashboard/audit", label: "Audit log", minTier: "pro" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { profile } = useProfile();

  const tier = (profile?.subscription_tier ?? "free") as SubscriptionTier;

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/dashboard" className="text-lg font-semibold text-white">
            Dashboard
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const show = !item.minTier || hasAccess(tier, item.minTier);

              if (!show) return null;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-neutral-500 text-sm capitalize">{tier}</span>
            <Link href="/" className="text-neutral-400 hover:text-white text-sm transition-colors">
              Home
            </Link>
            <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-neutral-400 hover:text-white text-sm transition-colors"
            >
              Sign out
            </button>
          </form>
          </div>
        </div>
      </div>
    </header>
  );
}
