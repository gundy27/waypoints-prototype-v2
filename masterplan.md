# Waypoints — Masterplan

## Vision

Waypoints is a mobile-first coaching app for early-career Marines. It answers three questions every junior Marine has:

1. **Where do I stand right now?**
2. **What's holding me back?**
3. **What percentage am I compared to peers in my MOS?**

The prototype is built as a mobile web app (target: bolt.new) to illustrate key workflows — not to be fully functional. Data is mock/static. The goal is to demonstrate information architecture, user flows, and the visual design language.

---

## Information Architecture

### Tab Structure (Bottom Navigation)

```
┌─────────────────────────────────────┐
│                                     │
│         [Active Screen]             │
│                                     │
├────────┬────────┬────────┬──────────┤
│ Career │ Fitness│ Pocket │ MARADMIN │
│  (Home)│        │  book  │   S      │
└────────┴────────┴────────┴──────────┘
```

### 1. Career (Home Tab)

The primary screen. Everything revolves around promotion competitiveness.

**Promotion Score Card (Hero Section)**
- Composite/cutting score displayed prominently (e.g., "1432 / 1776")
- Percentile rank among MOS peers (e.g., "Top 28%")
- Trend indicator — up/down arrow with delta from last month
- Visual gauge or radial chart showing score relative to the current cutting score for promotion

**Score Breakdown**
- Horizontal bar or segmented view showing contribution from each factor:
  - PFT/CFT score
  - Rifle qualification
  - PME completion
  - Time in service / Time in grade
  - Proficiency & Conduct marks
- Each segment is tappable to drill into detail

**Tips & Updates Feed**
- 3-5 cards below the score, each showing:
  - What changed (e.g., "New cutting score published for 0311")
  - What the user can do about it (e.g., "Scoring a 285+ PFT would move you to Top 20%")
  - MARADMIN references where relevant
- Cards are prioritized: most impactful actions first

**Quick Log Buttons**
- Floating action button or inline row: "Log PFT", "Log Rifle Score", "Log PME", "Log Cert", "Update Cutting Score"
- Each opens a simple form/modal

### 2. Fitness Tab

**Current PFT/CFT Summary**
- Last recorded PFT score with date
- Last recorded CFT score with date
- Class breakdown (1st, 2nd, 3rd class)

**Score History**
- Simple line chart showing PFT/CFT scores over time
- Tappable data points

**Log Entry**
- Form to log a new PFT or CFT
  - Pull-ups / push-ups
  - Crunches / plank
  - 3-mile run time
- Auto-calculates score using standard PFT scoring tables (mock for prototype)

**Goal Setter**
- "I want to score ___" → shows what individual events need to be to hit that target

### 3. Pocketbook Tab

A reference library. Static content, organized by category.

**Categories**
- Uniform Standards (measurements, grooming, inspections)
- Rank Structure & Insignia
- General Orders
- Code of Conduct
- Leadership Principles & Traits
- Common Acronyms & Terminology
- Chain of Command (template)
- Promotion Requirements by Grade

**Each Reference Item**
- Title, summary, and expandable full content
- Search bar at top to filter
- Bookmark/star capability for quick access

### 4. MARADMINS Tab

**Feed of Recent MARADMINS**
- Filtered to career-relevant updates (promotions, policy changes, PME updates)
- Each card shows:
  - MARADMIN number and date
  - Title / subject line
  - Brief summary (2-3 sentences)
  - Tag (e.g., "Promotions", "PME", "Policy")
  - "Affects your score" badge if applicable

**Detail View**
- Full MARADMIN text (mock content for prototype)
- "What this means for you" plain-language summary

---

## Data Model (Mock / Static)

For the prototype, all data is hardcoded or stored in local state. No backend.

```
User Profile:
  - Name: "LCpl Martinez"
  - MOS: "0311 - Rifleman"
  - Rank: E-3 (Lance Corporal)
  - TIS: 2 years 4 months
  - TIG: 1 year 1 month

Scores:
  - Composite Score: 1432
  - Current Cutting Score (0311 to Cpl): 1510
  - PFT: 271 (1st Class)
  - CFT: 285 (1st Class)
  - Rifle: Expert (335)
  - PME: Completed (Marine Net courses done, Cpl's Course not started)
  - Pro/Con: 4.4 / 4.4

Peer Percentile: 72nd percentile (Top 28%)
```

---

## Key Workflows to Illustrate

### Workflow 1: "Where Do I Stand?"
1. User opens app → lands on Career tab
2. Sees composite score, percentile, and cutting score gap
3. Scrolls to see breakdown of what's contributing
4. Reads tip: "You're 78 points below the cutting score. Here's how to close the gap."

### Workflow 2: "Log a PFT"
1. User taps "Log PFT" from Career tab (or navigates to Fitness tab)
2. Enters pull-ups, crunches/plank, run time
3. Score auto-calculates
4. Composite score updates on Career tab
5. Tip updates: "Nice — your PFT went up 14 points. You moved from 72nd to 74th percentile."

### Workflow 3: "What Changed?"
1. User sees badge on MARADMINS tab
2. Opens it, sees new MARADMIN about cutting score adjustment
3. Reads plain-language summary
4. Returns to Career tab — score card reflects updated cutting score
5. New tip: "Cutting score for 0311 dropped 25 points. You're now 53 points away."

### Workflow 4: "Quick Reference"
1. User navigates to Pocketbook
2. Searches "uniform inspection"
3. Opens "Uniform Standards" reference
4. Reads checklist-style content

### Workflow 5: "Set a Fitness Goal"
1. User goes to Fitness tab
2. Taps "Set Goal" → enters target PFT score
3. App shows what individual event scores are needed
4. User sees how that target PFT would affect composite score

---

## Build Milestones

### Milestone 1: Shell & Navigation
- Set up project (React + Tailwind or similar in bolt.new)
- Bottom tab navigation with 4 tabs
- Placeholder screens for each tab
- Apply design system: contour background, colors, typography
- Mobile viewport locked (375px-wide design)

### Milestone 2: Career Tab (Home)
- Promotion score card with gauge/radial visualization
- Percentile rank display
- Score breakdown bars
- Tips/updates feed (static cards)
- Quick log buttons (non-functional stubs)

### Milestone 3: Fitness Tab
- PFT/CFT summary cards
- Score history chart (static data, use Recharts or similar)
- Log PFT form with basic score calculation
- Goal setter UI

### Milestone 4: Pocketbook Tab
- Category list view
- Reference detail view with expandable sections
- Search/filter bar
- Bookmark toggle

### Milestone 5: MARADMINS Tab
- Feed of mock MARADMIN cards
- Detail view with plain-language summary
- "Affects your score" badge logic
- Notification badge on tab

### Milestone 6: Interactivity & Polish
- Wire up PFT logging → composite score update
- Animate score changes
- Add transitions between views
- Responsive touch targets (min 44px)
- Final visual polish pass

---

## Technical Notes (bolt.new Context)

- **Framework**: React (Vite) — bolt.new's default
- **Styling**: Tailwind CSS for rapid prototyping
- **Charts**: Recharts or a lightweight charting lib
- **State**: React useState/useContext — no backend, no auth
- **Routing**: React Router or simple tab state toggle
- **Data**: All mock data in a `data/` folder or inline constants
- **Assets**: SVG contour pattern for background, minimal imagery

---

## Out of Scope (for Prototype)

- Real data / API integrations
- Authentication / user accounts
- Push notifications
- Offline support
- Actual MARADMIN feed ingestion
- Real PFT/CFT scoring algorithm (use simplified version)
- Multi-user / admin views
- Backend / database
