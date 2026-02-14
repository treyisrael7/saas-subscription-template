"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormInput } from "@/components/ui/FormInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { AuthFormError } from "@/components/auth/AuthFormError";

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Invalid email or password.",
  rate_limited: "Too many attempts. Please try again later.",
  missing: "Please provide email and password.",
};

export function LoginForm() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const errorMessage = errorCode ? ERROR_MESSAGES[errorCode] : null;
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Sign in</h1>
        <p className="mt-2 text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <form
        action="/api/auth/login"
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
        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          required
          placeholder="Your password"
          labelRight={
            <Link href="/forgot-password" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Forgot password?
            </Link>
          }
        />
        <SubmitButton disabled={submitting} loading={submitting} loadingText="Signing in...">
          Sign in
        </SubmitButton>
      </form>
    </div>
  );
}
