'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { cx } from '@/utils/all';

export default function AdblockPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);
  const [adblockDetected, setAdblockDetected] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  // Get the original URL to return to
  const returnUrl = searchParams.get('return') || '/';
  const originalUrl = decodeURIComponent(returnUrl);

  // Adblock detection methods
  const detectAdblock = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Method 1: Check if ad elements are hidden
      const adElement = document.createElement('div');
      adElement.className = 'adsbox';
      adElement.innerHTML = '&nbsp;';
      adElement.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;';
      document.body.appendChild(adElement);
      
      setTimeout(() => {
        const isBlocked = adElement.offsetHeight === 0 || adElement.offsetWidth === 0;
        adElement.remove();
        resolve(isBlocked);
      }, 100);
    });
  };

  const checkAdScript = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.onload = () => {
        script.remove();
        resolve(false); // Script loaded successfully
      };
      script.onerror = () => {
        script.remove();
        resolve(true); // Script was blocked
      };
      document.head.appendChild(script);
      
      setTimeout(() => {
        script.remove();
        resolve(true);
      }, 3000);
    });
  };

  const checkAdClass = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const testElement = document.createElement('div');
      testElement.className = 'advertisement';
      testElement.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;';
      document.body.appendChild(testElement);
      
      setTimeout(() => {
        const computedStyle = window.getComputedStyle(testElement);
        const isBlocked = computedStyle.display === 'none' || 
                         computedStyle.visibility === 'hidden' ||
                         computedStyle.height === '0px';
        testElement.remove();
        resolve(isBlocked);
      }, 100);
    });
  };

  // Run detection
  const runDetection = async () => {
    setIsChecking(true);
    
    try {
      const results = await Promise.allSettled([
        detectAdblock(),
        checkAdScript(),
        checkAdClass()
      ]);

      const detections = results
        .filter(result => result.status === 'fulfilled' && result.value === true)
        .length;

      if (detections > 0) {
        setAdblockDetected(true);
      } else {
        // No adblock detected, redirect back to original page
        router.push(originalUrl);
      }
    } catch (error) {
      console.warn('Adblock detection error:', error);
      setAdblockDetected(true); // Assume adblock if error
    } finally {
      setIsChecking(false);
    }
  };

  // Initial detection
  useEffect(() => {
    runDetection();
  }, []);

  // Handle retry
  const handleRetry = async () => {
    setIsRetrying(true);
    setAttempts(prev => prev + 1);
    
    setTimeout(() => {
      runDetection();
      setIsRetrying(false);
    }, 1000);
  };

  // Handle refresh after disabling adblock
  const handleRefresh = () => {
    window.location.reload();
  };

  // Show loading state
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl max-w-md w-full mx-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Checking for ad blockers...
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Please wait while we verify your ad blocker status.
          </p>
        </div>
      </div>
    );
  }

  // Show adblock detected message
  if (adblockDetected) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900 rounded-full">
              <ExclamationTriangleIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Ad Blocker Detected
            </h1>
            
            <p className="text-lg text-gray-700 dark:text-gray-300 text-center leading-relaxed mb-6">
              We've detected that you're using an ad blocker. Our website relies on ad revenue to provide free, high-quality content.
            </p>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                ⚠️ Access Required
              </h2>
              <p className="text-red-700 dark:text-red-300">
                You must disable your ad blocker to access our content. This helps us keep our content free and support our writers.
              </p>
            </div>

            {attempts > 0 && (
              <div className="text-center text-red-600 dark:text-red-400 mb-4">
                Attempts: {attempts} - Please disable your ad blocker and try again
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-8 pb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Why we need you to disable your ad blocker:
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Keep our content free and accessible to everyone</li>
                <li>• Support our writers and developers</li>
                <li>• Maintain server costs and hosting</li>
                <li>• Continue creating valuable resources</li>
              </ul>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              Once you've disabled your ad blocker, click the button below to refresh and return to your content.
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 pb-8">
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleRefresh}
                className={cx(
                  "w-full inline-flex justify-center items-center px-6 py-4 text-lg font-semibold rounded-lg transition-all duration-200",
                  "bg-red-600 hover:bg-red-700 text-white",
                  "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                  "dark:focus:ring-offset-gray-800"
                )}
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                I've disabled my ad blocker - Refresh Page
              </button>
              
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className={cx(
                  "w-full inline-flex justify-center items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                  "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                  "dark:focus:ring-offset-gray-800",
                  isRetrying && "opacity-50 cursor-not-allowed"
                )}
              >
                {isRetrying ? 'Checking...' : 'Check again'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
              You will be automatically redirected back to your original page once ad blocking is disabled.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This should not be reached, but just in case
  return null;
}
