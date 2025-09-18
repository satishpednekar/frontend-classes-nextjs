# Adblock Detection System

This document describes the anti-adblocker implementation for the Frontendpedia website.

## Overview

The adblock detection system uses a hybrid approach combining native JavaScript detection methods with the BlockAdBlock library as a fallback for enhanced accuracy. The system is designed to be non-intrusive, user-friendly, and perfectly integrated with the site's design system.

## Architecture

### Components

1. **`useAdblockDetection` Hook** (`hooks/useAdblockDetection.ts`)
   - Main detection logic with multiple methods
   - Native detection methods for better performance
   - BlockAdBlock library integration as fallback
   - TypeScript support with proper type definitions

2. **`AdblockModal` Component** (`components/AdblockModal.tsx`)
   - User-friendly modal matching site design
   - Dark/light mode support
   - Responsive design
   - Clear call-to-action buttons

3. **`AdblockDetector` Component** (`components/AdblockDetector.tsx`)
   - Main orchestrator component
   - User choice persistence
   - Retry functionality
   - Configurable options

4. **`AdblockTest` Component** (`components/AdblockTest.tsx`)
   - Development/testing component
   - Can be removed in production

## Detection Methods

### Native Methods (Primary)

1. **Ad Element Visibility Check**
   - Creates a test ad element and checks if it's hidden
   - Most reliable for CSS-based adblockers

2. **Ad Class Blocking Check**
   - Tests if ad-related CSS classes are blocked
   - Detects class-based filtering

3. **Ad Script Blocking Check**
   - Attempts to load Google AdSense script
   - Detects script-based blocking

4. **Ad Container Modification Check**
   - Tests if ad containers are modified or emptied
   - Detects content-based filtering

### BlockAdBlock Library (Fallback)

- Used when native methods don't detect adblock
- Provides additional detection patterns
- Handles edge cases and newer adblockers

## Features

### User Experience
- **Non-intrusive**: Modal appears after 2-second delay
- **User-friendly**: Clear explanation of why ads are needed
- **Choice-based**: Users can disable adblock or continue anyway
- **Persistent**: Remembers user choice (configurable)
- **Retry option**: Users can retry detection if needed

### Technical Features
- **SSR Safe**: Only runs on client-side
- **Performance Optimized**: Minimal impact on page load
- **TypeScript Support**: Full type safety
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Matches site's theme system
- **Error Handling**: Graceful fallbacks for all scenarios

## Configuration

The `AdblockDetector` component accepts the following props:

```typescript
interface AdblockDetectorProps {
  enabled?: boolean;                    // Enable/disable detection
  showModalDelay?: number;             // Delay before showing modal (ms)
  rememberUserChoice?: boolean;        // Remember user's choice
  onAdblockDetected?: () => void;     // Callback when adblock detected
  onUserChoice?: (choice: 'disabled' | 'continued') => void; // User choice callback
}
```

## Usage

### Basic Usage
```tsx
import AdblockDetector from '@/components/AdblockDetector';

// In your layout or page
<AdblockDetector 
  enabled={true}
  showModalDelay={2000}
  rememberUserChoice={true}
/>
```

### Advanced Usage
```tsx
<AdblockDetector 
  enabled={process.env.NODE_ENV === 'production'}
  showModalDelay={3000}
  rememberUserChoice={true}
  onAdblockDetected={() => {
    // Track adblock detection
    analytics.track('adblock_detected');
  }}
  onUserChoice={(choice) => {
    // Track user choice
    analytics.track('adblock_user_choice', { choice });
  }}
/>
```

## Testing

### Development Testing
1. Install an adblocker (uBlock Origin, AdBlock Plus, etc.)
2. Visit the site - you should see the detection modal
3. Test both "disable adblock" and "continue anyway" options
4. Verify that the choice is remembered on page reload

### Test Component
The `AdblockTest` component provides a testing interface:
- Shows current detection status
- Displays detection method used
- Allows manual retry of detection
- Can be added to any page for testing

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Firefox Mobile
- **Legacy Support**: Internet Explorer 11+ (with polyfills)

## Performance Impact

- **Bundle Size**: ~15KB (including BlockAdBlock library)
- **Runtime Impact**: <100ms detection time
- **Memory Usage**: Minimal, components unmount after use
- **Network Requests**: Only one script load (Google AdSense test)

## Security Considerations

- **No External Dependencies**: BlockAdBlock is the only external library
- **Client-Side Only**: No server-side detection or tracking
- **Privacy Friendly**: No personal data collection
- **GDPR Compliant**: User choice is respected and stored locally

## Troubleshooting

### Common Issues

1. **Modal not appearing**
   - Check if `enabled` prop is true
   - Verify adblocker is actually blocking ads
   - Check browser console for errors

2. **False positives**
   - Some privacy extensions may trigger detection
   - Adjust detection sensitivity if needed
   - Consider whitelisting specific extensions

3. **Performance issues**
   - Detection runs only once per session
   - Check for JavaScript errors in console
   - Verify BlockAdBlock library loaded correctly

### Debug Mode

Enable debug logging by adding to your environment:
```bash
NEXT_PUBLIC_DEBUG_ADBLOCK=true
```

## Maintenance

### Regular Updates
- Monitor for new adblocker patterns
- Update detection methods as needed
- Test with popular adblocker updates

### Monitoring
- Track detection rates
- Monitor user choice patterns
- Analyze false positive rates

## License

This implementation is part of the Frontendpedia project and follows the same license terms.

## Support

For issues or questions regarding the adblock detection system:
1. Check this documentation
2. Review the component source code
3. Test with the provided test component
4. Create an issue in the project repository
