import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import type {
  OnboardingContextPayload,
  OnboardingContextResponse,
  OnboardingPersonalDetails,
  OnboardingPlanOption,
  OnboardingProfessionalDetails,
  OnboardingLearningPreferences,
  OnboardingUpdateRequest,
  SubscriptionPlanTier,
} from "@/types/onboarding";
import {
  DEFAULT_LEARNING_PREFERENCES,
  DEFAULT_PERSONAL_DETAILS,
  DEFAULT_PROFESSIONAL_DETAILS,
  PLAN_TIERS,
} from "@/types/onboarding";
import type { AnyRecord } from "@/types/utility";
import {
  AudienceType,
  ExperienceLevel,
  LearningStyle,
  SubscriptionStatus,
  SubscriptionTier,
} from "@prisma/client";

const PLAN_OPTIONS: OnboardingPlanOption[] = [
  {
    tier: "FREE",
    title: "Free",
    price: "$0",
    cadence: "per month",
    highlights: [
      "10 AI credits/month",
      "1 active learning path",
      "Core skill tracking",
      "Community access",
    ],
    description: "Perfect to explore the platform and start your learning journey.",
    cta: "Continue with Free",
  },
  {
    tier: "PRO",
    title: "Pro",
    price: "$19",
    cadence: "per month",
    badge: "Most Popular",
    highlights: [
      "100 AI credits/month",
      "Unlimited learning paths",
      "AI-generated insights",
      "Monthly skill assessments",
      "Certificates on completion",
    ],
    description: "Unlock AI personalization, premium content, and actionable insights.",
    cta: "Start 14-day Pro Trial",
    popular: true,
  },
  {
    tier: "PRO_PLUS",
    title: "Pro Plus",
    price: "$49",
    cadence: "per month",
    badge: "Best Value",
    highlights: [
      "500 AI credits/month",
      "All Pro features",
      "Weekly AI assessments",
      "Career guidance & concierge",
      "Bring your own LLM key",
      "Priority support",
    ],
    description: "Enterprise-grade personalization with concierge support and BYOK.",
    cta: "Start 14-day Pro Plus Trial",
  },
];

async function getSessionOrThrow(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return session as AnyRecord;
}

function normaliseStep(step?: number | null): number {
  if (!step || step < 1) return 1;
  if (step > 5) return 5;
  return step;
}

function extractPersonal(profile: AnyRecord | null | undefined): OnboardingPersonalDetails {
  const base = { ...DEFAULT_PERSONAL_DETAILS };
  if (!profile) return base;
  return {
    firstName: profile.firstName ?? base.firstName,
    lastName: profile.lastName ?? base.lastName,
    displayName: profile.displayName ?? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim(),
    country: profile.country ?? base.country,
    city: profile.city ?? base.city,
    timezone: profile.timezone ?? base.timezone,
    language: profile.language ?? base.language,
  };
}

function extractProfessional(profile: AnyRecord | null | undefined): OnboardingProfessionalDetails {
  const base = { ...DEFAULT_PROFESSIONAL_DETAILS };
  if (!profile) return base;
  return {
    jobTitle: profile.jobTitle ?? base.jobTitle,
    company: profile.company ?? base.company,
    yearsExperience: profile.yearsExperience ?? base.yearsExperience,
    domain: profile.domain ?? base.domain,
    industry: profile.industry ?? base.industry,
    linkedinUrl: profile.linkedinUrl ?? base.linkedinUrl,
    githubUrl: profile.githubUrl ?? base.githubUrl,
    portfolioUrl: profile.portfolioUrl ?? base.portfolioUrl,
    websiteUrl: profile.websiteUrl ?? base.websiteUrl,
  };
}

function extractLearning(profile: AnyRecord | null | undefined): OnboardingLearningPreferences {
  const base = { ...DEFAULT_LEARNING_PREFERENCES };
  if (!profile) return base;
  return {
    experienceLevel: (profile.experienceLevel as ExperienceLevel | undefined) ?? base.experienceLevel,
    learningGoals: Array.isArray(profile.learningGoals) ? profile.learningGoals : base.learningGoals,
    interests: Array.isArray(profile.interests) ? profile.interests : base.interests,
    preferredLearningStyle:
      (profile.preferredLearningStyle as LearningStyle | undefined) ?? base.preferredLearningStyle,
    weeklyLearningHours: profile.weeklyLearningHours ?? base.weeklyLearningHours,
  };
}

