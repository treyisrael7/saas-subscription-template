import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAuditEvent, AUDIT_EVENTS } from "@/lib/audit";

export async function POST() {
  try {
    const auth = await requireAuth();
    if ("unauthorized" in auth) return auth.unauthorized;
    const { user } = auth;

    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No billing account found. Subscribe to a plan first." },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const stripe = getStripe();

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${appUrl}/dashboard`,
    });

    await logAuditEvent(AUDIT_EVENTS.BILLING_PORTAL_ACCESSED, {
      userId: user.id,
      eventData: { sessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Billing portal error:", err);
    return NextResponse.json(
      { error: "Failed to create billing portal session" },
      { status: 500 }
    );
  }
}
