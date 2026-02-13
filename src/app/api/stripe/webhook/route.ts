import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAuditEvent, AUDIT_EVENTS } from "@/lib/audit";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
]);

function getTierFromPriceId(priceId: string | null): string {
  if (!priceId) return "free";
  if (priceId.includes("pro")) return "pro";
  if (priceId.includes("team")) return "team";
  return "pro";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Missing webhook secret" }, { status: 400 });
    }

    let event: Stripe.Event;
    const stripe = getStripe();
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Webhook error";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (!relevantEvents.has(event.type)) {
      return NextResponse.json({ received: true });
    }

    const supabase = createAdminClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        if (!userId) break;

        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id ?? null;
        const tier = getTierFromPriceId(priceId);

        await supabase
          .from("profiles")
          .update({
            subscription_id: subscriptionId,
            subscription_tier: tier,
            subscription_status: subscription.status,
            subscription_current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        await logAuditEvent(AUDIT_EVENTS.SUBSCRIPTION_CREATED, {
          userId,
          eventData: { subscriptionId, tier, status: subscription.status },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        let targetUserId = subscription.metadata?.supabase_user_id;

        if (!targetUserId) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("subscription_id", subscription.id)
            .single();
          targetUserId = profile?.id ?? undefined;
        }

        if (!targetUserId) break;

        const priceId = subscription.items.data[0]?.price.id ?? null;
        const tier = subscription.status === "active" ? getTierFromPriceId(priceId) : "free";

        await supabase
          .from("profiles")
          .update({
            subscription_tier: tier,
            subscription_status: subscription.status,
            subscription_id: subscription.status === "active" ? subscription.id : null,
            subscription_current_period_end:
              subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000).toISOString()
                : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", targetUserId);

        await logAuditEvent(AUDIT_EVENTS.SUBSCRIPTION_UPDATED, {
          userId: targetUserId,
          eventData: {
            subscriptionId: subscription.id,
            tier,
            status: subscription.status,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("subscription_id", subscription.id)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({
              subscription_tier: "free",
              subscription_status: "canceled",
              subscription_id: null,
              subscription_current_period_end: null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);

          await logAuditEvent(AUDIT_EVENTS.SUBSCRIPTION_CANCELLED, {
            userId: profile.id,
            eventData: { subscriptionId: subscription.id },
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string | null;
        if (!subscriptionId) break;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("subscription_id", subscriptionId)
          .single();

        if (profile) {
          await logAuditEvent(AUDIT_EVENTS.PAYMENT_SUCCEEDED, {
            userId: profile.id,
            eventData: {
              invoiceId: invoice.id,
              amountPaid: invoice.amount_paid,
            },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string | null;
        if (!subscriptionId) break;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("subscription_id", subscriptionId)
          .single();

        if (profile) {
          await logAuditEvent(AUDIT_EVENTS.PAYMENT_FAILED, {
            userId: profile.id,
            eventData: {
              invoiceId: invoice.id,
              attemptCount: invoice.attempt_count,
            },
          });

          await supabase
            .from("profiles")
            .update({
              subscription_status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);

          await logAuditEvent(AUDIT_EVENTS.SUBSCRIPTION_PAST_DUE, {
            userId: profile.id,
            eventData: { subscriptionId },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
