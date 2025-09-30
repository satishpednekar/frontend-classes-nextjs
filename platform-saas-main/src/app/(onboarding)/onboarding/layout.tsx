import React from "react";

import OnboardingPageLayout from "@/components/onboarding/OnboardingPageLayout";

type OnboardingRouteLayoutProps = {
  children: React.ReactNode;
};

export default function OnboardingRouteLayout({ children }: OnboardingRouteLayoutProps) {
  return <OnboardingPageLayout>{children}</OnboardingPageLayout>;
}

