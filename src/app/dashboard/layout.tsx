import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getAuth();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Ambient background – same as landing page */}
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
        <DashboardNav />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
