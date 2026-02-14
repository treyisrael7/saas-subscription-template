# SaaS Subscription Template

Next.js 15 + Supabase + Stripe. Auth, tiered subscriptions, billing portal, audit logging.

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with Supabase and Stripe keys. Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor.

```bash
npm run dev
```

## Testing tier override

Set `NEXT_PUBLIC_ALLOW_MANUAL_TIER_OVERRIDE=true` in `.env.local` to toggle plans from Dashboard → Billing without Stripe. Do not use in production.
