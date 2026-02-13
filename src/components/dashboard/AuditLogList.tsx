import type { AuditLog } from "@/types/database";

export function AuditLogList({ logs }: { logs: AuditLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="card-glassy p-12 text-center">
        <p className="text-neutral-500">No events yet</p>
      </div>
    );
  }

  const formatEventType = (type: string) => {
    return type
      .replace(/\./g, " ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="card-glassy overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left py-3 px-4 text-neutral-400 font-medium">Event</th>
              <th className="text-left py-3 px-4 text-neutral-400 font-medium">Time</th>
              <th className="text-left py-3 px-4 text-neutral-400 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-neutral-800">
                <td className="py-3 px-4 text-white font-medium">
                  {formatEventType(log.event_type)}
                </td>
                <td className="py-3 px-4 text-neutral-400 text-sm">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-neutral-500 text-sm">
                  {Object.keys(log.event_data ?? {}).length > 0 ? (
                    <code className="text-xs">
                      {JSON.stringify(log.event_data)}
                    </code>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
