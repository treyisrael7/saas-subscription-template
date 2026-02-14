import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAuditEvent, AUDIT_EVENTS } from "@/lib/audit";
import { TIERS } from "@/lib/tiers";
import type { SubscriptionTier } from "@/types/database";

/**
 * Manual tier override for testing – bypasses Stripe.
 * Enable by setting ALLOW_MANUAL_TIER_OVERRIDE=true in .env.local
 */
export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_ALLOW_MANUAL_TIER_OVERRIDE !== "true") {
    return NextResponse.json({ error: "Manual tier override is disabled" }, { status: 403 });
  }

  try {
    const auth = await requireAuth();
    if ("unauthorized" in auth) return auth.unauthorized;
    const { user } = auth;

    const { tier } = (await request.json()) as { tier?: string };

    if (!tier || !TIERS.includes(tier as SubscriptionTier)) {
      return NextResponse.json(
        { error: `tier must be one of: ${TIERS.join(", ")}` },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const isFree = tier === "free";
    const { error } = await adminClient
      .from("profiles")
      .update({
        subscription_tier: tier,
        subscription_status: isFree ? null : "active",
        subscription_id: isFree ? null : "manual_override",
        subscription_current_period_end: isFree ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logAuditEvent(AUDIT_EVENTS.PROFILE_UPDATE, {
      userId: user.id,
      eventData: { subscription_tier: tier, source: "manual_override" },
    });

    return NextResponse.json({ success: true, tier });
  } catch (err) {
    console.error("Set tier error:", err);
    return NextResponse.json({ error: "Failed to update tier" }, { status: 500 });
  }
}
