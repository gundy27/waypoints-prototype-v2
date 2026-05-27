# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Standing instructions for all coding agents working on this project.

---

## What this is

A mobile-web **prototype** of **Waypoints 2.0** — an intent-organized career-coaching app for U.S. military service members, built on an **objective + countdown + waypoints** model. The user picks one active objective (usually promotion or fitness), the app shows the gap to it, counts down to the target, and proposes waypoints to clear. Logging progress closes the gap. See `waypoints-2.0-prd.md` (in the parent `planning/` dir) for the full product spec, `masterplan.md` for the original v1 vision, and `design-guide.md` for the visual language (topographic-map motif).

All domain data is **mock/static** — there is no real backend for app data. The one live integration is the Guide AI chat (Anthropic API via a server-side proxy). Supabase is optional and only used for notification preferences.

Stack: React 19 + TypeScript, Vite 7, Tailwind CSS v4, Recharts, Lucide, react-markdown, `@anthropic-ai/sdk` (server-side only), optional Supabase.

## Commands

```bash
npm run dev      # Vite dev server on :5173 (also runs the /api/chat proxy middleware)
npm run build    # tsc -b type-check, then vite build
npm run lint     # eslint over src/
npm run preview  # serve the production build
```

No test framework is configured. `npm run build` is the correctness gate (fails on any type error).

**AI chat requires a key:** create `.env` (gitignored) with `ANTHROPIC_API_KEY=sk-ant-...`. Without it the Guide chat returns an error; everything else works. The key is read **server-side only** (Vite dev middleware locally, Vercel function in prod) — never bundled into the client.

## Architecture

### State lives in one hook
`useAppState()` (`src/data/useAppState.ts`) is the single source of truth for all domain state and the **2.0 primitives**: `branchId`, `objective`, `waypoints`, `logs`, plus derived `currentGap`, `objectiveCountdown`, `recentActivity`, `wpProgress`. `App.tsx` holds only ephemeral UI state (which tab/overlay is open, chat messages). Change data behavior in `useAppState.ts`, not in components.

> Legacy v1 helpers still live in `useAppState.ts` and `mockData.ts` (e.g. `logPft`, `submitOnboarding`, `completeCorporalsWaypoint`, `rankedOpportunities`, `tips`, `pocketbookCategories`, `maradmins`). They're inert remnants of the v1 JEPES prototype, kept where the Marines composite recompute reuses them. Don't build new features on them.

### The core loop (the heart of the app)
1. **Objective** — `src/data/objectives.ts`. One active `Objective` at a time, instantiated from `OBJECTIVE_TEMPLATES` via `buildObjective(...)`. Each has a `gapKind` (`'score' | 'fitness' | 'waypoints'`) and a `countdownAnchor`.
2. **Gap** (polymorphic) — `src/data/scoring.ts`. `currentGap` renders three ways by `gapKind`: promotion → `ScoreGap` (current vs. cutoff + component breakdown); fitness → score vs. max; other → null (the tab shows waypoint X-of-Y instead). Marines promotion reuses the live JEPES composite from `profile`/`breakdown`; other branches use **structurally-correct mock tables** in `mockBranchScore()` (NOT validated against official charts — prototype only).
3. **Countdown** — `objectiveCountdown`, derived via `makeCountdown(...)` from the objective's anchor (promotion cycle / next test / user date).
4. **Waypoints** — `src/data/waypoints.ts`. `recommendWaypoints(objective, branch, grade)` filters `WAYPOINT_TEMPLATES` by branch × grade × objective type. Completing a waypoint (`completeWaypointById`) or logging (`submitLog`) **moves the gap**: `applyBonusToComponents()` distributes completed waypoints' `pointValue` into the gap; a fitness log recomputes the Marines composite. Whenever you change what moves the gap, keep gap + breakdown consistent.

**Deterministic time:** all time logic keys off `CURRENT_DATE = new Date('2026-02-01')` in `promotionTimeline.ts`, never `new Date()`. Use it for any new time-based logic.

