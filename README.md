# Sales Pipeline

A local deal desk for seeing the next action and blocker behind a small sample pipeline.

## Features

- Filter the ledger by stage; select a deal to read its brief
- Record a new next action, move the deal forward or back a stage
- Changes persist in localStorage (validated against the sample set); "Reset sample" restores it

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs the same checks on every push (`.github/workflows/ci.yml`).

## Configuration

- `NEXT_PUBLIC_SITE_URL` (optional): canonical origin used for metadata, `/sitemap.xml` and `/robots.txt`. Defaults to `https://bookchaowalit-sales-pipeline-frontend.vercel.app`; must be an absolute http(s) URL.
