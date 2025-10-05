# Frontendpedia SaaS Platform - Current Blueprint

**Version:** 1.1  
**Last Updated:** October 5, 2025  
**Status:** Phase 1-2 Complete | Phase 3 In Progress  
**Current Phase:** Core Experience (Week 5)

---

## 🎯 Project Overview

### **Mission**
Build a hyper-personalized learning platform for frontend developers with AI-driven skill assessment, learning paths, and progress tracking.

### **Target Users**
- **FREE Users:** Beginners, students exploring frontend development
- **PRO Users:** Working professionals, serious learners ($19/month)
- **PRO PLUS Users:** Senior developers, career advancers ($49/month)

### **Core Value Propositions**
1. Personalized learning journeys based on skills and goals
2. AI-powered skill assessment and recommendations
3. Progress tracking with gamification
4. Curated content from multiple sources
5. Certificate generation for completed paths

---

## 📋 Tech Stack (All Open Source / Free Tier)

### **Frontend & Framework**
```
- Next.js 15 (App Router, React Server Components)
- React 19
- TypeScript 5+
- Tailwind CSS v4 (mobile-first, responsive)
```

### **Backend & Database**
```
- Vercel (Hosting & Edge Functions)
- PostgreSQL (Vercel Postgres - included)
- Prisma 5 (ORM, type-safe)
- Redis (Vercel KV - included, for caching)
```

### **Authentication & Authorization**
```
- NextAuth.js v4 (JWT sessions)
- OAuth Providers: Google, GitHub
- Role-Based Access Control (RBAC)
```

### **State Management**
```
- TanStack Query (React Query) - Server state
- Zustand - Client state
- Clear separation of concerns
```

### **Payments & Billing**
```
- Stripe (Checkout, Subscriptions, Webhooks)
- Credit-based system for AI operations
- BYOK (Bring Your Own Key) for PRO PLUS users
```

### **UI Components & Services**
```
- Radix UI / Headless UI (Accessible primitives)
- Sonner (Toast notifications)
- Heroicons / Lucide (Icons)
- Recharts (Data visualization)
- Framer Motion (Animations - optional)
```

### **Email & Monitoring**
```
- Resend (Email delivery, free tier: 3000/month)
- Vercel Analytics (Performance monitoring)
- Sentry (Error tracking, free tier)
```

### **AI Integration (Future)**
```
- Abstract provider interface
- Support for: OpenAI, Claude, Gemini
- Mock responses for MVP
- Cache-first strategy
```

---

## 🏗️ Architecture Decisions

### **Key Principles**
1. ✅ **Monolithic MVP** - Single Next.js app (user + admin routes)
2. ✅ **Same Database** - User tables + admin config tables
3. ✅ **Mobile-First** - Responsive web UI only (no native apps)
4. ✅ **Contract-First** - Mock AI initially, real AI later
5. ✅ **Feature Flags** - Control rollout of features
6. ✅ **Credit-Based AI** - Prevent abuse, enable monetization
7. ✅ **Cache Everything** - Reduce costs, improve performance
8. ✅ **Security-First** - OWASP Top 10 compliance

### **What We're NOT Building (MVP)**
- ❌ AI code review
- ❌ Community features (forums, chat)
- ❌ Native mobile apps
- ❌ WebSocket / SSE (REST only for now)
- ❌ Multiple admin users (single admin only)
- ❌ Advanced analytics (basic metrics only)

### **Deferred to Phase 2+**
- Server-Sent Events for long operations
- Separate AI microservice
- Advanced admin configuration UIs
- Gamification system (achievements, certificates)
- Team/organization plans

---

## 💾 Database Schema Overview

### **Core Tables (Must Build First)**

**Authentication (NextAuth)**
```
✅ users (id, email, name, image, emailVerified, isActive, isSuspended)
✅ accounts (OAuth accounts)
✅ sessions (JWT sessions)
✅ verification_tokens (email verification)
```

**User Profile & Subscription**
```
✅ user_profiles (50+ fields: personal, professional, learning, tracking, privacy)
   - Personal: firstName, lastName, bio, location, timezone
   - Professional: jobTitle, company, yearsExperience, social links
   - Learning: experienceLevel, learningGoals[], interests[], preferredStyle
   - Tracking: totalLearningMinutes, streakDays, onboardingCompleted
   - Privacy: isProfilePublic, allowAnalytics, allowMarketing

✅ subscriptions (tier, status, stripeCustomerId, credits, trial info)
✅ subscription_quotas (track credit usage per user)
```

**RBAC System**
```
✅ roles (name, displayName, priority, isSystem)
   Seed: admin, free_user, pro_user, pro_plus_user

✅ permissions (name, resource, action, isSystem)
   Format: "resource:action" (e.g., "content:create", "admin:dashboard")

✅ user_roles (userId, roleId, assignedAt, expiresAt)
✅ role_permissions (roleId, permissionId)
✅ user_permissions (userId, permissionId) - direct grants
```

