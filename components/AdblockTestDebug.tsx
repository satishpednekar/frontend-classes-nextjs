'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAdblockStore } from '@/stores/adblockStore';

interface AdblockTestDebugProps {
  enabled?: boolean;
}

export default function AdblockTestDebug({ 
  enabled = false
}: AdblockTestDebugProps) {
  const pathname = usePathname();
  const [status, setStatus] = useState('Initializing...');
  const { isDetecting, hasChecked, isBlocked } = useAdblockStore();

  // Only show in development or when explicitly enabled
  if (process.env.NODE_ENV === 'production' && !enabled) {
    return null;
  }

  useEffect(() => {
    if (pathname === '/adblock') {
      setStatus('On adblock page - skipping detection');
      return;
    }

    if (isDetecting) {
      setStatus('Running detection...');
    } else if (hasChecked) {
      setStatus(isBlocked ? 'Adblock detected!' : 'No adblock detected');
    } else {
      setStatus('Waiting to start detection...');
    }
  }, [pathname, isDetecting, hasChecked, isBlocked]);

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg z-50 max-w-xs shadow-lg">
      <h3 className="font-bold mb-2 text-yellow-400">🔧 Adblock Debug</h3>
      <p className="text-sm">Status: {status}</p>
      <p className="text-sm">Path: {pathname}</p>
      {isDetecting && (
        <div className="flex items-center mt-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400 mr-2"></div>
          <span className="text-xs">Detecting...</span>
        </div>
      )}
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
        disabled={isDetecting}
      >
        {isDetecting ? 'Detecting...' : 'Reload'}
      </button>
    </div>
  );
}
