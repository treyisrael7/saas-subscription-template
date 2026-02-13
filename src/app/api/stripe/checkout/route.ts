import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAuditEvent, AUDIT_EVENTS } from "@/lib/audit";
import { PLANS, type SubscriptionTier } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId, tier } = (await request.json()) as {
      priceId?: string;
      tier?: SubscriptionTier;
    };

    if (!priceId && !tier) {
      return NextResponse.json(
        { error: "priceId or tier required" },
        { status: 400 }
      );
    }

    const plan = tier ? PLANS[tier] : null;
    const finalPriceId = priceId ?? plan?.priceId;

    if (!finalPriceId) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const stripe = getStripe();
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await adminClient
        .from("profiles")
        .update({
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: finalPriceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        tier: tier ?? "pro",
      },
      subscription_data: {
        metadata: { supabase_user_id: user.id },
        trial_period_days: 0,
      },
    });

    await logAuditEvent(AUDIT_EVENTS.CHECKOUT_STARTED, {
      userId: user.id,
      eventData: { sessionId: session.id, tier: tier ?? "pro" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
