import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { AnyRecord } from "@/types/utility";

const PUBLIC_PATHS = ["/signin", "/signup", "/error"];
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

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = (await getToken({ req })) as AnyRecord | null;

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



