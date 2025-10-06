"use client";

import React, { useState } from "react";

import { useOnboardingModal } from "@/context/OnboardingModalContext";
import { useOnboardingStore } from "@/stores/onboarding-store";

type ProfileSummary = {
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  jobTitle: string | null;
  learningGoals: string[] | null;
  interests: string[] | null;
};

type CompletionStatus = {
  percentage: number;
  completed: boolean;
};

type ProfileCompletionButtonProps = {
  profile: ProfileSummary | null;
  completion: CompletionStatus;
};

export default function ProfileCompletionButton({ profile, completion }: ProfileCompletionButtonProps) {
  const { open } = useOnboardingModal();
  const markVisible = useOnboardingStore((state) => state.markVisible);
  const [isOpening, setIsOpening] = useState(false);

  if (completion.completed) return null;

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-dashed border-brand-300 bg-brand-50/60 p-6 dark:border-brand-400/40 dark:bg-brand-500/10">
      <div className="flex flex-wrap items-center gap-3 text-brand-700 dark:text-brand-200">
        <div>
          <h2 className="text-lg font-semibold">Complete your profile</h2>
          <p className="text-sm text-brand-600/80 dark:text-brand-100/80">
            Tell us more about yourself to personalize recommendations.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setIsOpening(true);
          void markVisible()
            .catch(() => undefined)
            .finally(() => {
              open();
              setIsOpening(false);
            });
        }}
        className="inline-flex max-w-xs items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isOpening}
      >
        {isOpening ? "Opening…" : "Finish profile setup"}
      </button>

      <ul className="mt-3 space-y-1 text-sm text-brand-700/80 dark:text-brand-200/80">
        {!profile?.firstName && <li>• Add your personal details</li>}
        {!profile?.jobTitle && <li>• Share your professional background</li>}
        {(!profile?.learningGoals || profile.learningGoals.length === 0) && <li>• Select your learning goals</li>}
        {(!profile?.interests || profile.interests.length === 0) && <li>• Choose the topics you’re interested in</li>}
      </ul>
    </div>
  );
}


