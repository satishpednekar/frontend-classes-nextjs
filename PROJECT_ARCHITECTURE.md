# Frontendpedia Project Architecture Reference

## Project Overview
**Frontendpedia** - A modern blog platform focused on frontend development, architecture, and design patterns.

## Tech Stack & Dependencies

### Core Framework
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Node.js** runtime

### Content Management
- **Sanity CMS v3** with custom studio
- **Custom schemas** for posts, authors, categories
- **Image optimization** via Sanity CDN

### Styling & UI
- **Tailwind CSS** for styling
- **Headless UI** for components
- **Heroicons** for icons
- **Custom fonts**: Inter, Noto Sans

### State Management
- **Zustand** for global state
- **SWR** for data fetching
- **React Hook Form** for forms

### Deployment & Analytics
- **Vercel** hosting platform
- **Vercel Analytics** & Speed Insights
- **Google Analytics** (G-HB34KD62K8)

## Project Structure

```
frontend-classes-nextjs/
├── app/                          # Next.js App Router
│   ├── (website)/               # Main website routes
│   │   ├── about/               # About page
│   │   ├── archive/             # Blog archive with pagination
│   │   ├── author/[slug]/       # Author profile pages
│   │   ├── category/[slug]/     # Category pages
│   │   ├── contact/             # Contact form
│   │   ├── post/[slug]/         # Individual blog posts
│   │   ├── search/              # Search functionality
│   │   ├── home.js              # Homepage component
│   │   └── layout.tsx           # Website layout
│   ├── (sanity)/                # Sanity Studio routes
│   │   └── studio/              # CMS admin interface
│   ├── api/                     # API routes
│   │   ├── hello/               # Test endpoint
│   │   └── revalidate/          # Cache revalidation
│   ├── rss.xml/                 # RSS feed generation
│   ├── sitemap.ts               # Dynamic sitemap
│   ├── layout.tsx               # Root layout
│   └── providers.jsx            # Context providers
├── components/                   # Reusable React components
│   ├── blog/                    # Blog-specific components
│   │   ├── authorCard.js        # Author display
│   │   ├── category.js          # Category display
│   │   └── pagination.tsx       # Page navigation
│   ├── ui/                      # UI components
│   │   ├── label.js             # Form labels
│   │   ├── search.js            # Search input
│   │   └── time.js              # Time formatting
│   ├── navbar.js                # Navigation component
│   ├── footer.js                # Footer component
│   ├── sidebar.js               # Sidebar component
│   ├── themeSwitch.js           # Dark/light mode toggle
│   └── ...                      # Other components
├── lib/                         # Utility libraries
│   └── sanity/                  # Sanity CMS integration
│       ├── client.ts            # Sanity client config
│       ├── config.ts            # Project configuration
│       ├── groq.js              # Query definitions
│       ├── image.js             # Image optimization
│       ├── schemas/             # Content schemas
│       │   ├── post.js          # Blog post schema
│       │   ├── author.js        # Author schema
│       │   ├── category.js      # Category schema
│       │   └── settings.js      # Site settings
│       └── plugins/             # Sanity plugins
├── stores/                      # Zustand state stores
├── hooks/                       # Custom React hooks
├── utils/                       # Utility functions
├── styles/                      # Global styles
│   ├── tailwind.css             # Tailwind base styles
│   └── prism.css                # Code syntax highlighting
└── public/                      # Static assets
    ├── img/                     # Images and logos
    ├── fonts/                   # Custom fonts
    └── ...                      # Other static files
```

## Data Flow Architecture

### Content Management Flow
1. **Content Creation**: Authors create content in Sanity Studio
2. **Data Storage**: Content stored in Sanity's cloud database
3. **API Queries**: Next.js queries Sanity via GROQ
4. **Static Generation**: Pages generated at build time
5. **Revalidation**: On-demand revalidation for updates

### User Experience Flow
1. **Page Request**: User visits a page
2. **Layout Rendering**: Root layout loads with providers
3. **Data Fetching**: SWR fetches data from Sanity
4. **Component Rendering**: React components render with data
5. **Client Hydration**: Interactive features become available

## Key Features & Integrations

