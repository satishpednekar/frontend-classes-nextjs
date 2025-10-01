import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type {
  OnboardingContextPayload,
  OnboardingLearningPreferences,
  OnboardingPersonalDetails,
  OnboardingPlanOption,
  OnboardingProfessionalDetails,
  SubscriptionPlanTier,
} from "@/types/onboarding";

type StepIndex = 0 | 1 | 2 | 3 | 4;

type OnboardingStepKey =
  | "personal"
  | "professional"
  | "learning"
  | "plan"
  | "complete";

interface OnboardingState {
  isLoading: boolean;
  error: string | null;
  stepIndex: StepIndex;
  plans: OnboardingPlanOption[];
  planTier: SubscriptionPlanTier;
  personal: OnboardingPersonalDetails;
  professional: OnboardingProfessionalDetails;
  learning: OnboardingLearningPreferences;
  emailVerified: boolean;
  userName: string | null;
  setStepIndex: (index: StepIndex) => void;
  setPlanTier: (tier: SubscriptionPlanTier) => void;
  updatePersonal: (input: OnboardingPersonalDetails) => void;
  updateProfessional: (input: OnboardingProfessionalDetails) => void;
  updateLearning: (input: OnboardingLearningPreferences) => void;
  loadInitialContext: () => Promise<void>;
  submitStep: () => Promise<void>;
  goToPrevStep: () => void;
  goToNextStep: () => void;
}

const STEP_KEYS: OnboardingStepKey[] = ["personal", "professional", "learning", "plan", "complete"];

const DEFAULT_PERSONAL: OnboardingPersonalDetails = {
  firstName: "",
  lastName: "",
  displayName: "",
  country: "",
  city: "",
  timezone: "UTC",
  language: "en",
};

const DEFAULT_PROFESSIONAL: OnboardingProfessionalDetails = {
  jobTitle: "",
  company: "",
  yearsExperience: 0,
  domain: "",
  industry: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  websiteUrl: "",
};

const DEFAULT_LEARNING: OnboardingLearningPreferences = {
  experienceLevel: "BEGINNER",
  learningGoals: [],
  interests: [],
  preferredLearningStyle: "MIXED",
  weeklyLearningHours: 5,
};

function toIndex(step: number | undefined): StepIndex {
  if (!step || step <= 1) return 0;
  if (step >= 5) return 4;
  return (step - 1) as StepIndex;
}

async function fetchContext(): Promise<OnboardingContextPayload> {
  const response = await fetch("/api/onboarding", { cache: "no-store" }).catch(() => null);
  if (!response || !response.ok) {
    throw new Error("Failed to load onboarding context");
  }
  const json = (await response.json().catch(() => null)) as
    | { success: boolean; data?: OnboardingContextPayload; error?: string }
    | null;
  if (!json?.success || !json.data) {
    throw new Error(json?.error || "Unexpected response");
  }
  return json.data;
}

async function patchStep(payload: unknown) {
  const response = await fetch("/api/onboarding", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).catch(() => null);

  if (!response || !response.ok) {
    const fallback = await response?.json().catch(() => ({ error: "Request failed" } as const));
    throw new Error((fallback as { error?: string })?.error || "Failed to submit step");
  }
  const json = (await response.json().catch(() => null)) as
    | { success: boolean; data?: OnboardingContextPayload; error?: string }
    | null;
  if (!json?.success || !json.data) {
    throw new Error(json?.error || "Unexpected response");
  }
  return json.data;
}

export const useOnboardingStore = create<OnboardingState>()(
  devtools((set, get) => ({
    isLoading: false,
    error: null,
    stepIndex: 0,
    plans: [],
    planTier: "FREE",
    personal: DEFAULT_PERSONAL,
    professional: DEFAULT_PROFESSIONAL,
    learning: DEFAULT_LEARNING,
    emailVerified: false,
    userName: null,

    setStepIndex: (index) => set({ stepIndex: index }),

    setPlanTier: (tier) => set({ planTier: tier }),

    updatePersonal: (input) => set({ personal: { ...get().personal, ...input } }),

    updateProfessional: (input) => set({ professional: { ...get().professional, ...input } }),

    updateLearning: (input) => set({ learning: { ...get().learning, ...input } }),

    goToPrevStep: () => {
      const current = get().stepIndex;
      if (current > 0) {
        set({ stepIndex: (current - 1) as StepIndex });
      }
    },

    goToNextStep: () => {
      const current = get().stepIndex;
      if (current < 4) {
        set({ stepIndex: (current + 1) as StepIndex });
      }
    },

    loadInitialContext: async () => {
      set({ isLoading: true, error: null });
      try {
        const data = await fetchContext();
        set({
          isLoading: false,
          stepIndex: toIndex(data.onboardingStep),
          personal: data.personal,
          professional: data.professional,
          learning: data.learning,
          planTier: data.planTier,
          plans: data.plans,
          emailVerified: data.user.emailVerified,
          userName: data.user.name ?? data.personal.displayName ?? null,
        });
      } catch (error) {
        set({ isLoading: false, error: (error as Error).message || "Unable to load onboarding" });
      }
    },

    submitStep: async () => {
      const state = get();
      const stepKey = STEP_KEYS[state.stepIndex];

      let payload: unknown;
      switch (stepKey) {
        case "personal":
          payload = { step: 1, data: state.personal };
          break;
        case "professional":
          payload = { step: 2, data: state.professional };
          break;
        case "learning":
          payload = { step: 3, data: state.learning };
          break;
        case "plan":
          payload = { step: 4, planTier: state.planTier };
          break;
        case "complete":
          payload = { step: 5, complete: true };
          break;
        default:
          return;
      }

      set({ isLoading: true, error: null });
      try {
        const updated = await patchStep(payload);
        set({
          isLoading: false,
          stepIndex: toIndex(updated.onboardingStep),
          personal: updated.personal,
          professional: updated.professional,
          learning: updated.learning,
          planTier: updated.planTier,
          plans: updated.plans,
          emailVerified: updated.user.emailVerified,
          userName: updated.user.name ?? updated.personal.displayName ?? null,
        });
      } catch (error) {
        set({ isLoading: false, error: (error as Error).message || "Unable to save progress" });
        throw error;
      }
    },
  }))
);


