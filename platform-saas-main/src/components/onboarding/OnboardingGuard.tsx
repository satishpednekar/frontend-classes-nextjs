import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import React from "react";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { AnyRecord } from "@/types/utility";

type OnboardingGuardProps = {
  children: React.ReactNode;
};

export default async function OnboardingGuard({ children }: OnboardingGuardProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=/onboarding");
  }

  const onboardingCompleted = Boolean((session?.user as AnyRecord)?.onboardingCompleted);

  if (onboardingCompleted) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}

