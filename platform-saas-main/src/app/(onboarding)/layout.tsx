import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Complete Your Profile | Frontendpedia",
};

type OnboardingShellLayoutProps = {
  children: React.ReactNode;
};

export default function OnboardingShellLayout({ children }: OnboardingShellLayoutProps) {
  return <div className="min-h-screen bg-slate-950 text-white">{children}</div>;
}

