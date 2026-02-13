import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasAccess } from "@/lib/access";
import type { SubscriptionTier } from "@/types/database";
import { AuditLogList } from "@/components/dashboard/AuditLogList";

export default async function AuditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const tier = (profile?.subscription_tier ?? "free") as SubscriptionTier;
  if (!hasAccess(tier, "pro")) {
    redirect("/dashboard?upgrade=audit");
  }

  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white">Audit log</h1>
      <p className="text-neutral-400 mt-2">
        Track subscription and account events.
      </p>
      <div className="mt-8">
        <AuditLogList logs={logs ?? []} />
      </div>
    </div>
  );
}
