'use client';

import { useState, useEffect, useCallback } from 'react';

// Type definitions
interface AdblockDetectionResult {
  isAdblockDetected: boolean;
  isChecking: boolean;
  detectionMethod: string | null;
  retryDetection: () => void;
  isBlocked: boolean;
}

interface AdblockDetectionOptions {
  timeout?: number;
  retryAttempts?: number;
  enableBlockAdBlock?: boolean;
  strictMode?: boolean;
}

// Enhanced detection methods for Brave and other browsers
const enhancedDetectionMethods = {
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
  },

  // Method 5: Brave browser specific detection
  checkBraveBrowser: (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check for Brave browser
      const isBrave = !!(window as any).chrome && (window as any).chrome.runtime && (window as any).chrome.runtime.onConnect;
      
      if (isBrave) {
        // Try to load a known ad script that Brave blocks
        const script = document.createElement('script');
        script.src = 'https://googletagmanager.com/gtag/js?id=GTM-XXXXXX';
        script.onload = () => {
          script.remove();
          resolve(false);
        };
        script.onerror = () => {
          script.remove();
          resolve(true);
        };
        document.head.appendChild(script);
        
        setTimeout(() => {
          script.remove();
          resolve(true);
        }, 2000);
      } else {
        resolve(false);
      }
    });
  },

  // Method 6: Check for common adblocker patterns
  checkAdblockerPatterns: (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check for common adblocker CSS rules
      const testElement = document.createElement('div');
      testElement.className = 'adsbygoogle';
      testElement.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;';
      document.body.appendChild(testElement);
      
      setTimeout(() => {
        const computedStyle = window.getComputedStyle(testElement);
        const isBlocked = computedStyle.display === 'none' || 
                         computedStyle.visibility === 'hidden' ||
                         computedStyle.height === '0px' ||
                         computedStyle.width === '0px';
        testElement.remove();
        resolve(isBlocked);
      }, 100);
    });
  },

  // Method 7: Check for uBlock Origin specific patterns
  checkUBlockOrigin: (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if uBlock Origin is present
      const uBlockDetected = !!(window as any).uBlockOrigin || 
                            !!(window as any).uBlock || 
                            document.querySelector('#ublock0-epicker');
      
      if (uBlockDetected) {
        resolve(true);
        return;
      }

      // Check for uBlock's CSS rules
      const testElement = document.createElement('div');
      testElement.className = 'adsbygoogle';
      testElement.id = 'google_ads_iframe_0';
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
  }
};

// BlockAdBlock integration (optional)
const checkWithBlockAdBlock = async (): Promise<boolean> => {
  try {
    const BlockAdBlock = await import('blockadblock');
    return new Promise((resolve) => {
      const bab = new BlockAdBlock.default({
        checkOnLoad: false,
        resetOnEnd: false
      });

      bab.onDetected(() => {
        resolve(true);
      });

      bab.onNotDetected(() => {
        resolve(false);
      });

      bab.check();
    });
  } catch (error) {
    console.warn('BlockAdBlock library not available:', error);
    return false;
  }
};

// Main hook implementation
export const useAdblockDetection = (options: AdblockDetectionOptions = {}): AdblockDetectionResult => {
  const {
    timeout = 5000,
    retryAttempts = 3,
    enableBlockAdBlock = true,
    strictMode = true
  } = options;

  const [isAdblockDetected, setIsAdblockDetected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [detectionMethod, setDetectionMethod] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  // Run all detection methods
  const runDetection = useCallback(async () => {
    setIsChecking(true);
    
    try {
      // Run enhanced detection methods in parallel
      const detectionResults = await Promise.allSettled([
        enhancedDetectionMethods.checkAdElementVisibility(),
        enhancedDetectionMethods.checkAdClassBlocking(),
        enhancedDetectionMethods.checkAdScriptBlocking(),
        enhancedDetectionMethods.checkAdContainerModification(),
        enhancedDetectionMethods.checkBraveBrowser(),
        enhancedDetectionMethods.checkAdblockerPatterns(),
        enhancedDetectionMethods.checkUBlockOrigin()
      ]);

      // Count how many methods detected adblock
      const detections = detectionResults
        .filter(result => result.status === 'fulfilled' && result.value === true)
        .length;

      // If any method detected adblock, use that result
      if (detections > 0) {
        setIsAdblockDetected(true);
        setIsBlocked(true);
        setDetectionMethod(`Enhanced (${detections}/7 methods)`);
        setIsChecking(false);
        return;
      }

      // If native methods didn't detect adblock, try BlockAdBlock as fallback
      if (enableBlockAdBlock) {
        try {
          const blockAdBlockResult = await checkWithBlockAdBlock();
          
          if (blockAdBlockResult) {
            setIsAdblockDetected(true);
            setIsBlocked(true);
            setDetectionMethod('BlockAdBlock');
          } else {
            setIsAdblockDetected(false);
            setIsBlocked(false);
            setDetectionMethod('None detected');
          }
        } catch (error) {
          // If BlockAdBlock fails, rely on native methods only
          setIsAdblockDetected(false);
          setIsBlocked(false);
          setDetectionMethod('Native only (BlockAdBlock unavailable)');
        }
      } else {
        setIsAdblockDetected(false);
        setIsBlocked(false);
        setDetectionMethod('None detected');
      }
    } catch (error) {
      console.warn('Adblock detection error:', error);
      setIsAdblockDetected(false);
      setIsBlocked(false);
      setDetectionMethod('Error');
    } finally {
      setIsChecking(false);
    }
  }, [enableBlockAdBlock]);

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

  // Continuous monitoring in strict mode
  useEffect(() => {
    if (!strictMode || !isAdblockDetected) return;

    const interval = setInterval(() => {
      // Re-run detection to ensure adblock is still active
      runDetection();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [strictMode, isAdblockDetected, runDetection]);

  return {
    isAdblockDetected,
    isChecking,
    detectionMethod,
    retryDetection,
    isBlocked
  };
};

export default useAdblockDetection;
