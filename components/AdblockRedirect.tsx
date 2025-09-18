'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdblockStore } from '@/stores/adblockStore';

interface AdblockRedirectProps {
  enabled?: boolean;
  checkDelay?: number;
  excludePaths?: string[];
  enableLogging?: boolean;
}

export default function AdblockRedirect({
  enabled = true,
  checkDelay = 2000,
  excludePaths = ['/adblock'],
  enableLogging = false
}: AdblockRedirectProps) {
  const router = useRouter();
  const { isBlocked, currentPath } = useAdblockStore();

  // Handle redirect when adblock is detected
  useEffect(() => {
    if (isBlocked && currentPath && currentPath !== '/adblock') {
      console.log('🚨 Redirecting to adblock page', { currentPath });
      const currentUrl = encodeURIComponent(currentPath + window.location.search);
      router.push(`/adblock?return=${currentUrl}`);
    }
  }, [isBlocked, currentPath, router]);

  // This component doesn't render anything
  return null;
}