async function buildOnboardingContext(userId: string): Promise<OnboardingContextPayload> {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      subscription: true,
    },
  });

  if (!dbUser) {
    throw new Response("User not found", { status: 404 });
  }

  const personal = extractPersonal(dbUser.profile);
  const professional = extractProfessional(dbUser.profile);
  const learning = extractLearning(dbUser.profile);

  const onboardingStep = normaliseStep(dbUser.profile?.onboardingStep ?? 1);
  const onboardingCompleted = Boolean(dbUser.profile?.onboardingCompleted);

  const planTier = (dbUser.subscription?.tier as SubscriptionPlanTier | undefined) ?? "FREE";

  return {
    onboardingStep,
    onboardingCompleted,
    personal,
    professional,
    learning,
    planTier,
    plans: PLAN_OPTIONS,
    user: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      image: dbUser.image,
      emailVerified: Boolean(dbUser.emailVerified),
    },
  };
}

async function ensureRole(roleName: "free_user" | "pro_user" | "pro_plus_user" | "admin") {
  return prisma.role.upsert({
    where: { name: roleName },
    update: {},
    create: {
      name: roleName,
      displayName:
        roleName === "admin"
          ? "Administrator"
          : roleName === "pro_plus_user"
          ? "Pro Plus User"
          : roleName === "pro_user"
          ? "Pro User"
          : "Free User",
      priority: roleName === "admin" ? 100 : roleName === "pro_plus_user" ? 30 : roleName === "pro_user" ? 20 : 10,
      isSystem: true,
    },
  });
}

async function assignRole(userId: string, roleName: "free_user" | "pro_user" | "pro_plus_user") {
  const role = await ensureRole(roleName);
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId,
        roleId: role.id,
      },
    },
    update: {},
    create: {
      userId,
      roleId: role.id,
    },
  });
}

async function removeRole(userId: string, roleName: "pro_user" | "pro_plus_user") {
  const role = await prisma.role.findUnique({ where: { name: roleName } });
  if (!role) return;
  await prisma.userRole.deleteMany({
    where: {
      userId,
      roleId: role.id,
    },
  });
}

async function applySubscriptionTier(userId: string, tier: SubscriptionPlanTier) {
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      tier,
      status: SubscriptionStatus.ACTIVE,
      billingCycle: "MONTHLY",
    },
    create: {
      userId,
      tier,
      status: SubscriptionStatus.ACTIVE,
      billingCycle: "MONTHLY",
      startDate: new Date(),
      amount: tier === "FREE" ? null : tier === "PRO" ? 19 : 49,
      currency: "USD",
    },
  });

  await assignRole(userId, "free_user");

  if (tier === "FREE") {
    await removeRole(userId, "pro_user");
    await removeRole(userId, "pro_plus_user");
  }

  if (tier === "PRO" || tier === "PRO_PLUS") {
    await assignRole(userId, "pro_user");
  }

  if (tier === "PRO_PLUS") {
    await assignRole(userId, "pro_plus_user");
  } else {
    await removeRole(userId, "pro_plus_user");
  }
}

async function createInitialLearningPath(userId: string) {
  const existing = await prisma.learningPath.findFirst({ where: { userId } });
  if (existing) return;

  await prisma.learningPath.create({
    data: {
      userId,
      title: "Kickstart your Frontendpedia journey",
      description:
        "A curated set of modules to help you explore the platform and build momentum in your first week.",
      status: "IN_PROGRESS",
      isCustom: true,
      isPublic: false,
      estimatedHours: 6,
    },
  });
}

