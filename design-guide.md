# Waypoints — Design Guide

A reference for coding agents building the Waypoints mobile web app prototype.

---

## Design Motif: Topographic Maps

The entire visual language draws from USGS topographic maps and land navigation. The app should feel like a modern digital tool built on top of a topo map — grounded, directional, and purposeful.

**Key visual metaphors:**
- Contour lines = progress and elevation (moving up in your career)
- Waypoints = goals and milestones
- Bearing/azimuth = direction and focus
- Terrain = the landscape of your career

---

## Color System

### Primary Palette

| Role        | Color     | Hex       | Usage                                      |
|-------------|-----------|-----------|---------------------------------------------|
| Primary     | Black     | `#1A1A1A` | Body text, headings, primary UI elements    |
| Secondary   | Tan       | `#D2B48C` | Backgrounds, secondary surfaces, muted text |
| Accent      | Signal Orange | `#FF5522` | CTAs, alerts, score highlights, active states |
| Background  | Off-White | `#F5F1EB` | Page background (under contour lines)       |
| Surface     | White     | `#FFFFFF` | Cards, modals, input fields                 |

### Extended Palette

| Role           | Hex       | Usage                                  |
|----------------|-----------|----------------------------------------|
| Tan Light      | `#E8D5B7` | Subtle fills, hover states             |
| Tan Dark       | `#A08060` | Secondary text, muted labels           |
| Accent Light   | `#FF7A55` | Accent hover/active state              |
| Accent Dark    | `#CC4400` | Accent pressed state                   |
| Success        | `#2D8A4E` | Positive score changes, improvements   |
| Warning        | `#D4940A` | Approaching thresholds                 |
| Danger         | `#CC3333` | Negative changes, missed targets       |
| Contour Line   | `#D2C4A8` | Background contour strokes (subtle)    |
| Contour Fill   | `#EDE6D8` | Alternating contour zone fills         |

### Usage Rules

- **Text on white/off-white surfaces**: Always `#1A1A1A` for body, `#A08060` for secondary
- **Accent `#FF5522`** is reserved for interactive elements and emphasis — never used for large background areas
- **Tan tones** are the workhorse — used for secondary backgrounds, dividers, inactive tabs, and muted UI
- **Cards** are always white (`#FFFFFF`) with a subtle shadow, sitting on top of the off-white/contour background
- Maintain **WCAG AA** contrast ratios (4.5:1 minimum for text)

---

## Typography

### Font Stack

