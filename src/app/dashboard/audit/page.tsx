import { createClient } from "@/lib/supabase/server";
import { requireTier } from "@/lib/requireTier";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { AuditLogList } from "@/components/dashboard/AuditLogList";

export default async function AuditPage() {
  const { user } = await requireTier("pro", "audit");
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <DashboardPageShell
      title="Audit log"
      description="Track subscription and account events."
    >
      <div className="mt-8">
        <AuditLogList logs={logs ?? []} />
      </div>
    </DashboardPageShell>
  );
}
