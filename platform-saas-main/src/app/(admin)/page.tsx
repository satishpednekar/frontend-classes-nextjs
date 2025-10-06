import type { Metadata } from "next";
import { ArrowRightIcon, CheckCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import ProfileCompletionButton from "@/components/profile/ProfileCompletionButton";

export const metadata: Metadata = {
  title: "Frontendpedia | Overview",
  description: "Your learning snapshot and profile status",
};

async function fetchProfile(userId: string) {
  return prisma.userProfile.findUnique({
    where: { userId },
    select: {
      firstName: true,
      lastName: true,
      displayName: true,
      jobTitle: true,
      learningGoals: true,
      interests: true,
      onboardingCompleted: true,
      onboardingStep: true,
    },
  });
}

function computeCompletion(profile: Awaited<ReturnType<typeof fetchProfile>> | null) {
  if (!profile) {
    return { percentage: 0, completed: false };
  }

  const checks = [
    Boolean(profile.firstName && profile.lastName),
    Boolean(profile.displayName),
    Boolean(profile.jobTitle),
    Array.isArray(profile.learningGoals) && profile.learningGoals.length > 0,
    Array.isArray(profile.interests) && profile.interests.length > 0,
  ];

  const completedCount = checks.filter(Boolean).length;
  const percentage = Math.round((completedCount / checks.length) * 100);

  return { percentage, completed: percentage === 100 };
}

export default async function OverviewPage() {
  const session = await getServerSession(authOptions);
  const profile = session?.user?.id ? await fetchProfile(session.user.id as string) : null;
  const profileStatus = computeCompletion(profile);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Welcome</p>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {profile?.displayName || profile?.firstName || session?.user?.name || "Learner"}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Here is a quick snapshot of your learning journey.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm text-brand-700 dark:border-brand-400/40 dark:bg-brand-500/10 dark:text-brand-200">
              <CheckCircleIcon className="h-5 w-5" aria-hidden />
              Profile completion: {profileStatus.percentage}%
            </div>

            <Link
              href="/profile"
              prefetch
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-gray-700 dark:text-gray-200 dark:hover:border-brand-500 dark:hover:text-brand-300"
            >
              View profile
              <ArrowRightIcon className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        {!profileStatus.completed && (
          <ProfileCompletionButton profile={profile} completion={profileStatus} />
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Learning step</p>
          <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Onboarding progress</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You are currently on step {profile?.onboardingStep ?? 1} of 5.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent activity</p>
          <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">No activity yet</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Start exploring to see insights here.</p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Learning paths</p>
          <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Kickstart available</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Your personalized learning path will appear here once you start.
          </p>
        </div>
      </section>
    </div>
  );
}
