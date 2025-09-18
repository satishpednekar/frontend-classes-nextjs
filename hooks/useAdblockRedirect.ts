'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { runAdblockDetection, cleanupDetections } from '@/lib/adblock-detection';

interface AdblockRedirectOptions {
  enabled?: boolean;
  checkDelay?: number;
  excludePaths?: string[];
  enableLogging?: boolean;
}

export const useAdblockRedirect = (options: AdblockRedirectOptions = {}) => {
  const {
    enabled = true,
    checkDelay = 2000,
    excludePaths = ['/adblock'],
    enableLogging = false
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const [hasChecked, setHasChecked] = useState(false);
  const isMountedRef = useRef(true);
  const detectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Run detection with proper cleanup and error handling
  const runDetection = async () => {
    console.log('🔍 runDetection called');
    
    if (!isMountedRef.current) {
      console.log('🔍 runDetection: Component unmounted, skipping');
      return;
    }
    
    console.log('🔍 AdblockRedirect: Starting detection', { enabled, hasChecked, pathname });
    
    if (enableLogging) {
      console.log('🔍 AdblockRedirect: Starting detection', { enabled, hasChecked, pathname });
    }
    
    if (!enabled || hasChecked) {
      if (enableLogging) {
        console.log('🔍 AdblockRedirect: Skipping detection', { enabled, hasChecked });
      }
      return;
    }
    
    // Skip if on excluded paths
    if (excludePaths.some(path => pathname.startsWith(path))) {
      if (enableLogging) {
        console.log('🔍 AdblockRedirect: Skipping excluded path', pathname);
      }
      return;
    }

    // Check if we've already detected adblock in this session
    const sessionKey = `adblock-detected-${pathname}`;
    const alreadyDetected = sessionStorage.getItem(sessionKey);
    if (alreadyDetected) {
      if (enableLogging) {
        console.log('🔍 AdblockRedirect: Already detected in this session, skipping');
      }
      setHasChecked(true);
      return;
    }

    // Prevent rapid successive detections (minimum 5 seconds between detections)
    const now = Date.now();
    const lastDetection = localStorage.getItem('last-adblock-detection');
    if (lastDetection && (now - parseInt(lastDetection)) < 5000) {
      if (enableLogging) {
        console.log('🔍 AdblockRedirect: Too soon since last detection, skipping');
      }
      setHasChecked(true);
      return;
    }

    try {
      console.log('🔍 AdblockRedirect: Running detection methods...');
      
      if (enableLogging) {
        console.log('🔍 AdblockRedirect: Running detection methods...');
      }
      
      console.log('🔍 About to call runAdblockDetection...');
      const { detected, results, details } = await runAdblockDetection({
        enableLogging,
        methods: ['adElement', 'adScript', 'adClass', 'adBlockPlus', 'enhancedAdblock', 'realAdContent']
      });
      console.log('🔍 runAdblockDetection completed:', { detected, results, details });

      if (!isMountedRef.current) return;

      if (enableLogging) {
        console.log('🔍 AdblockRedirect: Detection results', { detected, results, details });
      }

      if (detected) {
        console.log('🚨 AdblockRedirect: Adblock detected! Redirecting...');
        if (enableLogging) {
          console.log('🚨 AdblockRedirect: Adblock detected! Redirecting...');
        }
        // Set session flag to prevent loop
        sessionStorage.setItem(sessionKey, 'true');
        // Set timestamp to prevent rapid detections
        localStorage.setItem('last-adblock-detection', Date.now().toString());
        // Adblock detected, redirect to adblock page
        const currentUrl = encodeURIComponent(pathname + window.location.search);
        router.push(`/adblock?return=${currentUrl}`);
      } else {
        console.log('✅ AdblockRedirect: No adblock detected');
        if (enableLogging) {
          console.log('✅ AdblockRedirect: No adblock detected');
        }
        // Clear any previous detection flags
        sessionStorage.removeItem(sessionKey);
        // Set timestamp to prevent rapid detections
        localStorage.setItem('last-adblock-detection', Date.now().toString());
      }
    } catch (error) {
      if (enableLogging) {
        console.warn('❌ AdblockRedirect: Detection error:', error);
      }
    } finally {
      if (isMountedRef.current) {
        setHasChecked(true);
      }
    }
  };

  // Reset hasChecked when pathname changes, but only if not coming from adblock page
  useEffect(() => {
    if (pathname !== '/adblock') {
      setHasChecked(false);
    }
  }, [pathname]);

  // Run detection after delay with proper cleanup
  useEffect(() => {
    console.log('🔧 useEffect triggered:', { pathname, enabled, checkDelay });
    
    if (typeof window === 'undefined') {
      console.log('🔧 Skipping - no window');
      return;
    }
    
    // Don't run detection if we're on the adblock page
    if (pathname === '/adblock') {
      console.log('🔧 On adblock page - skipping detection');
      setHasChecked(true);
      return;
    }

    console.log('🔧 Setting up detection timeout:', checkDelay);

    // Clear any existing timeout
    if (detectionTimeoutRef.current) {
      clearTimeout(detectionTimeoutRef.current);
    }

    detectionTimeoutRef.current = setTimeout(() => {
      console.log('🔧 Timeout fired - running detection');
      runDetection();
    }, checkDelay);

    return () => {
      console.log('🔧 Cleanup - clearing timeout');
      if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
        detectionTimeoutRef.current = null;
      }
    };
  }, [pathname, enabled, checkDelay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
      }
      cleanupDetections();
    };
  }, []);

  return {
    hasChecked,
    isDetecting: !hasChecked && enabled && pathname !== '/adblock'
  };
};

export default useAdblockRedirect;
