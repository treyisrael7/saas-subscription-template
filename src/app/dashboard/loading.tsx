export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-neutral-800 bg-neutral-950/90 h-14 animate-pulse" />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-neutral-800 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-neutral-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-neutral-800/30 rounded-xl animate-pulse" />
        </div>
      </main>
    </div>
  );
}
