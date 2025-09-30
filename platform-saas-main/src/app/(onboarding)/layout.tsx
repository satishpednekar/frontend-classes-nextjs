import type { Metadata } from "next";
import React from "react";

import OnboardingShellLayout from "@/components/onboarding/OnboardingShellLayout";

export const metadata: Metadata = {
  title: "Complete Your Profile | Frontendpedia",
};

type OnboardingLayoutProps = {
  children: React.ReactNode;
};

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return <OnboardingShellLayout>{children}</OnboardingShellLayout>;
}

