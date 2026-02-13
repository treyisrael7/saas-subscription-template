import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasAccess } from "@/lib/access";
import type { SubscriptionTier } from "@/types/database";

export default async function AnalyticsPage() {
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
    redirect("/dashboard?upgrade=analytics");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white">Analytics</h1>
      <p className="text-neutral-400 mt-2">Pro feature: Advanced analytics dashboard.</p>
      <div className="mt-8 card-glassy p-12 text-center">
        <p className="text-neutral-500">Charts and metrics go here</p>
      </div>
    </div>
  );
}
