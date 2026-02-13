export type SubscriptionTier = "free" | "pro" | "team" | "enterprise";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  stripe_customer_id: string | null;
  subscription_tier: SubscriptionTier;
  subscription_id: string | null;
  subscription_status: string | null;
  subscription_current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  event_type: string;
  event_data: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
