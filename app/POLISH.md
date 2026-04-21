# FORGE Polish List

Things noticed during real usage that need fixing. Priority from top to bottom.

---

## 🔴 Active (next session)

- [ ] Post-Workout Summary screen — finish workout should show celebration + stats, not dump user to Home

## 🟡 Queued

_(add new items here as you notice them)_
- [ ] Show "+X lbs vs last time" delta under the hero volume number (needs history)
- [ ] Show "NEW PR" callout card when a PR is hit (needs history)
- [ ] Show per-exercise "+X lbs vs last time" in exercise breakdown cards (needs history)
- [ ] Progressive overload suggestion mode — recommend a weight bump based on last performance
- [ ] RPE (rate of perceived exertion) tracking per set
- [ ] Coaching program templates (5/3/1, Starting Strength, etc) with automated weight prescriptions

## ✅ Done

_(completed items move here with a date)_

---

## How to use this list

1. When using FORGE and something feels off, add it under "Queued" as a single line
2. When starting a new session with Claude, we pick the top 1-3 items from Active/Queued
3. After fixing, move to "Done" with the date

Principle: rough edges are more obvious during use than during design. Trust the list.

---

## Design System — Callout Card Pattern (Reusable)

A subtle, dismissible-ready notice used for preview-state messages, onboarding hints, empty states, and contextual tips. First introduced on the Profile screen's "Preview Build" notice. Works against dark backgrounds, pairs visually with the routine detail notes block (same accent-line family).

### Anatomy
- **Left accent bar:** 2px purple border (`border-l-2 border-purple-500/50`)
- **Subtle fill:** `bg-purple-500/5` — tinted but nearly transparent
- **Rounded right corner only:** `rounded-r-[10px]` (leaves the accent bar flush)
- **Label:** 10px, semibold, purple-300, uppercase, tracking-[0.14em]
- **Body:** 12px, text-text-secondary, leading-relaxed

### Reusable Component (future work)

When we use this pattern in 3+ places, extract to `components/CalloutCard.tsx`:

```tsx
interface CalloutCardProps {
  label: string;          // small-caps header (e.g. "PREVIEW BUILD", "TIP", "HEADS UP")
  children: React.ReactNode;  // body content
  dismissible?: boolean;  // show X button (future)
  onDismiss?: () => void; // callback when dismissed (future)
}
```

Until then, inline the markup directly using this template:

```tsx
<div className="mb-5 pl-3 pr-4 py-3 border-l-2 border-purple-500/50 bg-purple-500/5 rounded-r-[10px]">
  <div className="text-[10px] font-semibold text-purple-300 uppercase tracking-[0.14em] mb-1">
    {LABEL}
  </div>
  <div className="text-[12px] text-text-secondary leading-relaxed">
    {BODY}
  </div>
</div>
```

### Use Cases (planned)
- **Preview/beta state indicators** — currently on Profile screen
- **First-time user hints** — contextual onboarding tips ("Tap any exercise to edit its sets")
- **Empty states** — soft messages when a list has no items ("No workouts logged yet — your stats will appear here")
- **Feature announcements** — surfaced when a new feature ships ("New: drag exercises to reorder")
- **Safety notices** — non-critical messages ("This routine hasn't been trained in 3 weeks")

### Color Variants (future extensions)
When we need non-purple variants, follow the same structural formula but swap the accent color:
- **Info:** current purple treatment (default)
- **Success:** `border-green-500/50`, `bg-green-500/5`, label `text-green-300`
- **Warning:** `border-amber-500/50`, `bg-amber-500/5`, label `text-amber-300`
- **Error:** avoid — use a more prominent pattern (modal/toast) since errors need stronger signals

### Do Not
- Do not increase the left border width beyond 2px (heavier reads as "alert" not "notice")
- Do not add shadows — the accent line is the entire visual structure
- Do not use pure `purple-500` fill — must stay at `/5` opacity or lighter, or it competes with primary CTAs
- Do not use this for errors or destructive confirmations — those need higher-contrast treatments

---