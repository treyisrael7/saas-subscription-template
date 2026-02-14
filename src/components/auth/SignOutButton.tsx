"use client";

import { useFormStatus } from "react-dom";

interface SignOutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function SignOutButton({ className, children }: SignOutButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Signing out..." : children ?? "Sign out"}
    </button>
  );
}
