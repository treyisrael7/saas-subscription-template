import { requireTier } from "@/lib/requireTier";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";

export default async function TeamPage() {
  await requireTier("team", "team");

  return (
    <DashboardPageShell
      title="Team"
      description="Team plan: Invite and manage team members."
    >
      <div className="mt-8 card-glassy p-12 text-center">
        <p className="text-neutral-500">Team management UI goes here</p>
      </div>
    </DashboardPageShell>
  );
}
