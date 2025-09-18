'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cx } from '@/utils/all';

interface AdblockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDisableAdblock: () => void;
  onContinueAnyway: () => void;
  detectionMethod?: string | null;
  isRetrying?: boolean;
  onRetry?: () => void;
}

export default function AdblockModal({
  isOpen,
  onClose,
  onDisableAdblock,
  onContinueAnyway,
  detectionMethod,
  isRetrying = false,
  onRetry
}: AdblockModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleDisableAdblock = () => {
    onDisableAdblock();
    handleClose();
  };

  const handleContinueAnyway = () => {
    onContinueAnyway();
    handleClose();
  };

  return (
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
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75" />
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
                "w-full max-w-md transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all",
                "bg-white dark:bg-gray-800",
                isClosing && "scale-95 opacity-0"
              )}>
                {/* Header */}
                <div className="relative px-6 pt-6 pb-4">
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    onClick={handleClose}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                  
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <ExclamationTriangleIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  
                  <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 dark:text-white text-center mb-2">
                    Ad Blocker Detected
                  </Dialog.Title>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                    We've detected that you're using an ad blocker. Our website relies on ad revenue to provide free, high-quality content.
                  </p>
                </div>

                {/* Content */}
                <div className="px-6 pb-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Why we show ads:
                    </h4>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
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

                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Please consider disabling your ad blocker for this site to support our work.
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6">
                  <div className="flex flex-col space-y-3">
                    <button
                      type="button"
                      className={cx(
                        "w-full inline-flex justify-center items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                        "bg-blue-600 hover:bg-blue-700 text-white",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        "dark:focus:ring-offset-gray-800"
                      )}
                      onClick={handleDisableAdblock}
                    >
                      <span>I'll disable my ad blocker</span>
                    </button>
                    
                    <button
                      type="button"
                      className={cx(
                        "w-full inline-flex justify-center items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                        "border border-gray-300 dark:border-gray-600",
                        "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300",
                        "hover:bg-gray-50 dark:hover:bg-gray-600",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        "dark:focus:ring-offset-gray-800"
                      )}
                      onClick={handleContinueAnyway}
                    >
                      Continue anyway
                    </button>

                    {onRetry && (
                      <button
                        type="button"
                        className={cx(
                          "w-full inline-flex justify-center items-center px-4 py-2 text-xs font-medium rounded-md transition-all duration-200",
                          "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                          "dark:focus:ring-offset-gray-800"
                        )}
                        onClick={onRetry}
                        disabled={isRetrying}
                      >
                        {isRetrying ? 'Checking...' : 'Retry detection'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                  <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
                    You can always re-enable your ad blocker later if needed.
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
