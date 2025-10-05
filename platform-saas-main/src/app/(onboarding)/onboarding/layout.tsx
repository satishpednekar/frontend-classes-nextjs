import React from "react";

import OnboardingPageLayout from "@/components/onboarding/OnboardingPageLayout";
import OnboardingShellLayout from "@/components/onboarding/OnboardingShellLayout";

type OnboardingRouteLayoutProps = {
  children: React.ReactNode;
};

export default function OnboardingRouteLayout({ children }: OnboardingRouteLayoutProps) {
  return (
    <OnboardingShellLayout>
      <OnboardingPageLayout>{children}</OnboardingPageLayout>
    </OnboardingShellLayout>
  );
}

