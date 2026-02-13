import { Suspense } from "react";
import { AuthHeader } from "@/components/layout/AuthHeader";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="w-full max-w-md h-80 rounded-2xl border border-neutral-800 bg-neutral-900/50 animate-pulse" />}>
          <div className="w-full max-w-md card p-8">
            <LoginForm />
          </div>
        </Suspense>
      </main>
    </div>
  );
}
