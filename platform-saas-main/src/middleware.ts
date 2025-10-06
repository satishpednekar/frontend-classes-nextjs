import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { AnyRecord } from "@/types/utility";

const DASHBOARD_PATH = "/dashboard";
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
      // User is authenticated, redirect to main page
      return NextResponse.redirect(new URL("/", req.url));
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

  const isAdmin = (token.role as string | undefined) === "admin";

  // Admin route protection
  if (pathname.startsWith(ADMIN_PREFIX) && !isAdmin) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
  }

  // Allow access to all authenticated routes - no forced onboarding redirects
  // The main page will show a button to complete profile if needed

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|images).*)"],
};



