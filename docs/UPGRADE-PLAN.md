# Upgrade plan

## Current state

Score: 7/10 (was 5/10) — the desk's primary job (record the next action without losing context) now works and persists; deal set is still fixed.

## Backlog

- P1: Add/edit deals (company, contact, value) beyond the fixed sample set.
- P2: Show real "age" from a stored stage-entered date instead of static strings.
- P2: Playwright smoke test for select → record → advance → reload.

## Done in this pass

- CI (`.github/workflows/ci.yml`): `npm ci`, lint, typecheck, vitest, `next build` on every push and PR.
- Pipeline rules moved to `lib/deals.ts` (tested): stage moves both ways, counts/total, note updates, and storage parsing that only restores stage/notes (values cannot be tampered with).
- New next-action form, step-back action, reset-sample control, and persistence via `lib/use-stored-state.ts` — previously every change was lost on reload and the next action could not be recorded despite PRODUCT.md.
- Replaced a hard-coded fake timestamp in the header; stage filters and rows expose `aria-pressed`; ignored `*.tsbuildinfo`.

## Done in this pass (pass 2)

- Added config-driven canonical host (the app had no sitemap or robots at all): `lib/site.ts` resolves `NEXT_PUBLIC_SITE_URL` (validated; clear error on a non-http(s) value, default is the Vercel project URL) and feeds `metadataBase` plus generated `app/sitemap.ts` / `app/robots.ts` (`/api/` disallowed), matching the portfolio-wide pattern. Tested in `lib/site.test.ts`.
- The blocker is editable ("Update the blocker" form next to the next-action form, labelled input, blank input ignored, persisted); tested in `lib/deals.test.ts`.

## Done in this pass (pass 3)
- Edge-case pass on `lib/deals.ts` (regression tests in `lib/deals.test.ts`):
  - A next action / blocker made only of zero-width characters or BOM replaced
    the real note with blank-looking text (in the editor and from storage).
    New `cleanNote` strips them and keeps the previous note.
  - Notes were cut at `MAX_NOTE` with `slice`, leaving a lone surrogate when an
    emoji straddled the limit; the whole emoji is now dropped.
- Security deps: `next` 16.1.6 -> 16.3.8 (and `eslint-config-next`) clears critical GHSA-2xp9-vwfh-vxw4 (Image Optimization RCE) plus bundled postcss/sharp highs; lockfile regenerated with same-major `npm audit fix`. `npm audit --omit=dev`: C1/H2/M0/L0 [next:c,postcss:h,sharp:h] -> C0/H0/M0/L0.
