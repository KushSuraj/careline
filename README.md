# Careline — Doctor Appointment Booking UI

A responsive, browser-only healthcare interface built with React, Vite, TypeScript, and Tailwind CSS. All doctors, patients, appointments, notifications, and records are fictional. There is no Next.js, server, database, authentication service, payment gateway, or API integration.

## Run locally

Use **Node.js 24.15 or newer** (tested with 24.19.0; `.nvmrc` is included). The newest router and test environment require a newer runtime than Node 22.17.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173`. If Vite is already running in this folder, reuse that preview. Stop a previous development server before starting another on the same port.

```sh
npm run build          # TypeScript check and optimized static build
npm run preview        # Preview the dist output
npm run lint           # ESLint and React Hooks rules
npm test               # Booking, state recovery, and UI workflow tests
npm run format:check   # Check formatting
npm run format         # Apply formatting
```

## Explore the demo

The app opens as **Maya Patel**, a sample patient. Use the **Patient view / Doctor view / Admin view** selector in the header to explore each workspace.

- **Patient:** dashboard, searchable doctor directory, specialty/availability/fee filters, sorting, doctor profiles, saved doctors, three-step booking, rescheduling, cancellation, appointment status tabs, date filters, calendar downloads, mock video room, medical record previews/downloads, profile edits, notifications, and preferences.
- **Doctor:** practice dashboard, appointment schedule, patient directory and histories, visit completion, professional profile editing, consultation fees, and booking availability.
- **Admin:** care network dashboard, doctor creation/editing, pending profile verification, booking availability controls, appointment tracking, patient directory, and CSV export.
- **Sign-in UI:** Settings → Demo & account → Sign out. Enter a fictional email and any made-up password of at least eight characters, or choose a quick demo. Credentials are never saved.
- **Reset:** Settings → Demo & account → Reset demo. Restores the sample data and patient workspace.

Local demo state is stored under `careline-ui:v1` in `localStorage`. If storage is disabled or full, the current session continues in memory and displays a notice. Invalid or outdated saved data safely falls back to fresh sample data.

## Project structure

```text
src/
  components/       Layout, navigation, UI primitives, error boundary
  context/          Typed Context API, demo transactions, persistence
  data/             Fictional doctors, appointments, and medical records
  lib/              Dates, schemas, booking validation, storage, downloads
  pages/            Patient, doctor, admin, sign-in, and settings screens
  styles/           Tailwind import, design tokens, responsive styles
  test/             Vitest and Testing Library behavior tests
  types/            Shared domain types
  App.tsx           Routes, lazy loading, and demo route guards
  main.tsx          React entry point
```

## UI architecture

- Functional components, strict TypeScript, React Router, and lazy-loaded secondary pages.
- Context API handles shared mock state; no server cache library is needed.
- React Hook Form and Zod validate booking, profile, sign-in, and doctor forms.
- Appointments are 30 minutes long. Local date/time values avoid UTC date shifts. Bookings reject past times, dates more than 90 days away, unavailable/unverified doctors, doctor conflicts, and overlapping patient appointments. Rescheduling retains the original reference.
- Versioned, schema-validated browser storage and recoverable empty/error states.
- Semantic forms, visible keyboard focus, native modal focus management, reduced-motion support, responsive tables/navigation, and image fallbacks.
- Calendar files and CSV/text exports are generated locally. CSV cells escape quotes and neutralize spreadsheet formula prefixes.
- Fonts are bundled locally. Stock portraits use Unsplash URLs with initials as fallbacks. The fictional profiles do not identify the pictured people.

## Dependency policy

React 19.3.0, Vite 8.3.0, Tailwind CSS 4.3.3, and React Router 8.3.1 were installed from stable npm tags. Exact versions and `package-lock.json` make installs reproducible. TypeScript 6.0.3 is intentional: the installed typescript-eslint version supports TypeScript below 6.1, so TypeScript 7 is incompatible with that lint toolchain.

## Scope

This is a frontend demonstration, **not a clinical system**. Sign-in and role guards are UI simulations, not security boundaries. No real visits are booked, and no email, camera, microphone, payment, or healthcare API is activated. Notification preferences only persist demo settings. Use fictional information in forms.

The build outputs static assets to `dist/`. A future static host must rewrite application routes to `index.html`. The CI workflow checks formatting, lint, tests, and the build; it does not publish anything. A future real healthcare service would require a separately designed backend, server-enforced authentication/authorization, and data handling and operational review.
