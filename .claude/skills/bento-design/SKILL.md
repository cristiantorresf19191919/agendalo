# W3C-Standard Bento Architect — Agendalo

Apply the Bento Grid design system when building or redesigning UI for Agendalo. This is the project's canonical design language aligned with **W3C Web Platform Design Principles (Feb 2026)** and professional UI/UX standards. Use it for landing pages, feature sections, dashboards, booking flows, and any layout communicating multiple pieces of information.

---

## 1. W3C Design Compliance

### Priority of Constituencies
Follow the W3C "Priority of Constituencies" hierarchy: **User > Author > Implementer**. Every design decision must serve the end user first.

### Accessibility (WCAG 2.1+)
- All interactive elements must be keyboard-reachable and have visible focus states (`outline: 2px solid hsl(var(--ring))`)
- Every booking input must have an associated `<label>`
- All service images must have meaningful `alt` text
- Color alone must never convey information — always pair with text or icons
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text

### Privacy & Security
- Use Secure Contexts for all interactive flows
- Never reveal user assistive technology status or private browsing mode in the UI
- Use `AbortSignal` for any cancelable asynchronous booking flows

---

## 2. Philosophy: Sophisticated Bento

Bento Grid design organizes content into **modular, variable-sized blocks** within an underlying grid. Inspired by Apple's product pages and refined through modern SaaS design (Linear, Bolt, Vercel), this system creates visual hierarchy through **block size variation**, **high-contrast minimalism**, and **editorial typography**.

### Core Principles

1. **Modular blocks, variable sizes.** Content lives in distinct, rounded tiles. Some tiles are 2x wide, some are tall, some are 1x1. The variation creates visual rhythm and hierarchy. Larger tiles = higher priority content.

2. **Solid surfaces, not glass.** Use solid `bg-card` backgrounds with subtle `border-border/50` edges. **STRICTLY FORBIDDEN: No `backdrop-blur`, no `bg-opacity` on tiles.** Depth comes from **shadow tokens** (`--shadow-sm` through `--shadow-xl`) and **surface elevation** (`--surface-0` through `--surface-3`).

3. **1px borders, not thick decorative ones.** Borders are structural, never decorative. Always `border-border/50` or `border-border/30` — barely visible but defining edges. On hover: `border-emerald-500/20` for subtle interactive feedback.

4. **Editorial typography drives hierarchy.** Headers: `tracking-tighter font-bold`. Body: 16px minimum, 50-75 characters per line max. Size contrast between headline and body should be dramatic (`text-4xl` title vs `text-sm` description).

5. **White space is structure.** Generous padding inside tiles (`p-6` to `p-8`). Consistent gap between tiles (`gap-4` to `gap-5`). Section margins of `py-16 md:py-24`. Let content breathe.

6. **Icons add meaning, not decoration.** Every icon must serve a functional purpose. Place them in subtle containers (`bg-emerald-500/8 rounded-xl p-3`). Never scatter random icons for visual filler.

---

## 3. Layout Patterns

### Reading Patterns
- **Z-Pattern** for landing sections (hero, features, CTA) — user scans top-left → top-right → bottom-left → bottom-right
- **F-Pattern** for data-heavy booking agendas and lists — user scans left column first, then horizontal

### Base Grid
Use CSS Grid with `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` as the default. For feature/bento sections, use `lg:grid-cols-4` for asymmetric layouts.

### Bento Layouts (Asymmetric)

```tsx
// 4-column bento with variable sizes
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <div className="lg:col-span-2 lg:row-span-2">  {/* Hero tile — large */}
  <div className="lg:col-span-1">                  {/* Standard tile */}
  <div className="lg:col-span-1">                  {/* Standard tile */}
  <div className="lg:col-span-2">                  {/* Wide tile */}
</div>

// 3-column bento
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="sm:col-span-2">  {/* Wide tile */}
  <div>                             {/* Standard tile */}
  <div>                             {/* Standard tile */}
  <div className="sm:col-span-2">  {/* Wide tile */}
</div>
```

---

## 4. Interaction Design (Fitts's Law)

### Target Size
Every clickable element (buttons, time slots, tiles) MUST be at least **44px × 44px**. This includes:
- Buttons: `h-10` minimum (40px) with adequate padding → `h-11` or `h-12` for primary CTAs
- Time slot selectors: minimum `min-h-[44px]`
- Category filter pills: `min-h-[36px]` with `px-4 py-2`

