# Engineering Rules – Frontendpedia Platform

These rules codify the patterns we expect across the platform (Next.js 15, React 19, SSE, Zustand, Prisma). Follow them for all new work; refactor legacy code toward these standards when practical.

---

## 1. State Management & React Patterns

- **Zustand selectors:** Always select primitives or `shallow`-stable values. Never return new objects/arrays from a selector.
  ```ts
  const emailVerified = useAccountStore((state) => state.emailVerified);
  const setStep = useAccountStore((state) => state.setStep);
  ```

- **One-shot effects:** When triggering async store actions in a component, guard with `useRef` or a custom `useRunOnce` hook so the action runs exactly once per mount.
- **Async helpers:** Use `safeFetchJson` (or equivalent) for client-side API calls. Wrap `.catch()` around fetch/JSON parsing to prevent unhandled rejections that retrigger store subscriptions.
- **Button handlers:** Disable `onClick` when `loading` is true. Avoid multiple back-to-back submits.
- **Form inputs:** Sanitize user input on change (trim, limit length). For select components, tolerate missing options and support controlled usage.

## 2. Next.js Middleware & Routing

- Auth & onboarding logic must live in `src/middleware.ts` only. Preserve the matcher `"/((?!api|_next|favicon.ico|images).*)"` and treat `/` as protected.
- Avoid route-level fetch loops: if a route needs client data on mount, request it in the client layer (not in the server component) unless SSR is critical.
- `getServerSession` calls belong in server components/functions only. Never invoke them inside `useEffect` or client components.

## 3. Server-Sent Events (SSE)

- Use the shared SSE utility (`src/lib/sse/server.ts` once added): enforce per-request abort controllers, heartbeat pings every ≤25s, and JSON-encoded payloads.
- NO long-running async loops on the main request thread: offload to background tasks or early-return with SSE stream.
- Always check `req.signal.aborted` before writing to the stream. Exit gracefully if the client disconnects.
- Cap SSE burst frequency (aim for ≤5 events/sec) and filter unchanged payloads to conserve bandwidth.

## 4. API Routes & Prisma

- All API routes must validate input with Zod (or a shared validator). Reject untrusted fields explicitly.
- Use Prisma transactions for multi-table updates. Guard against partial writes if a step fails.
- Never return raw Prisma errors to the client. Map to typed error responses `{ success: false, error: string }`.
- Keep API responses shape-stable: always wrap in `{ success, data?, error? }`.

## 5. Error Handling & Logging

- Client: surface failures via toast/banner but do not loop. Log to `console.error` once, then stop retrying until user action.
- Server: log structured errors (message, stack, userId if available). Use `console.error` or the shared logger; avoid `console.log`.
- When catching errors, reset `isLoading`/`isSubmitting` flags to unblock UI.

## 6. Styling & Components

- Dark/light-friendly: use Tailwind classes that work in both modes (`text-white/80`, `bg-white/10`, etc.).
- Use shared UI components (`Button`, `Input`, `Select`). Extend them rather than creating ad-hoc versions.
- Avoid inline style mutations. Stick to Tailwind utilities or theme tokens.

## 7. Documentation & Tests

- Any new architecture rule goes into `eng-rules.md` + relevant blueprint sections.
- Client-only logic should have at least one smoke test (Playwright or Vitest) when possible. For now, target critical flows (auth, onboarding, payments).
- Update `work-in-progress.md` for major changes so future contributors know current efforts.

---

_Keeping these guardrails in place will save us from the infinite-loop bugs we just fixed and ensures consistent behavior across the platform. Treat this file as living documentation—propose updates via PR when patterns evolve._

