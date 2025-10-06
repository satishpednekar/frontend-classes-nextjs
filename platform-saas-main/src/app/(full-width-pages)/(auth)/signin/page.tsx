import React from "react";

import { AuthCard } from "@/components/auth/AuthCard";

export default function SignIn() {
  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-2 xl:gap-8">
      <div>
        <AuthCard mode="signin" />
      </div>
      <div className="relative hidden overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-50 via-white to-brand-25 p-8 dark:border-gray-800 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 lg:block">
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <img src="/images/logo/logo.svg" alt="Brand logo" className="mb-6 h-10 w-auto dark:hidden" />
          <img src="/images/logo/logo-dark.svg" alt="Brand logo" className="mb-6 hidden h-10 w-auto dark:block" />
          <h2 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white/90">Sign up for free!</h2>
          <p className="max-w-md text-sm text-gray-600 dark:text-gray-400">
            No credit card required. Explore easy time tracking and powerful reporting.
          </p>
        </div>
        <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-3xl bg-brand-500/10 blur-3xl dark:bg-brand-400/10" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-400/10" />
      </div>
    </div>
  );
}