**Content & Learning**
```
✅ content (title, slug, type, source, url, difficulty, tags, isPremium)
   Types: POST, VIDEO, PDF, COURSE, LINK, TUTORIAL
   Sources: PLATFORM, SANITY, EXTERNAL

✅ learning_paths (userId, title, status, progress, estimatedHours)
✅ learning_path_items (pathId, contentId, order, status, estimatedMinutes)
✅ progress_tracking (userId, contentId, progress, timeSpentMinutes, completed)
✅ bookmarks (userId, contentId, tags)
✅ notes (userId, contentId, title, body, tags, isPrivate)
```

**AI & Caching**
```
✅ ai_response_cache (cacheKey, provider, prompt, response, tokensUsed, cost, expiresAt)
✅ skill_scores (userId, skillName, score 0-100, confidence, trend, lastAssessed)
✅ ai_insights (userId, insightType, title, description, data, confidence, actionable)
```

**Admin & System**
```
✅ feature_flags (key, name, enabled, rolloutPercentage, rules, metadata)
✅ activity_logs (userId, action, resource, resourceId, metadata, ipAddress)
✅ admin_audit_log (adminId, action, target, beforeAfter, timestamp)
```

**Configuration Tables (Defaults Only - No UI)**
```
✅ cache_settings (feature, enabled, ttl, invalidationStrategy)
✅ rate_limits (endpoint, tier, requestsPerWindow, windowSeconds)
✅ ai_settings (provider, model, enabled, priority, maxTokens, costPerCall)
✅ credit_config (tier, monthlyAllocation, pricePerCredit, operations)
```

### **Deferred Tables (Phase 2+)**
```
⏸️ achievements, user_achievements
⏸️ certificates
⏸️ quizzes, quiz_attempts
⏸️ fraud_events, fraud_reviews
⏸️ notifications, notification_preferences
⏸️ system_messages
```

---

## 👤 User Journey Flows

### **New User Onboarding (5 Steps)**

**Implementation Status:**
- ✅ Route: `/onboarding` (App Router) with guarded layout + session validation (`OnboardingGuard`)
- ✅ Zustand store: `useOnboardingStore` (client state, optimistic updates)
- ✅ API endpoints: `GET /api/onboarding`, `PATCH /api/onboarding`
- ✅ Steps implemented as components under `src/components/onboarding/steps`
- ✅ Prisma updates: `SubscriptionTier.PRO_PLUS`, role seeding, onboarding progress columns

**Entry Point:** OAuth/Credentials signup → auto-provisioned FREE user → middleware redirects new users to `/onboarding` until completion

**Step 1: Basic Info**
```
Component: StepPersonalDetails
Fields:
- First Name (required)
- Last Name (required)
- Display Name (required, auto-composed from names, editable)
- Country (required)
- City
- Timezone (select, default UTC)
- Preferred language (select, default EN)
Validation: client side + server rejects missing required fields
Persistence: PATCH step=1 stores personal info, advances onboardingStep to 2
```

**Step 2: Professional Background**
```
Component: StepProfessionalDetails
Fields:
- Job Title (required)
- Company
- Years of Experience (bucketed select)
- Domain
- Industry
- LinkedIn / GitHub / Portfolio / Website URLs
UX: contextual helper panel instead of notes textarea
Persistence: PATCH step=2 stores professional profile, onboardingStep=3
```

**Step 3: Learning Profile**
```
Component: StepLearningPreferences
Collects:
- Experience Level (card select)
- Learning Goals (chip select + custom add, min 1, max 5)
- Interests (chip select + custom add, min 1, max 10)
- Preferred Learning Style (select)
- Weekly hours (range 1-30)
Validations: at least 1 goal + interest, hours > 0
Persistence: PATCH step=3 writes arrays + preferences, onboardingStep=4
```

**Step 4: Plan Selection**
```
Component: StepPlanSelection
Plans: Free, Pro, Pro Plus (highlighted, dynamic copy)
Action: choose tier → PATCH step=4 updates subscription + roles, onboardingStep=5
Stripe: placeholder messaging (actual checkout deferred to payments feature)
```

**Step 5: Completion**
```
Component: StepCompletion
Summary cards: Personal, Professional, Learning, Plan snapshot
Action: Finish → PATCH step=5 marks onboardingCompleted=true, seeds starter learning path, redirects to /dashboard
```

**Support Details:**
- Toast banner for unverified email via OnboardingStepperShell
- Loading & retry state handled by OnboardingJourney + OnboardingLoadingState
- Middleware (`src/app/middleware.ts`): blocks core routes until onboardingCompleted
- API uses Prisma upserts, role assignment (`free_user`, `pro_user`, `pro_plus_user`) + subscription tier mapping
- State store normalises step index from server, supports resume flows

**Next Enhancements:**
- Stripe checkout & webhooks (Phase 5)
- Guided tour / celebratory modal post-completion
- Analytics events for each step
- Auto-suggest timezone/language via browser locale
```

### **Returning User Flow**
```
Login → Check onboardingCompleted
  ↓
If false: Redirect to /onboarding (resume at onboardingStep)
If true: Redirect to /dashboard
```

### **Dashboard Access Logic**
```
User tries to access /dashboard
  ↓