```css
--font-heading: 'DM Sans', 'Inter', system-ui, sans-serif;
--font-body: 'Inter', 'DM Sans', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

Use Google Fonts. Load `DM Sans` (500, 700) and `Inter` (400, 500, 600). Mono is only needed for score displays.

### Type Scale

| Element            | Font      | Weight | Size   | Line Height | Letter Spacing |
|--------------------|-----------|--------|--------|-------------|----------------|
| Page Title         | DM Sans   | 700    | 24px   | 1.2         | -0.02em        |
| Section Heading    | DM Sans   | 700    | 18px   | 1.3         | -0.01em        |
| Card Title         | DM Sans   | 600    | 16px   | 1.3         | 0              |
| Body               | Inter     | 400    | 14px   | 1.5         | 0              |
| Body Bold          | Inter     | 600    | 14px   | 1.5         | 0              |
| Caption / Label    | Inter     | 500    | 12px   | 1.4         | 0.02em         |
| Score Display      | JetBrains | 700    | 36px   | 1.0         | -0.02em        |
| Score Small        | JetBrains | 600    | 20px   | 1.1         | -0.01em        |
| Tab Label          | Inter     | 500    | 11px   | 1.0         | 0.04em         |

### Rules

- All caps for tab labels and small badges only — never for headings or body text
- Score numbers should feel big, bold, and immediately readable
- Use DM Sans for anything structural (headings, navigation). Use Inter for readable content (body, descriptions, forms)

---

## Background: Topographic Contour Lines

The signature visual element. A subtle, light contour pattern sits behind all content.

### Implementation

Generate an SVG pattern of concentric, irregular contour lines. This lives as a full-bleed background on the page body, behind all cards and UI.

```css
body {
  background-color: #F5F1EB;
  background-image: url('/contour-bg.svg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}
```

### Contour Line Specs

- **Stroke color**: `#D2C4A8` (subtle tan, not distracting)
- **Stroke width**: 1px
- **Opacity**: 0.4–0.6 (content should be easily readable over it)
- **Style**: Smooth, organic, irregular curves — not perfect circles
- **Density**: Medium — roughly 8-12 lines visible in any viewport
- **No labels or numbers** on contour lines (unlike a real topo map — keep it abstract)

### Alternative: CSS-Only Approach

If SVG is too complex for bolt.new, use a CSS approach:

```css
body {
  background-color: #F5F1EB;
  background-image:
    radial-gradient(ellipse at 30% 20%, transparent 30%, #D2C4A833 30.5%, transparent 31%),
    radial-gradient(ellipse at 70% 60%, transparent 40%, #D2C4A833 40.5%, transparent 41%),
    radial-gradient(ellipse at 50% 80%, transparent 25%, #D2C4A833 25.5%, transparent 26%),
    radial-gradient(ellipse at 20% 70%, transparent 35%, #D2C4A833 35.5%, transparent 36%);
  background-size: 800px 800px;
}
```

---

## Layout & Spacing

### Mobile Viewport

- Target width: **375px** (iPhone SE / standard mobile)
- Max content width: **428px** (iPhone 14 Pro Max)
- Content should be fluid within this range
- No horizontal scroll — ever

### CRITICAL: Mobile Column Constraint

**All UI — without exception — must be contained within the `max-w-[428px]` mobile column.**

This applies to every feature, component, overlay, modal, drawer, popup, prompt, or sheet:

- Overlays and backdrops must be positioned **relative to the mobile column**, not the browser viewport
- Use `absolute` positioning inside the mobile column container — never `fixed` or `absolute` relative to `<body>` or a full-screen wrapper
- The mobile column is the `relative` ancestor: `className="relative h-full w-full max-w-[428px] ..."`
- Nothing should bleed outside this column or span the full browser/desktop width
- Rendered within the mobile column correctly, `absolute inset-0` will fill exactly the mobile viewport — this is the correct pattern

### Spacing Scale

```
4px   — micro (icon-to-label, tight internal padding)
8px   — small (between related elements within a card)
12px  — medium (card internal padding, gap between side-by-side cards)
16px  — standard (between cards, section padding, card internal padding default)
24px  — large (between major sections — section heading to previous content)
32px  — extra-large (top of page to first content, reserved for hero gaps)
```

### Applied Spacing Rules (implementation decisions)

These rules are locked in the codebase and should be kept consistent:

**Page structure:**
- Content area top padding: `pt-6` (24px) — creates breathing room below header
- Content area bottom padding: 96px total — 64px tab bar + 32px visual clearance
- Content area horizontal padding: `px-4` (16px)

**Between sections (section heading to previous card):**
- Use `mt-8` (32px) — gives each section clear separation

**Section heading to card below it:**
- Use `mb-4` (16px) — consistent gap from heading to first card

**Between cards in a list:**
- Use `space-y-3` (12px) — matches "margin between cards: 12px" spec

**Inside cards:**
- Standard card padding: `p-4` (16px)
- Hero/score card padding: `p-5` (20px) — score display cards get extra room
- Between labeled groups within a card: `space-y-4` (16px)
- Between individual items within a group: `space-y-3` (12px)
- Label above progress bar or input: `mb-2` (8px) — never `mb-1`
- Label above value text: `mt-2` (8px) from previous element

**Form inputs:**
- Label to input: `mb-2` (8px) minimum
- Between form field groups: `space-y-4` (16px)
- Buttons below form fields: `pt-1` extra top nudge within `space-y-4`

**Detail views (back nav + title):**
- Back button bottom margin: `mb-5` (20px)
- Title bottom margin: `mb-4` or `mb-5` (16–20px) before tags/content

**Badges and tags:**
- Internal padding: `px-2 py-1` — slightly taller than `py-0.5` for readability

**Header:**
- Height: 56px (title only) / 64px (title + subtitle)
- Bottom border: `border-b border-wp-tan-light/50` — subtle divider

### Page Structure

```
┌──────────────────────────┐
│  Status Bar (device)     │  — not rendered, but account for safe area
├──────────────────────────┤
│  Header / Page Title     │  — 56px (no subtitle) / 64px (with subtitle)
│  (optional subtitle)     │  — bottom border: 1px solid #E8D5B7 at 50% opacity
├──────────────────────────┤
│                          │
│  Scrollable Content      │  — padding: 16px horizontal, 24px top
│                          │
│  [First Card]            │  ← no extra top margin needed (pt-6 on container)
│  [Card]   — 12px gap     │
│  [Card]   — 12px gap     │
│                          │
│  [Section Heading]  ← 32px from previous card (mt-8)
│  [Card]             ← 16px from heading (mb-4)
│  [Card]   — 12px gap     │
│                          │
├──────────────────────────┤
│  Bottom Tab Bar          │  — 64px height + 32px clearance above
│  Career Fitness Pocket.. │
└──────────────────────────┘
```

---

## Component Specs

### Cards

The primary content container. Everything lives in cards.

```
Background: #FFFFFF
Border radius: 12px
Padding: 16px
Shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)
Margin between cards: 12px
```

Cards sit on top of the contour background. They should feel like they're resting on the terrain.

### Bottom Tab Bar

```
Background: #FFFFFF
Border top: 1px solid #E8D5B7
Height: 64px (plus safe area inset)
Shadow: 0 -2px 8px rgba(0, 0, 0, 0.06)

Tab Item:
  - Icon: 24px, centered
  - Label: 11px, uppercase, 500 weight
  - Inactive: #A08060 (tan dark)
  - Active: #FF5522 (accent)
  - Active indicator: 3px solid #FF5522 bar above the icon

Spacing: evenly distributed across 4 tabs
```

### Buttons

**Primary (Accent)**
```
Background: #FF5522
Text: #FFFFFF, 14px, 600 weight
Border radius: 8px
Padding: 12px 24px
Min height: 44px
Active: #CC4400
```

**Secondary (Outline)**
```
Background: #EBE1D1
Border: 1.5px solid #D2B48C
Text: #1A1A1A, 14px, 500 weight
Border radius: 8px
Padding: 12px 24px
Min height: 44px
Active: background #E8D5B7
```

**Ghost / Text Button**
```
Background: transparent
Text: #FF5522, 14px, 500 weight
Padding: 8px 12px
Active: text #CC4400
```

### Score Display (Hero)

The most important visual element on the Career tab.

```
Container: Card with slightly larger padding (20px)
Score number: 36px JetBrains Mono, 700, #1A1A1A
Score label: 12px Inter, 500, #A08060, uppercase
Cutting score reference: 20px JetBrains Mono, 600, #A08060
Percentile: 14px Inter, 600, #FF5522

Example layout:
  ┌──────────────────────────────┐
  │  YOUR COMPOSITE SCORE        │  ← caption, #A08060
  │  1432                        │  ← big number, #1A1A1A
  │  ━━━━━━━━━━━━━━━━━━━━━━━━    │  ← progress bar to cutting score
  │  Cutting: 1510    Top 28%    │  ← reference, percentile
  │                              │
  │  ↑ +14 since last month      │  ← trend, green if positive
  └──────────────────────────────┘
```

### Progress / Gauge Bars

```
Track: #E8D5B7 (tan light), 8px height, full rounded
Fill: #FF5522 (accent), rounded left end
If score exceeds threshold: fill turns #2D8A4E (success green)
Border radius: 4px
```

### Form Inputs

```
Background: #FFFFFF
Border: 1.5px solid #D2C4A8
Border radius: 8px
Padding: 12px 16px
Font: Inter, 14px, 400
Placeholder: #A08060
Focus border: #FF5522
Height: 44px
```

### Tip / Update Cards

```
Background: #FFFFFF
Left border: 3px solid #FF5522 (or relevant status color)
Padding: 12px 16px
Icon: 20px, left-aligned
Title: 14px, 600, #1A1A1A
Description: 13px, 400, #A08060
```

### Badges / Tags

```
Background: #FF552220 (accent at 12% opacity)
Text: #FF5522, 11px, 600, uppercase
Padding: 4px 8px
Border radius: 4px
```

---

## Iconography

Use a clean, outlined icon set. Recommended: **Lucide Icons** (available in React as `lucide-react`).

### Tab Icons
- **Career**: `Target` or `Crosshair` (waypoint/objective)
- **Fitness**: `Activity` or `HeartPulse`
- **Pocketbook**: `BookOpen` or `Library`
- **MARADMINS**: `FileText` or `Bell`

### Utility Icons
- Log entry: `Plus` or `PlusCircle`
- Trend up: `TrendingUp` (green)
- Trend down: `TrendingDown` (red)
- Bookmark: `Bookmark`
- Search: `Search`
- Score alert: `AlertCircle`
- Chevron / expand: `ChevronRight`, `ChevronDown`

### Rules
- Icon size: 20-24px in most contexts
- Icon stroke width: 1.5-2px
- Icon color inherits from text color of parent context
- Always pair icons with labels in navigation — never icon-only for primary nav

---

## Motion & Transitions

Keep it minimal and purposeful. This is a utility app, not an entertainment app.

```css
/* Standard transition for interactive elements */
transition: all 150ms ease-out;

/* Page/tab transitions */
transition: opacity 200ms ease-out, transform 200ms ease-out;

/* Score number changes — slightly longer for emphasis */
transition: all 400ms ease-in-out;
```

- Tab switches: fade + subtle slide (content slides in from direction of tab)
- Cards appearing: fade in + translate up 8px
- Score changes: count up/down animation over 400ms
- No bouncy, springy, or playful animations — keep it military-crisp

---

## Accessibility & Touch

- **Minimum touch target**: 44px x 44px (Apple HIG standard)
- **Font size minimum**: 11px (only for captions/labels; body is 14px+)
- **Color alone never conveys meaning** — always pair with icons or text
- **Focus states**: 2px `#FF5522` outline with 2px offset
- **Contrast**: All text meets WCAG AA (4.5:1 for normal, 3:1 for large)

---

## Design Tokens (Tailwind Config Reference)

If using Tailwind CSS, extend the config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'wp-black': '#1A1A1A',
        'wp-tan': {
          DEFAULT: '#D2B48C',
          light: '#E8D5B7',
          dark: '#A08060',
        },
        'wp-accent': {
          DEFAULT: '#FF5522',
          light: '#FF7A55',
          dark: '#CC4400',
        },
        'wp-bg': '#F5F1EB',
        'wp-surface': '#FFFFFF',
        'wp-contour': '#D2C4A8',
        'wp-success': '#2D8A4E',
        'wp-warning': '#D4940A',
        'wp-danger': '#CC3333',
      },
      fontFamily: {
        heading: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '8px',
        'badge': '4px',
      },
      spacing: {
        'micro': '4px',
        'sm': '8px',
        'md': '12px',
        'base': '16px',
        'lg': '24px',
        'xl': '32px',
      },
    },
  },
}
```

---

## Sample Contour SVG

A starting point for the background pattern. Adjust paths for variety.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" fill="none">
  <path d="M200,400 Q300,200 500,350 Q700,500 600,650 Q450,750 300,600 Q200,500 200,400Z"
        stroke="#D2C4A8" stroke-width="1" opacity="0.5" fill="none"/>
  <path d="M180,400 Q280,180 520,330 Q720,520 620,670 Q470,770 280,620 Q180,520 180,400Z"
        stroke="#D2C4A8" stroke-width="1" opacity="0.45" fill="none"/>
  <path d="M160,400 Q260,160 540,310 Q740,540 640,690 Q490,790 260,640 Q160,540 160,400Z"
        stroke="#D2C4A8" stroke-width="1" opacity="0.4" fill="none"/>
  <path d="M140,400 Q240,140 560,290 Q760,560 660,710 Q510,810 240,660 Q140,560 140,400Z"
        stroke="#D2C4A8" stroke-width="1" opacity="0.35" fill="none"/>
  <path d="M400,150 Q550,200 600,350 Q650,500 500,550 Q350,580 300,450 Q280,300 400,150Z"
        stroke="#D2C4A8" stroke-width="1" opacity="0.5" fill="none"/>
  <path d="M400,130 Q570,180 620,370 Q670,520 520,570 Q370,600 280,470 Q260,280 400,130Z"
        stroke="#D2C4A8" stroke-width="1" opacity="0.45" fill="none"/>
  <path d="M400,110 Q590,160 640,390 Q690,540 540,590 Q390,620 260,490 Q240,260 400,110Z"
        stroke="#D2C4A8" stroke-width="1" opacity="0.4" fill="none"/>
</svg>
```

---

## Do's and Don'ts

### Do
- Use the contour background consistently across all screens
- Keep cards clean, white, and well-spaced
- Make scores and numbers the biggest, boldest elements
- Use the accent orange sparingly for maximum impact
- Maintain the topo map aesthetic without being kitschy

### Don't
- Use camo patterns, eagle graphics, or overt military imagery
- Make the UI feel like a government form — it should feel modern
- Use red/green alone for meaning — always pair with text or icons
- Overload any single screen — if it feels crowded, break it into sections
- Use decorative animations — every motion should have purpose
- Add drop shadows heavier than the specs above — keep it flat and clean
- **Ever render any UI outside the `max-w-[428px]` mobile column** — modals, drawers, popups, sheets, and overlays must all stay within this column
