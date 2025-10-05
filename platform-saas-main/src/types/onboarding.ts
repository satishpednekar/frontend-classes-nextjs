import type { ExperienceLevel, LearningStyle, SubscriptionTier } from "@prisma/client";

import type { UserProfile } from "@/types/user-profile";

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export type SubscriptionPlanTier = Extract<SubscriptionTier, "FREE" | "PRO" | "PRO_PLUS">;

export interface OnboardingPersonalDetails {
  firstName: string;
  lastName: string;
  displayName: string;
  country: string;
  city: string;
  timezone: string;
  language: string;
}

export interface OnboardingProfessionalDetails {
  jobTitle: string;
  company: string;
  yearsExperience: number;
  domain: string;
  industry: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  websiteUrl: string;
}

export interface OnboardingLearningPreferences {
  experienceLevel: ExperienceLevel;
  learningGoals: string[];
  interests: string[];
  preferredLearningStyle: LearningStyle;
  weeklyLearningHours: number;
}

export interface OnboardingPlanOption {
  tier: SubscriptionPlanTier;
  title: string;
  price: string;
  cadence: string;
  badge?: string;
  highlights: string[];
  description: string;
  cta: string;
  popular?: boolean;
}

export interface OnboardingUserSummary {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  emailVerified: boolean;
}

export interface OnboardingContextPayload {
  onboardingStep: number;
  onboardingCompleted: boolean;
  onboardingDismissed?: boolean;
  personal: OnboardingPersonalDetails;
  professional: OnboardingProfessionalDetails;
  learning: OnboardingLearningPreferences;
  planTier: SubscriptionPlanTier;
  plans: OnboardingPlanOption[];
  user: OnboardingUserSummary;
}

export interface OnboardingContextResponse {
  success: boolean;
  data?: OnboardingContextPayload;
  error?: string;
}

export type OnboardingStepPayload =
  | {
      step: 1;
      data: OnboardingPersonalDetails;
    }
  | {
      step: 2;
      data: OnboardingProfessionalDetails;
    }
  | {
      step: 3;
      data: OnboardingLearningPreferences;
    }
  | {
      step: 4;
      planTier: SubscriptionPlanTier;
    }
  | {
      step: 5;
      complete: true;
    }
  | {
      step: "dismiss";
    }
  | {
      step: "resume";
    };

export type OnboardingUpdateRequest = OnboardingStepPayload & {
  complete?: boolean;
};

export const DEFAULT_PERSONAL_DETAILS: OnboardingPersonalDetails = {
  firstName: "",
  lastName: "",
  displayName: "",
  country: "",
  city: "",
  timezone: "UTC",
  language: "en",
};

export const DEFAULT_PROFESSIONAL_DETAILS: OnboardingProfessionalDetails = {
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

export const DEFAULT_LEARNING_PREFERENCES: OnboardingLearningPreferences = {
  experienceLevel: "BEGINNER",
  learningGoals: [],
  interests: [],
  preferredLearningStyle: "MIXED",
  weeklyLearningHours: 5,
};

export const PLAN_TIERS: SubscriptionPlanTier[] = ["FREE", "PRO", "PRO_PLUS"];

export type PartialProfile = Pick<
  UserProfile,
  | "firstName"
  | "lastName"
  | "displayName"
  | "country"
  | "city"
  | "timezone"
  | "language"
  | "jobTitle"
  | "company"
  | "yearsExperience"
  | "domain"
  | "industry"
  | "linkedinUrl"
  | "githubUrl"
  | "portfolioUrl"
  | "websiteUrl"
  | "experienceLevel"
  | "learningGoals"
  | "interests"
  | "preferredLearningStyle"
  | "weeklyLearningHours"
  | "audienceType"
  | "onboardingStep"
  | "onboardingCompleted"
>;


