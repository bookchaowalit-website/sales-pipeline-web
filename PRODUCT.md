# Sales Pipeline (Deal Desk) — Product truth

> Inferred from the code and copy (no user interview). Checked against the portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`, row `sales-pipeline`, evidence Live→Prototype: the
> copy is accurate, but `lib/deals.ts` uses four seeded sample deals and changes stay in localStorage, no API) on
> 2026-10-23.

## What it is

A client-only deal desk over four sample opportunities, labelled "DEMO REGISTER · NO SYNC / NO REVENUE CLAIM".

## Who it is for

A solo seller who wants to see the next action and blocker per deal at a glance, and a portfolio visitor.

## What works today

1. Four sample deals (Northstar Studio, Field Notes Co., Pale Blue Labs, Common Ground) with stage, value, age, next
   action and blocker; pipeline value (THB) and per-stage counts.
2. Filter by stage; select a deal; record a new next action or blocker (trimmed, ≤ 160 characters, blank or
   zero-width-only input ignored); move the deal one stage forward or back.
3. Changes persist in `localStorage`, validated against the sample set on load; "Reset sample" restores the seed.
4. Front-end and server errors go to Sentry (errors only, personal data stripped) when `NEXT_PUBLIC_SENTRY_DSN` is set.

## What does not work (and must not be claimed)

- No real deals, adding or deleting deals, accounts, CRM sync, email, forecasting or revenue reporting.
- No API and no `/api/mcp` route.

## Live URL and deploy state

- Live: https://sales.bookchaowalit.com (HTTP 200 on 2026-10-23).
- The Vercel project `bookchaowalit-sales-pipeline-frontend` is Git-linked to this repository, so a push to `main`
  ships to production. The CVE patch deployed by Git on 2026-10-23 12:31 (commit be89acc, READY). Pushes after that
  may not deploy on 2026-10-23 because Vercel's free plan hit its 100-deployments/day limit; the coordinator deploys
  the latest green `main` after the quota resets.
- `NEXT_PUBLIC_SENTRY_DSN` is set on the Vercel project (Sentry project `sales-pipeline-web`, org `personal-yu0`).

## Boundaries

- Browser-only. No server routes besides robots and sitemap; nothing leaves the browser.
