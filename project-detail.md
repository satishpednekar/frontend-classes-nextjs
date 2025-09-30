Frontendpedia Platform – Project Detail

Purpose
- This document gives any engineer or LLM a fast, accurate mental model of the Frontendpedia learning SaaS: the vision, scope, current architecture, roadmap, and development standards.

Vision (North Star)
- Build the best personal learning companion for frontend engineers: curated content, AI-assisted learning paths, and lightweight tracking that nudges consistent progress.
- Audience: Beginners (Free) and Working Professionals (Pro). Admins manage users, content pointers, and KPIs.

First Principles
- Start simple, ship value, keep code clean and modular.
- Avoid premature complexity. Add infra only when a constraint appears.
- Prefer open‑source libraries and free tiers. Vercel-first deploy.

Current Repo Layout
- Website (unchanged): Next.js 14 app lives at repository root under `app/(website)` etc.
- Platform (SaaS): TailAdmin-based Next.js 15 app in `platform-saas-main/`.

Status – What’s Implemented (Platform)
- UI Foundation
  - Modernized header (blurred, compact) and simplified sidebar.
  - Sign-in page redesigned (centered glass card, OAuth buttons + form).
  - Dashboard landing with: Welcome bar, Upgrade banner, two progress widgets, key metrics list.
  - Pages scaffolded: `/learning-path`, `/feed`, `/my-content`, `/admin` (basic cards + mock data).
- Auth
  - NextAuth v4 (JWT strategy). Providers: Google, GitHub. `ADMIN_EMAILS` env flag adds role=admin.
  - Middleware guards: `/` and core pages require auth; `/admin` requires admin.
  - Session available to client; header shows user info + sign in/out.
- APIs (Mocked)
  - `GET /api/learning-path`, `GET /api/feed`, `GET /api/my-content` backed by `src/lib/frontendpedia/mock.ts`.
- DX / Stability
  - Hydration mismatch hardening (suppress + strip common extension attributes).
  - Tailwind v4 in platform, isolated from website’s v3.
- Online Onboardings
  - **Onboarding Journey**: Dedicated `/onboarding` route with guarded layout, Zustand store, API-backed 5-step flow (personal → professional → learning → plan → completion) and starter learning path seeding.
  - **Subscription Tier Updates**: Prisma enum + seed data include `PRO_PLUS`; onboarding logic syncs roles (`pro_user`, `pro_plus_user`) and subscriptions.
  - **Middleware Refresh**: Central middleware restored (auth + onboarding redirection).

Near-Term Intent (MVP Scope)
- Keep website untouched for SEO/content.
- Make platform fully functional for 30–50 concurrent users using free/open‑source tooling.

High-Level Architecture (Target)
- Hosting: Vercel (two projects) – website (root), platform (`platform-saas-main/`).
- Platform App (Next.js 15, React 19, Tailwind v4)
  - App Router, server components where appropriate, API routes for thin controllers.
  - Auth: NextAuth v4 (JWT). Providers: Google/GitHub; later LinkedIn/Facebook.
  - Data: Vercel Postgres (+ Prisma). Redis for short-lived caches and rate limits.
  - Payments: Stripe (free/pro), webhook with idempotency.
  - Files: Vercel Blob (PDFs, small assets). Videos: external embeds.
  - Caching: Redis for feed and AI response dedupe; ISR/SSG where safe.
  - Realtime: Prefer SSE over WebSockets for chat/long operations in MVP.

Domain Model (Implemented – Prisma)
**Database:** PostgreSQL (Vercel Postgres)  
**Complete Schema:** See `platform-saas-main/prisma/schema.prisma` and `DATABASE_DESIGN.md`

