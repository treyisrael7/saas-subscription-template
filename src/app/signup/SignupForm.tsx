"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ERROR_MESSAGES: Record<string, string> = {
  failed: "Unable to create account. Please try again.",
  rate_limited: "Too many attempts. Please try again later.",
  missing: "Please provide all required fields.",
};

export function SignupForm() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "1";
  const errorCode = searchParams.get("error");
  const errorMessage = errorCode ? ERROR_MESSAGES[errorCode] : null;
  const [submitting, setSubmitting] = useState(false);

  if (success) {
    return (
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-2xl font-bold text-white">Check your email</h1>
        <p className="text-neutral-400">
          We sent a confirmation link to your email address. Click the link to activate your account.
        </p>
        <Link
          href="/login"
          className="inline-block text-white hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Create account</h1>
        <p className="mt-2 text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <form
        action="/api/auth/signup"
        method="POST"
        className="space-y-6"
        onSubmit={() => setSubmitting(true)}
      >
        {errorMessage && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 text-sm">
            {errorMessage}
          </div>
        )}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-neutral-300 mb-1">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600"
            placeholder="At least 6 characters"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-full btn-primary disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </div>
  );
}
