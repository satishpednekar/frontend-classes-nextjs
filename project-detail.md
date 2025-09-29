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

Domain Model (Planned – Prisma)
- users(id, email, name, image, role[user|admin], subscription_tier[free|pro], created_at)
- profiles(user_id, interests[], goals[], level)
- content(id, title, slug|url, type[post|video|pdf|link], source[sanity|external|platform], tags[], difficulty, published_at)
- bookmarks(id, user_id, content_id, created_at)
- notes(id, user_id, content_id, body, created_at, updated_at)
- learning_paths(id, user_id, title, status, progress%)
- learning_path_items(id, path_id, content_id, order, status)
- subscriptions(id, user_id, provider, status, current_period_end, plan)
- feature_flags(id, key, enabled, audience_json)
- ai_cache(hash, response_json, ttl)

Personas → UX Mapping
- Free (Beginner): onboarding quiz → limited learning path (3–5 items), daily feed (limited), bookmarks/notes.
- Pro (Professional): full AI-driven path, unlimited feed, progress tracking, premium items.
- Admin: metrics (users, active pro, MRR, signups), user table, content pointers, subscription overview.

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

Next Actions (Concrete)
- Create Prisma schema + migrations; wire `Vercel Postgres` (repositories for users/content/bookmarks/notes).
- Replace mock APIs with DB-backed controllers.
- Implement Stripe Pro plan + gating; record KPI events.
- Feed ingestion job + Redis cache. Render in `/feed` with filters.

How an LLM Should Use This Doc
- Treat this as the ground truth for goals, guardrails, and boundaries.
- When asked to implement features, prefer adding code under `src/lib/frontendpedia/*` with thin API controllers.
- If a choice is ambiguous, bias toward simplicity and the roadmap priorities above.