Check onboardingCompleted
  ↓
If false:
  Redirect to /onboarding
  Toast: "Please complete your profile first"
  
If true:
  Load appropriate dashboard:
  - FREE tier → Free layout
  - PRO/PRO_PLUS tier → Pro layout
```

---

## 🎨 Dashboard Layouts

### **FREE User Dashboard**
```
Purpose: Gateway, drive upgrades

Layout:
├── Welcome message
├── ⚠️ Email verification banner (if not verified)
├── Upgrade prompt (persistent card)
├── Current learning path (limited to 1)
├── Today's content (limited)
├── Skill scores (locked, upgrade prompt)
├── Streak widget (basic)
└── Quick stats

Features:
- Heavy upgrade CTAs
- Locked features visible (with upgrade prompts)
- Limited widget functionality
- Mobile-first, responsive
```

### **PRO/PRO_PLUS User Dashboard**
```
Purpose: Full experience, value delivery

Layout:
├── Welcome message (personalized)
├── ⚠️ Email verification banner (if not verified)
├── Active learning paths (multiple)
├── Today's recommendations (AI-powered)
├── Skill scores (radar chart, interactive)
├── Progress this week (charts)
├── Streak widget (gamified)
├── Recent achievements
├── Credits remaining (clear indicator)
└── Quick actions

Features:
- No upgrade prompts
- All features accessible
- Rich visualizations
- Personalized content
- Mobile-first, responsive

Note: PRO and PRO_PLUS use same layout initially
Backend differentiation: Credits, costs, BYOK option
```

---

## 🛡️ Admin Portal

### **Access**
```
Who: Single admin (you) initially
Check: user.email === ADMIN_EMAIL or user has 'admin' role
Location: Sidebar link (visible only to admins)
Route: /admin/dashboard
```

### **Admin Portal Structure**
```
/admin/dashboard (Landing page)

Sidebar:
├── 📊 Overview (key metrics, charts)
├── 🎛️ Feature Flags ← PRIMARY FOCUS
├── 👥 Users (list, search, view details)
├── 💰 Subscriptions (active, trials, canceled)
├── 📈 Analytics (basic metrics)
├── 🔍 Activity Logs (filterable)
└── ← Exit Admin Mode (back to /dashboard)
```

### **Feature Flags Page** (Build This Well)
```
/admin/feature-flags

UI:
- Table with toggles
- [+ New Flag] button
- Search/filter
- Sort by status/name

Columns:
| Key | Name | Status | Target | Actions |
| ai_skill | AI Skill | [ON] | All | [Edit][Del] |
| premium | Premium | [OFF] | PRO+ | [Edit][Del] |

Toggle:
- Click ON → Confirm disable
- Click OFF → Enable immediately
- Color coded (green/red)

Edit Modal:
- Key (immutable)
- Name
- Description
- Enabled toggle
- Target Audience (All, Specific Tiers, Specific Roles)
- Rollout Percentage (0-100%)
- [Save] [Cancel]

Features:
- CRUD operations
- Real-time toggle
- No complex approval (single admin)
- Audit log entry on change
```

### **Overview Dashboard**
```
Widget Grid (Extensible):

Row 1: KPI Cards
[Total Users] [Active Users] [Monthly Revenue] [Churn Rate]

Row 2: Charts
[User Growth - Last 30 days] [Revenue - Last 30 days]

Row 3: Recent Activity
- Latest signups
- Latest subscriptions
- Latest errors

System:
- Widget-based architecture
- Easy to add/remove widgets
- Responsive grid
```

### **Users Page** (Basic)
```
Search + Filter:
[Search by email] [All ▼] [FREE] [PRO] [PRO_PLUS]

Table:
| Email | Name | Tier | Status | Joined | Actions |
| user@email.com | John Doe | PRO | Active | 1d ago | [View] |

Click [View] → User detail modal:
- Profile info
- Subscription details
- Credit usage history
- Recent activity
- Actions: [Suspend] [Reset Credits] [Change Tier] (be careful)
```

### **Other Admin Pages** (Basic/Future)
```
Subscriptions: Stats + recent changes
Analytics: Placeholder "Coming Soon"
Activity Logs: Filterable table, export CSV
```

---

## 🔐 Security Implementation

### **Access Control (Critical - Your Responsibility)**

**Three-Layer Protection:**

**Layer 1: Route Middleware**
```typescript
// Pseudo-code pattern
export function middleware(req: NextRequest) {
  const session = await getSession(req);
  
  // Protect all authenticated routes
  if (protectedRoute && !session) {
    return redirect('/auth/signin');
  }
  
  // Admin routes
  if (req.pathname.startsWith('/admin')) {
    if (!isAdmin(session.user)) {
      return redirect('/dashboard');
    }
  }
  
  // Onboarding check
  if (requiresOnboarding(req.pathname)) {
    if (!session.user.onboardingCompleted) {
      return redirect('/onboarding');
    }
  }
  
  return next();
}
```

**Layer 2: API Route Protection**
```typescript
// Every API route pattern
export async function POST(req: Request) {
  // 1. Verify session
  const session = await getServerSession();
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  // 2. Get user
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });
  
  // 3. Check resource ownership (if applicable)
  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (resource.userId !== user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // 4. Check tier/permissions (if premium feature)
  if (isPremiumFeature && user.subscription.tier === 'FREE') {
    return Response.json({ error: 'Upgrade required' }, { status: 402 });
  }
  
  // 5. Check credits (if AI operation)
  if (isAIOperation) {
    const hasCredits = await checkCredits(user.id, operation.cost);
    if (!hasCredits) {
      return Response.json({ error: 'Insufficient credits' }, { status: 402 });
    }
  }
  
  // 6. Proceed
  // ... operation logic
  
  // 7. Log important actions
  await logActivity(user.id, 'action_name', metadata);
}
```

**Layer 3: Component-Level (UX Only)**
```typescript
// Hide/disable features user can't access
// This is UX, not security (security is server-side)

