'use client';

import { useAdblockRedirect } from '@/hooks/useAdblockRedirect';

interface AdblockRedirectProps {
  enabled?: boolean;
  checkDelay?: number;
  excludePaths?: string[];
}

export default function AdblockRedirect({
  enabled = true,
  checkDelay = 2000,
  excludePaths = ['/adblock']
}: AdblockRedirectProps) {
  useAdblockRedirect({
    enabled,
    checkDelay,
    excludePaths
  });

  // This component doesn't render anything
  return null;
}
