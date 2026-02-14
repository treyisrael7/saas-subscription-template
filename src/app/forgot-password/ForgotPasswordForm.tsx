"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormInput } from "@/components/ui/FormInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { AuthFormError } from "@/components/auth/AuthFormError";
import { AuthSuccessMessage } from "@/components/auth/AuthSuccessMessage";

const ERROR_MESSAGES: Record<string, string> = {
  failed: "Unable to send reset email. Please try again.",
  rate_limited: "Too many attempts. Please try again later.",
  missing: "Please enter your email address.",
};

export function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "1";
  const errorCode = searchParams.get("error");
  const errorMessage = errorCode ? ERROR_MESSAGES[errorCode] : null;
  const [submitting, setSubmitting] = useState(false);

  if (success) {
    return (
      <AuthSuccessMessage
        title="Check your email"
        message="We sent a password reset link to your email address. Click the link to set a new password."
      />
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Reset password</h1>
        <p className="mt-2 text-neutral-400">
          Enter your email and we&apos;ll send you a reset link.{" "}
          <Link href="/login" className="text-white hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>

      <form
        action="/api/auth/forgot-password"
        method="POST"
        className="space-y-6"
        onSubmit={() => setSubmitting(true)}
      >
        {errorMessage && <AuthFormError message={errorMessage} />}
        <FormInput
          id="email"
          name="email"
          label="Email"
          type="email"
          required
          placeholder="you@example.com"
        />
        <SubmitButton disabled={submitting} loading={submitting} loadingText="Sending...">
          Send reset link
        </SubmitButton>
      </form>
    </div>
  );
}
