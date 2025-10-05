"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useOnboardingStore } from "@/stores/onboarding-store";

type OnboardingModalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const OnboardingModalContext = createContext<OnboardingModalContextValue | undefined>(undefined);

export function OnboardingModalProvider({ children }: { children: React.ReactNode }) {
  const onboardingCompleted = useOnboardingStore((state) => state.onboardingCompleted);
  const onboardingDismissed = useOnboardingStore((state) => state.onboardingDismissed);
  const contextReady = useOnboardingStore((state) => state.contextReady);
  const markDismissed = useOnboardingStore((state) => state.markDismissed);
  const markVisible = useOnboardingStore((state) => state.markVisible);
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(() => false);

  useEffect(() => {
    if (!contextReady) return;

    if (onboardingCompleted || onboardingDismissed) {
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
  }, [contextReady, onboardingCompleted, onboardingDismissed]);

  const open = () => {
    void markVisible().catch(() => setIsOpen(false));
    setIsOpen(true);
  };

  const close = () => {
    void markDismissed()
      .then(() => {
        setIsOpen(false);
        if (pathname?.startsWith("/onboarding")) {
          router.replace("/dashboard");
        }
      })
      .catch(() => {
        setIsOpen(true);
      });
  };

  const value = useMemo<OnboardingModalContextValue>(
    () => ({
      isOpen,
      open,
      close,
    }),
    [isOpen],
  );

  return <OnboardingModalContext.Provider value={value}>{children}</OnboardingModalContext.Provider>;
}

export function useOnboardingModal() {
  const ctx = useContext(OnboardingModalContext);
  if (!ctx) {
    throw new Error("useOnboardingModal must be used within OnboardingModalProvider");
  }
  return ctx;
}