### Proximity
Group related actions within the same Bento module:
- Price + Duration + Book Button in the same card
- Service name + Rating + Location in the same tile
- Step number + Icon + Description in the same step tile

### Frictionless Booking (Slot-First Design)
Available times should be visible immediately upon service selection. Use progressive disclosure — hide complex options (add-ons, advanced preferences) until the primary service is selected.

---

## 5. Tile Anatomy

### Standard Tile
```tsx
<div className="rounded-2xl bg-card border border-border/50 p-6 hover:border-emerald-500/15 hover:shadow-[var(--shadow-md)] transition-all duration-300">
  <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/8 p-3 mb-4">
    <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
  </div>
  <h3 className="font-bold text-base font-display tracking-tight">{title}</h3>
  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{desc}</p>
</div>
```

### Hero Tile (2×2)
```tsx
<div className="rounded-2xl bg-card border border-border/50 p-8 lg:col-span-2 lg:row-span-2 flex flex-col justify-between">
  <div>
    <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/8 p-4 mb-6">
      <Icon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
    </div>
    <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight">{title}</h3>
    <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-md">{desc}</p>
  </div>
  <div className="mt-8 pt-6 border-t border-border/30">
    <p className="text-3xl font-extrabold text-gradient-primary font-display">{stat}</p>
    <p className="text-xs text-muted-foreground mt-1">{statLabel}</p>
  </div>
</div>
```

---

## 6. Design Tokens

### Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--background` | Near-white `98%` | Deep charcoal `5%` | Page canvas |
| `--card` | Pure white `100%` | Dark `9%` | Tile backgrounds |
| `--surface-1` | Light gray `96%` | Dark `9%` | Alternating sections |
| `--surface-2` | Mid gray `93%` | Dark `13%` | Nested elevation |
| `--border` | Light `90%` | Dark `18%` | Tile edges |
| `--foreground` | Near-black `12%` | Light `95%` | Primary text |
| `--muted-foreground` | Mid `46%` | Mid `55%` | Secondary text |

### Accent: Emerald
- Primary: `emerald-500` (actions, CTA buttons)
- Text accent: `emerald-600 dark:emerald-400` (labels, links)
- Subtle background: `emerald-500/8` (icon containers, badges)
- Border hover: `emerald-500/15` to `emerald-500/20`
- Shadow: `--shadow-emerald` for CTA buttons

### Shadows
Use CSS custom property shadows — **never raw `shadow-black/XX`**:
- `shadow-[var(--shadow-sm)]` — Tile resting state
- `shadow-[var(--shadow-md)]` — Tile hover state, header scroll
- `shadow-[var(--shadow-lg)]` — Elevated cards, dropdowns
- `shadow-[var(--shadow-xl)]` — Modals, popovers
- `shadow-[var(--shadow-emerald)]` — CTA buttons

### Typography
- **Display**: `font-display tracking-tight` (Outfit) — headlines, card titles
- **Body**: Default DM Sans — descriptions, UI text (16px minimum)
- **Sizes**: Dramatic contrast — section title `text-2xl sm:text-3xl lg:text-4xl`, card title `text-base` to `text-lg`, description `text-sm`
- **Labels**: `text-xs font-semibold tracking-widest uppercase text-emerald-600 dark:text-emerald-400`
- **Line length**: 50-75 characters max per line (`max-w-md` to `max-w-lg`)

### Spacing
- **Tile padding**: `p-6` standard, `p-7` to `p-8` for large tiles
- **Grid gap**: `gap-4` to `gap-5`
- **Section padding**: `py-16 md:py-24`
- **Section heading margin**: `mb-10` to `mb-12`
- **Content container**: `max-w-7xl mx-auto px-5 sm:px-8`

### Border Radius
- **Outer tiles**: `rounded-2xl` (16px) — use `rounded-3xl` for featured/hero cards
- **Inner elements**: `rounded-xl` (12px)
- **Buttons**: `rounded-lg` (8px) standard, `rounded-xl` (12px) for CTA
- **Badges/pills**: `rounded-full`
- **Inputs**: `rounded-lg` (8px)

---

## 7. Component Patterns

