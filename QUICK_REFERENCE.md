# Frontendpedia SaaS - Quick Reference Card

**Last Updated:** September 30, 2025

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `DATABASE_DESIGN.md` | Complete database architecture (800+ lines) |
| `SETUP_GUIDE.md` | Step-by-step setup instructions |
| `IMPLEMENTATION_SUMMARY.md` | Implementation overview and checklist |
| `ENV_TEMPLATE.md` | Environment variables template |
| `PROJECT_ARCHITECTURE.md` | Updated with SaaS architecture |
| `project-detail.md` | Project overview (updated) |

---

## 🗄️ Database Tables (30+)

### Core Tables
- `users`, `user_profiles` - User data
- `roles`, `permissions`, `user_roles` - RBAC
- `subscriptions`, `invoices` - Billing
- `content`, `learning_paths` - Learning content
- `progress_tracking`, `bookmarks`, `notes` - Engagement
- `achievements`, `certificates` - Gamification
- `activity_logs`, `notifications` - Analytics

**Location:** `platform-saas-main/prisma/schema.prisma`

---

## 🔐 RBAC System

### Roles (Priority)
1. **admin** (100) - Full access
2. **instructor** (50) - Content creation
3. **moderator** (40) - Moderation
4. **pro_user** (20) - Premium features
5. **free_user** (10) - Basic access

### Permission Format
`resource:action` (e.g., `content:create`, `user:manage`)

### Key Functions
```typescript
import {
  getUserPermissions,  // Get complete permission context
  hasPermission,       // Check specific permission
  hasRole,            // Check role assignment
  isAdmin,            // Admin check
  isPro,              // Pro subscription check
  assignRole,         // Assign role to user
  grantPermission,    // Grant direct permission
} from '@/lib/auth/permissions';
```

**Location:** `platform-saas-main/src/lib/auth/permissions.ts`

---

## 👤 User Profile Fields (50+)

### Sections
1. **Personal**: firstName, lastName, bio, location, timezone
2. **Professional**: jobTitle, company, yearsExperience, social links
3. **Learning**: experienceLevel, goals, interests, learningStyle
4. **Tracking**: learningMinutes, streakDays, progress
5. **Privacy**: isProfilePublic, allowAnalytics

### Audience Types
- FREE_USER, PRO_USER, TRIAL_USER, ENTERPRISE_USER
- STUDENT, INSTRUCTOR, ADMIN

**Component:** `platform-saas-main/src/components/user-profile/UserProfileForm.tsx`  
**Types:** `platform-saas-main/src/types/user-profile.ts`

---

## 🔌 API Endpoints

### Implemented
- `GET /api/profile` - Get current user profile
- `POST /api/profile` - Create profile
- `PUT /api/profile` - Update profile

### Planned
- `/api/roles` - Role management
- `/api/permissions` - Permission management
- `/api/learning-path` - Learning paths (DB-backed)
- `/api/content` - Content CRUD
- `/api/subscription` - Subscription management

**Location:** `platform-saas-main/src/app/api/`

---

## 🚀 Quick Setup (5 Steps)

### 1. Create Database
```bash
vercel postgres create
vercel env pull .env.local
```

### 2. Configure Environment
Copy from `ENV_TEMPLATE.md` to `platform-saas-main/.env.local`

### 3. Run Migrations
```bash
cd platform-saas-main
npx prisma migrate dev --name init
```

### 4. Seed Database
```bash
npx prisma db seed
```

### 5. Start Dev Server
```bash
npm run dev
```

**Full Guide:** `SETUP_GUIDE.md`

---

## 📦 Seed Data

**Run:** `npx prisma db seed`

**Creates:**
- ✅ 5 System Roles
- ✅ 21 Permissions
- ✅ Role-Permission Mappings
- ✅ 7 Sample Achievements
- ✅ 4 Feature Flags

**Location:** `platform-saas-main/prisma/seed.ts`

---

## 🔧 Common Commands

### Prisma
```bash
npx prisma generate        # Generate client
npx prisma migrate dev     # Create migration
npx prisma db push         # Push schema changes
npx prisma studio          # Open GUI
npx prisma db seed         # Seed database
npx prisma migrate reset   # Reset DB (dev only)
```