### Multi-branch foundation
`src/data/branches.ts` defines all 6 branches (`BRANCHES`): enlisted rank tables (E-1→E-9 with correct titles), theme color, job label (MOS/Rate/AFSC), scoring system (cutting_score/promotion_points/waps/fms/final_multiple), and fitness test (PFT/CFT/ACFT/PRT/PT Test/PFA). Marines is the deepest; others are baseline. Officer/Warrant are out of scope (onboarding routes them to a light waitlist).

### Branch theming (color-only)
Selecting a branch overrides the `--color-wp-accent` / `--color-wp-accent-dark` CSS variables on the mobile-column `div` (inline style in `App.tsx`, and live in `OnboardingFlow` before a branch is chosen the accent is the signal-orange `#FF5522`). Because Tailwind v4 emits theme colors as CSS vars, every `wp-accent` utility re-themes automatically — **prefer `wp-accent` utilities / `var(--color-wp-accent)` over hardcoded hex** so components theme correctly.

### Live AI chat (the one real integration)
- Client: `src/data/chat.ts` `sendChat()` → `POST /api/chat`. `GuideTab` renders responses with `react-markdown` + `remark-gfm` (styled by `.wp-md` rules in `index.css`).
- Server: `api/chatHandler.ts` (`generateReply`, shared) calls `@anthropic-ai/sdk` with `claude-opus-4-7`, builds a system prompt from the user's context (branch/rank/MOS/objective/gap/recent logs). Consumed by **two** entry points that must stay in sync: the Vite dev middleware in `vite.config.ts` (local) and `api/chat.ts` (Vercel function, prod).
- `api/` is outside the `tsconfig` includes, so it's type-checked only transitively (via `vite.config.ts`'s import of `chatHandler`). Keep the SDK out of any `src/` import or it lands in the client bundle.

### Onboarding
`src/components/OnboardingFlow.tsx` is a self-contained step machine: welcome → account → component (NG/Reserve → waitlist) → branch → rank class (Officer/Warrant → waitlist; pre-bootcamp → DEP) → rank → intent → intent capture → **Aha 2** (objective + countdown) → push opt-in. On finish, `completeOnboarding()` in `useAppState` sets branch/profile and seeds the objective + waypoints. Launch it from the Profile overlay.

### Tabs and overlays
Three tabs (`src/components/TabBar.tsx`): `objective`, `journey`, `guide` (`src/tabs/`). A global floating "+" opens the Log overlay; the header has notification + profile icons. All overlays (`LogOverlay`, `WaypointDetailOverlay`, `ObjectiveSwitcherOverlay`, `GapDetailOverlay`, `NotificationCenter`, `ProfileOverlay`, `OnboardingFlow`) are conditionally rendered in `App.tsx` as **absolute children of the mobile column** — see the mandatory layout rule below.

### Design tokens
Tailwind v4 `@theme` block in `src/index.css`. Colors are `wp-`-prefixed; fonts (DM Sans / Inter / JetBrains Mono) load in `index.html`.

---

## Mobile-Only Layout (MANDATORY)

This is a mobile web app rendered as a centered column on desktop. The mobile column is the only visible UI surface.

**Every feature, component, and UI element must be contained within the `max-w-[428px]` mobile column** — modals, drawers, sheets, popups, prompts, toasts, overlays, backdrops, and any absolutely/fixed positioned elements, without exception.

### How to implement overlays correctly

The mobile column `div` has `position: relative`. All overlays must use `position: absolute` inside this column — never `position: fixed` or `absolute` relative to `<body>` or any full-screen wrapper outside the column.

**Correct pattern:**
```tsx
// Inside the mobile column div (max-w-[428px] relative container)
<div className="absolute inset-0 z-[100]">
  <MyOverlay />
</div>
```

**Wrong pattern:**
```tsx
// Outside the mobile column — will span full browser width
<div className="fixed inset-0 z-[100]">
  <MyOverlay />
</div>
```

### App structure reference

```
<div className="h-full bg-black flex items-start justify-center">  ← full browser
  <div className="relative h-full w-full max-w-[428px] ...">        ← MOBILE COLUMN (all UI goes here)
    <Header />
    <main>...</main>
    <FloatingLogButton />
    <TabBar />
    {overlays go here, as absolute children of this div}
  </div>
  {nothing UI-related goes outside the mobile column}
</div>
```
