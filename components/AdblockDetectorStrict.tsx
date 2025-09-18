'use client';

import { useState, useEffect } from 'react';
import useAdblockDetection from '@/hooks/useAdblockDetectionStrict';
import AdblockModalStrict from './AdblockModalStrict';

interface AdblockDetectorStrictProps {
  enabled?: boolean;
  showModalDelay?: number;
  onAdblockDetected?: () => void;
  onAdblockDisabled?: () => void;
}

export default function AdblockDetectorStrict({
  enabled = true,
  showModalDelay = 2000,
  onAdblockDetected,
  onAdblockDisabled
}: AdblockDetectorStrictProps) {
  const [showModal, setShowModal] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  const {
    isAdblockDetected,
    isChecking,
    detectionMethod,
    retryDetection,
    isBlocked
  } = useAdblockDetection({
    timeout: 10000,
    retryAttempts: 2,
    enableBlockAdBlock: true,
    strictMode: true
  });

  // Handle adblock detection
  useEffect(() => {
    if (!enabled || !isAdblockDetected || hasShownModal) return;

    // Call the callback if provided
    onAdblockDetected?.();

    // Show modal after delay
    const timer = setTimeout(() => {
      setShowModal(true);
      setHasShownModal(true);
    }, showModalDelay);

    return () => clearTimeout(timer);
  }, [enabled, isAdblockDetected, hasShownModal, showModalDelay, onAdblockDetected]);

  // Handle user choice to disable adblock
  const handleDisableAdblock = () => {
    // Refresh the page to re-check for adblock
    window.location.reload();
  };

  // Handle retry detection
  const handleRetry = async () => {
    setIsRetrying(true);
    
    // Wait a bit before retrying
    setTimeout(() => {
      retryDetection();
      setIsRetrying(false);
    }, 1000);
  };

  // Block content access when adblock is detected
  useEffect(() => {
    if (!isBlocked) return;

    // Add CSS to hide content
    const style = document.createElement('style');
    style.id = 'adblock-blocker-style';
    style.textContent = `
      body > *:not(#adblock-modal-container) {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
      
      #adblock-modal-container {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      /* Prevent scrolling */
      body {
        overflow: hidden !important;
        height: 100vh !important;
      }
      
      /* Hide any potential escape routes */
      .adblock-escape {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 'S') ||
        (e.ctrlKey && e.key === 'A') ||
        (e.ctrlKey && e.key === 'P') ||
        (e.ctrlKey && e.key === 'R') ||
        (e.key === 'F5')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('selectstart', handleSelectStart, true);

    // Disable console access
    const originalConsole = { ...console };
    Object.keys(console).forEach(key => {
      (console as any)[key] = () => {};
    });

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('selectstart', handleSelectStart, true);
      Object.assign(console, originalConsole);
      
      // Remove the style
      const existingStyle = document.getElementById('adblock-blocker-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [isBlocked]);

  // Don't render anything if disabled or no adblock detected
  if (!enabled || (!isAdblockDetected && !isChecking)) {
    return null;
  }

  // Show loading state if checking
  if (isChecking && !isAdblockDetected) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 dark:bg-opacity-95 z-50 flex items-center justify-center">
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

  return (
    <AdblockModalStrict
      isOpen={showModal}
      onClose={() => {}} // Modal cannot be closed
      onDisableAdblock={handleDisableAdblock}
      detectionMethod={detectionMethod}
      isRetrying={isRetrying}
      onRetry={handleRetry}
    />
  );
}

// Export the hook for use in other components if needed
export { useAdblockDetection };
