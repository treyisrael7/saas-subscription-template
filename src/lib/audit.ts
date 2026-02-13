import { createAdminClient } from "@/lib/supabase/admin";

export const AUDIT_EVENTS = {
  USER_SIGNUP: "user.signup",
  USER_LOGIN: "user.login",
  USER_LOGOUT: "user.logout",
  PROFILE_UPDATE: "profile.update",
  SUBSCRIPTION_CREATED: "subscription.created",
  SUBSCRIPTION_UPDATED: "subscription.updated",
  SUBSCRIPTION_CANCELLED: "subscription.cancelled",
  SUBSCRIPTION_RENEWED: "subscription.renewed",
  SUBSCRIPTION_PAST_DUE: "subscription.past_due",
  CHECKOUT_STARTED: "checkout.started",
  BILLING_PORTAL_ACCESSED: "billing.portal_accessed",
  PAYMENT_SUCCEEDED: "payment.succeeded",
  PAYMENT_FAILED: "payment.failed",
} as const;

export type AuditEventType = (typeof AUDIT_EVENTS)[keyof typeof AUDIT_EVENTS];

export async function logAuditEvent(
  eventType: AuditEventType,
  data: {
    userId?: string;
    eventData?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }
) {
  const supabase = createAdminClient();

  await supabase.from("audit_logs").insert({
    user_id: data.userId ?? null,
    event_type: eventType,
    event_data: data.eventData ?? {},
    ip_address: data.ipAddress ?? null,
    user_agent: data.userAgent ?? null,
  });
}
