import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="relative min-h-dvh bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="pointer-events-none absolute -left-20 -top-10 hidden h-72 w-72 rotate-12 rounded-3xl bg-brand-500/5 blur-3xl dark:bg-brand-400/10 sm:block" />
        <div className="pointer-events-none absolute -right-24 bottom-0 hidden h-80 w-80 rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-400/10 sm:block" />
        <div className="relative mx-auto flex min-h-dvh max-w-7xl items-center justify-center px-4 sm:px-6">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
