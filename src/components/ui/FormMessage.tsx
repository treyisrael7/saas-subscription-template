interface FormMessageProps {
  type: "success" | "error";
  message: string;
}

export function FormMessage({ type, message }: FormMessageProps) {
  const styles =
    type === "success"
      ? "bg-green-500/10 border border-green-500/20 text-green-200"
      : "bg-red-500/10 border border-red-500/20 text-red-200";

  return (
    <div className={`rounded-lg px-4 py-3 text-sm ${styles}`}>{message}</div>
  );
}
