import React from "react";

export default function OnboardingLoadingState() {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-white">Preparing your personalized journey…</h1>
        <p className="mt-2 text-sm text-slate-300/80">
          We’re loading your profile data and crafting a bespoke onboarding experience.
        </p>
      </div>
    </div>
  );
}


