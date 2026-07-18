# BioSphere AI

Earth Intelligence for Every Farm — an enterprise agricultural intelligence
platform, evolved from the WayFinder Next.js base architecture.

## Getting started

```bash
npm install
npm run dev
```

## What's real vs. simulated

- **Biological Readiness Engine, disease risk, mission builder, product
  recommendations** (`src/lib/biosphere/*`) — real, rule-based logic that
  runs on whatever sensor/weather data you feed it.
- **Sensor readings, weather, market prices, retailers**
  (`src/lib/biosphere/simulate.ts`) — realistic simulated data so the app is
  fully demoable without hardware. Swap these functions for real
  integrations (LoRaWAN gateway, weather API, commodity price feed, Places
  API) without touching any component.
- **Auth** (`src/lib/biosphere/auth.ts`) — client-side/localStorage only, so
  the product is demoable without a database. Replace with real backend auth
  (NextAuth, Clerk, custom JWT) for production.
- **AI Assistant** (`src/app/api/assistant/route.ts`) — uses the existing
  `src/lib/openai.ts` wrapper. Set `OPENAI_API_KEY` to enable live answers;
  falls back to a static message otherwise (same graceful-fallback pattern
  as the original WayFinder pipeline).
- **Earth hero video** — drop `public/media/earth-loop.mp4` in; the landing
  page hides the hero panel gracefully if it's absent.

## Structure

- `src/app/(marketing)` — `/` landing/login portal, `/login`, `/register`,
  `/forgot-password`, `/onboarding`
- `src/app/mission-control` — protected dashboard shell + widgets
- `src/app/marketplace`, `src/app/outcomes` — secondary protected pages
- `src/components/mission-control/*` — one component per dashboard widget
- `src/lib/biosphere/*` — all domain logic (types, simulation, scoring)
