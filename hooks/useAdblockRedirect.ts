'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdblockRedirectOptions {
  enabled?: boolean;
  checkDelay?: number;
  excludePaths?: string[];
}

export const useAdblockRedirect = (options: AdblockRedirectOptions = {}) => {
  const {
    enabled = true,
    checkDelay = 2000,
    excludePaths = ['/adblock']
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const [hasChecked, setHasChecked] = useState(false);

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

  // Check for Brave browser
  const checkBraveBrowser = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const isBrave = !!(window as any).chrome && (window as any).chrome.runtime && (window as any).chrome.runtime.onConnect;
      
      if (isBrave) {
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
  };

  // Run detection
  const runDetection = async () => {
    if (!enabled || hasChecked) return;
    
    // Skip if on excluded paths
    if (excludePaths.some(path => pathname.startsWith(path))) {
      return;
    }

    try {
      const results = await Promise.allSettled([
        detectAdblock(),
        checkAdScript(),
        checkAdClass(),
        checkBraveBrowser()
      ]);

      const detections = results
        .filter(result => result.status === 'fulfilled' && result.value === true)
        .length;

      if (detections > 0) {
        // Adblock detected, redirect to adblock page
        const currentUrl = encodeURIComponent(pathname + window.location.search);
        router.push(`/adblock?return=${currentUrl}`);
      }
    } catch (error) {
      console.warn('Adblock detection error:', error);
    } finally {
      setHasChecked(true);
    }
  };

  // Run detection after delay
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      runDetection();
    }, checkDelay);

    return () => clearTimeout(timer);
  }, [pathname, enabled, checkDelay]);

  return {
    hasChecked
  };
};

export default useAdblockRedirect;
