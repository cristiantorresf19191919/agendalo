# Bento Grid Design System — Agendalo

Apply the Bento Grid design system when building or redesigning UI for Agendalo. This is the project's canonical design language. Use it for landing pages, feature sections, dashboards, and any layout that needs to communicate multiple pieces of information in a visually structured way.

---

## Philosophy

Bento Grid design organizes content into **modular, variable-sized blocks** within an underlying grid. Inspired by Apple's product pages and refined through modern SaaS design (Linear, Bolt, Vercel), this system creates visual hierarchy through **block size variation**, **high-contrast minimalism**, and **editorial typography** — NOT through glassmorphism, gradients-for-decoration, or transparency effects.

### Core Principles

1. **Modular blocks, variable sizes.** Content lives in distinct, rounded tiles. Some tiles are 2x wide, some are tall, some are 1x1. The variation creates visual rhythm and hierarchy. Larger tiles = higher priority content.

2. **Solid surfaces, not glass.** Use solid `bg-card` backgrounds with subtle `border-border/50` edges. No `backdrop-blur`, no transparency-based surfaces. Depth comes from **shadow tokens** (`--shadow-sm` through `--shadow-xl`) and **surface elevation** (`--surface-0` through `--surface-3`), not from blur or opacity.

3. **1px borders, not thick decorative ones.** Borders are structural, never decorative. Always `border-border/50` or `border-border/30` — barely visible but defining edges. On hover, borders can shift to `border-emerald-500/20` for subtle interactive feedback.

4. **High-contrast typography drives hierarchy.** Use bold weight + tight tracking for headlines (`font-display tracking-tight`). Use muted foreground for supporting text. Size contrast between headline and body should be dramatic (e.g., `text-4xl` title vs `text-sm` description).

5. **White space is structure.** Generous padding inside tiles (`p-6` to `p-8`). Consistent gap between tiles (`gap-4` to `gap-5`). Section margins of `py-20 md:py-28`. Let content breathe.

6. **Icons add meaning, not decoration.** Every icon should serve a functional purpose. Place them in subtle containers (`bg-emerald-500/8 rounded-xl p-3`). Never scatter random icons for visual filler.

---

## Grid System

### Base Grid

Use CSS Grid with `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` as the default. For feature/bento sections, use `lg:grid-cols-4` or explicit `grid-template-columns` for asymmetric layouts.

### Bento Layouts (Asymmetric)

For feature showcases and key sections, create visual interest with spanning tiles:

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

### Tile Anatomy

Every bento tile follows this structure:

```tsx
<div className="rounded-2xl bg-card border border-border/50 p-6 hover:border-emerald-500/15 hover:shadow-[var(--shadow-md)] transition-all duration-300">
  {/* Icon or visual indicator */}
  <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/8 p-3 mb-4">
    <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
  </div>

  {/* Title — bold, tight */}
  <h3 className="font-bold text-base font-display tracking-tight">{title}</h3>

  {/* Description — muted, relaxed */}
  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{desc}</p>
</div>
```

### Large/Hero Tiles

For featured content or hero tiles in bento layouts:

```tsx
<div className="rounded-2xl bg-card border border-border/50 p-8 lg:col-span-2 lg:row-span-2 flex flex-col justify-between">
  <div>
    <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/8 p-4 mb-6">
      <Icon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
    </div>
    <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight">{title}</h3>
    <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-md">{desc}</p>
  </div>
  {/* Optional: stat, visual, or CTA at bottom */}
  <div className="mt-8 pt-6 border-t border-border/30">
    <p className="text-3xl font-extrabold text-gradient-primary font-display">{stat}</p>
    <p className="text-xs text-muted-foreground mt-1">{statLabel}</p>
  </div>
</div>
```

---

## Design Tokens

### Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--background` | Near-white `98.5%` | Deep charcoal `4.5%` | Page canvas |
| `--card` | Pure white | Dark `7.5%` | Tile backgrounds |
| `--surface-1` | Light gray `97%` | Dark `7.5%` | Elevated sections |
| `--border` | Light `91%` | Dark `16%` | Tile edges |
| `--foreground` | Near-black `12%` | Light `95%` | Primary text |
| `--muted-foreground` | Mid `50%` | Mid `52%` | Secondary text |

