import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";
import type { AnyRecord } from "@/types/utility";
import {
  AudienceType,
  BillingCycle,
  SubscriptionStatus,
  SubscriptionTier,
} from "@prisma/client";

type AppRole = "admin" | "free_user" | "pro_user" | "pro_plus_user";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const ROLE_METADATA: Record<AppRole, { displayName: string; priority: number }> = {
  admin: { displayName: "Administrator", priority: 100 },
  free_user: { displayName: "Free User", priority: 10 },
  pro_user: { displayName: "Pro User", priority: 20 },
  pro_plus_user: { displayName: "Pro Plus User", priority: 30 },
};

const deriveNameParts = (name?: string | null) => {
  if (!name) return { firstName: null, lastName: null };
  const segments = name.split(" ").filter(Boolean);
  if (!segments.length) return { firstName: null, lastName: null };
  return {
    firstName: segments[0] ?? null,
    lastName: segments.length > 1 ? segments.slice(1).join(" ") : null,
  };
};

const isAdminEmail = (email: string | null | undefined) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

async function ensureRole(roleName: AppRole) {
  const metadata = ROLE_METADATA[roleName];
  return prisma.role.upsert({
    where: { name: roleName },
    update: {
      displayName: metadata.displayName,
      priority: metadata.priority,
      isSystem: true,
    },
    create: {
      name: roleName,
      displayName: metadata.displayName,
      priority: metadata.priority,
      isSystem: true,
    },
  });
}

async function ensureUserRole(userId: string, roleName: AppRole) {
  const role = await ensureRole(roleName);
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId,
        roleId: role.id,
      },
    },
    create: {
      userId,
      roleId: role.id,
    },
    update: {},
  });
}

async function ensureUserProfile(userId: string, name?: string | null) {
  const { firstName, lastName } = deriveNameParts(name);
  await prisma.userProfile.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      firstName,
      lastName,
      displayName: name ?? undefined,
      learningGoals: [],
      interests: [],
      audienceType: AudienceType.FREE_USER,
      onboardingCompleted: false,
      onboardingStep: 0,
    },
  });
}

async function ensureUserSubscription(userId: string) {
  await prisma.subscription.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      tier: SubscriptionTier.FREE,
      status: SubscriptionStatus.ACTIVE,
      billingCycle: BillingCycle.MONTHLY,
      startDate: new Date(),
      amount: null,
      currency: "USD",
    },
  });
}

async function ensureDefaultUserSetup(userId: string, name?: string | null, email?: string | null) {
  await Promise.all([
    ensureUserProfile(userId, name),
    ensureUserSubscription(userId),
    ensureUserRole(userId, "free_user"),
    isAdminEmail(email) ? ensureUserRole(userId, "admin") : Promise.resolve(),
  ]);
}

function resolvePrimaryRole(roleNames: string[]): AppRole {
  if (roleNames.includes("admin")) return "admin";
  if (roleNames.includes("pro_plus_user")) return "pro_plus_user";
  if (roleNames.includes("pro_user")) return "pro_user";
  return "free_user";
}

async function enrichToken(token: AnyRecord) {
  const userId = (token.id as string | undefined) ?? (token.sub as string | undefined);
  if (!userId) return token;

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      subscription: true,
      roles: { include: { role: true } },
    },
  });

  if (!dbUser) return token;

  const roleNames = dbUser.roles.map((userRole) => userRole.role.name as AppRole);
  const primaryRole = resolvePrimaryRole(roleNames);

  token.id = dbUser.id;
  token.email = dbUser.email;
  token.name = dbUser.name;
  token.picture = dbUser.image;
  token.role = primaryRole;
  token.roles = roleNames;
  token.tier = dbUser.subscription?.tier ?? SubscriptionTier.FREE;
  token.onboardingCompleted = dbUser.profile?.onboardingCompleted ?? false;
  token.onboardingStep = dbUser.profile?.onboardingStep ?? 0;
  token.userLoaded = true;

  return token;
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const emailRaw = credentials?.email;
        const password = credentials?.password;
        if (!emailRaw || !password) {
          throw new Error("Missing email or password");
        }

        const email = emailRaw.trim().toLowerCase();

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          const hashedPassword = await bcrypt.hash(password, 12);
          user = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              emailVerified: new Date(),
              lastLoginAt: new Date(),
            },
          });
          return user;
        }

        if (!user.password) {
          throw new Error("Use social sign-in for this account");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          throw new Error("Invalid email or password");
        }

        return user;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user }) {
      const email = user.email;
      if (!email) {
        throw new Error("Email is required");
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (!existingUser) {
        const createdUser = await prisma.user.create({
          data: {
            email,
            name: user.name ?? null,
            image: user.image ?? null,
            emailVerified: new Date(),
            lastLoginAt: new Date(),
          },
        });
        await ensureDefaultUserSetup(createdUser.id, user.name, email);
        (user as AnyRecord).id = createdUser.id;
        return true;
      }

      const updated = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: user.name ?? existingUser.name,
          image: user.image ?? existingUser.image,
          lastLoginAt: new Date(),
          emailVerified: existingUser.emailVerified ?? new Date(),
        },
      });
      await ensureDefaultUserSetup(updated.id, user.name, email);
      (user as AnyRecord).id = updated.id;

      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = (user as AnyRecord).id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.userLoaded = false;
      }

      if (trigger === "update") {
        token.userLoaded = false;
      }

      if (!token.userLoaded) {
        await enrichToken(token as AnyRecord);
      }

      return token;
    },
    async session({ session, token }) {
      const tier = (token.tier as SubscriptionTier | undefined) ?? SubscriptionTier.FREE;
      const role = (token.role as AppRole | undefined) ?? "free_user";

      if (!session.user) {
        session.user = {
          email: token.email as string | null,
          name: token.name as string | null,
          image: token.picture as string | null,
        };
      }

      const sessionUser = session.user as AnyRecord;
      sessionUser.id = token.id ?? token.sub;
      sessionUser.role = role;
      sessionUser.roles = (token.roles as string[]) ?? [role];
      sessionUser.tier = tier;
      sessionUser.onboardingCompleted = Boolean(token.onboardingCompleted);
      sessionUser.onboardingStep = token.onboardingStep ?? 0;

      const sessionRecord = session as AnyRecord;
      sessionRecord.role = role;
      sessionRecord.roles = (token.roles as string[]) ?? [role];
      sessionRecord.tier = tier;
      sessionRecord.onboardingCompleted = Boolean(token.onboardingCompleted);
      sessionRecord.onboardingStep = token.onboardingStep ?? 0;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


