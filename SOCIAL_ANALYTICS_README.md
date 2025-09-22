# Social Media Analytics & Brand Mention Tracking

This document describes the native social media analytics and brand mention tracking system implemented for Frontendpedia.

## Features

### 1. Native Social Share Buttons
- **Location**: `components/SocialShareButtons.js`
- **Features**:
  - Native implementation (no third-party dependencies)
  - Analytics tracking for each share action
  - Share count display
  - Multiple variants: default, minimal, compact
  - Support for Twitter, LinkedIn, Reddit, Email, and Copy Link
  - Hardware performance metrics collection
  - User behavior tracking

### 2. Social Icons with Analytics
- **Location**: `components/SocialIconsWithAnalytics.js`
- **Features**:
  - Analytics tracking for header/footer social icons
  - Support for Twitter, LinkedIn, and Medium
  - Multiple variants: header, footer, minimal
  - Click tracking and user data collection

### 3. Analytics API Endpoints

#### Social Share Analytics
- **Endpoint**: `/api/analytics/social-share`
- **Methods**: GET, POST
- **Features**:
  - Track social share clicks and copy actions
  - Collect user hardware data (device memory, CPU cores, connection type)
  - Geographic data (country detection)
  - Performance scoring based on hardware capabilities
  - Session tracking
  - Platform breakdown
  - Device breakdown
  - Hourly/daily distribution

#### Share Counts
- **Endpoint**: `/api/analytics/share-counts`
- **Methods**: GET, POST
- **Features**:
  - Track share counts per URL and platform
  - Increment counts on share actions

#### Brand Mentions
- **Endpoint**: `/api/analytics/brand-mentions`
- **Methods**: GET, POST
- **Features**:
  - Track brand mentions across platforms
  - Sentiment analysis (positive, negative, neutral)
  - Reach and engagement metrics
  - Platform breakdown
  - Author verification status

#### Brand Mention Crawler
- **Endpoint**: `/api/analytics/crawl-mentions`
- **Methods**: GET, POST
- **Features**:
  - Trigger web crawler to find brand mentions
  - Support for multiple platforms (Twitter, Reddit, Medium, Dev.to, etc.)
  - Configurable crawl parameters

### 4. Web Crawler for Brand Mentions
- **Location**: `lib/crawler/brandMentionCrawler.ts`
- **Features**:
  - Crawl websites and social media platforms
  - Extract brand mentions of "frontendpedia"
  - Sentiment analysis
  - Author extraction
  - Platform detection
  - Respectful crawling with delays
  - URL validation and deduplication

### 5. Admin Dashboard
- **Location**: `app/(sanity)/admin/page.tsx`
- **Features**:
  - Social media analytics visualization
  - Brand mention tracking and analysis
  - Real-time metrics and charts
  - Date range filtering
  - Platform breakdown charts
  - Sentiment analysis
  - Recent activity tables
  - Crawl trigger functionality

## Data Collection

### User Data Collected (No Permissions Required)
- User Agent
- Screen Resolution
- Language
- Timezone
- Device Memory (if available)
- CPU Cores (if available)
- Connection Type (if available)
- Cookie Enabled Status
- Do Not Track Status
- Referrer
- IP Address (for geolocation)

### Performance Metrics
- Hardware-based performance scoring
- Connection quality assessment
- Device capability analysis

## Installation & Setup

### 1. Install Dependencies
```bash
npm install jsdom
```

### 2. Environment Variables
No additional environment variables required for basic functionality.

### 3. Database Setup
Currently uses in-memory storage for demo purposes. For production, replace with:
- PostgreSQL for analytics data
- Redis for caching
- MongoDB for document storage

## Usage

### Social Share Buttons
```jsx
import SocialShareButtons from '@/components/SocialShareButtons';

<SocialShareButtons 
  url="https://example.com/post"
  title="Post Title"
  description="Post Description"
  variant="default"
  showCounts={true}
  className="justify-center"
/>
```

### Social Icons with Analytics
```jsx
import SocialIconsWithAnalytics from '@/components/SocialIconsWithAnalytics';

<SocialIconsWithAnalytics 
  variant="header"
  className="space-x-3"
/>
```

### Admin Dashboard
Access the admin dashboard at `/admin` to view:
- Social media analytics
- Brand mention tracking
- Crawl management
- Performance metrics

## API Usage

### Track Social Share
```javascript
const response = await fetch('/api/analytics/social-share', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    platform: 'twitter',
    action: 'share',
    url: 'https://example.com',
    title: 'Page Title'
  })
});
```

### Get Analytics Data
```javascript
const response = await fetch('/api/analytics/social-share?startDate=2024-01-01&endDate=2024-01-31');
const data = await response.json();
```

### Start Brand Mention Crawl
```javascript
const response = await fetch('/api/analytics/crawl-mentions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    urls: ['https://twitter.com/search?q=frontendpedia'],
    maxPages: 50
  })
});
```

## Performance Benefits

1. **No Third-Party Dependencies**: Eliminates ShareThis and other external scripts
2. **AdBlocker Resistant**: Native implementation bypasses ad blockers
3. **Faster Loading**: No external script loading delays
4. **Better Privacy**: Data stays within your control
5. **Customizable**: Full control over appearance and behavior

## Security Considerations

1. **Rate Limiting**: Implement rate limiting on API endpoints
2. **Input Validation**: Validate all user inputs
3. **Data Privacy**: Ensure compliance with privacy regulations
4. **Crawler Ethics**: Respect robots.txt and implement proper delays
5. **Authentication**: Add admin authentication for dashboard access

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live analytics
2. **Advanced Sentiment Analysis**: ML-based sentiment detection
3. **Social Media APIs**: Direct integration with platform APIs
4. **Export Functionality**: CSV/PDF export of analytics data
5. **Alert System**: Notifications for significant mentions or trends
6. **A/B Testing**: Test different share button designs
7. **Heatmaps**: Visual representation of user interactions

## Troubleshooting

### Common Issues
1. **Crawler Not Working**: Check if target sites allow crawling
2. **Analytics Not Tracking**: Verify API endpoints are accessible
3. **Performance Issues**: Check database connection and query optimization
4. **Missing Data**: Ensure proper error handling in data collection

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` to see detailed logs.

## Support

For issues or questions regarding the social analytics system, please check the admin dashboard or review the API documentation.