### Accent: Emerald

- Primary: `emerald-500` (actions, CTA buttons)
- Text accent: `emerald-600 dark:emerald-400` (labels, links)
- Subtle background: `emerald-500/8` (icon containers, badges)
- Border hover: `emerald-500/15` to `emerald-500/20`
- Shadow: `--shadow-emerald` for CTA buttons

### Shadows

Use CSS custom property shadows — never raw `shadow-black/XX`:

- `shadow-[var(--shadow-sm)]` — Tile resting state
- `shadow-[var(--shadow-md)]` — Tile hover state, header scroll
- `shadow-[var(--shadow-lg)]` — Elevated cards, dropdowns
- `shadow-[var(--shadow-xl)]` — Modals, popovers
- `shadow-[var(--shadow-emerald)]` — CTA buttons

### Typography

- **Display**: `font-display tracking-tight` (Outfit) — headlines, card titles
- **Body**: Default DM Sans — descriptions, UI text
- **Sizes**: Use dramatic contrast. Section title `text-2xl sm:text-3xl lg:text-4xl`, card title `text-base` to `text-lg`, description `text-sm`
- **Labels**: `text-xs font-semibold tracking-widest uppercase text-emerald-600 dark:text-emerald-400`

### Spacing

- **Tile padding**: `p-6` standard, `p-7` to `p-8` for large tiles
- **Grid gap**: `gap-4` to `gap-5`
- **Section padding**: `py-20 md:py-28`
- **Section heading margin**: `mb-12` to `mb-16`
- **Content container**: `max-w-7xl mx-auto px-5 sm:px-8`

### Border Radius

- **Tiles**: `rounded-2xl` (16px)
- **Icon containers**: `rounded-xl` (12px)
- **Buttons**: `rounded-lg` (8px) standard, `rounded-xl` (12px) for CTA
- **Badges/pills**: `rounded-full`
- **Inputs**: `rounded-lg` (8px)

---

## Component Patterns

### Section Header

```tsx
<div className="text-center mb-16">
  <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-3">
    {sectionLabel}
  </p>
  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight">
    {sectionTitle}
  </h2>
  <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm sm:text-base">
    {sectionDescription}
  </p>
</div>
```

### Stat Tile (Bento)

```tsx
<div className="text-center p-6 md:p-8 rounded-2xl bg-card border border-border/50">
  <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/8 p-2.5 mb-4">
    <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
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

### Interactive Tile (with hover)

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

## Animation Rules

- **Hover**: `y: -4` with spring `stiffness: 400, damping: 20`. Never more than 4px lift.
- **Scroll reveal**: Staggered `delay: i * 0.06` to `0.08`. Fade + slight upward motion.
- **Transitions**: `duration-300` for most, `duration-200` for small interactive elements.
- **Reduced motion**: All animations respect `prefers-reduced-motion: reduce`.
- **No bounce**: Professional interfaces don't bounce. Use spring with high damping (20+).

---

## Anti-Patterns (NEVER do these)

- **No `backdrop-blur` on tiles** — solid `bg-card` only
- **No gradient backgrounds on tiles** — solid colors only
- **No `shadow-black/XX`** — use `var(--shadow-*)` tokens
- **No `zinc-*` classes** — use semantic tokens (`text-foreground`, `bg-card`, `border-border`)
- **No thick borders** — always 1px, always subtle
- **No pure white cards on colored backgrounds** — use `bg-card` token
- **No more than ONE accent color** — emerald only, no purple/pink accents on tiles
- **No decorative gradients** — gradients only for text (`text-gradient-primary`) and CTA buttons
- **No `white/[0.XX]` borders** — invisible in light mode. Use `border-border/50`
- **No hardcoded dark-only colors** — everything must work in both themes

---

## When to Use This Skill

Use `/bento-design` when:
- Building or redesigning landing page sections
- Creating feature showcase layouts
- Designing dashboard overview tiles
- Building pricing comparison grids
- Laying out any multi-item content that benefits from visual hierarchy through size variation

Do NOT use for:
- Single-item detail pages (use standard layout)
- Long-form content (use editorial layout)
- Simple forms (use standard form patterns)