### Development
```bash
npm run dev                # Start dev server
npm run build              # Build for production
npm run lint               # Run linter
```

---

## 📊 Subscription Tiers

| Tier | Features |
|------|----------|
| **FREE** | Basic content, limited paths, bookmarks |
| **BASIC** | More content, personal paths |
| **PRO** | All content, AI features, certificates |
| **ENTERPRISE** | Custom plans, team features, SSO |

**Table:** `subscriptions`  
**Status:** ACTIVE, TRIALING, PAST_DUE, CANCELED

---

## 🎮 Gamification

### Achievement Rarities
- **COMMON** (10-20 pts) - Easy
- **UNCOMMON** (50-100 pts) - Moderate
- **RARE** (200-300 pts) - Challenging
- **EPIC** (500-750 pts) - Very difficult
- **LEGENDARY** (1000+ pts) - Extremely rare

### Examples
- `first_login` - Welcome Aboard! (10 pts)
- `streak_7` - Week Warrior (50 pts)
- `completed_50` - Knowledge Seeker (500 pts)

**Table:** `achievements`, `user_achievements`

---

## 🔍 Key Indexes

Performance-critical indexes:
- `users.email` (unique)
- `user_profiles.userId` (unique)
- `subscriptions.userId` (unique)
- `content.slug` (unique)
- `activity_logs.userId, createdAt` (compound)

**Full list:** See `DATABASE_DESIGN.md` → Indexes section

---

## 🌐 Environment Variables

### Required
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
ADMIN_EMAILS="admin@example.com"
```

### Optional
```env
STRIPE_SECRET_KEY="sk_..."
RESEND_API_KEY="re_..."
OPENAI_API_KEY="sk-..."
```

**Template:** `ENV_TEMPLATE.md`

---

## 📈 Analytics Events

Track with `activity_logs`:
- `view_content` - Content viewed
- `complete_item` - Item completed
- `start_learning_path` - Path started
- `upgrade_subscription` - Upgraded
- `unlock_achievement` - Achievement earned

**Query:**
```typescript
await prisma.activityLog.create({
  data: {
    userId,
    action: 'complete_item',
    resource: 'content',
    resourceId: contentId,
  },
});
```

---

## 🧪 Testing Checklist

- [ ] Database migrations run successfully
- [ ] Seed script completes without errors
- [ ] User can sign in with OAuth
- [ ] Profile API returns data
- [ ] Profile form saves changes
- [ ] Permissions enforce access control
- [ ] Subscription tiers gate features
- [ ] Activity logs record events

---

## 🎯 Next Implementation Steps

### Week 1: Foundation
1. Set up Vercel Postgres
2. Run migrations and seed
3. Update NextAuth to use DB
4. Test OAuth flow

### Week 2: Profile UI
1. Create profile page
2. Integrate UserProfileForm
3. Connect to API
4. Add validation

### Week 3: RBAC
1. Implement permission middleware
2. Protect routes
3. Add admin dashboard
4. Test role-based access

### Week 4+: Features
1. Stripe integration
2. Content management
3. Learning paths
4. Gamification

**Full Roadmap:** See `project-detail.md`

---

## 📞 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Prisma Docs**: https://prisma.io/docs
- **NextAuth Docs**: https://next-auth.js.org
- **Stripe Dashboard**: https://dashboard.stripe.com

---

## 💡 Tips for LLMs

1. **Start with** `DATABASE_DESIGN.md` for architecture understanding
2. **Follow** `SETUP_GUIDE.md` for implementation steps
3. **Reference** `prisma/schema.prisma` for exact table structures
4. **Use** `src/types/user-profile.ts` for TypeScript types
5. **Copy patterns** from existing API routes
6. **Test** with Prisma Studio before building UI

---

## 📋 Checklist for Production

- [ ] Environment variables set in Vercel
- [ ] Database migrations deployed
- [ ] Seed data populated
- [ ] Indexes verified
- [ ] Connection pooling configured
- [ ] Backup strategy in place
- [ ] Monitoring enabled
- [ ] Error tracking (Sentry) configured

---

**Need Help?** Refer to the detailed documentation files listed at the top of this reference card.
