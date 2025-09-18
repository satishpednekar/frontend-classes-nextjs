'use client';

import { useState } from 'react';
import useAdblockDetection from '@/hooks/useAdblockDetection';

// Test component to verify adblock detection works
// This can be removed in production
export default function AdblockTest() {
  const [showTest, setShowTest] = useState(false);
  const { isAdblockDetected, isChecking, detectionMethod, retryDetection } = useAdblockDetection();

  if (!showTest) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowTest(true)}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          Test Adblock Detection
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Adblock Detection Test
        </h3>
        
        <div className="space-y-3">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Status: </span>
            <span className={`px-2 py-1 rounded text-sm ${
              isChecking 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : isAdblockDetected 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {isChecking ? 'Checking...' : isAdblockDetected ? 'Adblock Detected' : 'No Adblock'}
            </span>
          </div>
          
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Method: </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {detectionMethod || 'Unknown'}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={retryDetection}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Retry Detection
          </button>
          <button
            onClick={() => setShowTest(false)}
            className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
