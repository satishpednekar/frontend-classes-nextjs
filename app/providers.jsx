"use client";

import { ThemeProvider } from "next-themes";
import { useHydrationFix } from "@/hooks/useHydrationFix";

export function Providers({ children }) {
  useHydrationFix();
  
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  );
}
