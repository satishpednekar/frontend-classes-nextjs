"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorType = searchParams?.get("type") || "unknown";
  const errorMessage = searchParams?.get("message") || "An unexpected error occurred";
  const [showDetails, setShowDetails] = useState(false);

  const errorDetails = {
    redirect: {
      title: "Redirect Loop Detected",
      description: "We detected too many redirects and stopped the process to protect your browser.",
      technical: "The application attempted to redirect more than 5 times in a short period.",
    },
    "404": {
      title: "Page Not Found",
      description: "The page you're looking for doesn't exist or has been moved.",
      technical: "HTTP 404 - Resource not found",
    },
    unknown: {
      title: "Technical Error",
      description: "We encountered a technical issue while processing your request.",
      technical: errorMessage,
    },
  };

  const details = errorDetails[errorType as keyof typeof errorDetails] || errorDetails.unknown;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="w-full max-w-2xl">
        {/* Main Error Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
          {/* Header with gradient accent */}
          <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />

          <div className="p-8 sm:p-12">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/20 blur-xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500">
                  <svg
                    className="h-10 w-10 text-white"
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
            <h1 className="mb-3 text-center text-3xl font-bold text-gray-900 dark:text-white">
              System Down
            </h1>

            {/* Subtitle */}
            <h2 className="mb-6 text-center text-xl font-semibold text-gray-700 dark:text-gray-300">
              {details.title}
            </h2>

            {/* Description */}
            <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
              {details.description}
            </p>

            {/* Contact Info */}
            <div className="mb-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
              <p className="mb-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                Need immediate assistance?
              </p>
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:admin@frontendpedia.com"
                  className="text-lg font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                >
                  admin@frontendpedia.com
                </a>
              </div>
            </div>

            {/* Technical Details Toggle */}
            <div className="mb-6">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750"
              >
                <span>Technical Details</span>
                <svg
                  className={`h-5 w-5 transition-transform ${showDetails ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDetails && (
                <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
                    {details.technical}
                  </p>
                  <p className="mt-2 font-mono text-xs text-gray-500 dark:text-gray-500">
                    Error Type: {errorType}
                  </p>
                  <p className="font-mono text-xs text-gray-500 dark:text-gray-500">
                    Timestamp: {new Date().toISOString()}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/"
                className="flex-1 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 text-center font-semibold text-white transition-all hover:from-brand-700 hover:to-brand-800 hover:shadow-lg"
              >
                Go to Home
              </a>
              <a
                href="/dashboard"
                className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          If this issue persists, please include the technical details when contacting support.
        </p>
      </div>
    </div>
  );
}

