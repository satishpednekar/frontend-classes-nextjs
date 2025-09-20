"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function GDPRBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, can't be disabled
    analytics: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setCookiePreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      preferences: true,
    };
    setCookiePreferences(allAccepted);
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted));
    setShowBanner(false);
    // Trigger any necessary cookie loading here
  };

  const handleRejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      preferences: false,
    };
    setCookiePreferences(onlyEssential);
    localStorage.setItem("cookie-consent", JSON.stringify(onlyEssential));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(cookiePreferences));
    setShowBanner(false);
    setShowSettings(false);
    // Trigger any necessary cookie loading here
  };

  const handlePreferenceChange = (type) => {
    if (type === "essential") return; // Can't disable essential cookies
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {!showSettings ? (
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                We use cookies
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                By clicking "Accept All", you consent to our use of cookies.{" "}
                <a 
                  href="/privacy" 
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  Learn more in our Privacy Policy
                </a>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cookie Settings
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cookie Preferences
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Essential Cookies</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Required for the website to function properly
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.essential}
                    disabled
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-500">Always Active</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Help us understand how visitors interact with our website
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={cookiePreferences.analytics}
                  onChange={() => handlePreferenceChange("analytics")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>


              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Preference Cookies</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Remember your settings and preferences
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={cookiePreferences.preferences}
                  onChange={() => handlePreferenceChange("preferences")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
