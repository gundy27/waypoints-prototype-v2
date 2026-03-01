# Waypoints — Agent Rules

Standing instructions for all coding agents working on this project.

---

## Mobile-Only Layout (MANDATORY)

This is a mobile web app rendered as a centered column on desktop. The mobile column is the only visible UI surface.

**Every feature, component, and UI element must be contained within the `max-w-[428px]` mobile column.**

This includes — without exception:
- Modals and dialogs
- Drawers and side panels
- Popups and bottom sheets
- Notification prompts and toasts
- Overlays and backdrops
- Any absolutely or fixed positioned elements

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
    <TabBar />
    {overlays go here, as absolute children of this div}
  </div>
  {nothing UI-related goes outside the mobile column}
</div>
```

---

## Design Reference

See `design-guide.md` for the full color system, typography, spacing, component specs, and visual language.
