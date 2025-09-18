'use client';

import { useState, useEffect, useCallback } from 'react';

// Type definitions for better TypeScript support
interface AdblockDetectionResult {
  isAdblockDetected: boolean;
  isChecking: boolean;
  detectionMethod: string | null;
  retryDetection: () => void;
}

interface AdblockDetectionOptions {
  timeout?: number;
  retryAttempts?: number;
}

// Native detection methods only (no external dependencies)
const nativeDetectionMethods = {
  // Method 1: Check if ad elements are hidden by CSS
  checkAdElementVisibility: (): Promise<boolean> => {
    return new Promise((resolve) => {
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
  },

  // Method 2: Check if ad-related CSS classes are blocked
  checkAdClassBlocking: (): Promise<boolean> => {
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
  },

  // Method 3: Check if ad-related scripts are blocked
  checkAdScriptBlocking: (): Promise<boolean> => {
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
      
      // Timeout fallback
      setTimeout(() => {
        script.remove();
        resolve(true);
      }, 3000);
    });
  },

  // Method 4: Check if ad containers are modified
  checkAdContainerModification: (): Promise<boolean> => {
    return new Promise((resolve) => {
      const adContainer = document.createElement('div');
      adContainer.id = 'test-ad-container';
      adContainer.className = 'ad-container';
      adContainer.innerHTML = '<div class="ad-content">Test Ad</div>';
      adContainer.style.cssText = 'position:absolute;left:-9999px;width:100px;height:100px;';
      document.body.appendChild(adContainer);
      
      setTimeout(() => {
        const adContent = adContainer.querySelector('.ad-content');
        const isBlocked = !adContent || 
                         adContent.offsetHeight === 0 || 
                         adContent.innerHTML === '';
        adContainer.remove();
        resolve(isBlocked);
      }, 100);
    });
  }
};

// Main hook implementation (native methods only)
export const useAdblockDetection = (options: AdblockDetectionOptions = {}): AdblockDetectionResult => {
  const {
    timeout = 5000,
    retryAttempts = 3
  } = options;

  const [isAdblockDetected, setIsAdblockDetected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [detectionMethod, setDetectionMethod] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Run all detection methods
  const runDetection = useCallback(async () => {
    setIsChecking(true);
    
    try {
      // Run native detection methods in parallel
      const nativeResults = await Promise.allSettled([
        nativeDetectionMethods.checkAdElementVisibility(),
        nativeDetectionMethods.checkAdClassBlocking(),
        nativeDetectionMethods.checkAdScriptBlocking(),
        nativeDetectionMethods.checkAdContainerModification()
      ]);

      // Count how many methods detected adblock
      const nativeDetections = nativeResults
        .filter(result => result.status === 'fulfilled' && result.value === true)
        .length;

      // Determine if adblock is detected
      if (nativeDetections > 0) {
        setIsAdblockDetected(true);
        setDetectionMethod(`Native (${nativeDetections}/4 methods)`);
      } else {
        setIsAdblockDetected(false);
        setDetectionMethod('None detected');
      }
    } catch (error) {
      console.warn('Adblock detection error:', error);
      setIsAdblockDetected(false);
      setDetectionMethod('Error');
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Retry detection function
  const retryDetection = useCallback(() => {
    if (retryCount < retryAttempts) {
      setRetryCount(prev => prev + 1);
      runDetection();
    }
  }, [retryCount, retryAttempts, runDetection]);

  // Initial detection
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setIsChecking(false);
      return;
    }

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      runDetection();
    }, 1000);

    return () => clearTimeout(timer);
  }, [runDetection]);

  // Timeout fallback
  useEffect(() => {
    if (isChecking) {
      const timeoutId = setTimeout(() => {
        setIsChecking(false);
        if (!isAdblockDetected) {
          setDetectionMethod('Timeout');
        }
      }, timeout);

      return () => clearTimeout(timeoutId);
    }
  }, [isChecking, isAdblockDetected, timeout]);

  return {
    isAdblockDetected,
    isChecking,
    detectionMethod,
    retryDetection
  };
};

export default useAdblockDetection;
