import Link from "next/link";
import { getAuth } from "@/lib/auth";
import { AuthHeader } from "@/components/layout/AuthHeader";
import HeroDashboardPreview from "@/components/HeroDashboardPreview";
import { PricingContent } from "@/app/pricing/PricingContent";

export default async function HomePage() {
  const { user, profile } = await getAuth();

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Ambient background */}
      <div className="ambient-blobs" aria-hidden>
        <div className="ambient-blob" />
        <div className="ambient-blob" />
        <div className="ambient-blob" />
        <div className="ambient-blob" />
      </div>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 85% 30%, rgba(88, 28, 135, 0.18), transparent 50%), radial-gradient(ellipse 70% 70% at 75% 80%, rgba(14, 116, 144, 0.12), transparent 45%), radial-gradient(ellipse 60% 80% at 15% 50%, rgba(180, 83, 9, 0.08), transparent 50%)",
        }}
      />
      <div className="page-vignette" aria-hidden />
      <div className="noise-overlay" aria-hidden />

      <div className="relative z-10">
        <AuthHeader />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 md:pb-24">
          {/* Hero section */}
          <section className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16">
              <div className="flex-1 max-w-2xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                  Affordable Pricing
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-xl leading-relaxed">
                  Get access to powerful tools to manage your sales, boost productivity, and delight your customers at every stage of growth.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/signup"
                    className="btn-primary inline-flex items-center px-6 py-3.5 text-base font-semibold"
                  >
                    Start for free
                  </Link>
                  <a
                    href="#pricing"
                    className="btn-ghost inline-flex items-center px-6 py-3.5 text-base"
                  >
                    View pricing
                  </a>
                </div>
              </div>

              <div className="relative z-10 flex-shrink-0 w-full lg:w-[460px] lg:min-w-[460px] h-[360px] lg:h-[520px] rounded-2xl overflow-hidden dashboard-preview-wrapper">
                <HeroDashboardPreview className="absolute inset-0" />
              </div>
            </div>
          </section>

          {/* Feature cards */}
          <section className="mt-32 max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10">
              Built for growth
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                title="Supabase Auth"
                description="Email/password, magic links, OAuth. Profiles auto-created on signup."
              />
              <FeatureCard
                title="Stripe Subscriptions"
                description="Checkout, webhooks, billing portal. Syncs to PostgreSQL."
              />
              <FeatureCard
                title="Tiered Access"
                description="Free, Pro, Team, Enterprise. RLS and feature gating built-in."
              />
            </div>
          </section>

          {/* Pricing section */}
          <section id="pricing" className="mt-32 scroll-mt-24">
            <PricingContent user={user} profile={profile} />
          </section>
        </main>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="card-glassy p-6 sm:p-8 transition-all duration-300">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
