"use client";

import React from "react";

import { useOnboardingStore } from "@/stores/onboarding-store";

const STEPS = [
  { label: "Personal", description: "Tell us about you" },
  { label: "Professional", description: "Role & experience" },
  { label: "Learning", description: "Goals & interests" },
  { label: "Plan", description: "Choose your tier" },
  { label: "Complete", description: "Review & finish" },
];

type OnboardingStepperShellProps = {
  children: React.ReactNode;
};

export default function OnboardingStepperShell({ children }: OnboardingStepperShellProps) {
  const stepIndex = useOnboardingStore((state) => state.stepIndex);
  const emailVerified = useOnboardingStore((state) => state.emailVerified);
  const goToPrevStep = useOnboardingStore((state) => state.goToPrevStep);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl gap-8 px-6 py-12 lg:py-16">
      <aside className="hidden w-72 flex-col gap-6 rounded-3xl border border-white/10 bg-white/5/50 p-6 shadow-lg shadow-black/20 backdrop-blur lg:flex">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-300/70">Your progress</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Onboarding Journey</h2>
        </div>
        <ol className="space-y-4">
          {STEPS.map((step, index) => {
            const isActive = index === stepIndex;
            const isCompleted = index < stepIndex;
            return (
              <li
                key={step.label}
                className={`rounded-2xl border border-white/10 p-4 transition ${
                  isActive
                    ? "bg-white/20 text-white"
                    : isCompleted
                    ? "bg-white/10 text-white/80"
                    : "bg-transparent text-white/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${
                      isActive
                        ? "border-white bg-white text-slate-900"
                        : isCompleted
                        ? "border-white/60 bg-white/20"
                        : "border-white/20"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{step.label}</p>
                    <p className="text-xs text-white/70">{step.description}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </aside>

      <section className="flex flex-1 flex-col">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={goToPrevStep}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-white/30 disabled:opacity-40"
            disabled={stepIndex === 0}
          >
            <span aria-hidden>←</span>
            Back
          </button>
          {!emailVerified && (
            <div className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-2 text-xs font-medium text-yellow-200">
              Verify your email to unlock all features.
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col rounded-3xl border border-white/10 bg-white/10/5 p-6 shadow-2xl shadow-black/30 backdrop-blur">
          {children}
        </div>
      </section>
    </div>
  );
}


