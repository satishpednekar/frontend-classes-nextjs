"use client";

import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import Button from "@/components/ui/button/Button";
import type { SubscriptionPlanTier } from "@/types/onboarding";
import { useOnboardingStore } from "@/stores/onboarding-store";

const PLAN_LABELS: Record<SubscriptionPlanTier, { title: string; price: string; summary: string; description: string }> = {
  FREE: {
    title: "Free",
    price: "$0",
    summary: "10 AI credits / month",
    description: "Core platform access, starter journey, and community features.",
  },
  PRO: {
    title: "Pro",
    price: "$19",
    summary: "100 AI credits / month",
    description: "Full AI personalization, premium content, and monthly assessments.",
  },
  PRO_PLUS: {
    title: "Pro Plus",
    price: "$49",
    summary: "500 AI credits / month",
    description: "Concierge guidance, BYOK support, and weekly AI skill reviews.",
  },
};

const EXPERIENCE_LABELS: Record<number, string> = {
  0: "Not specified",
  1: "< 1 year",
  2: "1-3 years",
  3: "3-5 years",
  4: "5-10 years",
  5: "10+ years",
};

export default function StepCompletion() {
  const { personal, professional, learning, planTier, submitStep, goToPrevStep, isLoading } = useOnboardingStore(
    (state) => ({
      personal: state.personal,
      professional: state.professional,
      learning: state.learning,
      planTier: state.planTier,
      submitStep: state.submitStep,
      goToPrevStep: state.goToPrevStep,
      isLoading: state.isLoading,
    }),
  );

  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const planLabel = useMemo(() => PLAN_LABELS[planTier] ?? PLAN_LABELS.FREE, [planTier]);

  const displayName = useMemo(() => {
    if (personal.displayName.trim()) return personal.displayName;
    return `${personal.firstName} ${personal.lastName}`.trim();
  }, [personal.displayName, personal.firstName, personal.lastName]);

  const handleFinish = async () => {
    setMessage(null);
    try {
      await submitStep();
      router.push("/dashboard");
    } catch (error) {
      setMessage((error as Error).message || "We couldn’t mark you as complete.");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold text-white">You’re all set! 🎉</h1>
        <p className="text-sm text-white/70">
          Review your selections below. We’ll take you to your dashboard and generate your first personalized journey.
        </p>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">Personal profile</h2>
          <div className="space-y-2 text-sm text-white/90">
            <p>
              <span className="block text-xs uppercase text-white/50">Name</span>
              {displayName || "Not provided"}
            </p>
            <p>
              <span className="block text-xs uppercase text-white/50">Location</span>
              {personal.country
                ? personal.city
                  ? `${personal.city}, ${personal.country}`
                  : personal.country
                : "Not provided"}
            </p>
            <p>
              <span className="block text-xs uppercase text-white/50">Timezone</span>
              {personal.timezone || "Not provided"}
            </p>
            <p>
              <span className="block text-xs uppercase text-white/50">Preferred language</span>
              {personal.language ? personal.language.toUpperCase() : "Not specified"}
            </p>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">Professional snapshot</h2>
          <div className="space-y-2 text-sm text-white/90">
            <p>
              <span className="block text-xs uppercase text-white/50">Role</span>
              {professional.jobTitle || "Not specified"}
            </p>
            <p>
              <span className="block text-xs uppercase text-white/50">Company</span>
              {professional.company || "Not specified"}
            </p>
            <p>
              <span className="block text-xs uppercase text-white/50">Experience</span>
              {EXPERIENCE_LABELS[professional.yearsExperience ?? 0]}
            </p>
            <p>
              <span className="block text-xs uppercase text-white/50">Domain</span>
              {professional.domain || "Not specified"}
            </p>
            <p>
              <span className="block text-xs uppercase text-white/50">Industry</span>
              {professional.industry || "Not specified"}
            </p>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">Learning focus</h2>
          <div className="space-y-3 text-sm text-white/90">
            <div>
              <span className="block text-xs uppercase text-white/50">Target level</span>
              {learning.experienceLevel.replace("_", " ")}
            </div>
            <div>
              <span className="block text-xs uppercase text-white/50">Goals</span>
              <ul className="mt-1 space-y-1">
                {learning.learningGoals.map((goal) => (
                  <li key={goal} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="block text-xs uppercase text-white/50">Interests</span>
              <ul className="mt-1 flex flex-wrap gap-2">
                {learning.interests.map((interest) => (
                  <li key={interest} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                    {interest}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="block text-xs uppercase text-white/50">Weekly commitment</span>
              ~{learning.weeklyLearningHours} hours/week
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-6 text-sm text-white/90">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/60">Selected plan</p>
            <h2 className="text-lg font-semibold text-white">{planLabel.title}</h2>
            <p className="text-sm text-white/70">{planLabel.description}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-white/80">
            <p className="text-xs uppercase tracking-wide text-white/50">Monthly price</p>
            <p className="text-xl font-semibold text-white">{planLabel.price}</p>
            <p className="text-xs text-white/60">{planLabel.summary}</p>
          </div>
        </div>
      </section>

      {message && <p className="mt-4 text-sm text-rose-300">{message}</p>}

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button variant="outline" type="button" onClick={goToPrevStep} className="px-6">
          Back
        </Button>
        <Button type="button" onClick={handleFinish} loading={isLoading} className="px-6">
          Go to dashboard
        </Button>
      </div>
    </div>
  );
}


