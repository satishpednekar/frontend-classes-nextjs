'use client';

import { useAdblockDetection } from '@/hooks/useAdblockDetection';
import AdblockRedirect from './AdblockRedirect';
import AdblockTestDebug from './AdblockTestDebug';
import { ADBLOCK_CONFIG } from '@/config/adblock';

export default function AdblockRedirectWrapper() {
  console.log('🔧 AdblockRedirectWrapper rendered');
  
  const { hasChecked, isDetecting, isBlocked } = useAdblockDetection({
    enabled: ADBLOCK_CONFIG.ENABLED,
    checkDelay: ADBLOCK_CONFIG.CHECK_DELAY,
    excludePaths: ADBLOCK_CONFIG.EXCLUDE_PATHS,
    enableLogging: ADBLOCK_CONFIG.ENABLE_LOGGING
  });

  console.log('🔧 AdblockRedirectWrapper state:', { hasChecked, isDetecting, isBlocked });

  return (
    <>
      <AdblockRedirect 
        enabled={ADBLOCK_CONFIG.ENABLED}
        checkDelay={ADBLOCK_CONFIG.CHECK_DELAY}
        excludePaths={ADBLOCK_CONFIG.EXCLUDE_PATHS}
        enableLogging={ADBLOCK_CONFIG.ENABLE_LOGGING}
      />
      <AdblockTestDebug 
        enabled={ADBLOCK_CONFIG.ENABLE_LOGGING}
      />
    </>
  );
}
