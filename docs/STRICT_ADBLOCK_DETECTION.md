# Strict Anti-Adblocker System

This document describes the strict anti-adblocker implementation that prevents circumvention and blocks content access until adblockers are disabled.

## Overview

The strict anti-adblocker system is designed to be unbypassable and forces users to disable their adblockers to access content. It includes multiple detection methods, content blocking, and circumvention prevention.

## Key Features

### 🚫 **Unbypassable Design**
- **No "Continue Anyway" option** - Users must disable adblock
- **Content blocking** - All content hidden until adblock disabled
- **Console protection** - Prevents circumvention via developer tools
- **Keyboard shortcut blocking** - Disables F12, Ctrl+Shift+I, etc.
- **Right-click disabled** - Prevents context menu access

### 🔍 **Enhanced Detection**
- **7 detection methods** including Brave browser specific
- **uBlock Origin detection** - Specific patterns for uBlock
- **Continuous monitoring** - Re-checks every 30 seconds
- **Multiple fallback methods** - Native + BlockAdBlock

### 🛡️ **Circumvention Prevention**
- **CSS-based content hiding** - All content hidden with !important
- **JavaScript protection** - Console access disabled
- **Event listener blocking** - Prevents keyboard shortcuts
- **Text selection disabled** - Prevents copying content

## Detection Methods

### Native Methods (7 total)

1. **Ad Element Visibility** - Checks if ad elements are hidden
2. **Ad Class Blocking** - Tests CSS class-based filtering
3. **Ad Script Blocking** - Attempts to load Google AdSense
4. **Ad Container Modification** - Tests content-based filtering
5. **Brave Browser Detection** - Specific patterns for Brave
6. **Adblocker Pattern Detection** - Common adblocker CSS rules
7. **uBlock Origin Detection** - Specific uBlock patterns

### BlockAdBlock Fallback
- Additional detection patterns when available
- Handles edge cases and newer adblockers

## Components

### `useAdblockDetectionStrict` Hook
- Enhanced detection with 7 methods
- Brave browser specific detection
- Continuous monitoring in strict mode
- Returns `isBlocked` status for content blocking

### `AdblockModalStrict` Component
- Uncloseable modal design
- No "Continue Anyway" option
- Console and keyboard protection
- Content blocking overlay

### `AdblockDetectorStrict` Component
- Main orchestrator with strict enforcement
- Content blocking implementation
- Circumvention prevention
- Page refresh on adblock disable

## Content Blocking Implementation

### CSS Blocking
```css
body > *:not(#adblock-modal-container) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}

body {
  overflow: hidden !important;
  height: 100vh !important;
}
```

### JavaScript Protection
- Console access disabled
- Keyboard shortcuts blocked
- Right-click disabled
- Text selection prevented

### Event Prevention
- F12, Ctrl+Shift+I, Ctrl+U blocked
- Ctrl+S, Ctrl+A, Ctrl+P blocked
- F5 refresh blocked
- Context menu disabled

## Brave Browser Support

### Specific Detection Methods
- **Brave browser detection** - Identifies Brave browser
- **Brave ad blocking** - Tests Brave's built-in ad blocking
- **Script loading test** - Attempts to load blocked scripts
- **CSS rule detection** - Checks for Brave-specific blocking

### Enhanced Patterns
- Tests multiple ad-related scripts
- Checks for Brave's specific blocking patterns
- Uses longer timeouts for Brave detection
- Fallback to native methods if Brave detection fails

## Usage

### Basic Implementation
```tsx
import AdblockDetectorStrict from '@/components/AdblockDetectorStrict';

// In your layout
<AdblockDetectorStrict 
  enabled={true}
  showModalDelay={2000}
  onAdblockDetected={() => {
    // Track detection
    analytics.track('adblock_detected_strict');
  }}
  onAdblockDisabled={() => {
    // Track when user disables
    analytics.track('adblock_disabled');
  }}
/>
```

### Configuration Options
```typescript
interface AdblockDetectorStrictProps {
  enabled?: boolean;                    // Enable/disable detection
  showModalDelay?: number;             // Delay before showing modal
  onAdblockDetected?: () => void;     // Callback when detected
  onAdblockDisabled?: () => void;     // Callback when disabled
}
```

## Security Features

### Console Protection
- Disables all console methods
- Prevents debugging and inspection
- Blocks developer tools access
- Restores console on cleanup

### Keyboard Shortcut Blocking
- F12 (Developer Tools)
- Ctrl+Shift+I (Inspect Element)
- Ctrl+Shift+C (Inspect Element)
- Ctrl+U (View Source)
- Ctrl+S (Save Page)
- Ctrl+A (Select All)
- Ctrl+P (Print)
- F5 (Refresh)

### Content Protection
- All content hidden with CSS
- Text selection disabled
- Right-click context menu blocked
- Scrolling disabled
- Overlay prevents interaction

## Browser Compatibility

### Supported Browsers
- **Chrome** - Full support with all features
- **Firefox** - Full support with all features
- **Safari** - Full support with all features
- **Edge** - Full support with all features
- **Brave** - Enhanced detection and support

### Mobile Support
- **iOS Safari** - Full support
- **Chrome Mobile** - Full support
- **Firefox Mobile** - Full support
- **Samsung Internet** - Full support

## Performance Impact

### Bundle Size
- **Native methods only**: ~8KB
- **With BlockAdBlock**: ~15KB
- **Total impact**: Minimal

### Runtime Performance
- **Detection time**: <2 seconds
- **Memory usage**: Minimal
- **CPU impact**: Negligible
- **Network requests**: 1-2 script loads

## Testing

### Manual Testing
1. Install adblocker (uBlock Origin, AdBlock Plus, etc.)
2. Visit site - content should be blocked
3. Try to bypass via console - should fail
4. Try keyboard shortcuts - should be blocked
5. Disable adblocker and refresh - content should load

### Brave Browser Testing
1. Open Brave browser
2. Enable Brave's ad blocking
3. Visit site - should detect and block
4. Disable Brave's ad blocking
5. Refresh - content should load

## Troubleshooting

### Common Issues

1. **Content not blocked**
   - Check if `enabled` prop is true
   - Verify adblocker is actually blocking ads
   - Check browser console for errors

2. **Modal can be closed**
   - Ensure using `AdblockModalStrict` component
   - Check if `onClose` is properly disabled
   - Verify event listeners are attached

3. **Brave browser not detected**
   - Check if Brave's ad blocking is enabled
   - Verify detection methods are running
   - Check for JavaScript errors

### Debug Mode
Enable debug logging:
```bash
NEXT_PUBLIC_DEBUG_ADBLOCK_STRICT=true
```

## Maintenance

### Regular Updates
- Monitor for new adblocker patterns
- Update detection methods as needed
- Test with popular adblocker updates
- Check Brave browser compatibility

### Monitoring
- Track detection rates by browser
- Monitor circumvention attempts
- Analyze user behavior patterns
- Check false positive rates

## Legal Considerations

### Terms of Service
- Clearly state adblocker policy
- Explain why adblockers are blocked
- Provide contact for exceptions
- Include in privacy policy

### User Experience
- Provide clear instructions
- Explain benefits of disabling adblock
- Offer alternative support methods
- Maintain professional tone

## License

This implementation is part of the Frontendpedia project and follows the same license terms.

## Support

For issues or questions regarding the strict anti-adblocker system:
1. Check this documentation
2. Review the component source code
3. Test with different browsers and adblockers
4. Create an issue in the project repository
