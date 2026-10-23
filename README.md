# Sales Pipeline (Deal Desk)

A browser-only deal desk over four sample deals: filter the ledger by stage (Listen, Shape, Propose, Close), select a
deal to read its next action and blocker, record a new next action or blocker, and move it a stage forward or back.
Changes persist in this browser's `localStorage`; "Reset sample" restores the four deals. No CRM, email or forecast.

Live: https://sales.bookchaowalit.com (Vercel Git-deployed: a push to `main` ships to production).

## What it does

- Pipeline value and per-stage counts over the deals in this browser.
- Notes are trimmed, capped at 160 characters (emoji kept whole) and ignored when blank or zero-width only.
- Stored deals are validated against the sample set on load.

## What it does not do

- No real deals, accounts, CRM sync, email, forecasting or revenue reporting. No `/api/mcp` route.

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test           # Vitest: deal rules, site/robots/sitemap, home render, Sentry scrubbing
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (with a line-coverage gate) and the shared security
scan on every push and PR to `main`.

## Configuration

- `NEXT_PUBLIC_SITE_URL` (optional): canonical origin for metadata, `/sitemap.xml` and `/robots.txt`. Defaults to
  `https://sales.bookchaowalit.com`; must be an absolute http(s) URL.
- `NEXT_PUBLIC_SENTRY_DSN` (optional): turns on error reporting; unset means Sentry is off.

## Code map

- `lib/deals.ts`: the sample deals, stage moves, note rules, totals and stored-deal parsing (used by the page).
- `lib/use-stored-state.ts`: state mirrored to `localStorage`, read after mount.
- `lib/site.ts`: canonical URL, robots and sitemap.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped.