{user.tier === 'FREE' && (
  <UpgradePrompt feature="AI Skill Assessment" />
)}

{user.tier !== 'FREE' && (
  <SkillAssessmentButton />
)}
```

### **OWASP Top 10 Quick Reference**

**1. XSS (Cross-Site Scripting)**
- ✅ React auto-escapes
- ❌ Never use dangerouslySetInnerHTML
- ✅ Use DOMPurify for user content
- ✅ CSP headers configured

**2. SQL Injection**
- ✅ Prisma ORM (parameterized queries)
- ❌ Never raw SQL with string concatenation

**3. CSRF**
- ✅ NextAuth handles this (CSRF tokens)
- ✅ SameSite cookies

**4. Broken Access Control** ← YOUR FOCUS
- ✅ Server-side checks on every API route
- ✅ Never trust client-side permissions
- ✅ Verify resource ownership
- ✅ Check tier/subscription

**5. Security Misconfiguration**
- ✅ Environment variables for secrets
- ✅ Security headers (HSTS, X-Frame-Options, etc.)
- ✅ No debug mode in production

**6. Sensitive Data Exposure**
- ✅ HTTPS only (Vercel enforces)
- ✅ Passwords hashed (bcrypt if email/password)
- ❌ Don't log sensitive data

**7. Insufficient Logging**
- ✅ Activity logs for important actions
- ✅ Admin audit log
- ✅ Error tracking (Sentry)

**8. Input Validation**
- ✅ Zod schemas for all API inputs
- ✅ Validate on server, not just client
- ✅ Sanitize user input

**9. Vulnerable Components**
- ✅ npm audit before deploy
- ✅ Dependabot auto-updates

**10. SSRF**
- ✅ Whitelist allowed domains
- ✅ No user-provided URLs in fetch() without validation

---

## 🤖 AI Integration Strategy

### **Mock-First Approach (MVP)**

**Phase 1: Mock AI Service**
```
All AI responses are mocked
- Fast, predictable, cost-free
- Allows UI development
- Defines contracts clearly

Mock Service Location:
src/lib/ai/mock-service.ts

