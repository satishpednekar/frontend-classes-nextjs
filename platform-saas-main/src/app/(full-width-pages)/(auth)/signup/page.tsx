import { AuthCard } from "@/components/auth/AuthCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import type { AnyRecord } from "@/types/utility";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignUp Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js SignUp Page TailAdmin Dashboard Template",
  // other metadata
};

type SearchParams = Promise<{
  callbackUrl?: string;
}>;

type SignUpProps = {
  searchParams: SearchParams;
};

export default async function SignUp({ searchParams }: SignUpProps) {
  const session = await getServerSession(authOptions);
  
  // If user is already authenticated, redirect them away from signup page
  if (session?.user?.id) {
    const sessionUser = session.user as AnyRecord;
    const onboardingCompleted = Boolean(sessionUser.onboardingCompleted);
    
    // Default destination based on onboarding status
    const defaultDestination = onboardingCompleted ? "/dashboard" : "/onboarding";
    
    // Await searchParams in Next.js 15
    const params = await searchParams;
    const callbackUrl = params?.callbackUrl;
    
    // If there's a specific callbackUrl, validate and use it
    if (callbackUrl) {
      try {
        // Parse the URL to extract the pathname
        const parsedUrl = new URL(callbackUrl);
        const pathname = parsedUrl.pathname;
        
        // Security: Only redirect to local paths, and not back to signin/signup
        if (pathname && pathname !== '/signin' && pathname !== '/signup') {
          redirect(pathname + parsedUrl.search);
        }
      } catch {
        // If URL parsing fails, use default destination
        redirect(defaultDestination);
      }
    }
    
    // No callbackUrl, use default
    redirect(defaultDestination);
  }

  return <AuthCard mode="signup" />;
}
