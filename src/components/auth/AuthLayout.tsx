import { Suspense } from "react";
import { AuthHeader } from "@/components/layout/AuthHeader";

interface AuthLayoutProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthLayout({ children, fallback }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
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
      <div className="relative z-10 flex flex-col flex-1">
        <AuthHeader />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Suspense
            fallback={
              fallback ?? (
                <div className="w-full max-w-md h-80 rounded-2xl border border-neutral-800 bg-neutral-900/50 animate-pulse" />
              )
            }
          >
            <div className="w-full max-w-md card p-8">{children}</div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
