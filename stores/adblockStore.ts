import { create } from 'zustand';
import { runAdblockDetection } from '@/lib/adblock-detection';

interface AdblockState {
  // State
  isDetecting: boolean;
  hasChecked: boolean;
  isBlocked: boolean;
  lastDetection: number | null;
  currentPath: string;
  
  // Actions
  setDetecting: (detecting: boolean) => void;
  setChecked: (checked: boolean) => void;
  setBlocked: (blocked: boolean) => void;
  setCurrentPath: (path: string) => void;
  runDetection: (path: string, options?: {
    enabled?: boolean;
    checkDelay?: number;
    excludePaths?: string[];
    enableLogging?: boolean;
  }) => Promise<void>;
  reset: () => void;
}

export const useAdblockStore = create<AdblockState>((set, get) => ({
  // Initial state
  isDetecting: false,
  hasChecked: false,
  isBlocked: false,
  lastDetection: null,
  currentPath: '',

  // Actions
  setDetecting: (detecting: boolean) => {
    console.log('🔧 Store: setDetecting', detecting);
    set({ isDetecting: detecting });
  },

  setChecked: (checked: boolean) => {
    console.log('🔧 Store: setChecked', checked);
    set({ hasChecked: checked });
  },

  setBlocked: (blocked: boolean) => {
    console.log('🔧 Store: setBlocked', blocked);
    set({ isBlocked: blocked });
  },

  setCurrentPath: (path: string) => {
    console.log('🔧 Store: setCurrentPath', path);
    set({ currentPath: path });
  },

  runDetection: async (path: string, options = {}) => {
    const {
      enabled = true,
      checkDelay = 500, // Reduced from 2000ms to 500ms
      excludePaths = ['/adblock'],
      enableLogging = false
    } = options;

    console.log('🔧 Store: runDetection called', { path, enabled, checkDelay });

    // Skip if disabled
    if (!enabled) {
      console.log('🔧 Store: Detection disabled, skipping');
      return;
    }

    // Skip if on excluded paths
    if (excludePaths.some(excludePath => path.startsWith(excludePath))) {
      console.log('🔧 Store: On excluded path, skipping');
      set({ hasChecked: true, isDetecting: false });
      return;
    }

    // Check if we've already detected adblock in this session
    const sessionKey = `adblock-detected-${path}`;
    const alreadyDetected = sessionStorage.getItem(sessionKey);
    if (alreadyDetected) {
      console.log('🔧 Store: Already detected in this session, skipping');
      set({ hasChecked: true, isDetecting: false, isBlocked: true });
      return;
    }

    // Prevent rapid successive detections (minimum 5 seconds between detections)
    const now = Date.now();
    const { lastDetection } = get();
    if (lastDetection && (now - lastDetection) < 5000) {
      console.log('🔧 Store: Too soon since last detection, skipping');
      set({ hasChecked: true, isDetecting: false });
      return;
    }

    // Set detecting state
    set({ isDetecting: true, hasChecked: false, isBlocked: false, currentPath: path });

    try {
      console.log('🔧 Store: Starting detection...');
      
      const { detected, results, details } = await runAdblockDetection({
        enableLogging,
        methods: ['adElement', 'adScript', 'adClass', 'adBlockPlus', 'enhancedAdblock', 'realAdContent']
      });

      console.log('🔧 Store: Detection completed', { detected, results, details });

      if (detected) {
        console.log('🚨 Store: Adblock detected!');
        // Set session flag to prevent loop
        sessionStorage.setItem(sessionKey, 'true');
        set({ 
          isBlocked: true, 
          hasChecked: true, 
          isDetecting: false,
          lastDetection: now
        });
      } else {
        console.log('✅ Store: No adblock detected');
        // Clear any previous detection flags
        sessionStorage.removeItem(sessionKey);
        set({ 
          isBlocked: false, 
          hasChecked: true, 
          isDetecting: false,
          lastDetection: now
        });
      }
    } catch (error) {
      console.error('❌ Store: Detection error:', error);
      set({ 
        isBlocked: false, 
        hasChecked: true, 
        isDetecting: false,
        lastDetection: now
      });
    }
  },

  reset: () => {
    console.log('🔧 Store: Resetting state');
    set({
      isDetecting: false,
      hasChecked: false,
      isBlocked: false,
      lastDetection: null,
      currentPath: ''
    });
  }
}));
