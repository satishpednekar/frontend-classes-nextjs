'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAdblockStore } from '@/stores/adblockStore';

interface AdblockDetectionOptions {
  enabled?: boolean;
  checkDelay?: number;
  excludePaths?: string[];
  enableLogging?: boolean;
}

export const useAdblockDetection = (options: AdblockDetectionOptions = {}) => {
  const {
    enabled = true,
    checkDelay = 500, // Reduced from 2000ms to 500ms
    excludePaths = ['/adblock'],
    enableLogging = false
  } = options;

  const pathname = usePathname();
  const { 
    isDetecting, 
    hasChecked, 
    isBlocked, 
    currentPath,
    setCurrentPath,
    runDetection 
  } = useAdblockStore();

  // Update current path when pathname changes
  useEffect(() => {
    if (pathname !== currentPath) {
      setCurrentPath(pathname);
    }
  }, [pathname, currentPath, setCurrentPath]);

  // Run detection when pathname changes
  useEffect(() => {
    if (!enabled) return;

    console.log('🔧 Hook: useEffect triggered', { pathname, enabled, checkDelay });

    const timer = setTimeout(() => {
      runDetection(pathname, { enabled, checkDelay, excludePaths, enableLogging });
    }, checkDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname, enabled, checkDelay, excludePaths, enableLogging, runDetection]);

  return {
    isDetecting,
    hasChecked,
    isBlocked,
    currentPath
  };
};

export default useAdblockDetection;