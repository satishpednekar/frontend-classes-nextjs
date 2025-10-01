"use client";

import React, { useEffect, useRef } from "react";

import OnboardingStepperShell from "@/components/onboarding/OnboardingStepperShell";
import StepPersonalDetails from "@/components/onboarding/steps/StepPersonalDetails";
import StepProfessionalDetails from "@/components/onboarding/steps/StepProfessionalDetails";
import StepLearningPreferences from "@/components/onboarding/steps/StepLearningPreferences";
import StepPlanSelection from "@/components/onboarding/steps/StepPlanSelection";
import StepCompletion from "@/components/onboarding/steps/StepCompletion";
import OnboardingLoadingState from "@/components/onboarding/OnboardingLoadingState";
import { useOnboardingStore } from "@/stores/onboarding-store";

const STEPS = [
  StepPersonalDetails,
  StepProfessionalDetails,
  StepLearningPreferences,
  StepPlanSelection,
  StepCompletion,
] as const;

export default function OnboardingJourney() {
  const stepIndex = useOnboardingStore((state) => state.stepIndex);
  const isLoading = useOnboardingStore((state) => state.isLoading);
  const error = useOnboardingStore((state) => state.error);
  const loadInitialContext = useOnboardingStore((state) => state.loadInitialContext);

  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    void loadInitialContext();
  }, [loadInitialContext]);

  if (isLoading) {
    return <OnboardingLoadingState />;
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-6 py-24 text-center">
        <h1 className="text-3xl font-semibold text-white/90">We couldn&apos;t load your journey</h1>
        <p className="text-base text-slate-300">{error}</p>
        <button
          type="button"
          onClick={() => loadInitialContext()}
          className="inline-flex items-center justify-center rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  const ActiveStep = STEPS[stepIndex] ?? StepPersonalDetails;

  return (
    <OnboardingStepperShell>
      <ActiveStep />
    </OnboardingStepperShell>
  );
}


