import { Suspense } from "react";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";

export default function DashboardPage() {
  return (
    <DashboardPageShell>
      <Suspense fallback={<div className="animate-pulse h-32 rounded-xl border border-neutral-800 bg-neutral-900/30" />}>
        <DashboardOverview />
      </Suspense>
    </DashboardPageShell>
  );
}
