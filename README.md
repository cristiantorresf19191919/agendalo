# Agendalo

Premium booking SaaS for barbershops, spas, and clinics. Built with Next.js 14+, TypeScript, Firebase, and a Clean Architecture approach.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS + Framer Motion
- **UI Primitives:** shadcn/ui (Radix)
- **Backend:** Firebase (Auth, Firestore, Storage)
- **i18n:** next-intl (ES/EN, default ES)
- **Testing:** Vitest
- **Validation:** Zod

## Architecture

```
src/
  domain/          # Entities, Value Objects, Invariants, Slot Engine (ZERO deps)
  application/     # Use Cases (depend only on ports + domain)
  ports/           # Repository & service interfaces
  infra/firebase/  # Firebase implementations of ports
  infra/providers/ # Dependency injection / factories
  ui/              # Reusable animated components
  app/             # Next.js App Router (routes, layouts, pages)
  i18n/            # next-intl configuration
  lib/             # Shared utilities (cn, etc.)
```

### Key Principle

Firebase is **never** imported in `domain/` or `application/`. All external services are accessed through port interfaces, keeping business logic testable and framework-agnostic.

## Getting Started

### Prerequisites

- Node.js >= 20
- npm
- Firebase project

### Setup

```bash
# Clone and install
cd agendalo
npm install

# Configure Firebase
cp .env.example .env.local
# Edit .env.local with your Firebase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/es` (default locale).

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password + Google)
3. Create a **Firestore** database
4. Enable **Storage**
5. Copy your web app config to `.env.local`
6. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Seed Development Data

```bash
npx tsx scripts/seed.ts
```

This creates a sample business with 2 professionals and 3 services.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm test` | Run Vitest test suite |
| `npm run test:watch` | Run tests in watch mode |

## Slot Engine

The core scheduling logic lives in `src/domain/services/slot-engine.ts` as a **pure function** with zero side effects.

**Algorithm:**
1. Determine working windows for the date (exceptions override weekly schedule)
2. Generate candidate slots in configurable step increments (default: 15min)
3. Filter out slots overlapping with existing bookings (+ buffer time)
4. Filter out slots overlapping with blocked ranges
5. Filter out slots that don't respect minimum lead time

**Configuration:**
- `stepMinutes`: Slot increment (default: 15)
- `bufferMinutes`: Gap between bookings (default: 10)
- `leadTimeMinutes`: Minimum advance notice (default: 60)

## Membership Plans

| Plan | Max Professionals |
|------|------------------|
| Individual | 1 |
| Duo | 2 |
| Unlimited | No limit |

## i18n

Supported locales: `es` (default), `en`. All UI strings use `next-intl` with message files at `/messages/`.

## Firestore Schema

```
businesses/{businessId}
  - name, slug, ownerId, plan, currency, timezone

professionals/{professionalId}
  - businessId, name, email, weeklySchedule, exceptions, isActive

services/{serviceId}
  - businessId, name, description, durationMinutes, price, currency

bookings/{bookingId}
  - businessId, professionalId, customerId, serviceId, date, startTime, endTime, status

blockedRanges/{rangeId}
  - professionalId, businessId, date, startTime, endTime, reason

userRoles/{userId}
  - role: 'business' | 'customer'
```

## Test Results

```
 Test Files  3 passed (3)
       Tests  65 passed (65)
```
