# my-job-portal-fe

A job portal web application. Job seekers can search and apply for jobs, build CVs, and follow companies. Employers and admins manage listings, users, and permissions via an admin dashboard.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack), React 18, TypeScript 5
- **Styling**: Tailwind CSS 3, Radix UI (via shadcn/ui), Lucide icons
- **State**: Redux Toolkit + RTK Query, Redux Persist (auth hydration)
- **Forms**: React Hook Form + Zod validation
- **HTTP**: Axios with interceptors (auto token refresh on 401, mutex-guarded)
- **Auth**: JWT (access + refresh token), Google OAuth
- **PDF**: @react-pdf/renderer (CV export), with `/api/proxy-image` route for CORS
- **Testing**: Jest + React Testing Library (jsdom)
- **i18n**: Custom i18n provider (`src/locales/`, `useI18n` hook)

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # Login, register, password reset, email verification (guest-only)
│   ├── (main)/                 # Public pages: home, jobs, companies, profile
│   ├── (dashboard)/admin/      # Protected admin pages: users, jobs, companies, roles, permissions
│   └── api/proxy-image/        # Image proxy (used by PDF renderer)
├── components/                 # React components
│   ├── ui/                     # Shadcn/Radix UI wrappers (Button, Dialog, Form, etc.)
│   ├── admin/                  # Admin dashboard components
│   ├── cv/                     # CV builder UI
│   ├── pdf/                    # PDF templates (Modern, Classic, Minimal)
│   └── ...                     # auth, job, company, profile, chatbot, etc.
├── features/                   # Feature modules: RTK Query API defs + Redux slices
│   └── {domain}/redux/         # slice.ts + api.ts per domain (auth, user, job, company, resume, ...)
├── hooks/                      # Custom hooks wrapping feature logic (use-auth, use-job, use-cv, ...)
├── lib/
│   ├── redux/                  # Store config, base API, Redux provider
│   ├── axios/                  # Axios instance + RTK Query base adapter
│   └── utils/                  # Shared utilities
├── contexts/                   # Auth modal context, i18n provider
├── shared/                     # Types, constants, config, static data
└── locales/                    # Translation JSON files
```

**Route protection**: `ProtectedRoute` guards admin routes; `GuestGuard` guards auth routes.  
**Path alias**: `@/*` → `src/*`

## Common Commands

```bash
npm run dev        # Dev server (Turbopack)
npm run build      # Production build (also type-checks)
npm run lint       # ESLint
npm test           # Jest tests
npx tsc --noEmit   # Type-check without building
```

## Detailed Documentation

Before working on a specific task, decide which docs (if any) are relevant and read them first. You may also present the list to the user for approval before reading.

### UI Architecture (`docs/ui/`)

The UI is defined as a state-machine-driven system. These 9 files are the source of truth for all UI work:

| File | Purpose | Read when... |
|---|---|---|
| `docs/ui/UI_SYSTEM_MAP.md` | Screen inventory (23 pages), route flow, layout hierarchy | Starting any UI task — find the screen ID first |
| `docs/ui/UI_INFORMATION_ARCHITECTURE.md` | Per-screen block matrix: fixed vs state-driven blocks | Deciding what goes on a screen, what changes with state |
| `docs/ui/UI_LAYOUT_RULES.md` | Spacing, containers, grids, component heights | Any layout or spacing work |
| `docs/ui/UI_DESIGN_RULES.md` | Colors, typography, state visuals, transitions, icons | Any visual/design work |
| `docs/ui/UI_CARD_LAYOUT.md` | Card patterns: Data, Stat, Form, Empty, Table | Building or modifying any card-based UI |
| `docs/ui/UI_SPEC.md` | State machines per screen (LOADING→LOADED→EMPTY, etc.) | Implementing data-fetching UI or state transitions |
| `docs/ui/UI_RUNTIME_PATTERN.md` | Physical rules: no DOM mutation, no layout shift, CLS=0 | Reviewing or validating any UI change |
| `docs/ui/UI_OPERATION.md` | Developer workflow, debugging checklist, PR review checklist | Before submitting or reviewing a UI PR |
| `docs/ui/UI_IMPLEMENTATION_PLAN.md` | Migration order, baseline screen, validation protocol | Planning which screen to work on next |

### Feature Documentation (`docs/`)

| Topic | File |
|---|---|
| Auth flow & token handling | `docs/AUTH_FLOW_SUMMARY.md`, `docs/AUTH_ARCHITECTURE_DIAGRAM.md` |
| Permission & role system | `docs/PERMISSION_SYSTEM_GUIDE.md`, `docs/ACCESS_CONTROL_GUIDE.md` |
| Admin layout & pages | `docs/ADMIN_LAYOUT_ARCHITECTURE.md`, `docs/ADMIN_PAGES_COMPLETE_SUMMARY.md` |
| CV builder & PDF export | `docs/CV_README.md`, `docs/CV_IMPLEMENTATION_GUIDE.md` |
| Dashboard | `docs/DASHBOARD_README.md`, `docs/DASHBOARD_GUIDE.md` |
| Profile pages | `docs/PROFILE_PAGES_QUICK_REFERENCE.md` |
