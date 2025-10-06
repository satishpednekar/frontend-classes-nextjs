"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const MAX_REDIRECTS = 5;
const TIME_WINDOW = 10000; // 10 seconds
const STORAGE_KEY = "redirect_history";

interface RedirectEntry {
  path: string;
  timestamp: number;
}

export function RedirectLoopProtection() {
  const pathname = usePathname();
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [loopDetected, setLoopDetected] = useState(false);

  useEffect(() => {
    // Skip protection on error page
    if (pathname === "/error-page") return;

    try {
      // Get redirect history from sessionStorage
      const historyJson = sessionStorage.getItem(STORAGE_KEY);
      const history: RedirectEntry[] = historyJson ? JSON.parse(historyJson) : [];

      // Clean up old entries (older than TIME_WINDOW)
      const now = Date.now();
      const recentHistory = history.filter((entry) => now - entry.timestamp < TIME_WINDOW);

      // Add current path
      recentHistory.push({ path: pathname, timestamp: now });

      // Count redirects to current path
      const redirectCount = recentHistory.filter((entry) => entry.path === pathname).length;

      // Check for redirect loop
      if (redirectCount >= MAX_REDIRECTS) {
        setLoopDetected(true);
        setShowWarning(true);

        // Clear history to prevent further issues
        sessionStorage.removeItem(STORAGE_KEY);

        // Redirect to error page after showing warning
        setTimeout(() => {
          const errorUrl = `/error-page?type=redirect&message=${encodeURIComponent(
            `Detected ${redirectCount} redirects to ${pathname}`
          )}`;
          window.location.href = errorUrl;
        }, 3000);

        return;
      }

      // Save updated history
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(recentHistory));
    } catch (error) {
      console.error("RedirectLoopProtection error:", error);
      // If there's an error with sessionStorage, clear it
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [pathname]);

  // Auto-hide warning after 3 seconds
  useEffect(() => {
    if (showWarning && !loopDetected) {
      const timer = setTimeout(() => setShowWarning(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showWarning, loopDetected]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-red-200 bg-white shadow-2xl dark:border-red-900 dark:bg-gray-900">
        {/* Header with animated gradient */}
        <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-[length:200%_100%] animate-pulse" />

        <div className="p-6">
          {/* Warning Icon */}
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-red-500/30" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-500">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="mb-2 text-center text-xl font-bold text-gray-900 dark:text-white">
            {loopDetected ? "Redirect Loop Detected!" : "Navigation Issue"}
          </h2>

          {/* Description */}
          <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {loopDetected
              ? "We've detected too many redirects and stopped the process. Redirecting you to a safe page..."
              : "We noticed unusual navigation patterns. Please wait..."}
          </p>

          {/* Loading Spinner */}
          {loopDetected && (
            <div className="mb-4 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-500 dark:border-gray-700" />
            </div>
          )}

          {/* Technical Info */}
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Current Path:</span> {pathname}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Protection:</span> Active (Kill Switch Engaged)
            </p>
          </div>

          {/* Manual Override Button */}
          {!loopDetected && (
            <button
              onClick={() => {
                sessionStorage.removeItem(STORAGE_KEY);
                setShowWarning(false);
              }}
              className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750"
            >
              Dismiss Warning
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

