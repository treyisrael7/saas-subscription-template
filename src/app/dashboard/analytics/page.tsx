import { requireTier } from "@/lib/requireTier";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";

export default async function AnalyticsPage() {
  await requireTier("pro", "analytics");

  return (
    <DashboardPageShell
      title="Analytics"
      description="Pro feature: Advanced analytics dashboard."
    >
      <div className="mt-8 card-glassy p-12 text-center">
        <p className="text-neutral-500">Charts and metrics go here</p>
      </div>
    </DashboardPageShell>
  );
}