async function handleStepUpdate(userId: string, payload: OnboardingUpdateRequest, profileId: string) {
  switch (payload.step) {
    case 1: {
      const data = payload.data as OnboardingPersonalDetails;
      if (!data.firstName || !data.lastName || !data.displayName) {
        throw new Response("Missing required personal details", { status: 400 });
      }

      await prisma.userProfile.update({
        where: { id: profileId },
        data: {
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          displayName: data.displayName.trim(),
          country: data.country.trim(),
          city: data.city.trim(),
          timezone: data.timezone || "UTC",
          language: data.language || "en",
          onboardingStep: 2,
        },
      });
      break;
    }
    case 2: {
      const data = payload.data as OnboardingProfessionalDetails;
      await prisma.userProfile.update({
        where: { id: profileId },
        data: {
          jobTitle: data.jobTitle?.trim() || null,
          company: data.company?.trim() || null,
          yearsExperience: Number.isFinite(data.yearsExperience) ? data.yearsExperience : 0,
          domain: data.domain?.trim() || null,
          industry: data.industry?.trim() || null,
          linkedinUrl: data.linkedinUrl?.trim() || null,
          githubUrl: data.githubUrl?.trim() || null,
          portfolioUrl: data.portfolioUrl?.trim() || null,
          websiteUrl: data.websiteUrl?.trim() || null,
          onboardingStep: 3,
        },
      });
      break;
    }
    case 3: {
      const data = payload.data as OnboardingLearningPreferences;
      if (!data.learningGoals || data.learningGoals.length === 0) {
        throw new Response("Select at least one learning goal", { status: 400 });
      }
      if (!data.interests || data.interests.length === 0) {
        throw new Response("Select at least one interest", { status: 400 });
      }

      await prisma.userProfile.update({
        where: { id: profileId },
        data: {
          experienceLevel: data.experienceLevel ?? ExperienceLevel.BEGINNER,
          learningGoals: data.learningGoals,
          interests: data.interests,
          preferredLearningStyle: data.preferredLearningStyle ?? LearningStyle.MIXED,
          weeklyLearningHours: Number.isFinite(data.weeklyLearningHours)
            ? Math.max(1, data.weeklyLearningHours)
            : 5,
          onboardingStep: 4,
        },
      });
      break;
    }
    case 4: {
      const { planTier } = payload;
      if (!planTier || !PLAN_TIERS.includes(planTier)) {
        throw new Response("Invalid plan tier", { status: 400 });
      }

      await prisma.$transaction(async (tx) => {
        await tx.userProfile.update({
          where: { id: profileId },
          data: {
            onboardingStep: 5,
            audienceType:
              planTier === "PRO"
                ? AudienceType.PRO_USER
                : planTier === "PRO_PLUS"
                ? AudienceType.ENTERPRISE_USER
                : AudienceType.FREE_USER,
          },
        });

        await tx.subscription.upsert({
          where: { userId },
          update: {
            tier: planTier,
            status: SubscriptionStatus.ACTIVE,
            startDate: new Date(),
          },
          create: {
            userId,
            tier: planTier,
            status: SubscriptionStatus.ACTIVE,
            billingCycle: "MONTHLY",
            startDate: new Date(),
            amount: planTier === "FREE" ? null : planTier === "PRO" ? 19 : 49,
            currency: "USD",
          },
        });
      });

      await applySubscriptionTier(userId, planTier);
      break;
    }
    case 5: {
      if (!payload.complete) {
        throw new Response("Completion flag required", { status: 400 });
      }

      await prisma.userProfile.update({
        where: { id: profileId },
        data: {
          onboardingCompleted: true,
          onboardingStep: 5,
          lastActiveDate: new Date(),
        },
      });

      await createInitialLearningPath(userId);
      break;
    }
    default:
      throw new Response("Invalid step", { status: 400 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json<OnboardingContextResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const context = await buildOnboardingContext(session.user.id as string);
    return NextResponse.json<OnboardingContextResponse>({ success: true, data: context });
  } catch (error) {
    if (error instanceof Response) {
      return NextResponse.json<OnboardingContextResponse>(
        { success: false, error: error.statusText || "Error" },
        { status: error.status },
      );
    }

    console.error("Onboarding GET error", error);
    return NextResponse.json<OnboardingContextResponse>(
      { success: false, error: "Unable to load onboarding context" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json<OnboardingContextResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as OnboardingUpdateRequest;
    if (!body?.step) {
      return NextResponse.json<OnboardingContextResponse>(
        { success: false, error: "Missing step" },
        { status: 400 },
      );
    }

    const userId = session.user.id as string;
    const profile = await prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json<OnboardingContextResponse>(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    await handleStepUpdate(userId, body, profile.id);

    const updated = await buildOnboardingContext(userId);
    return NextResponse.json<OnboardingContextResponse>({ success: true, data: updated });
  } catch (error) {
    if (error instanceof Response) {
      return NextResponse.json<OnboardingContextResponse>(
        { success: false, error: error.statusText || "Error" },
        { status: error.status },
      );
    }

    console.error("Onboarding PATCH error", error);
    return NextResponse.json<OnboardingContextResponse>(
      { success: false, error: "Unable to update onboarding" },
      { status: 500 },
    );
  }
}


