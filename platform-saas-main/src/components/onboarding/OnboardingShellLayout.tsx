import React from "react";

type OnboardingShellLayoutProps = {
  children: React.ReactNode;
};

export default function OnboardingShellLayout({ children }: OnboardingShellLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>
      {children}
    </div>
  );
}

