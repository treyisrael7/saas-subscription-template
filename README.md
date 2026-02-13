# SaaS Subscription Template

A reusable SaaS starter built with **Next.js 15**, **TypeScript**, **Supabase**, and **Stripe**. Features authentication, tiered subscriptions, billing portal, and audit logging.

## Features

- **Supabase Auth** – Email/password signup and login with profiles auto-created on signup
- **Stripe Checkout** – Subscription checkout sessions synced to PostgreSQL via webhooks
- **Stripe Billing Portal** – Manage subscriptions, payment methods, and invoices
- **Tiered Access** – Free, Pro, Team, Enterprise with feature gating
- **Protected Routes** – 6+ dashboard routes (Overview, Projects, Analytics, Team, Billing, Settings, Audit)
- **Audit Logging** – 10+ events: signup, login, checkout, subscription lifecycle, payments, billing portal

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in your keys:

```bash
cp .env.local.example .env.local
```

**Supabase**

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Use the `service_role` key for `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose)

**Stripe**

1. Create an account at [stripe.com](https://stripe.com)
2. Create products and prices in Dashboard → Products (e.g. Pro $19/mo, Team $49/mo)
3. Add price IDs to `.env.local`:

```
STRIPE_PRO_PRICE_ID=price_xxxxx
STRIPE_TEAM_PRICE_ID=price_xxxxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxxxx
```

4. Get `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` from Developers → API keys
5. For webhooks: Developers → Webhooks → Add endpoint → `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
   - For local dev, use [Stripe CLI](https://stripe.com/docs/stripe-cli): `stripe listen --forward-to localhost:3000/api/stripe/webhook`

**App URL**

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database setup

In Supabase SQL Editor, run the migration:

```bash
# Or use Supabase CLI: supabase db push
```

Copy the contents of `supabase/migrations/001_initial_schema.sql` and run it in the SQL Editor.

### 4. Run the app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Performance

- **Auth deduplication** – `getAuth()` uses React `cache()` so multiple components share one auth fetch per request
- **Font optimization** – Inter uses `display: swap` for faster text render
- **Preconnect** – Supabase domain is preconnected for quicker API calls
- **Loading states** – `loading.tsx` skeletons for dashboard and root for instant feedback
- **Package imports** – Supabase packages are tree-shaken via `optimizePackageImports`

## Security

- **Rate limiting** – Auth endpoints (login, signup) limit to 5 attempts per 15 minutes per IP. In-memory by default; for multi-instance production, use [Upstash Redis](https://upstash.com).
- **Server-side auth** – Login and signup run on the server; no credentials in client-side JS.
- **Generic error messages** – Auth errors use codes (`invalid`, `rate_limited`, `missing`) to avoid account enumeration.
- **RLS** – Supabase Row Level Security restricts data access by user.

## Customization

1. **Plans** – Edit `src/lib/stripe.ts` to change plan names, features, and map to your Stripe price IDs
2. **Tiers** – Update `subscription_tier` enum in the migration and `PLANS` in `stripe.ts`
3. **Audit events** – Add events in `src/lib/audit.ts` and call `logAuditEvent()` where needed