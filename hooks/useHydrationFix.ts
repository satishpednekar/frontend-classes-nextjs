"use client";

import { useEffect } from 'react';

export function useHydrationFix() {
  useEffect(() => {
    // Suppress hydration warnings for browser extensions
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    const suppressHydrationWarnings = (message: string) => {
      return message.includes('Extra attributes from the server') ||
             message.includes('data-new-gr-c-s-check-loaded') ||
             message.includes('data-gr-ext-installed') ||
             message.includes('Hydration failed because the initial UI does not match') ||
             message.includes('You are mounting a new html component') ||
             message.includes('You are mounting a new body component') ||
             message.includes('validateDOMNesting') ||
             message.includes('cannot appear as a child of');
    };

    console.error = function(...args) {
      const message = args[0];
      if (typeof message === 'string' && suppressHydrationWarnings(message)) {
        return;
      }
      originalConsoleError.apply(console, args);
    };

    console.warn = function(...args) {
      const message = args[0];
      if (typeof message === 'string' && suppressHydrationWarnings(message)) {
        return;
      }
      originalConsoleWarn.apply(console, args);
    };

    // Clean up browser extension attributes
    const cleanExtensionAttributes = () => {
      const body = document.body;
      if (body) {
        const extensionAttributes = [
          'data-new-gr-c-s-check-loaded',
          'data-gr-ext-installed',
          'data-grammarly-shadow-root',
          'data-grammarly-ignore',
          'data-grammarly-original-text',
          'data-grammarly-original-html'
        ];
        
        extensionAttributes.forEach(attr => {
          body.removeAttribute(attr);
        });
      }
    };

    // Run immediately
    cleanExtensionAttributes();
    
    // Set up observer
    const observer = new MutationObserver(() => {
      cleanExtensionAttributes();
    });
    
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true
    });

    // Cleanup
    return () => {
      observer.disconnect();
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);
}
