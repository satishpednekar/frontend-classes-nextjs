import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized: ({ req, token }) => {
      const { pathname } = req.nextUrl;
      // Public routes
      if (
        pathname.startsWith("/signin") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/error")
      ) {
        return true;
      }

      // Admin-only
      if (pathname.startsWith("/admin")) {
        return Boolean(token && (token as any).role === "admin");
      }

      // Protected app pages
      const protectedRoutes = [
        "/",
        "/learning-path",
        "/my-content",
        "/feed",
        "/profile",
      ];
      if (protectedRoutes.includes(pathname)) {
        return Boolean(token);
      }

      // Default allow
      return true;
    },
  },
});

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|images).*)"],
};



