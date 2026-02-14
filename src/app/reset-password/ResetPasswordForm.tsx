"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/ui/FormInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { AuthFormError } from "@/components/auth/AuthFormError";
import { AuthSuccessMessage } from "@/components/auth/AuthSuccessMessage";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        setError("Your reset link may have expired. Please request a new one.");
      } else {
        setError(data.error ?? "Failed to reset password");
      }
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
    setTimeout(() => router.push("/login"), 2000);
  };

  if (success) {
    return (
      <AuthSuccessMessage
        title="Password updated"
        message="Your password has been reset. Redirecting you to sign in..."
        linkText="Sign in now"
      />
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Set new password</h1>
        <p className="mt-2 text-neutral-400">
          Enter your new password below.{" "}
          <Link href="/login" className="text-white hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <AuthFormError message={error} />}
        <FormInput
          id="password"
          name="password"
          label="New password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
        />
        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          type="password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
        />
        <SubmitButton disabled={submitting} loading={submitting} loadingText="Updating...">
          Update password
        </SubmitButton>
      </form>
    </div>
  );
}
