import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";

export default function ProjectsPage() {
  return (
    <DashboardPageShell
      title="Projects"
      description="Your projects will appear here. Add your project logic as you build your app."
    >
      <div className="mt-8 card-glassy p-8 text-center">
        <p className="text-neutral-500">No projects yet</p>
      </div>
    </DashboardPageShell>
  );
}