### SEO & Performance
- **Metadata Management**: Comprehensive meta tags
- **OpenGraph**: Social media sharing optimization
- **Structured Data**: JSON-LD for search engines
- **Image Optimization**: Next.js Image component + Sanity CDN
- **Core Web Vitals**: LCP monitoring and optimization
- **Dynamic Sitemap**: Auto-generated with all pages, posts, categories, authors
- **RSS Feed**: Automated content syndication
- **SEO Gold Standard**: Complete coverage of all site pages

### Content Features
- **Blog Posts**: Rich text with code blocks
- **Categories**: Organized content taxonomy
- **Authors**: Multi-author support
- **Search**: Full-text search functionality
- **Archive**: Paginated post listings
- **RSS Feed**: Automated content syndication

### Technical Features
- **Dark Mode**: Theme switching with persistence
- **Responsive Design**: Mobile-first approach
- **TypeScript**: Type safety throughout
- **Error Handling**: Graceful error boundaries
- **Loading States**: Skeleton screens and loading indicators

## Environment Configuration

### Required Environment Variables
```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-03-25

# Site Configuration
SITE_URL=https://www.frontendpedia.com
NEXT_PUBLIC_TWITTER_HANDLE=@Frontendpedia

# Analytics
GOOGLE_SITE_VERIFICATION=your_verification_code
BING_SITE_VERIFICATION=your_verification_code

# Social Profiles (Optional)
NEXT_PUBLIC_SOCIAL_TWITTER=https://x.com/Frontendpedia
NEXT_PUBLIC_SOCIAL_LINKEDIN=https://linkedin.com/company/frontendpedia
```

## Deployment Architecture

### Vercel Integration
- **Automatic Deployments**: Git-based CI/CD
- **Edge Functions**: API routes on Vercel Edge
- **CDN**: Global content delivery
- **Analytics**: Real-time performance monitoring

### Sanity Studio
- **Admin Interface**: Accessible at `/studio`
- **Content Preview**: Live preview functionality
- **Asset Management**: Image and file handling
- **User Management**: Multi-user collaboration

## Performance Optimizations

### Build-time Optimizations
- **Static Generation**: Pre-rendered pages
- **Image Optimization**: WebP/AVIF formats
- **Code Splitting**: Automatic bundle optimization
- **Tree Shaking**: Unused code elimination

### Runtime Optimizations
- **SWR Caching**: Client-side data caching
- **Lazy Loading**: Component and image lazy loading
- **Prefetching**: Link prefetching for navigation
- **Service Worker**: Offline functionality (if implemented)

## Security Considerations

### Content Security
- **CORS Configuration**: Sanity API access control
- **Environment Variables**: Secure configuration management
- **API Routes**: Server-side data fetching
- **Input Validation**: Form and query validation

### SEO Security
- **Robots.txt**: Search engine directives
- **Meta Tags**: Proper indexing controls
- **Canonical URLs**: Duplicate content prevention
- **Sitemap**: Structured content discovery

## Development Workflow

### Local Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Start Sanity Studio
pnpm sanity

# Import demo data
pnpm sanity-import

# Build for production
pnpm build
```

### Content Management
1. **Access Studio**: Navigate to `/studio`
2. **Create Content**: Use Sanity Studio interface
3. **Preview Changes**: Live preview functionality
4. **Publish**: Content goes live immediately
5. **Revalidate**: Cache invalidation if needed

## Monitoring & Analytics

### Performance Monitoring
- **Vercel Analytics**: Real-time performance data
- **Speed Insights**: Core Web Vitals tracking
- **LCP Observer**: Custom performance monitoring

### Content Analytics
- **Google Analytics**: User behavior tracking
- **Search Console**: SEO performance data

## Future Considerations

### Scalability
- **CDN Integration**: Global content delivery
- **Database Optimization**: Query performance tuning
- **Caching Strategy**: Multi-layer caching approach

### Feature Enhancements
- **Comments System**: User engagement features
- **Newsletter Integration**: Email marketing
- **Advanced Search**: Faceted search capabilities
- **Multi-language**: Internationalization support

---

*This architecture reference is maintained for the Frontendpedia project and should be updated as the project evolves.*
