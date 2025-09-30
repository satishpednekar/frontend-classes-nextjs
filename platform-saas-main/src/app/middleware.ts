import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import type { AnyRecord } from "@/types/utility";

const PUBLIC_PATHS = ["/signin", "/signup", "/error"];
const ONBOARDING_PATH = "/onboarding";
const DASHBOARD_PATH = "/dashboard";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/learning-path",
  "/my-content",
  "/feed",
  "/profile",
  "/settings",
  "/notes",
  "/bookmarks",
];

const ADMIN_PREFIX = "/admin";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = (await getToken({ req })) as AnyRecord | null;

  if (!token) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const onboardingCompleted = Boolean(token.onboardingCompleted);
  const onboardingStep = Number(token.onboardingStep ?? 0);
  const isAdmin = (token.role as string | undefined) === "admin";

  if (pathname.startsWith(ADMIN_PREFIX) && !isAdmin) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
  }

  const requiresAuth = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (requiresAuth && !onboardingCompleted) {
    const onboardingUrl = new URL(ONBOARDING_PATH, req.url);
    if (onboardingStep > 0) onboardingUrl.searchParams.set("step", onboardingStep.toString());
    return NextResponse.redirect(onboardingUrl);
  }

  if (pathname.startsWith(ONBOARDING_PATH) && onboardingCompleted) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
  }

  if (pathname === "/" && onboardingCompleted) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|images).*)"],
};


