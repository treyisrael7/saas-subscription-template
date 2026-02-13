export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white">Projects</h1>
      <p className="text-neutral-400 mt-2">
        Your projects will appear here. Add your project logic as you build your app.
      </p>
      <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900/30 p-8 text-center">
        <p className="text-neutral-500">No projects yet</p>
      </div>
    </div>
  );
}
