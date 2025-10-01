"use client";

import React, { useMemo, useState } from "react";

import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import { useOnboardingStore } from "@/stores/onboarding-store";

const EXPERIENCE_LEVELS = [
  { label: "Beginner", value: "BEGINNER", description: "Just getting started" },
  { label: "Intermediate", value: "INTERMEDIATE", description: "Comfortable with the fundamentals" },
  { label: "Advanced", value: "ADVANCED", description: "Ship production-ready features" },
  { label: "Expert", value: "EXPERT", description: "Lead teams & architect systems" },
];

const GOALS = [
  "Master React",
  "Level up with TypeScript",
  "Improve performance skills",
  "Prepare for senior interviews",
  "Build a standout portfolio",
  "Learn system design",
  "Lead high-performing teams",
  "Explore AI tooling",
];

const INTERESTS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "CSS",
  "Testing",
  "GraphQL",
  "Performance",
  "Accessibility",
  "Animations",
  "State Management",
  "UX/UI",
];

const LEARNING_STYLES = [
  { label: "Video tutorials", value: "VIDEO" },
  { label: "Reading & articles", value: "READING" },
  { label: "Hands-on practice", value: "HANDS_ON" },
  { label: "Mixed approach", value: "MIXED" },
];

export default function StepLearningPreferences() {
  const learning = useOnboardingStore((state) => state.learning);
  const updateLearning = useOnboardingStore((state) => state.updateLearning);
  const submitStep = useOnboardingStore((state) => state.submitStep);
  const goToNextStep = useOnboardingStore((state) => state.goToNextStep);
  const goToPrevStep = useOnboardingStore((state) => state.goToPrevStep);
  const isLoading = useOnboardingStore((state) => state.isLoading);

  const [error, setError] = useState<string | null>(null);
  const [customGoal, setCustomGoal] = useState("");
  const [customInterest, setCustomInterest] = useState("");

  const isValid = useMemo(() => {
    return learning.learningGoals.length > 0 && learning.interests.length > 0 && learning.weeklyLearningHours > 0;
  }, [learning]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) {
      setError("Tell us at least one goal and interest so we know how to help.");
      return;
    }

    setError(null);
    try {
      await submitStep();
      goToNextStep();
    } catch (err) {
      setError((err as Error).message || "We couldn’t save your preferences");
    }
  };

  const handleGoalToggle = (goal: string) => {
    const exists = learning.learningGoals.includes(goal);
    if (exists) {
      updateLearning({ learningGoals: learning.learningGoals.filter((item) => item !== goal) });
    } else if (learning.learningGoals.length < 5) {
      updateLearning({ learningGoals: [...learning.learningGoals, goal] });
    }
  };

  const handleInterestToggle = (interest: string) => {
    const exists = learning.interests.includes(interest);
    if (exists) {
      updateLearning({ interests: learning.interests.filter((item) => item !== interest) });
    } else if (learning.interests.length < 10) {
      updateLearning({ interests: [...learning.interests, interest] });
    }
  };

  const addCustomGoal = () => {
    const trimmed = customGoal.trim();
    if (!trimmed) return;
    if (learning.learningGoals.includes(trimmed)) return;
    updateLearning({ learningGoals: [...learning.learningGoals, trimmed] });
    setCustomGoal("");
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (!trimmed) return;
    if (learning.interests.includes(trimmed)) return;
    updateLearning({ interests: [...learning.interests, trimmed] });
    setCustomInterest("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold text-white">What are you aiming to achieve?</h1>
        <p className="text-sm text-white/70">
          We’ll tailor your dashboard, AI recommendations, and your first learning path based on these preferences.
        </p>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div>
            <Label>Experience level</Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {EXPERIENCE_LEVELS.map((level) => {
                const isActive = learning.experienceLevel === level.value;
                return (
                  <button
                    type="button"
                    key={level.value}
                    onClick={() => updateLearning({ experienceLevel: level.value as typeof learning.experienceLevel })}
                    className={`rounded-2xl border p-4 text-left transition ${
                      isActive ? "border-white bg-white text-slate-900" : "border-white/20 text-white/80 hover:border-white/40"
                    }`}
                  >
                    <p className="text-sm font-semibold">{level.label}</p>
                    <p className="text-xs opacity-75">{level.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label>Learning goals (select up to 5)</Label>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((goal) => {
                const isActive = learning.learningGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleGoalToggle(goal)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      isActive ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Add your own goal"
                value={customGoal}
                onChange={(event) => setCustomGoal(event.target.value)}
              />
              <Button type="button" onClick={addCustomGoal} variant="outline">
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <Label>Interests (select up to 10)</Label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => {
                const isActive = learning.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      isActive ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Add a topic"
                value={customInterest}
                onChange={(event) => setCustomInterest(event.target.value)}
              />
              <Button type="button" onClick={addCustomInterest} variant="outline">
                Add
              </Button>
            </div>
          </div>

          <div>
            <Label>Preferred learning style</Label>
            <Select
              options={LEARNING_STYLES}
              value={learning.preferredLearningStyle}
              onChange={(value) =>
                updateLearning({ preferredLearningStyle: value as typeof learning.preferredLearningStyle })
              }
            />
          </div>

          <div>
            <Label>Weekly time commitment</Label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={30}
                value={learning.weeklyLearningHours}
                onChange={(event) => updateLearning({ weeklyLearningHours: Number(event.target.value) })}
                className="w-full accent-white"
              />
              <span className="w-12 text-sm text-white/80">{learning.weeklyLearningHours}h</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
            <p>
              We’ll use these selections to prime your AI concierge, suggest learning paths, and surface the right
              analytics. You can always revisit these preferences from your profile.
            </p>
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button variant="outline" type="button" onClick={goToPrevStep} className="px-6">
          Back
        </Button>
        <Button type="submit" disabled={!isValid || isLoading} loading={isLoading} className="px-6">
          Save & Continue
        </Button>
      </div>
    </form>
  );
}


