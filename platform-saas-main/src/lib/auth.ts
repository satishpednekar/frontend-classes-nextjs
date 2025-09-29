import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

export const authOptions = {
  providers: [
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
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token }) {
      const adminList = (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
      if (token?.email && adminList.includes(token.email.toLowerCase())) {
        (token as any).role = "admin";
      } else {
        (token as any).role = "user";
      }
      (token as any).tier = (token as any).tier || "free";
      return token;
    },
    async session({ session, token }) {
      (session as any).role = (token as any).role || "user";
      (session as any).tier = (token as any).tier || "free";
      return session;
    },
  },
};



