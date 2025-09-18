/**
 * Shared adblock detection utilities
 * Centralized detection logic to avoid duplication and ensure consistency
 */

export interface DetectionResult {
  method: string;
  detected: boolean;
  details?: any;
}

export interface DetectionOptions {
  timeout?: number;
  enableLogging?: boolean;
}

/**
 * Base detection method - checks if ad elements are hidden
 */
export const detectAdElement = async (options: DetectionOptions = {}): Promise<DetectionResult> => {
  const { timeout = 100, enableLogging = false } = options;
  
  return new Promise((resolve) => {
    const adElement = document.createElement('div');
    adElement.className = 'adsbox';
    adElement.innerHTML = '&nbsp;';
    adElement.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;';
    document.body.appendChild(adElement);
    
    const timer = setTimeout(() => {
      const isBlocked = adElement.offsetHeight === 0 || adElement.offsetWidth === 0;
      if (enableLogging) {
        console.log('🔍 Ad element detection:', { 
          isBlocked, 
          height: adElement.offsetHeight, 
          width: adElement.offsetWidth 
        });
      }
      adElement.remove();
      resolve({
        method: 'adElement',
        detected: isBlocked,
        details: { height: adElement.offsetHeight, width: adElement.offsetWidth }
      });
    }, timeout);

    // Cleanup function
    const cleanup = () => {
      clearTimeout(timer);
      if (adElement.parentNode) {
        adElement.remove();
      }
    };
  });
};

/**
 * Check if ad scripts are blocked
 */
export const detectAdScript = async (options: DetectionOptions = {}): Promise<DetectionResult> => {
  const { timeout = 3000, enableLogging = false } = options;
  
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    
    let resolved = false;
    
    const cleanup = () => {
      if (script.parentNode) {
        script.remove();
      }
    };

    script.onload = () => {
      if (!resolved) {
        resolved = true;
        if (enableLogging) console.log('✅ Ad script loaded successfully');
        cleanup();
        resolve({
          method: 'adScript',
          detected: false,
          details: { status: 'loaded' }
        });
      }
    };

    script.onerror = () => {
      if (!resolved) {
        resolved = true;
        if (enableLogging) console.log('❌ Ad script blocked');
        cleanup();
        resolve({
          method: 'adScript',
          detected: true,
          details: { status: 'blocked' }
        });
      }
    };

    document.head.appendChild(script);
    
    // Timeout fallback
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        if (enableLogging) console.log('⏰ Ad script timeout - assuming blocked');
        cleanup();
        resolve({
          method: 'adScript',
          detected: true,
          details: { status: 'timeout' }
        });
      }
    }, timeout);
  });
};

/**
 * Check if ad-related CSS classes are blocked
 */
export const detectAdClass = async (options: DetectionOptions = {}): Promise<DetectionResult> => {
  const { timeout = 100, enableLogging = false } = options;
  
  return new Promise((resolve) => {
    const testElement = document.createElement('div');
    testElement.className = 'advertisement';
    testElement.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;';
    document.body.appendChild(testElement);
    
    const timer = setTimeout(() => {
      const computedStyle = window.getComputedStyle(testElement);
      const isBlocked = computedStyle.display === 'none' || 
                       computedStyle.visibility === 'hidden' ||
                       computedStyle.height === '0px';
      
      if (enableLogging) {
        console.log('🔍 Ad class detection:', { 
          isBlocked, 
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          height: computedStyle.height
        });
      }
      
      testElement.remove();
      resolve({
        method: 'adClass',
        detected: isBlocked,
        details: { 
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          height: computedStyle.height
        }
      });
    }, timeout);

    // Cleanup function
    const cleanup = () => {
      clearTimeout(timer);
      if (testElement.parentNode) {
        testElement.remove();
      }
    };

  });
};

/**
 * AdBlock Plus specific detection
 */
