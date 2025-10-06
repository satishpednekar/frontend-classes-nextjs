import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { AnyRecord } from "@/types/utility";

const ONBOARDING_PATH = "/onboarding";
const DASHBOARD_PATH = "/dashboard";
const ONBOARDING_DISMISSED_COOKIE = "onboarding-dismissed";

const PROTECTED_PREFIXES = [
  "/",
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

const authConfig = {
  pages: {
    signIn: "/signin",
  },
};

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

  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as AnyRecord | null;

  // Handle auth pages (signin/signup) - redirect authenticated users away
  if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
    if (token) {
      // User is authenticated, redirect them away from auth pages
      const onboardingCompleted = Boolean(token.onboardingCompleted);
      const onboardingDismissed = Boolean(req.cookies.get(ONBOARDING_DISMISSED_COOKIE)?.value);
      
      // Determine where to send them
      if (onboardingCompleted || onboardingDismissed) {
        return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
      } else {
        const onboardingUrl = new URL(ONBOARDING_PATH, req.url);
        const onboardingStep = Number(token.onboardingStep ?? 0);
        if (onboardingStep > 0) {
          onboardingUrl.searchParams.set("step", onboardingStep.toString());
        }
        return NextResponse.redirect(onboardingUrl);
      }
    }
    // Not authenticated, allow access to signin/signup
    return NextResponse.next();
  }

  // Allow access to error pages without auth
  if (pathname.startsWith("/error") || pathname.startsWith("/error-page")) {
    return NextResponse.next();
  }

  if (!token) {
    const signInUrl = new URL(authConfig.pages.signIn, req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const onboardingCompleted = Boolean(token.onboardingCompleted);
  const onboardingStep = Number(token.onboardingStep ?? 0);
  const isAdmin = (token.role as string | undefined) === "admin";
  const onboardingDismissed = Boolean(req.cookies.get(ONBOARDING_DISMISSED_COOKIE)?.value);

  if (pathname.startsWith(ADMIN_PREFIX) && !isAdmin) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
  }

  const requiresAuth = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (pathname === "/" && !onboardingCompleted && !onboardingDismissed) {
    const onboardingUrl = new URL(ONBOARDING_PATH, req.url);
    if (onboardingStep > 0) onboardingUrl.searchParams.set("step", onboardingStep.toString());
    return NextResponse.redirect(onboardingUrl);
  }

  if (
    requiresAuth &&
    !onboardingCompleted &&
    !onboardingDismissed &&
    !pathname.startsWith(ONBOARDING_PATH)
  ) {
    const onboardingUrl = new URL(ONBOARDING_PATH, req.url);
    if (onboardingStep > 0) onboardingUrl.searchParams.set("step", onboardingStep.toString());
    return NextResponse.redirect(onboardingUrl);
  }

  if (pathname.startsWith(ONBOARDING_PATH) && (onboardingCompleted || onboardingDismissed)) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
  }

  if (pathname === "/" && (onboardingCompleted || onboardingDismissed)) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|images).*)"],
};



