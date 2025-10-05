"use client";

import React from "react";

import { Modal } from "@/components/ui/modal";
import { useOnboardingModal } from "@/context/OnboardingModalContext";
import { useOnboardingStore } from "@/stores/onboarding-store";

type OnboardingShellLayoutProps = {
  children: React.ReactNode;
};

export default function OnboardingShellLayout({ children }: OnboardingShellLayoutProps) {
  const { isOpen, close } = useOnboardingModal();
  const contextReady = useOnboardingStore((state) => state.contextReady);

  const shouldRenderModal = contextReady ? isOpen : true;

  return (
    <Modal
      isOpen={shouldRenderModal}
      onClose={close}
      className="relative mx-auto flex h-[90vh] max-h-[800px] w-full max-w-5xl flex-col overflow-hidden border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl shadow-brand-500/30"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>
      {children}
    </Modal>
  );
}