export const detectAdBlockPlus = async (options: DetectionOptions = {}): Promise<DetectionResult> => {
  const { timeout = 200, enableLogging = false } = options;
  
  return new Promise((resolve) => {
    const testElement = document.createElement('div');
    testElement.className = 'adsbygoogle';
    testElement.id = 'google_ads_iframe_0';
    testElement.innerHTML = '<div class="ad-content">Test Ad</div>';
    testElement.style.cssText = 'position:absolute;left:-9999px;width:100px;height:100px;';
    document.body.appendChild(testElement);
    
    const timer = setTimeout(() => {
      const computedStyle = window.getComputedStyle(testElement);
      const isBlocked = computedStyle.display === 'none' || 
                       computedStyle.visibility === 'hidden' ||
                       computedStyle.height === '0px' ||
                       computedStyle.width === '0px' ||
                       testElement.offsetHeight === 0 ||
                       testElement.offsetWidth === 0;
      
      if (enableLogging) {
        console.log('🔍 AdBlock Plus detection:', { 
          isBlocked, 
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          height: computedStyle.height,
          width: computedStyle.width,
          offsetHeight: testElement.offsetHeight,
          offsetWidth: testElement.offsetWidth
        });
      }
      
      testElement.remove();
      resolve({
        method: 'adBlockPlus',
        detected: isBlocked,
        details: { 
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          height: computedStyle.height,
          width: computedStyle.width,
          offsetHeight: testElement.offsetHeight,
          offsetWidth: testElement.offsetWidth
        }
      });
    }, timeout);

    // Cleanup function
    const cleanup = () => {
      clearTimeout(timer);
      if (testElement.parentNode) {
        testElement.remove();
      }
    };

  });
};

/**
 * Enhanced detection with multiple patterns
 */
export const detectEnhancedAdblock = async (options: DetectionOptions = {}): Promise<DetectionResult> => {
  const { timeout = 100, enableLogging = false } = options;
  
  return new Promise((resolve) => {
    const patterns = [
      { className: 'adsbygoogle', id: 'google_ads_iframe_0' },
      { className: 'advertisement', id: 'ad-container' },
      { className: 'adsbox', id: 'test-ad' },
      { className: 'ad-banner', id: 'banner-ad' },
      { className: 'advertisement-banner', id: 'ad-banner' }
    ];

    let blockedCount = 0;
    let totalTests = patterns.length;
    let completedTests = 0;
    const elements: HTMLElement[] = [];

    patterns.forEach((pattern, index) => {
      const testElement = document.createElement('div');
      testElement.className = pattern.className;
      testElement.id = pattern.id;
      testElement.innerHTML = '<div class="ad-content">Test Ad</div>';
      testElement.style.cssText = 'position:absolute;left:-9999px;width:100px;height:100px;';
      document.body.appendChild(testElement);
      elements.push(testElement);
      
      const timer = setTimeout(() => {
        const computedStyle = window.getComputedStyle(testElement);
        const isBlocked = computedStyle.display === 'none' || 
                         computedStyle.visibility === 'hidden' ||
                         computedStyle.height === '0px' ||
                         computedStyle.width === '0px' ||
                         testElement.offsetHeight === 0 ||
                         testElement.offsetWidth === 0;
        
        if (isBlocked) blockedCount++;
        
        if (enableLogging) {
          console.log(`🔍 Pattern ${index + 1} (${pattern.className}):`, { 
            isBlocked, 
            display: computedStyle.display,
            visibility: computedStyle.visibility,
            height: computedStyle.height,
            width: computedStyle.width,
            offsetHeight: testElement.offsetHeight,
            offsetWidth: testElement.offsetWidth
          });
        }
        
        testElement.remove();
        completedTests++;
        
        // Check if all tests are complete
        if (completedTests === totalTests) {
          const result = blockedCount > 0;
          if (enableLogging) {
            console.log('🔍 Enhanced detection result:', { blockedCount, totalTests, result });
          }
          resolve({
            method: 'enhancedAdblock',
            detected: result,
            details: { blockedCount, totalTests, result }
          });
        }
      }, timeout + (index * 50)); // Stagger the tests
    });

    // Cleanup function
    const cleanup = () => {
      elements.forEach(element => {
        if (element.parentNode) {
          element.remove();
        }
      });
    };

    // Store cleanup for potential early cleanup
  });
};

/**
 * Try to load actual ad content to detect blocking
 */
