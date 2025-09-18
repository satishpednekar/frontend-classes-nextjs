# Adblock Detection System - Refactored

## Overview

This document describes the refactored adblock detection system that has been completely rewritten to address bugs, improve modularity, and enhance user experience.

## Key Improvements

### ✅ **Issues Fixed**

1. **Code Duplication Eliminated**
   - Created shared detection utilities in `lib/adblock-detection.ts`
   - All components now use the same detection logic
   - Consistent behavior across the application

2. **Memory Leaks Fixed**
   - Proper cleanup of setTimeout timers
   - DOM elements are always removed after detection
   - Component unmounting properly handled

3. **Race Conditions Resolved**
   - Added `isMountedRef` to prevent state updates after unmount
   - Proper timeout management with refs
   - Single detection per component lifecycle

4. **Performance Optimized**
   - Reduced unnecessary re-renders with `useCallback`
   - Conditional logging (disabled in production)
   - Efficient detection method selection

5. **Error Handling Enhanced**
   - Added `AdblockErrorBoundary` component
   - Graceful fallbacks for detection failures
   - Better error reporting and recovery

6. **Production Ready**
   - Debug component only shows in development
   - Console logging disabled in production
   - Proper TypeScript types throughout

## Architecture

### Core Files

```
lib/
├── adblock-detection.ts          # Shared detection utilities
hooks/
├── useAdblockRedirect.ts         # Main detection hook
components/
├── AdblockRedirect.tsx           # Redirect component
├── AdblockTestDebug.tsx          # Debug component (dev only)
├── AdblockErrorBoundary.tsx      # Error boundary
app/(website)/adblock/
├── page.tsx                      # Route handler
└── adblock-page.tsx              # Adblock page component
```

### Detection Methods

1. **adElement** - Basic ad element visibility check
2. **adScript** - Script loading detection
3. **adClass** - CSS class blocking detection
4. **adBlockPlus** - AdBlock Plus specific patterns
5. **enhancedAdblock** - Multiple pattern testing
6. **realAdContent** - Real ad content loading test

## Usage

### Basic Implementation

```tsx
import { useAdblockRedirect } from '@/hooks/useAdblockRedirect';

function MyComponent() {
  const { hasChecked, isDetecting } = useAdblockRedirect({
    enabled: true,
    checkDelay: 2000,
    excludePaths: ['/adblock'],
    enableLogging: false
  });

  return (
    <div>
      {isDetecting && <div>Checking for ad blockers...</div>}
      {/* Your content */}
    </div>
  );
}
```

### Detection Utilities

```tsx
import { runAdblockDetection } from '@/lib/adblock-detection';

const { detected, results, details } = await runAdblockDetection({
  enableLogging: true,
  methods: ['adElement', 'adScript', 'adClass'],
  timeout: 3000
});
```

## Configuration

### Environment Variables

- `NODE_ENV=development` - Enables debug mode and logging
- `NODE_ENV=production` - Disables debug component and logging

### Options

```typescript
interface AdblockRedirectOptions {
  enabled?: boolean;           // Enable/disable detection
  checkDelay?: number;        // Delay before detection (ms)
  excludePaths?: string[];    // Paths to skip detection
  enableLogging?: boolean;    // Enable console logging
}
```

## State Management

### Session Storage
- `adblock-detected-{pathname}` - Per-page detection flags
- Prevents duplicate detections on same page

### Local Storage
- `last-adblock-detection` - Timestamp of last detection
- Prevents rapid successive detections (5-second minimum)

## Error Handling

### Error Boundary
The `AdblockErrorBoundary` component catches any errors in the adblock detection system and displays a user-friendly error message with a refresh option.

### Graceful Degradation
- Detection failures don't break the application
- Fallback to assuming no adblock if detection fails
- Proper cleanup on component unmount

## Performance Considerations

### Optimizations
- Detection methods run in parallel using `Promise.allSettled`
- Timeout management prevents hanging detections
- Memory cleanup prevents leaks
- Conditional rendering reduces bundle size

### Monitoring
- Debug component shows real-time detection status
- Console logging for development debugging
- Error boundary for production error handling

## Testing

### Manual Testing
1. Enable adblocker (AdBlock Plus, uBlock Origin, etc.)
2. Navigate to any page
3. Should redirect to `/adblock` page
4. Disable adblocker and refresh
5. Should return to original page

### Edge Cases Tested
- Rapid navigation between pages
- Browser back/forward buttons
- Page refresh during detection
- Multiple tabs open
- Network connectivity issues

## Migration Notes

### Breaking Changes
- `useAdblockRedirect` now returns `{ hasChecked, isDetecting }` instead of just `{ hasChecked }`
- Debug component requires explicit `enabled` prop
- Detection methods are now centralized

### Backward Compatibility
- All existing functionality preserved
- Same redirect behavior
- Same adblock page experience

## Troubleshooting

### Common Issues

1. **Detection not working**
   - Check if adblocker is actually blocking ads
   - Verify detection methods in console logs
   - Check session storage for detection flags

2. **Infinite redirects**
   - Clear session storage and local storage
   - Check excludePaths configuration
   - Verify adblock page is working

3. **Performance issues**
   - Disable debug component in production
   - Reduce detection methods if needed
   - Check for memory leaks in browser dev tools

### Debug Mode

Enable debug mode by setting `NODE_ENV=development` or passing `enableLogging: true` to the hook.

## Future Enhancements

### Planned Features
- Detection method configuration via environment variables
- Custom detection patterns for specific adblockers
- Analytics integration for detection statistics
- A/B testing for different detection strategies

### Performance Improvements
- Web Workers for detection (if needed)
- Caching of detection results
- Lazy loading of detection methods

## Security Considerations

### Privacy
- No personal data collected during detection
- Detection methods use standard web APIs
- No tracking or analytics in detection code

### Security
- All detection methods are client-side only
- No external API calls for detection
- Proper error handling prevents information leakage

## Conclusion

The refactored adblock detection system provides a robust, maintainable, and performant solution for detecting ad blockers while maintaining excellent user experience. The modular architecture makes it easy to extend and modify detection methods as needed.