**Core Tables:**
- users(id, email, name, image, isActive, isSuspended, lastLoginAt)
- user_profiles(userId, firstName, lastName, bio, experienceLevel, learningGoals[], interests[], audienceType, totalLearningMinutes, streakDays, onboardingCompleted, onboardingStep)
- roles(name, displayName, priority, isSystem) + permissions(name, resource, action)
- user_roles(userId, roleId, assignedAt, expiresAt) [RBAC with expiration support]
- subscriptions(userId, tier[FREE|PRO|PRO_PLUS|ENTERPRISE], status, stripeCustomerId, stripeSubscriptionId)
- content(title, slug, type[POST|VIDEO|PDF|COURSE|LINK], source[PLATFORM|SANITY|EXTERNAL], difficulty, isPremium)
- learning_paths(userId, title, status, progress%) + learning_path_items(pathId, contentId, order, status)
- progress_tracking(userId, contentId, progress, timeSpentMinutes, completed)
- bookmarks(userId, contentId, tags[]) + notes(userId, contentId, body, tags[])
- achievements(name, category, rarity, criteria) + user_achievements(userId, achievementId, unlockedAt)
- quizzes(title, difficulty, questions, passingScore) + quiz_attempts(userId, quizId, score, passed)
- activity_logs(userId, action, resource, resourceId, metadata)
- feature_flags(key, enabled, rules, rolloutPercentage)

Personas → UX Mapping (Enhanced with RBAC)
- **Free User (Beginner)**: Onboarding quiz → limited learning path (3–5 items), daily feed (limited), bookmarks/notes. No premium content.
- **Pro User (Professional)**: Full AI-driven path, unlimited feed, progress tracking, premium content access, certificates, advanced analytics.
- **Trial User**: 14-day access to Pro features with conversion prompts.
- **Enterprise User**: Custom plans, team management, advanced analytics, SSO support.
- **Student**: Educational pricing, access to curated student paths, community features.
- **Instructor**: Content creation tools, student management, analytics on created content.
- **Admin**: Full system access, user management, content moderation, subscription management, KPI dashboard, feature flag control.

**Role-Based Access Control:**
- Roles: admin, instructor, moderator, pro_user, pro_plus_user, free_user
- Permissions: Granular resource:action permissions (e.g., content:create, user:manage, admin:analytics)
- Flexible assignment: Users can have multiple roles + direct permissions
- Temporary access: Roles/permissions can have expiration dates

Roadmap (Phased)
1) Foundation (Week 1–2)
   - Finalize envs + OAuth (Google/GitHub) and route protection (DONE base).
   - Create Prisma schema, connect Vercel Postgres, seed minimal data.
   - Replace mocks with real repos/services in `src/lib/frontendpedia/*`.
2) Core Features (Week 3–5)
   - Bookmarks + Notes CRUD (API + UI), optimistic updates.
   - Onboarding quiz → generate initial learning path from tags.
   - Feed ingestion (external curated sources) + Redis cache (60–120s).
3) Monetization (Week 6)
   - Stripe checkout for Pro, webhook processing, gating Pro features.
   - Upgrade banner CTA events + funnel metrics.
4) AI Assist (Week 7–8)
   - Chat via SSE with rate limits + caching; lightweight recommendations.
   - Personalization: re-rank content by interests/goals and activity.
5) Admin & Analytics (Week 9)
   - KPI events table + admin dashboard widgets (view_dashboard, click_upgrade, complete_item, time_spent).
6) Polish (Week 10)
   - Accessibility, empty states, loading skeletons; docs and examples.

KPIs (Product & Business)
- Activation: onboarding quiz completion rate
- Engagement: weekly completed items, time spent, return rate
- Conversion: upgrade clicks → Stripe success
- Retention: Pro churn, DAU/WAU/MAU ratios

Security & Compliance
- JWT sessions (short-lived). Role from `ADMIN_EMAILS` for MVP; later DB roles.
- Zod validation at API boundaries; sanitize HTML for notes.
- Stripe webhook signature verification; idempotency keys.
- Minimal PII; ready hooks for data export/delete.

