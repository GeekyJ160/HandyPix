# HandyPix AI

HandyPix is a mobile-first home repair assistant that turns a photo of a household problem into an AI-assisted diagnosis, a repair brief, local bids, and a managed hire/payment flow.

## Core flow

1. Capture or upload up to four photos of the problem.
2. Add optional notes and run an AI-assisted diagnosis.
3. Review the likely issue, safety guidance, and job description.
4. Compare local professional bids.
5. Hire a pro and manage the job and payment hold in-app.

## Product principles

- Photo-first and mobile-first.
- Diagnosis is preliminary guidance, not a certified inspection.
- Safety issues should be surfaced clearly.
- Users compare bids themselves; HandyPix does not choose a contractor for them.
- Payments and job status remain visible through the workflow.

## Tech stack

- React 19
- TypeScript
- TanStack Router / React Query
- Vite
- Tailwind CSS
- Better Auth
- Kysely + PostgreSQL/PGlite support

## Development

```bash
npm install
npm run dev
```

The development server runs on port `8080` by default.

Useful checks:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

## Installable app

HandyPix includes a web app manifest and mobile metadata so supported browsers can install it to the home screen as a standalone app.

## Status

This repository contains the working HandyPix v1 application foundation, including landing, authentication, onboarding, photo scanning, diagnosis, bids, hiring, jobs, messages, profiles, marketplace, and wallet flows.
