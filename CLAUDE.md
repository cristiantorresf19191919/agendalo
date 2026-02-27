# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000, redirects to /es)
npm run build        # Production build
npm test             # Run all tests (vitest, single pass)
npm run test:watch   # Run tests in watch mode
npm run lint         # ESLint
npx tsx scripts/seed.ts  # Seed Firestore with sample data
```

Tests live in `tests/` (not co-located in `src/`). Vitest globals are enabled—no need to import `describe`/`it`/`expect`. Run a single test file with `npx vitest run tests/domain/slot-engine.test.ts`.

## Architecture

Clean Architecture / Hexagonal Architecture with strict layer boundaries:

- **`src/domain/`** — Pure TypeScript, ZERO external dependencies. Entities (interfaces), value objects (`TimeSlot`), invariants (typed Error subclasses with assertion functions), and domain services (`computeAvailableSlots` — pure function).
- **`src/application/`** — Use case classes with `execute()` method. Constructor receives port interfaces (DI). Never imports Firebase directly.
- **`src/ports/`** — TypeScript interfaces only (`BookingRepository`, `ProfessionalRepository`, `ServiceRepository`, `BusinessRepository`, `BlockedRangeRepository`, `StoragePort`, `AuthPort`).
- **`src/infra/firebase/`** — Concrete Firebase implementations of ports. Maps Firestore `Timestamp` to `Date`.
- **`src/infra/providers/`** — Singleton lazy-init factories (`getBookingRepository()`, `getAuthAdapter()`, etc.) for dependency injection.
- **`src/ui/`** — Reusable components (Radix UI primitives + Tailwind + Framer Motion). Animation variants centralized in `src/ui/animations/variants.ts`.
- **`src/app/[locale]/`** — Next.js App Router pages and layouts.

**Critical rule:** `domain/` and `application/` must never import from `infra/` or any Firebase module. All external services go through port interfaces.

## i18n

- **Library:** next-intl v4. Locales: `es` (default), `en`. Messages in `messages/es.json` and `messages/en.json`.
- **Always** import `Link`, `useRouter`, `usePathname` from `@/i18n/navigation` — never from `next/link` or `next/navigation` directly. This ensures locale prefixes are maintained.
- Server components: `getTranslations('namespace')`. Client components: `useTranslations('namespace')`.
- All routes are under `src/app/[locale]/`. Middleware handles locale detection/redirect.

## UI Conventions

- `cn()` from `@/lib/utils` for all className merging (clsx + tailwind-merge).
- `'use client'` on all interactive components. `React.forwardRef` + `displayName` on form-type components.
- Dark mode is always on (`<html className="dark">`). Primary color: emerald green.
- Button uses CVA for variants. Card supports `interactive` and `glass` props. Modal uses Radix Dialog + AnimatePresence.
- Components render as `motion.*` elements with animation variants from `src/ui/animations/variants.ts`.

## Firebase

- Config in `src/infra/firebase/config.ts` (singleton init).
- All env vars are `NEXT_PUBLIC_FIREBASE_*` (see `.env.example`).
- In client pages, lazy-import infra: `const { getAuthAdapter } = await import('@/infra/providers/repositories')`.
- Auth methods: Email/Password, Google (popup).
- Firestore collections: `businesses`, `professionals`, `services`, `bookings`, `blockedRanges`, `userRoles`.

## Path Alias

`@/*` maps to `./src/*` (configured in both `tsconfig.json` and `vitest.config.mts`).
