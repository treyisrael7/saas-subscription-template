"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";
import { SignOutButton } from "@/components/auth/SignOutButton";

interface HeaderProps {
  user?: User | null;
  profile?: Pick<Profile, "subscription_tier"> | null;
}

export function Header({ user = null, profile = null }: HeaderProps) {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-lg font-semibold text-white hover:text-neutral-200 transition-colors"
          >
            SaaS Starter
          </Link>

          <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
            {user && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-neutral-500 text-sm capitalize hidden sm:inline">
                  {profile?.subscription_tier ?? "free"}
                </span>
                <form action="/api/auth/signout" method="POST">
                  <SignOutButton className="btn-ghost px-4 py-2 text-sm">
                    Sign out
                  </SignOutButton>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn-ghost px-4 py-2 text-sm"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Start for free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
