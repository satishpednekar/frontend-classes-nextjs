"use client";

import React, { useMemo, useState } from "react";

import Button from "@/components/ui/button/Button";
import { useOnboardingStore } from "@/stores/onboarding-store";

export default function StepPlanSelection() {
  const { plans, planTier, setPlanTier, submitStep, goToNextStep, goToPrevStep, isLoading } = useOnboardingStore(
    (state) => ({
      plans: state.plans,
      planTier: state.planTier,
      setPlanTier: state.setPlanTier,
      submitStep: state.submitStep,
      goToNextStep: state.goToNextStep,
      goToPrevStep: state.goToPrevStep,
      isLoading: state.isLoading,
    }),
  );

  const [error, setError] = useState<string | null>(null);

  const selectedPlan = useMemo(() => plans.find((plan) => plan.tier === planTier), [plans, planTier]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      await submitStep();
      goToNextStep();
    } catch (err) {
      setError((err as Error).message || "We couldn’t update your plan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold text-white">Choose the plan that matches your goals</h1>
        <p className="text-sm text-white/70">
          You can upgrade or downgrade anytime. Trials include full access, and we’ll remind you before they end.
        </p>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isActive = plan.tier === planTier;
          return (
            <label
              key={plan.tier}
              className={`group relative flex cursor-pointer flex-col gap-4 rounded-3xl border p-6 transition ${
                isActive
                  ? "border-white bg-white text-slate-900 shadow-2xl shadow-blue-500/30"
                  : "border-white/15 bg-white/5 text-white/90 hover:border-white/40"
              }`}
            >
              {plan.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              )}
              <input
                type="radio"
                name="plan"
                value={plan.tier}
                checked={isActive}
                onChange={() => setPlanTier(plan.tier)}
                className="sr-only"
              />
              <div className="flex items-baseline justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{plan.title}</h2>
                  <p className="text-xs uppercase tracking-wide opacity-70">{plan.cadence}</p>
                </div>
                <p className="text-2xl font-bold">{plan.price}</p>
              </div>
              <p className="text-sm opacity-80">{plan.description}</p>

              <ul className="space-y-2 text-sm">
                {plan.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden className="mt-1 text-white/70">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {isActive && (
                <div className="rounded-2xl border border-slate-900/10 bg-slate-900/5 px-4 py-2 text-sm text-slate-900">
                  {plan.cta}
                </div>
              )}
            </label>
          );
        })}
      </div>

      {selectedPlan && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-6 text-sm text-white/80">
          <p className="font-medium text-white">What happens next?</p>
          {selectedPlan.tier === "FREE" ? (
            <p className="mt-2 opacity-80">
              We’ll keep you on the Free plan. You can upgrade later from the dashboard. Enjoy 10 AI credits and a curated
              starter journey.
            </p>
          ) : (
            <p className="mt-2 opacity-80">
              We’ll redirect you to Stripe to start your {selectedPlan.cta.toLowerCase()}. Once confirmed, you’ll get
              access to all premium features.
            </p>
          )}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button variant="outline" type="button" onClick={goToPrevStep} className="px-6">
          Back
        </Button>
        <Button type="submit" loading={isLoading} className="px-6">
          {selectedPlan?.tier === "FREE" ? "Continue with Free" : "Proceed to Checkout"}
        </Button>
      </div>
    </form>
  );
}


