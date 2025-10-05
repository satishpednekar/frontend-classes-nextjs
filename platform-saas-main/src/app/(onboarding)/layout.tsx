import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Complete Your Profile | Frontendpedia",
};

type OnboardingLayoutProps = {
  children: React.ReactNode;
};

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return <>{children}</>;
}

