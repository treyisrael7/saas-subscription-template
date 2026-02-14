import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAuditEvent, AUDIT_EVENTS } from "@/lib/audit";
import { PLANS, type SubscriptionTier } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if ("unauthorized" in auth) return auth.unauthorized;
    const { user } = auth;

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

    if (finalPriceId.startsWith("prod_")) {
      return NextResponse.json(
        {
          error:
            "Stripe expects a price ID (price_xxx), not a product ID (prod_xxx). Get the price ID from Stripe Dashboard → Products → your product → Pricing.",
        },
        { status: 400 }
      );
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
      cancel_url: `${appUrl}/?checkout=cancelled#pricing`,
      metadata: {
        supabase_user_id: user.id,
        tier: tier ?? "pro",
      },
      subscription_data: {
        metadata: { supabase_user_id: user.id },
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
