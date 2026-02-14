interface DashboardPageShellProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Consistent wrapper for dashboard pages: max-width container, padding, optional title/description.
 */
export function DashboardPageShell({
  title,
  description,
  children,
}: DashboardPageShellProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {title && <h1 className="text-2xl font-bold text-white">{title}</h1>}
      {description && <p className="text-neutral-400 mt-2">{description}</p>}
      {children}
    </div>
  );
}