Coding Standards (Applied)
- Namespaces: everything new under `frontendpedia` (files/folders/types).
- SOLID, DRY, modular: domain code in `src/lib/frontendpedia/*` and thin API controllers.
- UI: small, composable components; no heavy global CSS overrides; Tailwind utilities.
- Errors: never swallow; return typed errors from libs and map in API.

Key Files (Platform)
- `platform-saas-main/src/app/layout.tsx` – root layout + hydration guard.
- `platform-saas-main/src/middleware.ts` – route protection rules.
- `platform-saas-main/src/app/api/auth/[...nextauth]/route.ts` – NextAuth config.
- `platform-saas-main/src/lib/frontendpedia/types.ts` – core types.
- `platform-saas-main/src/lib/frontendpedia/mock.ts` – mock data for early screens.
- `platform-saas-main/src/app/(admin)/*` – dashboard pages.

Environments (Platform)
- Local: `platform-saas-main/.env.local`
  - NEXTAUTH_URL, NEXTAUTH_SECRET, GOOGLE_* / GITHUB_*, ADMIN_EMAILS
- Vercel: project → Settings → Environment Variables (same keys). Production NEXTAUTH_URL is `https://platform.frontendpedia.com`.

Decision Log (Abbreviated)
- Keep website on Next 14/Tailwind v3 (stable). Platform on Next 15/Tailwind v4 (modern). Isolate to avoid conflicts.
- No microservices for MVP; API routes + thin service modules suffice for 30–50 concurrent users.
- SSE over WebSockets for early realtime; switch only if a strong need appears.
- No full code editor in MVP; use snippets/embeds to avoid undue complexity.

Risks & Mitigations
- OAuth misconfig → strict redirect URIs in Google/GitHub consoles; test users while unverified.
- DB connection exhaustion → pooled connections, short queries, indexes.
- AI cost spikes → per-user/ip rate limits, caching, token caps.
- Styling drift → keep design tokens in Tailwind; constrain components through `@frontendpedia/ui` later.

Completed Actions
✅ **Database Design Complete**: Comprehensive Prisma schema with 30+ tables covering users, profiles, RBAC, subscriptions, content, learning paths, gamification, and analytics.
✅ **TypeScript Types**: Full type definitions in `platform-saas-main/src/types/user-profile.ts` for type-safe development.
✅ **Documentation**: Detailed database design document (`DATABASE_DESIGN.md`) with ERD, migration strategy, and API examples.
✅ **User Profile Component**: React component (`UserProfileForm.tsx`) with personal, professional, learning, and privacy sections.
✅ **Onboarding Experience**: `/onboarding` flow implemented with API persistence, five step UI, plan selection, and completion redirect.
✅ **Middleware Restored**: Auth + onboarding-aware route protection back in place.

Next Actions (Updated)
1. **Database Setup**:
   - Configure Vercel Postgres connection string
   - Run `npx prisma migrate dev --name init` to create tables
   - Run seed script to populate system roles and permissions
   
2. **API Implementation**:
   - Create `/api/profile` routes (GET, POST, PUT)
   - Create `/api/roles` and `/api/permissions` for RBAC management
   - Implement permission checking middleware
   
3. **UI Integration**:
   - Create user profile page at `/profile` or `/settings/profile`
   - Integrate UserProfileForm component
   - Add profile completeness indicator
   
4. **Stripe Integration**:
   - Implement subscription checkout flow for Pro/Pro Plus
   - Set up webhook handlers for subscription events
   - Add subscription management UI
   
5. **Feature Implementation**:
   - Replace mock APIs with DB-backed controllers
   - Implement content filtering based on subscription tier
   - Add learning path generation from onboarding data
   - Feed ingestion job + Redis cache

How an LLM Should Use This Doc
- Treat this as the ground truth for goals, guardrails, and boundaries.
- When asked to implement features, prefer adding code under `src/lib/frontendpedia/*` with thin API controllers.
- If a choice is ambiguous, bias toward simplicity and the roadmap priorities above.