Mock Data:
src/lib/ai/mock-data/*.json
```

**Phase 2: Real AI Integration** (Week 12+)
```
Replace mocks with real LLM providers
- Abstract provider interface
- Support: OpenAI, Claude, Gemini
- Provider routing logic
- Cache-first strategy
- Cost monitoring
```

### **AI Operations & Contracts**

**Operation 1: Skill Assessment**
```typescript
Request:
POST /api/ai/skill-assessment
{
  userId: string;
  type: 'full' | 'quick';
}

Response:
{
  success: boolean;
  data: {
    assessmentId: string;
    userId: string;
    assessedAt: Date;
    skills: Array<{
      name: string;
      score: number; // 0-100
      confidence: number; // 0-100
      trend: 'improving' | 'stable' | 'declining';
      dataPoints: number;
    }>;
    overallLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    strengths: string[];
    weaknesses: string[];
    recommendations: Array<{
      title: string;
      reason: string;
      contentIds: string[];
      priority: 'high' | 'medium' | 'low';
    }>;
  };
  creditsUsed: number;
  cached: boolean;
  provider: 'mock' | 'openai' | 'claude';
  executionTime: number; // ms
}

Credit Cost: 5 credits
Cache TTL: 24 hours
Mock Response Time: 1-2 seconds
```

**Operation 2: Learning Path Generation**
```typescript
Request:
POST /api/ai/generate-learning-path
{
  userId: string;
  goal: string;
  timeframe: number; // weeks
  currentSkills?: string[];
}

Response:
{
  success: boolean;
  data: {
    pathId: string;
    title: string;
    description: string;
    estimatedWeeks: number;
    items: Array<{
      order: number;
      contentId: string;
      title: string;
      type: 'video' | 'article' | 'course';
      duration: number; // minutes
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      why: string; // Explanation
    }>;
  };
  creditsUsed: number;
  cached: boolean;
  provider: string;
}

Credit Cost: 10 credits
Cache TTL: 7 days
Mock Response Time: 2-3 seconds
```

**Operation 3: Daily Recommendations**
```typescript
Request:
GET /api/ai/recommendations?userId=xxx

Response:
{
  success: boolean;
  data: {
    recommendations: Array<{
      contentId: string;
      title: string;
      type: string;
      reason: string;
      relevanceScore: number; // 0-1
    }>;
  };
  creditsUsed: number;
  cached: boolean;
}

Credit Cost: 1 credit (cheap operation)
Cache TTL: 12 hours
Mock Response Time: 500ms
```

### **Caching Strategy**

**Cache Everything Possible:**
```
Cache Table: ai_response_cache

Cache Key Generation:
hash(userId + operation + parameters)

Cache Lookup Flow:
1. Generate cache key
2. Check cache table
3. If found and not expired: Return cached
4. If not found: Call AI/mock
5. Store response in cache
6. Return response

Benefits:
- 70%+ cost reduction
- Faster responses
- Consistent results
```

**Cache TTLs:**
```
Skill assessments: 24 hours
Learning paths: 7 days
Recommendations: 12 hours
Career guidance: 30 days
Insights: 24 hours
```

### **Credit System**

**Credit Allocation:**
```
FREE: 10 credits/month
PRO: 100 credits/month
PRO_PLUS: 500 credits/month

Resets: Monthly on subscription anniversary
Carry-over: No (use it or lose it)
Buy More: PRO users can purchase additional credits
```

**Credit Costs:**
```
Content recommendation: 1 credit
Skill assessment (quick): 5 credits
Skill assessment (full): 8 credits
Learning path generation: 10 credits
Career guidance: 10 credits
Weekly insights: 5 credits
```

**Enforcement:**
```
Before AI operation:
1. Check user credits
2. If insufficient: Return 402 error with upgrade prompt
3. If sufficient: Proceed
4. After operation: Deduct credits
5. Log transaction in subscription_quotas
```

---

## 🎨 UI/UX Guidelines

### **Design System**
```
Colors:
- Primary: #3B82F6 (Blue)
- Success: #10B981 (Green)
- Warning: #F59E0B (Yellow)
- Error: #EF4444 (Red)
- Gray scale: Tailwind defaults

Typography:
- Font: Inter (system font fallback)
- Headings: Bold, larger sizes
- Body: Regular, 16px base
- Code: Monospace font

Spacing:
- Use Tailwind spacing scale (4px increments)
- Consistent padding/margins

Shadows:
- Subtle elevation for cards
- No heavy shadows (modern, clean)

Borders:
- Radius: rounded-lg (8px) for cards
- Radius: rounded-md (6px) for buttons
- Border: 1px solid gray-200

Animations:
- Subtle, fast (200ms)
- Framer Motion for complex animations
- CSS transitions for simple hover states
```

### **Responsive Breakpoints**
```
Mobile: < 640px (base, mobile-first)
Tablet: 640px - 1024px
Desktop: > 1024px

Strategy: Mobile-first
- Design for mobile
- Enhance for larger screens
- Test on real devices
```

### **Component Patterns**

**Buttons:**
```
Primary: bg-primary text-white
Secondary: bg-white border text-gray-700
Danger: bg-red-500 text-white
Ghost: bg-transparent hover:bg-gray-100

Sizes: sm, md, lg
States: default, hover, active, disabled, loading
```

**Cards:**
```
Default: white background, border, shadow
Hover: lift effect (translateY)
Interactive: cursor-pointer
```

**Forms:**
```
Inputs: border, rounded, padding
Labels: above input, medium font weight
Validation: red border + error message below
Success: green border + success message
Auto-save: subtle "Saved" indicator
```

**Modals:**
```
Overlay: semi-transparent black
Content: centered, white, rounded
Close: X button top-right
Actions: bottom right, consistent order
```

**Toasts:**
```
Library: Sonner
Position: top-right (desktop), top-center (mobile)
Duration: 3s (success), 5s (error)
Types: success, error, warning, info
```

---

## 📅 Implementation Phases

### **PHASE 1: Foundation (Week 1-2) - ✅ COMPLETE**
**Goal:** Users can sign up, log in, and see basic UI

**Status:** Completed September 30, 2025

**Tasks:**
- ✅ Project setup (Next.js 15, dependencies)
- ✅ Vercel Postgres connection
- ✅ Prisma schema (Phase 1 tables - 30+ tables)
- ✅ Database migrations
- ✅ Seed script (roles, permissions, defaults)
- ✅ NextAuth setup (Google, GitHub OAuth + Credentials)
- ✅ Auth pages (signin, signup)
- ✅ Basic app layout (header, sidebar, container)
- ✅ Platform services (toast, modals)
- ✅ Environment variables configuration

**Deliverables:**
- ✅ Working authentication (OAuth + Credentials)
- ✅ Database with seeded data (roles, permissions, achievements)
- ✅ Basic UI shell
- ✅ Route protection middleware
- ✅ User auto-provisioning on signup

---

### **PHASE 2: Onboarding Journey (Week 3-4) - ✅ COMPLETE**
**Goal:** Users complete profile and choose subscription

**Status:** Completed October 5, 2025

**Tasks:**
- ✅ Onboarding route structure (/onboarding with nested layouts)
- ✅ Onboarding state management (Zustand store)
- ✅ API routes for saving progress (GET/PATCH /api/onboarding)
- ✅ Step 1: Basic info form + validation (personal details)
- ✅ Step 2: Professional background form
- ✅ Step 3: Learning profile form (goals, interests, experience)
- ✅ Step 4: Pricing cards + plan selection (FREE/PRO/PRO_PLUS)
- ⏳ Stripe integration (checkout, webhooks) - Deferred to Phase 5
- ✅ Step 5: Completion page with summary
- ✅ Auto-save functionality per step
- ✅ Progress indicator (stepper component)
- ✅ Mobile responsive forms
- ⏳ Email verification flow - Backend ready, UI pending
- ✅ Persistent banner for unverified emails

**Deliverables:**
- ✅ Complete 5-step onboarding flow
- ✅ Plan selection UI (Stripe checkout deferred to Phase 5)
- ✅ Role assignment based on plan tier
- ✅ Data persists and resumes from last step
- ✅ Mobile-friendly experience
- ✅ Dismiss/resume onboarding functionality
- ✅ Automatic starter learning path creation
- ✅ Subscription auto-provisioning

---

### **PHASE 3: Core Experience (Week 5-6)**
**Goal:** Users see value, interact with features

**Tasks:**
- [ ] Dashboard layouts (FREE vs PRO)
- [ ] Content model and API routes
- [ ] Learning path model and routes
- [ ] Progress tracking system
- [ ] Bookmarks functionality
- [ ] Notes functionality
- [ ] Mock AI service setup
- [ ] AI contracts defined (TypeScript types)
- [ ] Mock skill assessment
- [ ] Mock learning path generation
- [ ] Mock recommendations
- [ ] Credit system implementation
- [ ] Credit balance display
- [ ] Credit deduction logic
- [ ] Upgrade prompts for FREE users
- [ ] Charts and data visualization

**Deliverables:**
- Two distinct dashboard experiences
- Users can create/view learning paths
- Mock AI features work
- Credit system enforced
- Engaging, valuable experience

---

### **PHASE 4: Admin Portal (Week 7)**
**Goal:** Admin can control platform

**Tasks:**
- [ ] Admin route protection
- [ ] Admin layout with sidebar
- [ ] Admin overview dashboard (metrics)
- [ ] Feature flags CRUD UI
- [ ] Feature flags toggle functionality
- [ ] User list page (basic)
- [ ] User detail view
- [ ] Subscription overview page
- [ ] Activity logs page
- [ ] Admin audit logging
- [ ] Exit admin mode button

**Deliverables:**
- Working admin portal
- Feature flags can be toggled
- Basic user management
- Activity monitoring

---

### **PHASE 5: Subscription & Monetization (Week 8-9)**
**Goal:** Revenue generation works smoothly

**Tasks:**
- [ ] Subscription management pages
- [ ] Upgrade flow (FREE → PRO)
- [ ] Upgrade flow (PRO → PRO_PLUS)
- [ ] Downgrade flow
- [ ] Cancel subscription flow
- [ ] Stripe webhook handling (all events)
- [ ] Trial period management
- [ ] Buy additional credits
- [ ] BYOK UI (PRO_PLUS users)
- [ ] BYOK key storage (encrypted)
- [ ] Subscription status display
- [ ] Credit purchase flow

**Deliverables:**
- Complete subscription lifecycle
- Users can upgrade/downgrade/cancel
- PRO_PLUS users can add own LLM keys
- Credits can be purchased

---

### **PHASE 6: Polish & Security (Week 10-11)**
**Goal:** Production-ready, secure, performant

**Tasks:**
- [ ] Security audit (OWASP checklist)
- [ ] Access control testing (all routes)
- [ ] Input validation (all APIs)
- [ ] Security headers configuration
- [ ] Error pages (404, 500)
- [ ] Error handling (all routes)
- [ ] Performance optimization
- [ ] React Query caching tuned
- [ ] Image optimization
- [ ] Code splitting
- [ ] Loading states (all pages)
- [ ] Empty states
- [ ] Error states
- [ ] Animations and transitions
- [ ] Mobile testing (real devices)
- [ ] Cross-browser testing
- [ ] Accessibility audit
- [ ] SEO optimization
- [ ] Monitoring setup (Sentry)
- [ ] Analytics setup

**Deliverables:**
- Secure application
- Fast, optimized
- Great user experience
- Production monitoring
- Ready for launch

---

### **PHASE 7: Real AI Integration (Week 12+)**
**Goal:** Replace mocks with real AI

**Tasks:**
- [ ] Abstract AI provider interface
- [ ] OpenAI integration
- [ ] Claude integration (optional)
- [ ] Provider routing logic
- [ ] Cache implementation
- [ ] Cost monitoring
- [ ] Replace skill assessment mock
- [ ] Replace learning path mock
- [ ] Replace recommendations mock
- [ ] Test with real users
- [ ] Monitor costs
- [ ] Optimize prompts
- [ ] A/B test providers

**Deliverables:**
- Real AI-powered features
- Cost-optimized implementation
- Smooth user experience
- Monitoring dashboards

---

## 🎯 Success Criteria

### **MVP Launch Checklist**

**Must Have (Launch Blockers):**
- [ ] Users can sign up via OAuth
- [ ] Onboarding flow complete (all 5 steps)
- [ ] Email verification works
- [ ] FREE and PRO dashboards different
- [ ] Mock AI features functional
- [ ] Credit system enforced
- [ ] Stripe checkout works (test mode)
- [ ] Stripe webhooks handled
- [ ] Admin portal accessible
- [ ] Feature flags toggle works
- [ ] Mobile responsive (all pages)
- [ ] No critical bugs
- [ ] Security checklist complete
- [ ] Error tracking enabled

**Should Have (High Priority):**
- [ ] Performance optimized (< 2s load)
- [ ] Accessibility basics (keyboard nav, ARIA)
- [ ] SEO basics (meta tags, sitemap)
- [ ] Activity logging works
- [ ] Admin can view users
- [ ] Content seeded (20+ items)
- [ ] Learning paths seeded (3+)

**Nice to Have (Can Add Later):**
- [ ] Animations polished
- [ ] Empty states beautiful
- [ ] Loading skeletons everywhere
- [ ] Advanced analytics
- [ ] Email templates customized
- [ ] Onboarding can be skipped and resumed

---

## 🚀 Development Workflow

### **Environment Setup**
```bash
# Prerequisites
Node.js 18+
pnpm or npm
Git

# Clone repo
git clone <repo-url>
cd platform-saas-main

# Install dependencies
pnpm install

# Setup database
# Get Vercel Postgres connection string
# Add to .env.local

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database
npx prisma db seed

# Start development server
pnpm dev

# Open http://localhost:3000
```

### **Database Commands**
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio

# Generate Prisma Client (after schema changes)
npx prisma generate

# Push schema without migration (dev only)
npx prisma db push
```

### **Git Workflow**
```bash
# Feature branches
git checkout -b feature/onboarding-step-1
git add .
git commit -m "feat: add onboarding step 1 basic info form"
git push origin feature/onboarding-step-1

# Create PR on GitHub
# After review and approval, merge to main
# Vercel auto-deploys main branch
```

### **Deployment**
```bash
# Automatic on push to main
# Vercel handles:
# - Build
# - Database migrations (via prisma)
# - Environment variables
# - Edge deployment

# Manual deploy (if needed)
vercel --prod
```

---

## 📝 Key Conventions

### **File Structure**
```
platform-saas-main/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── signin/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   └── learning-path/page.tsx
│   │   ├── (onboarding)/
│   │   │   └── onboarding/page.tsx
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx
│   │   │   └── feature-flags/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── profile/route.ts
│   │   │   ├── onboarding/route.ts
│   │   │   ├── ai/
│   │   │   │   ├── skill-assessment/route.ts
│   │   │   │   └── learning-path/route.ts
│   │   │   └── admin/
│   │   │       └── feature-flags/route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/ (reusable UI components)
│   │   ├── dashboard/
│   │   ├── onboarding/
│   │   ├── admin/
│   │   └── layout/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── ai/
│   │   │   ├── mock-service.ts
│   │   │   ├── contracts.ts
│   │   │   └── cache.ts
│   │   └── utils.ts
│   ├── stores/
│   │   ├── auth-store.ts (Zustand)
│   │   ├── ui-store.ts (Zustand)
│   │   └── onboarding-store.ts (Zustand)
│   ├── types/
│   │   └── user-profile.ts
│   └── middleware.ts
├── .env.local (not committed)
├── .env.example (template)
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

### **Naming Conventions**
```
Files:
- Components: PascalCase (UserProfile.tsx)
- Utils: camelCase (getUserById.ts)
- Types: PascalCase (UserProfile.ts)
- API routes: kebab-case (skill-assessment/route.ts)

Variables:
- React components: PascalCase (UserProfile)
- Functions: camelCase (getUserById)
- Constants: UPPER_SNAKE_CASE (MAX_CREDITS)
- Types/Interfaces: PascalCase (UserProfile)

Database:
- Tables: snake_case (user_profiles)
- Columns: camelCase in Prisma, snake_case in SQL
- Enums: PascalCase (SubscriptionTier)
```

### **Code Style**
```typescript
// Use TypeScript for everything
// Prefer function components over class components
// Use async/await over promises
// Use const over let
// Destructure props
// Early returns for error cases

// Example:
export async function GET(req: Request) {
  // Early return for errors
  const session = await getServerSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Main logic
  const data = await fetchData();
  return Response.json({ data });
}
```

---

## 🔗 Key Resources

### **Documentation**
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- NextAuth: https://next-auth.js.org
- React Query: https://tanstack.com/query/latest
- Zustand: https://github.com/pmndrs/zustand
- Stripe: https://stripe.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

### **Internal Documentation**
- `DATABASE_DESIGN.md` - Complete schema documentation
- `SETUP_GUIDE.md` - Step-by-step setup
- `IMPLEMENTATION_SUMMARY.md` - Feature overview
- `PROJECT_ARCHITECTURE.md` - Architecture details
- `project-detail.md` - Project overview
- `eng-rules.md` - Engineering guardrails (Next.js, Zustand, SSE patterns)

### **Design Assets**
- Figma: [Link when available]
- Brand guidelines: [Link when available]
- Component library: Radix UI, Headless UI

---

## ⚠️ Known Constraints & Limitations

### **MVP Limitations (Intentional)**
1. **Single Admin Only** - No multi-admin support
2. **Mock AI** - Real AI comes in Phase 7
3. **Basic Analytics** - Advanced analytics deferred
4. **No Gamification** - Achievements/certificates in Phase 2
5. **REST Only** - No SSE/WebSocket yet
6. **Web Only** - No native mobile apps

### **Technical Constraints**
1. **Vercel Edge Function Timeout** - 30s max (affects long AI operations)
2. **Free Tier Limits** - Sentry: 5000 events/month, Resend: 3000 emails/month
3. **Database Size** - Works well up to 100GB, then need optimization
4. **React Query** - Team needs 3-5 days to learn if unfamiliar

### **Business Constraints**
1. **Credit System** - Must be enforced to prevent abuse
2. **Free Tier** - Must be limited enough to drive upgrades
3. **Trial Period** - 14 days standard (can adjust)
4. **Pricing** - Fixed at $19/$49 for now (no dynamic pricing)

---

## 📊 Metrics to Track

### **Product Metrics**
- **Signups** - Daily/weekly new users
- **Onboarding Completion Rate** - % who complete all 5 steps
- **Activation Rate** - % who complete first learning path
- **Conversion Rate** - FREE → PRO (target: 10-15%)
- **Churn Rate** - Monthly (target: < 5%)
- **Engagement** - Daily/weekly active users
- **Feature Usage** - Which features used most
- **Credit Usage** - Average per user, per tier

### **Technical Metrics**
- **Page Load Time** - Target: < 2s
- **API Response Time** - Target: < 500ms
- **Error Rate** - Target: < 1%
- **Uptime** - Target: 99.9%
- **Cache Hit Rate** - Target: 70%+
- **AI Cost per User** - Target: < $3/user/month

### **Business Metrics**
- **Monthly Recurring Revenue (MRR)**
- **Customer Acquisition Cost (CAC)**
- **Lifetime Value (LTV)**
- **LTV:CAC Ratio** - Target: > 3:1
- **Stripe Fees** - Track for profitability
- **AI Costs** - Monitor closely

---

## 🎯 Current Status & Next Actions

### **Current Phase:** Core Experience (Week 5)

**Completed Phases:**
- ✅ Phase 1: Foundation (100% complete)
- ✅ Phase 2: Onboarding Journey (100% complete)

**Overall Progress:** ~25% (2 of 7 phases complete)

**Immediate Next Steps (Phase 3):**
1. [ ] Create dashboard layout components (FREE vs PRO differentiation)
2. [ ] Build dashboard API endpoint (`/api/dashboard`)
3. [ ] Implement content CRUD API routes
4. [ ] Create learning path UI (view/create/manage)
5. [ ] Set up mock AI service contracts
6. [ ] Build mock skill assessment endpoint
7. [ ] Create credit system display components

**This Sprint's Goal:**
By end of Week 6, users should be able to access a personalized dashboard, view content, and interact with learning paths (using mock AI data).

**Pending Commits:**
- 14 modified files + 2 new files awaiting commit on `feat/saas-main-bootstrap` branch
- Recommended to commit Phase 2 work before starting Phase 3

**Known Blockers:**
- None currently - all dependencies resolved

---

## 📞 Support & Help

### **When Implementing:**
1. **Read this blueprint first** - Understand full context
2. **Follow phase order** - Don't skip ahead
3. **Test as you go** - Don't accumulate untested code
4. **Ask for clarification** - If anything unclear, ask
5. **Document decisions** - Update this blueprint when making changes

### **LLM Agents: How to Use This Blueprint**
1. Read entire document before implementing
2. Follow conventions strictly
3. Reference contracts for data shapes
4. Implement security checks on all APIs
5. Test with mock data first
6. Update progress as you complete tasks
7. Flag any blockers or unclear requirements

---

## 🔄 Updates & Versioning

**Version History:**
- v1.0 (Sep 30, 2025) - Initial blueprint, project kickoff
- v1.1 (Oct 5, 2025) - Phase 1 & 2 completion, onboarding system implemented

**How to Update:**
When making architectural decisions or completing phases, update this document and increment version.

**Last Updated:** October 5, 2025  
**Next Review:** After Phase 3 completion (Core Experience)

---

**END OF BLUEPRINT**

This document is the single source of truth for the Frontendpedia SaaS Platform. All implementation should align with the decisions, architecture, and guidelines documented here.

