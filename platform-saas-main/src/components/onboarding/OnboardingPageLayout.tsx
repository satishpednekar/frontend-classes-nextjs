import React from "react";

import OnboardingGuard from "@/components/onboarding/OnboardingGuard";

type OnboardingPageLayoutProps = {
  children: React.ReactNode;
};

export default function OnboardingPageLayout({ children }: OnboardingPageLayoutProps) {
  return <OnboardingGuard>{children}</OnboardingGuard>;
}

