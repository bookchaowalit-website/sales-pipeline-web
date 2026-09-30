# Upgrade plan

## Current state

Score: 7/10 (was 5/10) — the desk's primary job (record the next action without losing context) now works and persists; deal set is still fixed.

## Backlog

- P1: Add/edit deals (company, contact, value) beyond the fixed sample set.
- P1: Edit the blocker text (the model supports it; UI only exposes next action).
- P2: Show real "age" from a stored stage-entered date instead of static strings.
- P2: Playwright smoke test for select → record → advance → reload.

## Done in this pass

- CI (`.github/workflows/ci.yml`): `npm ci`, lint, typecheck, vitest, `next build` on every push and PR.
- Pipeline rules moved to `lib/deals.ts` (tested): stage moves both ways, counts/total, note updates, and storage parsing that only restores stage/notes (values cannot be tampered with).
- New next-action form, step-back action, reset-sample control, and persistence via `lib/use-stored-state.ts` — previously every change was lost on reload and the next action could not be recorded despite PRODUCT.md.
- Replaced a hard-coded fake timestamp in the header; stage filters and rows expose `aria-pressed`; ignored `*.tsbuildinfo`.
