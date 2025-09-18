'use client';

import { useState, useEffect } from 'react';
import useAdblockDetection from '@/hooks/useAdblockDetectionRobust';
import AdblockModal from './AdblockModal';

interface AdblockDetectorProps {
  enabled?: boolean;
  showModalDelay?: number;
  rememberUserChoice?: boolean;
  onAdblockDetected?: () => void;
  onUserChoice?: (choice: 'disabled' | 'continued') => void;
}

export default function AdblockDetector({
  enabled = true,
  showModalDelay = 2000,
  rememberUserChoice = true,
  onAdblockDetected,
  onUserChoice
}: AdblockDetectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [userChoice, setUserChoice] = useState<'disabled' | 'continued' | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const {
    isAdblockDetected,
    isChecking,
    detectionMethod,
    retryDetection
  } = useAdblockDetection({
    timeout: 10000,
    retryAttempts: 2,
    enableBlockAdBlock: true
  });

  // Check if user has already made a choice
  useEffect(() => {
    if (typeof window === 'undefined' || !rememberUserChoice) return;

    const savedChoice = localStorage.getItem('adblock-user-choice');
    if (savedChoice === 'disabled' || savedChoice === 'continued') {
      setUserChoice(savedChoice as 'disabled' | 'continued');
    }
  }, [rememberUserChoice]);

  // Handle adblock detection
  useEffect(() => {
    if (!enabled || !isAdblockDetected || userChoice) return;

    // Call the callback if provided
    onAdblockDetected?.();

    // Show modal after delay
    const timer = setTimeout(() => {
      setShowModal(true);
    }, showModalDelay);

    return () => clearTimeout(timer);
  }, [enabled, isAdblockDetected, userChoice, showModalDelay, onAdblockDetected]);

  // Handle user choice to disable adblock
  const handleDisableAdblock = () => {
    setUserChoice('disabled');
    onUserChoice?.('disabled');
    
    if (rememberUserChoice) {
      localStorage.setItem('adblock-user-choice', 'disabled');
    }
  };

  // Handle user choice to continue anyway
  const handleContinueAnyway = () => {
    setUserChoice('continued');
    onUserChoice?.('continued');
    
    if (rememberUserChoice) {
      localStorage.setItem('adblock-user-choice', 'continued');
    }
  };

  // Handle retry detection
  const handleRetry = async () => {
    setIsRetrying(true);
    setUserChoice(null);
    
    if (rememberUserChoice) {
      localStorage.removeItem('adblock-user-choice');
    }
    
    // Wait a bit before retrying
    setTimeout(() => {
      retryDetection();
      setIsRetrying(false);
    }, 1000);
  };

  // Don't render anything if disabled or user already made choice
  if (!enabled || userChoice === 'continued' || (!isAdblockDetected && !isChecking)) {
    return null;
  }

  // Show loading state if checking
  if (isChecking && !isAdblockDetected) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50 z-40 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-gray-700 dark:text-gray-300">Checking for ad blockers...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdblockModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onDisableAdblock={handleDisableAdblock}
      onContinueAnyway={handleContinueAnyway}
      detectionMethod={detectionMethod}
      isRetrying={isRetrying}
      onRetry={handleRetry}
    />
  );
}

// Export the hook for use in other components if needed
export { useAdblockDetection };