export const detectRealAdContent = async (options: DetectionOptions = {}): Promise<DetectionResult> => {
  const { timeout = 5000, enableLogging = false } = options;
  
  return new Promise((resolve) => {
    const adContainer = document.createElement('div');
    adContainer.id = 'google_ads_iframe_0';
    adContainer.className = 'adsbygoogle';
    adContainer.setAttribute('data-ad-client', 'ca-pub-1234567890123456');
    adContainer.setAttribute('data-ad-slot', '1234567890');
    adContainer.style.cssText = 'position:absolute;left:-9999px;width:300px;height:250px;';
    document.body.appendChild(adContainer);
    
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    let scriptLoaded = false;
    let scriptBlocked = false;
    let resolved = false;
    
    const cleanup = () => {
      if (script.parentNode) {
        script.remove();
      }
      if (adContainer.parentNode) {
        adContainer.remove();
      }
    };

    script.onload = () => {
      if (resolved) return;
      scriptLoaded = true;
      if (enableLogging) console.log('🔍 Real ad script loaded successfully');
      
      // Try to initialize ads
      try {
        if ((window as any).adsbygoogle) {
          (window as any).adsbygoogle.push({});
        }
      } catch (e) {
        if (enableLogging) console.log('🔍 Ad initialization failed:', e);
      }
      
      setTimeout(() => {
        if (resolved) return;
        resolved = true;
        const isBlocked = adContainer.offsetHeight === 0 || 
                         adContainer.offsetWidth === 0 ||
                         adContainer.innerHTML.trim() === '';
        
        if (enableLogging) {
          console.log('🔍 Real ad content check:', { 
            isBlocked, 
            height: adContainer.offsetHeight,
            width: adContainer.offsetWidth,
            content: adContainer.innerHTML
          });
        }
        
        cleanup();
        resolve({
          method: 'realAdContent',
          detected: isBlocked,
          details: { 
            height: adContainer.offsetHeight,
            width: adContainer.offsetWidth,
            content: adContainer.innerHTML
          }
        });
      }, 1000);
    };
    
    script.onerror = () => {
      if (resolved) return;
      scriptBlocked = true;
      resolved = true;
      if (enableLogging) console.log('🔍 Real ad script blocked');
      cleanup();
      resolve({
        method: 'realAdContent',
        detected: true,
        details: { status: 'script_blocked' }
      });
    };
    
    document.head.appendChild(script);
    
    // Timeout fallback
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        if (enableLogging) console.log('🔍 Real ad script timeout - assuming blocked');
        cleanup();
        resolve({
          method: 'realAdContent',
          detected: true,
          details: { status: 'timeout' }
        });
      }
    }, timeout);
  });
};

/**
 * Run all detection methods and return consolidated results
 */
export const runAdblockDetection = async (
  options: DetectionOptions & { 
    methods?: string[];
    enableLogging?: boolean;
  } = {}
): Promise<{ detected: boolean; results: DetectionResult[]; details: any }> => {
  const { 
    methods = ['adElement', 'adScript', 'adClass', 'adBlockPlus', 'enhancedAdblock', 'realAdContent'],
    enableLogging = false,
    ...detectionOptions 
  } = options;

  console.log('🔍 Starting adblock detection with methods:', methods);
  
  if (enableLogging) {
    console.log('🔍 Starting adblock detection with methods:', methods);
  }

  const detectionFunctions: Record<string, () => Promise<DetectionResult>> = {
    adElement: () => detectAdElement(detectionOptions),
    adScript: () => detectAdScript(detectionOptions),
    adClass: () => detectAdClass(detectionOptions),
    adBlockPlus: () => detectAdBlockPlus(detectionOptions),
    enhancedAdblock: () => detectEnhancedAdblock(detectionOptions),
    realAdContent: () => detectRealAdContent(detectionOptions)
  };

  try {
    const results = await Promise.allSettled(
      methods.map(method => {
        const fn = detectionFunctions[method];
        if (!fn) {
          console.warn(`Unknown detection method: ${method}`);
          return Promise.resolve({ method, detected: false, details: { error: 'Unknown method' } });
        }
        return fn();
      })
    );

    const successfulResults = results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<DetectionResult>).value);

    const detections = successfulResults.filter(result => result.detected).length;
    const detected = detections > 0;

    console.log('🔍 Detection results:', { 
      detected, 
      detections, 
      totalMethods: methods.length,
      results: successfulResults 
    });

    console.log('🔍 Individual method results:');
    successfulResults.forEach(result => {
      console.log(`  - ${result.method}: ${result.detected ? 'BLOCKED' : 'ALLOWED'}`, result.details);
    });

    if (enableLogging) {
      console.log('🔍 Detection results:', { 
        detected, 
        detections, 
        totalMethods: methods.length,
        results: successfulResults 
      });
    }

    return {
      detected,
      results: successfulResults,
      details: {
        detections,
        totalMethods: methods.length,
        successfulMethods: successfulResults.length
      }
    };
  } catch (error) {
    if (enableLogging) {
      console.error('❌ Detection error:', error);
    }
    return {
      detected: false,
      results: [],
      details: { error: error.message }
    };
  }
};

/**
 * Cleanup function to abort all ongoing detections
 */
export const cleanupDetections = () => {
  // This would need to be implemented with proper cleanup tracking
  // For now, we rely on individual cleanup functions in each detection method
  console.log('🧹 Cleaning up adblock detections');
};
