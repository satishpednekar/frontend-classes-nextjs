// Adblock Detection Configuration
export const ADBLOCK_CONFIG = {
  // Detection delay in milliseconds
  // 500ms = Fast detection (recommended)
  // 1000ms = Medium detection
  // 2000ms = Slow detection (original)
  CHECK_DELAY: 500,
  
  // Minimum time between detections (prevents spam)
  MIN_DETECTION_INTERVAL: 5000,
  
  // Paths to exclude from detection
  EXCLUDE_PATHS: ['/adblock'],
  
  // Enable detailed logging in development
  ENABLE_LOGGING: process.env.NODE_ENV === 'development',
  
  // Detection methods to use
  DETECTION_METHODS: [
    'adElement',
    'adScript', 
    'adClass',
    'adBlockPlus',
    'enhancedAdblock',
    'realAdContent'
  ] as const,
  
  // Timeout for individual detection methods
  METHOD_TIMEOUT: 3000,
  
  // Whether to enable detection
  ENABLED: true
} as const;

export type AdblockConfig = typeof ADBLOCK_CONFIG;
