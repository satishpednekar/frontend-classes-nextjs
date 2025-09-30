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
- **Social Sharing**: ShareThis integration for 40+ social channels

### Technical Features
- **Dark Mode**: Theme switching with persistence
- **Responsive Design**: Mobile-first approach
- **TypeScript**: Type safety throughout
- **Error Handling**: Graceful error boundaries
- **Loading States**: Skeleton screens and loading indicators
- **Auth UX**: Social sign-in buttons now respect the `callbackUrl` supplied by NextAuth, so users return to the dashboard after authenticating.
- **Profile Images**: Remote avatars from Google/GitHub are allowed via `next.config.ts` to support social logins showing the user’s picture.

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

### Social Media Integration
- **ShareThis Widget**: 40+ social sharing channels
- **Social Sharing**: Easy content sharing across platforms
- **Community Engagement**: Boost content reach and visibility

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

## Platform SaaS Architecture (NEW)

### Database Architecture

**PostgreSQL (Vercel Postgres)** with **Prisma ORM**

Complete schema documentation: See `DATABASE_DESIGN.md`

**Core Domain Models:**

1. **User Management**
   - `users`: Authentication and identity (NextAuth)
   - `user_profiles`: Extended user data (50+ fields)
   - `accounts`, `sessions`: OAuth management

2. **Authorization (RBAC)**
   - `roles`: System and custom roles
   - `permissions`: Granular resource:action permissions
   - `user_roles`, `role_permissions`: Many-to-many relationships
   - Support for temporary access with expiration dates

3. **Subscription & Billing**
   - `subscriptions`: Tier management (FREE, BASIC, PRO, ENTERPRISE)
   - `invoices`: Billing history
   - `subscription_logs`: Audit trail
   - Full Stripe integration

4. **Learning System**
   - `content`: Posts, videos, courses, PDFs
   - `learning_paths`: Curated learning journeys
   - `learning_path_items`: Path content with ordering
   - `progress_tracking`: User progress per content item
   - `bookmarks`, `notes`: User engagement

5. **Gamification**
   - `achievements`: Milestone definitions
   - `user_achievements`: User unlocks
   - `certificates`: Course completion certificates
   - `quizzes`, `quiz_attempts`: Assessment system

6. **Analytics**
   - `activity_logs`: User action tracking
   - `notifications`: In-app notifications
   - `notification_preferences`: User preferences

7. **System**
   - `feature_flags`: Feature rollout control

### API Architecture

**REST API** built with Next.js 15 App Router:

- `/api/profile` - User profile CRUD
- `/api/roles` - Role management (planned)
- `/api/permissions` - Permission management (planned)
- `/api/learning-path` - Learning paths (exists, to be DB-backed)
- `/api/content` - Content management (planned)
- `/api/subscription` - Subscription management (planned)

**Authentication:** NextAuth v4 with JWT sessions

### Permission System

**RBAC with Fine-Grained Permissions:**

- **Roles**: admin, instructor, moderator, pro_user, free_user
- **Permissions**: `resource:action` format (e.g., `content:create`)
- **Flexible Assignment**: Users can have multiple roles + direct permissions
- **Temporary Access**: Roles/permissions can expire

**Utility Functions:**
```typescript
import { getUserPermissions, hasPermission, hasRole, isAdmin, isPro } from '@/lib/auth/permissions';
```

### User Profile System

**Comprehensive Profile Fields:**

- **Personal**: Name, bio, location, timezone, language
- **Professional**: Job title, company, experience, social links
- **Learning**: Experience level, goals, interests, learning style
- **Tracking**: Learning minutes, streaks, progress
- **Privacy**: Profile visibility, analytics consent

**Audience Types:**
- FREE_USER, PRO_USER, TRIAL_USER, ENTERPRISE_USER
- STUDENT, INSTRUCTOR, ADMIN

**React Component:** `UserProfileForm.tsx` with tabbed interface

### Technology Stack (Platform)

| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | Next.js 15 | App Router, RSC |
| Database | PostgreSQL | Vercel Postgres |
| ORM | Prisma 5 | Type-safe database access |
| Auth | NextAuth v4 | OAuth + JWT |
| Payments | Stripe | Subscriptions |
| Caching | Redis | Feed cache, rate limiting |
| Email | Resend | Transactional emails |
| Storage | Vercel Blob | File uploads |
| Analytics | Vercel Analytics | Performance tracking |

### File Structure (Platform)

```
platform-saas-main/
├── prisma/
│   ├── schema.prisma           # Complete DB schema
│   └── seed.ts                 # Initial data
├── src/
│   ├── app/
│   │   ├── (admin)/            # Admin pages
│   │   └── api/
│   │       └── profile/        # Profile API
│   ├── components/
│   │   └── user-profile/       # Profile components
│   ├── lib/
│   │   ├── prisma.ts           # DB client
│   │   └── auth/
│   │       └── permissions.ts  # RBAC utilities
│   └── types/
│       └── user-profile.ts     # TypeScript types
└── .env.local                  # Environment config
```

### Setup & Deployment

**Quick Start:**
1. Configure Vercel Postgres (see `SETUP_GUIDE.md`)
2. Run migrations: `npx prisma migrate dev --name init`
3. Seed database: `npx prisma db seed`
4. Start dev server: `npm run dev`

**Documentation:**
- `DATABASE_DESIGN.md` - Complete schema documentation
- `SETUP_GUIDE.md` - Step-by-step setup instructions
- `IMPLEMENTATION_SUMMARY.md` - Implementation overview
- `ENV_TEMPLATE.md` - Environment variables

## Future Considerations

### Website (Existing)
- **CDN Integration**: Global content delivery
- **Database Optimization**: Query performance tuning
- **Caching Strategy**: Multi-layer caching approach
- **Comments System**: User engagement features
- **Newsletter Integration**: Email marketing
- **Advanced Search**: Faceted search capabilities
- **Multi-language**: Internationalization support

### Platform (SaaS)
- **AI Integration**: GPT-powered learning assistant
- **Real-time Features**: WebSocket for live collaboration
- **Advanced Analytics**: ML-based recommendations
- **Team Features**: Organization and team management
- **API Gateway**: Rate limiting and quota management
- **Mobile App**: React Native companion app

---

*This architecture reference is maintained for the Frontendpedia project and should be updated as the project evolves.*

**Last Updated:** September 30, 2025 - Added Platform SaaS architecture with complete database design and RBAC system.
