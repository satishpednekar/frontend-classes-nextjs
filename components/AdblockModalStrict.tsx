'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cx } from '@/utils/all';

interface AdblockModalStrictProps {
  isOpen: boolean;
  onClose: () => void;
  onDisableAdblock: () => void;
  detectionMethod?: string | null;
  isRetrying?: boolean;
  onRetry?: () => void;
}

export default function AdblockModalStrict({
  isOpen,
  onClose,
  onDisableAdblock,
  detectionMethod,
  isRetrying = false,
  onRetry
}: AdblockModalStrictProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Prevent modal from being closed via console or inspect
  useEffect(() => {
    if (!isOpen) return;

    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 'S') ||
        (e.ctrlKey && e.key === 'A') ||
        (e.ctrlKey && e.key === 'P')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);

    // Disable console access
    const originalConsole = { ...console };
    Object.keys(console).forEach(key => {
      (console as any)[key] = () => {};
    });

    // Restore console when component unmounts
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      Object.assign(console, originalConsole);
    };
  }, [isOpen]);

  // Block content access
  useEffect(() => {
    if (!isOpen) return;

    // Hide all content except the modal
    const contentElements = document.querySelectorAll('body > *:not(#adblock-modal-container)');
    contentElements.forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });

    // Add overlay to prevent interaction with hidden content
    const overlay = document.createElement('div');
    overlay.id = 'adblock-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 9998;
      pointer-events: none;
    `;
    document.body.appendChild(overlay);

    return () => {
      // Restore content visibility
      contentElements.forEach(element => {
        (element as HTMLElement).style.display = '';
      });
      // Remove overlay
      const existingOverlay = document.getElementById('adblock-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }
    };
  }, [isOpen]);

  const handleDisableAdblock = () => {
    setAttempts(prev => prev + 1);
    onDisableAdblock();
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  // Prevent modal from being closed
  const handleClose = () => {
    // Do nothing - modal cannot be closed
  };

  return (
    <div id="adblock-modal-container" className="fixed inset-0 z-50">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-90 dark:bg-opacity-95" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className={cx(
                  "w-full max-w-lg transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all",
                  "bg-white dark:bg-gray-800",
                  "select-none" // Prevent text selection
                )}>
                  {/* Header */}
                  <div className="relative px-6 pt-6 pb-4">
                    <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 dark:text-white text-center mb-4">
                      Ad Blocker Detected
                    </Dialog.Title>
                    
                    <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full">
                      <ExclamationTriangleIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    
                    <p className="text-base text-gray-700 dark:text-gray-300 text-center leading-relaxed mb-4">
                      We've detected that you're using an ad blocker. Our website relies on ad revenue to provide free, high-quality content.
                    </p>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                        ⚠️ Access Restricted
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        You must disable your ad blocker to access this content. There is no way around this requirement.
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-6 pb-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Why we require ad blockers to be disabled:
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Keep our content free and accessible</li>
                        <li>• Support our writers and developers</li>
                        <li>• Maintain server costs and hosting</li>
                        <li>• Continue creating valuable resources</li>
                      </ul>
                    </div>

                    {detectionMethod && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 text-center mb-4">
                        Detection method: {detectionMethod}
                      </div>
                    )}

                    {attempts > 0 && (
                      <div className="text-sm text-red-600 dark:text-red-400 text-center mb-4">
                        Attempts: {attempts} - Please disable your ad blocker and refresh the page
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="px-6 pb-6">
                    <div className="flex flex-col space-y-3">
                      <button
                        type="button"
                        className={cx(
                          "w-full inline-flex justify-center items-center px-6 py-4 text-base font-semibold rounded-lg transition-all duration-200",
                          "bg-red-600 hover:bg-red-700 text-white",
                          "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                          "dark:focus:ring-offset-gray-800"
                        )}
                        onClick={handleDisableAdblock}
                      >
                        <span>I'll disable my ad blocker and refresh</span>
                      </button>
                      
                      {onRetry && (
                        <button
                          type="button"
                          className={cx(
                            "w-full inline-flex justify-center items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                            "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                            "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                            "dark:focus:ring-offset-gray-800"
                          )}
                          onClick={handleRetry}
                          disabled={isRetrying}
                        >
                          {isRetrying ? 'Checking...' : 'Check again'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 pb-6">
                    <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
                      This page will remain blocked until your ad blocker is disabled.
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
