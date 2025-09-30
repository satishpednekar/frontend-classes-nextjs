import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { AnyRecord } from "@/types/utility";

type OnboardingRouteLayoutProps = {
  children: React.ReactNode;
};

export default async function OnboardingRouteLayout({ children }: OnboardingRouteLayoutProps) {
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