### Section Header
```tsx
<div className="text-center mb-12">
  <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-2">
    {sectionLabel}
  </p>
  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight">
    {sectionTitle}
  </h2>
  <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm sm:text-base">
    {sectionDescription}
  </p>
</div>
```

### Stat Tile
```tsx
<div className="text-center p-6 md:p-8 rounded-2xl bg-card border border-border/50">
  <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/8 p-3 mb-4">
    <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
  </div>
  <p className="text-3xl sm:text-4xl font-extrabold text-gradient-primary font-display tracking-tight">{value}</p>
  <p className="text-xs sm:text-sm text-muted-foreground mt-2">{label}</p>
</div>
```

### Badge/Pill
```tsx
<span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/8 border border-emerald-500/12 px-4 py-1.5 text-[13px] font-medium text-emerald-600 dark:text-emerald-400">
  <Icon className="h-3.5 w-3.5" />
  {text}
</span>
```

### Interactive Tile
```tsx
<motion.div
  whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
  className="group rounded-2xl p-6 bg-card border border-border/50 cursor-pointer
    hover:border-emerald-500/20 hover:shadow-[var(--shadow-lg)] transition-all duration-300"
>
  {/* content */}
  <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all duration-300" />
</motion.div>
```

---

## 8. Animation Rules

- **Hover**: `y: -4` with spring `stiffness: 400, damping: 20`. Never more than 4px lift.
- **Scroll reveal**: Staggered `delay: i * 0.06` to `0.08`. Fade + slight upward motion.
- **Transitions**: `duration-300` for most, `duration-200` for small interactive elements.
- **Reduced motion**: All animations respect `prefers-reduced-motion: reduce`.
- **No bounce**: Professional interfaces don't bounce. Use spring with high damping (20+).

---

## 9. Mandatory Playwright QA Audit

Before finalizing any UI change, run a Playwright check via MCP:

### Viewport Stress Test
1. **Mobile (375px):** Ensure bento grid stacks vertically. Check for horizontal overflow.
2. **Desktop (1440px):** Check for excessive whitespace or "stretched" cards.

### Visual QA
1. Verify `1px` border consistency on all tiles
2. Check for element collision (overlapping text/buttons)
3. Ensure hero images are responsive and not cropping key details
4. Verify dark/light mode contrast and readability in every section

### Accessibility Audit
1. All booking inputs must have associated labels
2. All service images must have `alt` text
3. All interactive elements must have visible focus indicators
4. Minimum touch target of 44px × 44px

---

## 10. Coding Standards

### Performance
- Optimize all images with Next.js `next/image`
- Use `loading="lazy"` for below-fold images
- Prefer CSS transitions over JavaScript animations where possible

### Consistency
- Use shadcn/ui semantic variables (`--primary`, `--background`, `--card`, `--border`)
- **Never hardcode hex values in components**
- Use `cn()` utility from `@/lib/utils` for all className merging

### Progressive Disclosure
- Hide complex options (advanced spa add-ons, filters) until primary selection is made
- Show available times immediately upon service selection (Slot-First design)

---

## 11. Anti-Patterns (NEVER do these)

- **No `backdrop-blur` on tiles** — solid `bg-card` only
- **No `bg-opacity` on tiles** — solid surfaces only
- **No gradient backgrounds on tiles** — solid colors only
- **No `shadow-black/XX`** — use `var(--shadow-*)` tokens
- **No `zinc-*` classes** — use semantic tokens (`text-foreground`, `bg-card`, `border-border`)
- **No thick borders** — always 1px, always subtle
- **No pure white cards on colored backgrounds** — use `bg-card` token
- **No more than ONE accent color** — emerald only
- **No decorative gradients** — gradients only for text (`text-gradient-primary`) and CTA buttons
- **No `white/[0.XX]` borders** — invisible in light mode. Use `border-border/50`
- **No hardcoded dark-only colors** — everything must work in both themes
- **No clickable elements under 44px** — violates Fitts's Law and WCAG

---

## When to Use This Skill

Use `/bento-design` when:
- Building or redesigning landing page sections
- Creating feature showcase layouts
- Designing dashboard overview tiles
- Building pricing comparison grids
- Creating booking flow interfaces
- Laying out any multi-item content with visual hierarchy through size variation

Do NOT use for:
- Single-item detail pages (use standard layout)
- Long-form content (use editorial layout)
- Simple forms (use standard form patterns)
